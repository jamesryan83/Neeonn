"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};



// Gallery
app.account.view.Gallery = Backbone.View.extend({

    el: "#divContentGallery",

    events: {
        "click #buttonFromUrl": "showFromUrlDialog",
        "click .divItemImage": "imageClicked",
        "click .divGalleryIconEdit": "editImage",
        "click .divGalleryIconDelete": "deleteImage"
    },

    initialize: function () {
        var self = this;

        // Get gallery images
        this.appendGalleryLoadingItem();
        app.server.getGalleryImages(function (success, data) {
            self.removeGalleryLoadingItem();

            if (success === true) {
                if (data.length === 0) {
                    self.hideGallery();
                } else {

                    // append images to gallery
                    var sorted = app.util.sortArray(data, "lastModified");
                    for (var i = 0; i < sorted.length; i++) {
                        self.appendGalleryItem(sorted[i]);
                    }

                    self.showGallery();
                }
            }
        });

        this.setupGetImageFromComputer();
    },




    // ------------------------------------- Add New Image Actions -------------------------------------


    // Add image from url
    showFromUrlDialog: function () {
        var self = this;
        $("#divDialogContainer").show();
        new app.dialog.view.FromUrl(function (success, urlData) {
            app.util.hideDialog();

            if (success === true) {
                if ($("#divPictures").children().length === 0) {
                    self.showGallery();
                }

                self.appendGalleryLoadingItem();
                app.server.getImageFromUrl(urlData, function (success, data) {
                    self.removeGalleryLoadingItem();

                    // add image to page
                    if (success === true) {
                        self.appendGalleryItem(data);
                    }
                });
            }
        });
    },


    // from computer button setup - jquery.fileupload
    setupGetImageFromComputer: function () {
        var self = this;
        this.$el.find(".fileupload").fileupload({
            dataType: 'json',
            maxNumberOfFiles: 1,
            acceptFileTypes: /^image\/(gif|jpe?g|png)$/i,
            maxFileSize: 250000,

            add: function (e, data) {

                // validate selected file
                var $this = $(this);
                var validation = data.process(function () {
                    return $this.fileupload('process', data);
                });

                validation.done(function() {
                    data.submit(); // ok
                });

                validation.fail(function(data) {
                    app.util.showToast("Error", data.files[0].error);
                    return;
                });
            },

            beforeSend: function() {
                if ($("#divPictures").children().length == 0) {
                    self.showGallery();
                }

                self.appendGalleryLoadingItem();
            },

            done: function (e, data) {
                self.removeGalleryLoadingItem();
                if (data.result && data.result.success === true) {
                    self.appendGalleryItem(data.result.data);
                } else {
                    app.util.showToast("Error", "Error uploading image");
                }
            },

            fail: function(e, data) {
                app.util.showToast("Error", "Unknown server error");
            }
        });
    },




    // ------------------------------------- Image Item Actions -------------------------------------

    // Show zoomed in image
    imageClicked: function (e) {
        var imgSrc = $(e.target).find(".imgItem").context.src.replace("thumb_", "");
        $("#divDialogContainer").show();
        new app.dialog.view.ViewPicture(imgSrc, function () {
            app.util.hideDialog();
        });
    },


    // Go to edit image page
    editImage: function (e) {
        var name = $(e.target).data("imgname");
        this.appendGalleryLoadingItem(true, $(e.target).closest(".divGalleryItem"));
        location.href = "/edit-image/" + name;
    },


    // Delete an image
    deleteImage: function (e) {
        var self = this;

        var galleryItem = $(e.target).closest(".divGalleryItem");
        app.server.deleteImage($(e.target).data("imgname"), function (success, data) {

            // remove from page
            if (success === true) {
                $(galleryItem).remove();

                if ($("#divPictures").children().length == 0) {
                    self.hideGallery();
                }
            }
        });
    },










    // ------------------------------------- Gallery Actions -------------------------------------

    // Appends a new gallery item
    appendGalleryItem: function (data) {

        var fileName = data.filename.replace("thumb_", "");

        var template =
            $("<div class='divGalleryItem'>" +
                "<div class='divItemButtons'>" +
                    "<div class='divGalleryIconEdit' data-imgname='" + fileName + "'></div>" +
                    "<div class='divGalleryIconDelete' data-imgname='" + fileName+ "'></div>" +
                    "<div class='clearfix'></div>" +
                "</div>" +

                "<div class='divItemImage'>" +
                    "<img class='imgItem center' src='" + data.url_thumb + "'  />" +
                "</div>" +
            "</div>");

        this.$el.find("#divPictures").prepend(template);
    },


    // Appends a image loading item to gallery
    appendGalleryLoadingItem: function (replace, element) {
        var template =
            $("<div class='divGalleryItem loadingItem'>" +
                "<div class='divItemImage'>" +
                    "<img class='imgItem center' src='../res/loading_hourglass2.svg' height=40 width=40  />" +
                "</div>" +
            "</div>");

        if (replace === true) {
            $(element).replaceWith(template);
        } else {
            this.$el.find("#divPictures").prepend(template);
        }
    },


    // Remove image loading item from gallery
    removeGalleryLoadingItem: function () {
        this.$el.find(".loadingItem").remove();
    },


    // Show gallery
    showGallery: function () {
        $("#divPictures").show();
        $("#divNoImages").hide();
    },


    // Hide gallery (when there's no images to show)
    hideGallery: function () {
        $("#divPictures").hide();
        $("#divNoImages").show();
    }

});


new app.account.view.Gallery();
