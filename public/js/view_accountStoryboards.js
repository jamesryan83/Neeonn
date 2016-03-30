"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};



// Storyboards
app.account.view.Storyboards = Backbone.View.extend({

    el: "#divContentStoryboards",

    events: {
        "click #buttonCreateStoryboard": "createStoryboard"
    },

    initialize: function () {
        var self = this;

        this.hideStoryboards();
        $("#divLoadingStoryboards").show();

        // load storyboards
        app.server.getAllStoryboards(function (success, data) {
            if (success === true) {
                $("#divLoadingStoryboards").hide();

                if (data.length === 0) {
                    self.hideStoryboards();
                } else {
                    self.showStoryboards();

                    // append loaded storyboards
                    for (var i = 0; i < data.length; i++) {
                        self.appendStoryboardItem(data[i]);
                    }
                }
            }
        });
    },


    // create a new storyboard
    createStoryboard: function () {
        var self = this;

        // Show dialog
        $("#divDialogContainer").show();
        new app.dialog.view.CreateStoryboard(function (success, data) {

            if (success === false) {
                app.util.hideDialog();
                return;
            }

            // Create storyboard
            app.server.createStoryboard(data, function (success, result) {
                app.util.hideDialog();
                if (success === true) {
                    location.href = "/edit-storyboard/" + result;
                }
            });
        });
    },


    // append storyboard item
    appendStoryboardItem: function(data) {
        this.showStoryboards();

        var item = new app.account.view.StoryboardItem(data);
        $("#divStoryboards").prepend(item.el);
    },


    // remove storyboard item
    deleteStoryboard: function (item) {
        item.remove();

        if ($("#divStoryboards").children().length == 0) {
            this.hideStoryboards();
        }
    },


    // Show storyboards
    showStoryboards: function () {
        $("#divStoryboards").show();
        $("#divNoStoryboards").hide();
    },


    // Hide storyboards (when there's none to show)
    hideStoryboards: function () {
        $("#divStoryboards").hide();
        $("#divNoStoryboards").show();
    }

});





