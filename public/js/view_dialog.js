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



// From url dialog
app.dialog.view.FromUrl = Backbone.View.extend({

    template: _.template($("#templateDialogFromUrl").html()),

    events: {
        "click #buttonDialogOk": "ok",
        "click #buttonDialogCancel": function () {this.callback(false) }
    },

    // provide el, this dialog may be required above other dialogs
    initialize: function (el, callback) {
        this.setElement(el);
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






// Picture gallery dialog
app.dialog.view.PictureGallery = app.base.view.GalleryBase.extend({
    el: "#divGalleryContainer",

    template: _.template($("#templateDialogPictureGallery").html()),

    initialize: function (callback) {
        this.callback = callback;
        this.render();

        // call base initialize and add cancel event
        app.base.view.GalleryBase.prototype.initialize.apply(this);
        this.delegateEvents(_.extend(_.clone(this.events), {
            "click .divItemButtonsBottom": "selectImage",
            "click #buttonDialogCancel": function () { this.callback(false); }
        }));
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },


    // Select clicked
    selectImage: function (e) {
        var imageName = this.getImageNameFromClickedElement(e.target);
        this.callback(true, imageName);
    },


    // Edit image
    editImage: function (e) {
        var self = this;
        var imageName = this.getImageNameFromClickedElement(e.target);

        var dialogData = {
            heading: "Go to Edit Image page",
            text1: "Go to the Edit Image page ?",
            text2: "You will leave this page and your Storyboard will be saved"
        }

        $("#divDialogContainer").show();
        new app.dialog.view.OkCancel(dialogData, function (result) {
            app.util.hideDialog();

            if (result === true) {
                self.callback(true, imageName, true);
            }
        });
    },


    // Appends a new gallery item
    appendGalleryItem: function (data) {

        var fileName = data.filename.replace("thumb_", "");

        var galleryItemTemplate =
            "<div class='divGalleryItem noselect'>" +
                "<div class='divItemButtons'>" +
                    "<div class='divGalleryIconEdit' data-imgname='" + fileName + "' title='Edit'></div>" +
                    "<div class='divGalleryIconDelete' data-imgname='" + fileName+ "' title='Delete'></div>" +
                    "<div class='clearfix'></div>" +
                "</div>" +

                "<div class='divItemImage'>" +
                    "<img class='imgItem center' src='" +
                            data.url_thumb + "?" + new Date().getTime() + "' />" +
                "</div>" +

                "<div class='divItemButtonsBottom'>" +
                    "<label><b>Select</b></label>" +
                "</div>" +
            "</div>";

        this.$el.find("#divPictures").prepend($(galleryItemTemplate));
    },


    // Returns image name + extension without thumb_
    getImageNameFromClickedElement: function (element) {
        var imgUrl = $(element).closest(".divGalleryItem")
            .find("img")[0].src.replace("thumb_", "");

        var tempArray = imgUrl.split("/"); // remove stuff before name
        var tempName = tempArray[tempArray.length - 1];
        return tempName.split("?")[0]; // remove cache-breaker date
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
        "click #divCloseButton": function () {this.callback(false) }
    },

    initialize: function (storyboardData, callback) {
        var self = this;
        this.data = storyboardData;
        this.callback = callback;
        this.render();

        // after rendered
        setTimeout(function () {
            var sceneDivs = self.$el.find(".divSceneItem");

            // center text vertically when text height < sceneDiv height
            for (var i = 0; i < sceneDivs.length; i ++) {
                // TODO - text app.data.sceneHeight + 2 is enough or too much
                if (sceneDivs[i].offsetHeight <= app.data.sceneHeight + 2) {
                    $(sceneDivs[i]).children().not("div")
                        .wrapAll("<div class='divCenterSceneVertical'></div>")
                        .wrapAll("<div class='divCenterSceneVerticalInner'></div>");
                }
            }
        }, 0);
    },

    render: function() {
        this.$el.html(this.template({ title: this.data.title }));

        app.util.preventWindowScroll(this.$el.find("#divContent"));

        this.$el.find("#divContent").append($("<div class='divSceneGap'><hr></div>"));


        // append scenes
        for (var i = 0; i < this.data.scenes.length; i++) {

            var sceneDiv = "<div class='divSceneItem'>";

            // canvas image (append as svg)
            var canvasImage = this.data.scenes[i].canvas_data_svg;

            // TODO - not necessary when user is logged in
            canvasImage = canvasImage.replace("image-proxy", "image-proxy-public/" + this.data.user_id);

            if (canvasImage !== null && canvasImage.length > 0) {
                if (this.data.scenes[i].type === "canvastext") {
                    sceneDiv += "<div class='divImageLeft'>" + canvasImage + "</div>";
                } else if (this.data.scenes[i].type === "textcanvas") {
                    sceneDiv += "<div class='divImageRight'>" + canvasImage + "</div>";
                } else {
                    sceneDiv += "<div class='divImageCenter'>" + canvasImage + "</div>";
                }
            }

            // text
            var text = this.data.scenes[i].text;
            if (text !== null && text.length > 0) {

                // replace hashtags and links with clickable link elements
                var newText = text.replace(app.data.regexHashtag, "<a class='aSceneHashtag'>$&</a>")
                newText = newText.replace(app.data.regexUrl, "<a class='aSceneUrl'>$&</a>")

                sceneDiv += newText;
            }

            sceneDiv += "</div>";
            this.$el.find("#divContent").append($(sceneDiv));

            this.$el.find("#divContent").append($("<div class='divSceneGap'><hr></div>"));
        }

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





// Scene pattern dialog
app.dialog.view.ScenePatterns = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogScenePattern").html()),

    events: {
        "click .divImage": "selectPattern",
        "click #buttonDialogRemovePattern": function () { this.callback(true, "removePattern") },
        "click #buttonDialogCancel": function () { this.callback(false) }
    },

    initialize: function (bgColor, callback) {
        this.backgroundColor = bgColor;
        this.callback = callback;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        var self = this;

        app.util.preventWindowScroll(this.$el.find("#divPatterns"));

        // add images and background color to pattern gallery
        for (var i = 0; i < app.data.patternImages.length; i++) {
            var el = $("<div class='divImage' data-index='" + i + "'></div>");
            el.css({
                "background-image": "url(../res/patterns/" + app.data.patternImages[i] + ")",
                "background-color": this.backgroundColor
            })

            this.$el.find("#divPatterns").append(el);
        }

        return this;
    },


    // Select pattern and return
    selectPattern: function (e) {
        var index = $(e.target).data("index");
        var imgSrc = app.data.patternImages[index];
        this.callback(true, imgSrc);
    },
});
