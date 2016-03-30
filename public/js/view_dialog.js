"use strict";

var app = app || {};
app.dialog = {};
app.dialog.view = {};

// Ok Cancel dialog
app.dialog.view.OkCancel = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogOkCancel").html()),

    events: {
        "click #buttonDialogOk": "ok",
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    initialize: function (data, callback) {
        this.data = data;
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template(this.data));
        return this;
    },

    ok: function () {
        this.callback(true);
    }
});



// Choose Picture dialog
app.dialog.view.ChoosePicture = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogChoosePicture").html()),

    events: {
        "click #buttonDialogFromGallery": "fromGallery",
        "click #buttonDialogRemovePicture": "removePicture",
        "click #buttonDialogCancel": function () {this.callback(true, "cancel") }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },


    // Select image from gallery
    fromGallery: function () {
        this.callback(true, "fromGallery");
    },


    // Remove current picture
    removePicture: function () {
        this.callback(true, "remove");
    }
});



// From url dialog
app.dialog.view.FromUrl = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogFromUrl").html()),

    events: {
        "click #buttonDialogOk": "ok",
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    ok: function () {
        var providedUrl = this.$el.find("#inputFromUrl").val();

        // validation
        if (app.util.stringStartsWithHttpOrHttps(providedUrl) === false ||
            app.util.stringEndsWithImageExtension(providedUrl) === false) {
            return;
        }

        this.callback(true, providedUrl);
    }
});




// Galley dialog
app.dialog.view.PictureGallery = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogPictureGallery").html()),

    events: {
        "click .divImage": "selectImage",
        "click #buttonDialogCancel": function () {this.callback(false) },
        "click #buttonDialogGoToGallery": "goToGallery"
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        var self = this;

        $("#divPictures").hide();
        $("#divNoImages").hide();
        $("#divProgress").show();

        app.server.getGalleryImages(function (success, result) {
            if (success === true) {
                $("#divProgress").hide();

                self.displayPictures(result);
            }
        });

        return this;
    },


    // Display pictures in gallery
    displayPictures: function (pictures) {
        if (pictures.length === 0) {
            $("#divNoImages").show();
        } else {
            $("#divPictures").show();
            for (var i = 0; i < pictures.length; i++) {
                var tmp = "<div class='divImage'><img src='" + pictures[i].url_thumb + "' /></div>"
                this.$el.find("#divPictures").append(tmp);
            }
        }
    },


    // Select image and return
    selectImage: function (e) {
        var imgSrc = $(e.currentTarget).find("img").attr("src");
        this.callback(true, imgSrc);
    },


    // Go to user gallery
    goToGallery: function () {
        location.href = "/account/gallery";
    }
});




// View single picture dialog
app.dialog.view.ViewPicture = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogViewPicture").html()),

    events: {
        "click #divDialogViewPicture": function () { this.callback() },
        "click #imgViewPicture": function () { this.callback() }
    },

    initialize: function (pictureUrl, callback) {
        this.pictureUrl = pictureUrl;
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());

        this.$el.find("#imgViewPicture").attr("src", this.pictureUrl);

        return this;
    }
});




// Create Storyboard dialog
app.dialog.view.CreateStoryboard = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogCreateStoryboard").html()),

    events: {
        "click #buttonDialogOk": "ok",
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());

        // Add category options to select element
        for (var i = 0; i < app.data.categories.length; i++) {
            this.$el.find("#selectCategory").append(
                "<option value='" + app.data.categories[i] + "'>" +
                app.data.categories[i] + "</option>");
        }

        return this;
    },


    // ok button clicked
    ok: function () {
        var title = this.$el.find("#inputTitle").val().trim();

        if (title.length === 0) {
            app.util.showToast("Error", "You need to enter a Title");
            return;
        }

        var data = {
            title: title,
            category: $("#selectCategory option:selected").text(),
            firstScene: $("#selectFirstScene").val(),
            showTitle: $("#checkboxShowTitle").prop('checked'),
            isPrivate: $("#checkboxPrivate").prop('checked'),
            allowComments: $("#checkboxAllowComments").prop('checked')
        }

        this.callback(true, data);
    }
});




// Full screen storyboard dialog
app.dialog.view.StoryboardFullScreen = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogStoryboardFullScreen").html()),

    events: {
        "click #buttonDialogClose": function () {this.callback(false) }
    },

    initialize: function (storyboardData, callback) {
        this.data = storyboardData;
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template({ title: this.data.title }));

        for (var i = 0; i < this.data.scenes.length; i++) {
            var item = "<div class='divScene'>" +
                            "<div class='divSceneImage'>" +
                                "<img src='" + this.data.scenes[i].image_url + "' />" +
                            "</div>" +
                            "<div class='divSceneText'>" +
                                this.data.scenes[i].text +
                            "</div>" +
                        "</div>";

            this.$el.find("#divContent").append(item);
        }


        var contentHeight = this.$el.find("#divDialogStoryboardFullScreen").height();
        contentHeight -= 100;

        this.$el.find("#divContent").height(contentHeight);


        return this;
    }
});




// Canvas Choose Picture dialog
app.dialog.view.CanvasChoosePicture = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogCanvasChoosePicture").html()),

    events: {
        "click #buttonDialogAddPicture": "addPicture",
        "click #buttonDialogAddBackgroundPicture": "backgroundPicture",
        "click #buttonDialogAddBackgroundColor": "backgroundColor",
        "click #buttonDialogRemoveBackground": "removeBackground",
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },


    // Select image from gallery
    addPicture: function () {
        this.callback(true, "addPicture");
    },


    // add picture to fill background
    backgroundPicture: function () {
        this.callback(true, "addBackgroundPicture");
    },


    // add color to fill background
    backgroundColor: function () {
        this.callback(true, "addBackgroundColor");
    },

    // add color to fill background
    removeBackground: function () {        
        this.callback(true, "removeBackground");
    }
});
