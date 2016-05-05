"use strict";

var app = app || {};
app.base = app.base || {};
app.base.view = app.base.view || {};


// Gallery Base
app.base.view.GalleryBase = Backbone.View.extend({

    events: {
        "click #buttonFromUrl": "showFromUrlDialog",
        "click .divItemImage": "imageClicked",
        "click .divGalleryIconDelete": "checkDeleteImage"
    },

    initialize: function () {
        var self = this;

        this.showGallery();

        // Get gallery images
        this.appendGalleryLoadingItem();
        app.server.getGalleryImages(function (success, data) {
            self.removeGalleryLoadingItem();

            if (success === true) {
                if (data.images.length === 0) {
                    self.hideGallery();
                } else {
                    self.showGallery();

                    // add items to gallery
                    for (var i = 0; i < data.images.length; i++) {
                        self.appendGalleryItem(data.images[i]);
                    }

                    // setup sortable grid
                    var el = document.getElementById("divPictures");
                    var sortable = new Sortable(el, {
                        animation: 150,
                        onSort: function (evt) {
                            var data = sortable.toArray().join("|");

                            // update galery order
                            app.server.updateGalleryOrder(data, function (success) {});
                        }
                    });

                    // restore gallery order
                    if (data.order !== null && data.order.length > 0) {
                        var order = data.order.split("|");
                        if (order.length > 1) {
                            sortable.sort(order);
                        }
                    }
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
        new app.dialog.view.FromUrl("#divDialogContainer", function (success, urlData) {
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
            maxFileSize: 1000000,

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
        var imgSrc = $(e.target).closest(".divGalleryItem")
            .find("img")[0].src.replace("thumb_", "");

        $("#divDialogContainer").show();
        new app.dialog.view.ViewPicture(imgSrc, function () {
            app.util.hideDialog();
        });
    },


    // Check before deleting image if it's referenced in any storyboards
    checkDeleteImage: function (e) {
        var self = this;
        var imageName = $(e.target).data("imgname");

        app.server.getStoryboardsForImage(imageName, function (success, data) {
            if (success === true) {
                if (data.linked === false) {
                    self.deleteImage(e);
                } else {
                    if (data.titles.length > 0) {
                        $("#divDialogContainer").show();
                        new app.dialog.view.ImageStoryboardLink(data.titles, function (success) {
                            app.util.hideDialog();

                            if (success === true) {
                                self.deleteImage(e);
                            }
                        });
                    } else {
                        self.deleteImage(e);
                    }
                }
            }
        });
    },


    // Delete an image
    deleteImage: function (e) {
        var self = this;
        var galleryItem = $(e.target).closest(".divGalleryItem");
        var imageName = $(e.target).data("imgname");

        app.server.deleteImage(imageName, function (success, data) {
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

        var galleryItemTemplate =
            "<div class='divGalleryItem' data-id='" + data.filename + "'>" +
                "<div class='divItemButtons'>" +
                    "<div class='divGalleryIconDelete' data-imgname='" + fileName+ "' title='Delete'></div>" +
                    "<div class='clearfix'></div>" +
                "</div>" +

                "<div class='divItemImage'>" +
                    "<img class='imgItem center' src='" +
                        data.url_thumb + "?" + new Date().getTime() + "' />" +
                "</div>" +
            "</div>";

        this.$el.find("#divPictures").prepend($(galleryItemTemplate));
    },


    // Appends a image loading item to gallery
    appendGalleryLoadingItem: function (replace, element) {
        var loadingItemTemplate =
            $("<div class='divGalleryItem loadingItem'>" +
                "<div class='divItemImage'>" +
                    "<img class='imgItem center' src='../res/loading_hourglass2.svg' height=40 width=40  />" +
                "</div>" +
            "</div>");

        if (replace === true) {
            $(element).replaceWith(loadingItemTemplate);
        } else {
            this.$el.find("#divPictures").prepend(loadingItemTemplate);
        }
    },


    // Remove image loading item from gallery
    removeGalleryLoadingItem: function () {
        this.$el.find(".loadingItem").remove();
    },


    // Show gallery
    showGallery: function () {
        $("#divGalleryImagesContainer").empty();
        $("#divGalleryImagesContainer").unbind();
        $("#divGalleryImagesContainer").append($("<div id='divPictures'></div>"));
    },


    // Hide gallery (when there's no images to show)
    hideGallery: function () {
        $("#divGalleryImagesContainer").empty();
        $("#divGalleryImagesContainer").unbind();

        var noImagesTemplate =
            "<div id='divNoImages'>" +
                "<p>You have no images !</p>" +
                "<p>Click <b><i>Add From Url</i></b> or <b><i>Add From Computer</i></b> to add some</p>" +
            "</div>";

        $("#divGalleryImagesContainer").append($(noImagesTemplate));
    }

});
