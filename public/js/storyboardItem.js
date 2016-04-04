"use strict";

var app = app || {};
app.items = app.items || {};
app.items.view = app.items.view || {};


// A single storyboard item
app.items.view.StoryboardItem = Backbone.View.extend({

    className: "divStoryboardSceneItemFullContainer",

    template: _.template($("#templateStoryboardSceneItemFull").html()),

    events: {
        "click .divButtonComment": "comment",
        "click .divButtonStar": "star",
        "click .divButtonShare": "share",
        "click .divButtonExpand": "fullScreen",
        "click .divButtonEdit": "edit",
        "click .divButtonDelete": "delete",
        "click .divNavNext": "nextScene",
        "click .divNavPrevious": "previousScene"
    },

    // page = search, account, user
    initialize: function (page, data) {
        this.page = page;
        this.data = data;
        this.selectedIndex = 0;
        this.render();
    },

    render: function () {

        // hide Uncategorized category on public pages, looks ugly
        if (this.page !== "account" && this.data.category === "Uncategorized") {
            this.data.category = " ";
        }

        this.$el.html(this.template({
            storyboardId: this.data.storyboard_id,
            title: this.data.title,
            category: this.data.category,
            username: this.data.username
        }));


        // set colors/patterns
        this.$el.find(".divInner").css({ "background-color": this.data.scene_color });

        if (this.data.scene_pattern !== null) {
            this.$el.find(".divInner").css({
                "background-image": "url(../res/patterns/" + this.data.scene_pattern + ")"
            });
        }

        this.$el.find(".divActualText *").css({ "color": this.data.text_color });


        // stop window scrolling when scrolling over text
        app.util.preventWindowScroll(this.$el.find(".divActualText"));


        // set the first scene up
        if (this.data.scenes !== undefined && this.data.scenes.length > 0) {
            this.setSelectedScene();
        }


        // Hide delete and edit icons if on public page
        if (this.page === "search" || this.page === "user") {
            this.$el.find(".divIconPrivate").hide();
            this.$el.find(".divButtonEdit").hide();
            this.$el.find(".divButtonDelete").hide();
            this.$el.find(".divButtonExpand").css({ "margin-right": 0 });

        // show the private icon if storyboard is private and on edit page
        } else {
            if (this.data.is_private === "1") {
                this.$el.find(".divIconPrivate").css({ "display": "inline-block" });
            }
        }


        // hide comments if needed
        if (this.data.allow_comments === "0") {
            this.$el.find(".divButtonComment").hide();
            this.$el.find(".divCommentNumber").hide();
        }


        return this;
    },



    // ------------------------------------- Select a scene -------------------------------------


    // Set the selected scene
    setSelectedScene: function () {
        this.$el.find(".labelCurrentScene").text((this.selectedIndex + 1) + "/" + this.data.scenes.length);

        this.$el.find(".divPicture").empty();
        this.$el.find(".divActualText").empty();
        this.$el.find(".divPicture").unbind();
        this.$el.find(".divActualText").unbind();

        // text
        var text = this.data.scenes[this.selectedIndex].text;
        if (text !== null && text.length > 0) {

            // replace hashtags and links with clickable link elements
            var newText = text.replace(app.data.regexHashtag, "<a class='aSceneHashtag'>$&</a>")
            newText = newText.replace(app.data.regexUrl, "<a class='aSceneUrl'>$&</a>")

            this.$el.find(".divActualText").append(newText);
        }


        // canvas image (append as svg)
        var canvasImage = this.data.scenes[this.selectedIndex].canvas_data_svg;
        if (canvasImage !== null && canvasImage.length > 0) {

            // change images to public access
            if (this.page === "search" || this.page === "user") {
                canvasImage = canvasImage.replace("image-proxy", "image-proxy-public/" + this.data.user_id);
            }

            this.$el.find(".divPicture").append($(canvasImage));
        }


        // TODO - move this stuff to css
        // setup element sizes
        var sceneType = this.data.scenes[this.selectedIndex].type;
        switch (sceneType) {
            case "canvastext":
                this.$el.find(".divPicture").css({
                    "display": "block",
                    "float": "left",
                    "width": "50%",
                    "height": app.data.sceneHeight
                });
                this.$el.find(".divText").css({
                    "display": "block",
                    "float": "right",
                    "width": "50%",
                    "height": app.data.sceneHeight
                });
                break;

            case "textcanvas":
                this.$el.find(".divPicture").css({
                    "display": "block",
                    "float": "right",
                    "width": "50%",
                    "height": app.data.sceneHeight
                });
                this.$el.find(".divText").css({
                    "display": "block",
                    "float": "left",
                    "width": "50%",
                    "height": app.data.sceneHeight,
                });
                break;

            case "canvas":
                this.$el.find(".divText").css({
                    "display": "none"
                });
                this.$el.find(".divPicture").css({
                    "display": "block",
                    "width": "100%",
                    "height": app.data.sceneHeight
                });
                break;

            case "text":
                this.$el.find(".divPicture").css({
                    "display": "none"
                });
                this.$el.find(".divText").css({
                    "display": "block",
                    "width": "100%",
                    "height": app.data.sceneHeight,
                });
                break;
        }


        // scroll scene to top
        this.$el.find(".divActualText").scrollTop(0);

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
        if (this.page === "account") {
            var storyboardId = this.$el.find(".divStoryboardSceneItemFull").data("storyboardid");
            location.href = "/edit-storyboard/" + storyboardId;
        }
    },


    // Delete storyboard
    delete: function () {
        if (this.page === "account") {
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
    }

});