// A single storyboard item
app.account.view.StoryboardItem = Backbone.View.extend({

    className: "divStoryboardSceneItemFullContainer",

    template: _.template($("#templateStoryboardSceneItemFull").html()),

    events: {
        "click .divButtonComment": "comment",
        "click .divButtonStar": "star",
        "click .divButtonShare": "share",
        "click .divButtonExpand": "fullScreen",
        "click .divButtonEdit": "edit",
        "click .divButtonDelete": "delete",

        "click .divSceneMenuItem": "menuItemClicked",
        "click .divNavNext": "nextScene",
        "click .divNavPrevious": "previousScene"
    },

    initialize: function (data) {
        this.data = data;
        this.selectedIndex = 0;
        this.render();

        // set selected item icon
        // http://stackoverflow.com/a/9145790/4359306
        setTimeout(function () {
            $(".divSceneMenuItem").first().addClass("selected");
        }, 0)
    },

    render: function () {
        this.$el.html(this.template({
            storyboardId: this.data.storyboard_id,
            storyboardTitle: this.data.title
        }));


        // Show/hide title
        if (this.data.show_title === "0") {
            this.$el.find(".divTitle").hide();
            console.log("hi")
            this.$el.find(".divContentArea").css({ "margin-top": (app.data.titleHeight / 2) + "px" });
        }


        // stop window scrolling when scrolling over text
        app.util.preventWindowScroll(this.$el.find(".divActualText"));


        // create menu items along bottom of storyboard
        if (this.data.scenes !== undefined && this.data.scenes.length > 0) {
            for (var i = 0; i < this.data.scenes.length; i++) {

                var imgItem = "<div class='divSceneMenuItem' data-index='" + i + "'>" +
                                    "<img src='../../res/images/icon_scene_gray.png' style='padding: 2px' />" +
                                "</div>";
                this.$el.find(".divImageMenuItems").append($(imgItem));
            }

            this.setSelectedScene();
        }

        return this;
    },



    // ------------------------------------- Select a scene -------------------------------------

    // click on storyboard menu item
    menuItemClicked: function (e) {
        this.selectedIndex = $(e.currentTarget).data("index");
        this.setSelectedScene();
    },


    // Set the selected scene
    setSelectedScene: function () {
        $(".divSceneMenuItem").removeClass("selected");
        $(".divImageMenuItems").find("[data-index='" + this.selectedIndex + "']").addClass("selected");

        // reload template
        var template =
            "<div class='divPicture'>" +
                "<div class='divPictureContainer''>" +
                    "<img class='imgScene' />" +
                "</div>" +
            "</div>" +
            "<div class='divText'>" +
                "<div class='divTextContainer'>" +
                    "<div class='divActualText'></div>" +
                "</div>" +
            "</div>"

        this.$el.find(".divContentArea").empty();
        this.$el.find(".divContentArea").append($(template));

        // setup element sizes
        var sceneType = this.data.scenes[this.selectedIndex].type;
        switch (sceneType) {
            case "imagetext":
            case "canvastext":
                this.$el.find(".divPicture").css({ "width": "50%", "float": "left" });
                this.$el.find(".divText").css({ "width": "50%", "float": "right" });
                break;
            case "textimage":
            case "textcanvas":
                this.$el.find(".divPicture").css({ "width": "50%", "float": "right" });
                this.$el.find(".divText").css({ "width": "50%", "float": "left", "padding-left": "10px" });
                break;
            case "image":
            case "canvas":
                this.$el.find(".divPicture").css({ "width": "100%" });
                this.$el.find(".divText").css({ "display": "none" });
                break;
            case "text":
                this.$el.find(".divPicture").css({ "display": "none" });
                this.$el.find(".divText").css({ "width": "100%" });
                break;
        }


        // remove img element if canvas
        if (sceneType === "canvastext" || sceneType === "textcanvas" || sceneType === "canvas") {
            this.$el.find(".divPictureContainer").empty();
        }


        // text
        var text = this.data.scenes[this.selectedIndex].text;
        if (text.length > 0) {
            this.$el.find(".divActualText").append(text);
        }


        // image
        var imageUrl = this.data.scenes[this.selectedIndex].image_url;
        if (imageUrl.length > 0) {
            this.$el.find(".imgScene").attr("src", imageUrl);
        }


        // canvas image (append as svg)
        var canvasImage = this.data.scenes[this.selectedIndex].canvas_data_svg;
        if (canvasImage.length > 0) {
            this.$el.find(".divPictureContainer").append($(canvasImage));
        }
    },


    // Go to next scene
    nextScene: function () {
        if (this.selectedIndex < this.data.scenes.length - 1) {
            this.selectedIndex += 1;
            this.setSelectedScene();
        }
    },


    // Go to previous scene
    previousScene: function () {
        if (this.selectedIndex > 0) {
            this.selectedIndex -= 1;
            this.setSelectedScene(this.selectedIndex);
        }
    },



    // ------------------------------------- Storyboard Actions -------------------------------------


    // comment
    comment: function () {

    },


    // star
    star: function () {

    },


    // share
    share: function () {

    },


    // Open storyboard in fullscreen
    fullScreen: function () {
        $("#divDialogContainer").show();
        new app.dialog.view.StoryboardFullScreen(this.data, function (result) {
            app.util.hideDialog();
        });
    },


    // Go to the edit storyboard page
    edit: function () {
        var storyboardId = this.$el.find(".divStoryboardSceneItemFull").data("storyboardid");
        location.href = "/edit-storyboard/" + storyboardId;
    },


    // Delete storyboard
    delete: function () {
        var self = this;
        var storyboardId = this.$el.find(".divStoryboardSceneItemFull").data("storyboardid");

        var dialogData = {
            heading: "Delete Storyboard",
            text1: "Are you sure you want to delete this Storyboard ?",
            text2: "Its Scenes will also be deleted and it cannot be undone"
        }

        // show delete storyboard dialog
        $("#divDialogContainer").show();
        new app.dialog.view.OkCancel(dialogData, function (result) {
            app.util.hideDialog();

            if (result === true) {

                // delete storyboard
                app.server.deleteStoryboard(storyboardId, function (success, result) {
                    if (success === true) {
                        app.account.view.storyboards.deleteStoryboard(self);
                    }
                });
            }
        });
    }

});


app.account.view.storyboards = new app.account.view.Storyboards();
