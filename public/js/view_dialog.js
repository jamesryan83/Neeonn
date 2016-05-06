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

        $("#inputFromUrl").focus();

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


    // Appends a new gallery item
    appendGalleryItem: function (data) {

        var fileName = data.filename.replace("thumb_", "");

        var galleryItemTemplate =
            "<div class='divGalleryItem noselect'>" +
                "<div class='divItemButtons'>" +
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

        var isIE = false;
        if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
            isIE = true;
        }

        // select crashes on internet explorer because of this.size = 0 in onchange
        if (isIE === false) {
            // shorten select menu height
            $("#selectCategory").on("mousedown", function () {
                if (this.options.length > 5) {
                    this.size = 8;
                }
            });
            $("#selectCategory").on("change blur", function () {
                this.size = 0;
            });
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

        if (title.length > 70) {
            app.util.showToast("Error", "Title is 70 character limit.  You have "
                               + title.length + " characters");
            return;
        }

        var data = {
            title: title,
            category: $("#selectCategory option:selected").text(),
            type: $("#selectFirstScene").val(),
            is_private: $("#checkboxPrivate").prop('checked'),
            allow_comments: $("#checkboxAllowComments").prop('checked')
        }

        this.callback(true, data);
    }
});



// Full screen storyboard dialog
app.dialog.view.StoryboardFullScreen = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogStoryboardFullScreen").html()),

    events: {
        "click #divCloseButton": "close"
    },

    initialize: function (storyboardData, callback) {
        var self = this;
        this.data = storyboardData;
        this.callback = callback;
        this.render();


        // after rendered
        setTimeout(function () {
            var sceneDivs = self.$el.find(".divSceneItem");

            // center text vertically when text height < sceneDiv height, also set height of scene item
            for (var i = 0; i < sceneDivs.length; i ++) {
                var sceneType = $(sceneDivs[i]).data("type");

                if (sceneType === "canvastext" || sceneType === "textcanvas") {
                    if (sceneDivs[i].offsetHeight <= app.data.sceneWidthHalf) {

                        // set height of scene item
                        $(sceneDivs[i]).css({ "height": sceneDivs[i].offsetWidth / 2 })

                        $(sceneDivs[i]).children().not("div")
                            .wrapAll("<div class='divCenterSceneVertical'></div>")
                            .wrapAll("<div class='divCenterSceneVerticalInner'></div>");
                    }
                }
            }

        }, 0);
    },

    render: function() {
        this.$el.html(this.template({
            title: this.data.title,
            username: this.data.username,
            category: this.data.category
        }));

        this.$el.find("#divContent").append($("<div class='divSceneGap'></div>"));

        // append scenes
        for (var i = 0; i < this.data.scenes.length; i++) {

            var sceneDiv = "<div class='divSceneItem' data-type='" + this.data.scenes[i].type + "'>";


            // canvas image
            var canvasImage = this.data.scenes[i].canvas_data_svg;
            if (canvasImage !== null && canvasImage.length > 0) {

                canvasImage = canvasImage.replace(app.data.regexImageProxy,
                                                  app.data.serverHost + "/image-proxy-public/" +
                                                  this.data.user_id);

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


            // append to storyboard thing
            sceneDiv += "</div>";
            this.$el.find("#divContent").append($(sceneDiv));
            this.$el.find("#divContent").append($("<div class='divSceneGap'></div>"));
        }

        return this;
    },


    close: function () {
        this.callback(false)
    }
});





// Canvas Choose Picture dialog
app.dialog.view.CanvasChoosePicture = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogCanvasChoosePicture").html()),

    events: {
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


    // add picture to background
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





// Position background image dialog
app.dialog.view.PositionBackgroundImage = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogPositionBackgroundImage").html()),

    events: {
        "click #buttonDialogOk": "ok",
        "click #buttonDialogCancel": function () { this.callback(false) }
    },

    initialize: function (isFullWidth, imageName, callback) {
        this.isFullWidth = isFullWidth;
        this.imageName = imageName;
        this.callback = callback;
        this.mouseIsDown = false;
        this.originalImgWidth = 0;
        this.originalImgHeight = 0;
        this.render();
    },

    render: function() {
        this.$el.html(this.template());
        var self = this;

        this.$el.find("#divPicture").css({
            "height": app.data.sceneHeight,
            "width": this.isFullWidth ? app.data.sceneWidth : app.data.sceneWidthHalf
        });

        this.$el.find("#imgPicture").attr("src", "../image-proxy/" + this.imageName);


        // set initial height/width of image when its loaded
        this.$el.find("#imgPicture").imagesLoaded(function () {
            self.originalImgWidth = self.$el.find("#imgPicture")[0].offsetWidth;
            self.originalImgHeight = self.$el.find("#imgPicture")[0].offsetHeight;
        })


        // setup slider
        this.$el.find("#inputRange").rangeslider({
            polyfill: false,
            rangeClass: "rangeMain",
            fillClass: "rangeFill",
            handleClass: "rangeHandle",
            onSlide: function (position, value) {
                self.$el.find("#imgPicture").css({
                    "width": self.originalImgWidth * (value / 100),
                    "height": self.originalImgHeight * (value / 100),
                });
            }
        });


        // Drag image around
        var startX;
        var startY;
        var currentLeft;
        var currentTop;

        this.$el.find("#imgPicture").on("touchstart mousedown", function(e) {
            e.stopPropagation(); e.preventDefault();

            self.mouseIsDown = true;
            startX = e.pageX;
            startY = e.pageY;
            currentLeft = self.$el.find("#imgPicture")[0].offsetLeft;
            currentTop = self.$el.find("#imgPicture")[0].offsetTop;
        });

        this.$el.find("#imgPicture").on("touchmove mousemove", function(e) {
            e.stopPropagation(); e.preventDefault();

            if (self.mouseIsDown === true) {
                $(this).css({
                    "left": currentLeft + (e.pageX - startX),
                    "top": currentTop + (e.pageY - startY)
                });
            }
        });

        this.$el.on("touchend mouseup", function(e) {
            self.mouseIsDown = false;
        });
    },


    // ok
    ok: function () {
        this.$el.off("touchend mouseup");

        // frame left/top is centered so have to minus scene size
        var frameLeft = this.$el.find("#divPicture")[0].offsetLeft -
            (this.isFullWidth ? app.data.sceneWidth / 2 : app.data.sceneWidthHalf / 2)
        var frameTop = this.$el.find("#divPicture")[0].offsetTop - (app.data.sceneHeight / 2);
        var imgLeft = this.$el.find("#imgPicture")[0].offsetLeft;
        var imgTop = this.$el.find("#imgPicture")[0].offsetTop;

        var data = {
            left: imgLeft - frameLeft,
            top: imgTop - frameTop,
            width: this.$el.find("#imgPicture")[0].offsetWidth,
            height: this.$el.find("#imgPicture")[0].offsetHeight
        }

        this.callback(true, data);
    }
});




// Emoji dialog
app.dialog.view.Emoji = Backbone.View.extend({

    el: "#divGalleryContainer",

    template: _.template($("#templateDialogEmoji").html()),

    events: {
        "click .divImageItem": "pickImage",
        "click #buttonDialogCancel": function () { this.callback(false) }
    },

    initialize: function (callback) {
        this.callback = callback;
        this.render();
    },

    render: function() {
        var self = this;
        this.$el.html(this.template());

        var imagesEl = self.$el.find("#divImages");

        var temp;

        for (var i = 0; i < app.data.emojiImages.length; i++) {
            $(imagesEl).append("<div class='divImageItem' data-id='" + app.data.emojiImages[i] + "'></div>")
        }
    },

    pickImage: function (e) {
        this.callback(true, "../res/emoji/" + $(e.currentTarget).data("id"));
    }

});





// Image Storyboard link dialog
app.dialog.view.ImageStoryboardLink = Backbone.View.extend({

    el: "#divDialogContainer",

    template: _.template($("#templateDialogImageStoryboardLink").html()),

    events: {
        "click #buttonDialogDelete": function () { this.callback(true) },
        "click #buttonDialogCancel": function () { this.callback(false) }
    },

    initialize: function (storyboards, callback) {
        this.storyboards = storyboards;
        this.callback = callback;
        this.render();
    },

    render: function() {
        var self = this;
        this.$el.html(this.template());

        for (var i = 0; i < this.storyboards.length; i++) {
            this.$el.find("#ulStoryboards").append($("<li>" + this.storyboards[i] + "</li>"));
        }
    },

});
