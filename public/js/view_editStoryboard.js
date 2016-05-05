"use strict";

var app = app || {};
app.editStoryboard = {};
app.editStoryboard.view = {};



// Edit storyboard page Main
app.editStoryboard.view.Main = Backbone.View.extend({

    el: "#divEditStoryboard",

    events: {
        "click #buttonBackToStoryboards": function () { location.href = "../account/storyboards"; },
        "click #buttonAddScenePattern": "setScenePattern",
        "click #buttonAddSceneCanvasText": function () { this.addScene("canvastext") },
        "click #buttonAddSceneTextCanvas": function () { this.addScene("textcanvas") },
        "click #buttonAddSceneText": function () { this.addScene("text") },
        "click #buttonAddSceneCanvas": function () { this.addScene("canvas") },
        "focusout #inputEditStoryboardTitle": "saveStoryboardDetails",
        "change #selectEditStoryboardCategory": "saveStoryboardDetails",
        "change #checkboxPrivate": "saveStoryboardDetails",
        "change #checkboxAllowComments": "saveStoryboardDetails"
    },

    initialize: function () {
        var self = this;
        this.lastStoryboardDetailsData = null;


        // Add category options to select element
        for (var i = 0; i < app.data.categories.length; i++) {
            this.$el.find("#selectEditStoryboardCategory").append(
                "<option value='" + app.data.categories[i] + "'>" +
                app.data.categories[i] + "</option>");
        }


        // Get storyboard
        app.server.getStoryboard(self.$el.data("storyboard_id"), function (success, data) {
            if (success === true) {

                // Redirect to storyboards if no data
                if (data === undefined) {
                    location.href = "../account/storyboards"
                }


                // update storyboard details
                self.$el.find("#inputEditStoryboardTitle").val(data.title);
                self.$el.find("#selectEditStoryboardCategory").val(data.category || "Uncategorized");
                self.$el.find("#checkboxPrivate").prop("checked", data.is_private === "1" ? true : false);
                self.$el.find("#checkboxAllowComments").prop("checked",
                                                             data.allow_comments === "1" ? true : false);


                // store storyboard pattern
                self.scene_pattern = data.scene_pattern;


                // add storyboard scenes
                if (data.scenes.length > 0) {
                    var sortedScenes = app.util.sortArray(data.scenes, "storyboard_index");

                    for (var i = 0; i < sortedScenes.length; i++) {
                        var item = new app.items.view.SceneItem(sortedScenes[i]);
                        self.$el.find("#divScenes").append(item.el);
                    }

                    self.refreshSceneIndicies();
                }


                // setup scene color picker background
                self.$el.find("#inputColorPickerSceneBackground").spectrum({
                    showPalette: true,
                    showAlpha: true,
                    color: data.scene_color,
                    clickoutFiresChange: false,
                    show: function () {
                        // event to select same color when choose is clicked
                        // (instead of change event which doesn't fire when same color is picked)
                        $("body > .sp-container").find(".sp-choose").on("click.myChooseClick", function () {
                            self.setSceneBackgroundColor($("#inputColorPickerSceneBackground")
                                                         .spectrum("get").toHexString());
                        });
                    },
                    hide: function () {
                        $("body > .sp-container").find(".sp-choose").off("click.myChooseClick");
                        self.saveStoryboardDetails();
                    },
                    move: function(color) {
                        self.setSceneBackgroundColor(color.toHexString());
                    }
                });


                // change scene/text color picker css
                self.$el.find(".divInputContainer").css({ "max-width": "auto", "border": "none" });


                // set scene color & text color
                self.setSceneBackgroundColor(data.scene_color);


                // set scene pattern
                if (self.scene_pattern !== null) {
                    self.$el.find(".divInner").css({
                        "background-image": "url(../res/patterns/" + self.scene_pattern + ")"
                    });
                }
            }
        });
    },



    // ----------------------------------- Scene Actions -----------------------------------

    // Add a scene
    addScene: function (type) {
        var self = this;

        var storyboard_index = self.$el.find("#divScenes").children().length;

        var data = {
            storyboard_id: this.$el.data("storyboard_id"),
            storyboard_index: storyboard_index,
            type: type
        }

        app.server.createScene(data, function (success, scene_id) {
            self.removeEditorInstances();
            self.hideCanvasControls();

            self.$el.find("#divScenes").append(
                new app.items.view.SceneItem({
                    scene_id: scene_id,
                    type: type,
                    storyboard_index: storyboard_index
                }).el);

            self.refreshSceneIndicies();
            self.$el.find(".divStoryboardSceneItemBasic")[storyboard_index].scrollIntoView();
        });
    },


    // Remove a scene
    removeScene: function (scene) {
        var self = this;

        var data = {
            storyboard_id: scene.data.storyboard_id,
            storyboard_index: scene.data.storyboard_index
        }

        app.server.deleteScene(data, function (success) {
            self.removeEditorInstances();
            self.hideCanvasControls();

            scene.remove();
            self.refreshSceneIndicies();
        })
    },




    // Move scene up
    moveSceneUp: function (currentScene) {
        this.removeEditorInstances();
        this.hideCanvasControls();

        var sceneAbove = currentScene.prev(".divStoryboardSceneItem");
        if (sceneAbove.length !== 0) {
            currentScene.insertBefore(sceneAbove);
            this.refreshSceneIndicies();
            this.saveSceneIndicies();
        }
    },


    // Move scene down
    moveSceneDown: function (currentScene) {
        this.removeEditorInstances();
        this.hideCanvasControls();

        var sceneBelow = currentScene.next(".divStoryboardSceneItem");
        if (sceneBelow.length !== 0) {
            currentScene.insertAfter(sceneBelow);
            this.refreshSceneIndicies();
            this.saveSceneIndicies();
        }
    },


    // Update the scene indexes and ckeditor and canvas ids
    refreshSceneIndicies: function () {
        var self = this;
        this.$el.find("#divScenes").children().each(function (i) {
            var type = $(this).find(".divStoryboardSceneItemBasic").data("type");

            // make new heading for scene
            var sceneHeading = "Scene " + (i + 1);
            switch (type) {
                case "canvastext": sceneHeading += " - Canvas/Text"; break;
                case "textcanvas": sceneHeading += " - Text/Canvas"; break;
                case "text": sceneHeading += " - Text Only"; break;
                case "canvas": sceneHeading += " - Canvas Only"; break;
            }

            $(this).find(".labelSceneIndex").text(sceneHeading);

            // update storyboard index
            $(this).find(".divStoryboardSceneItemBasic").attr("data-storyboard_index", i);

            // update element ids
            $(this).find(".canvasMain").attr("id", "canvas" + i);
            $(this).find(".divActualText").attr("id", "editor" + i);
            $(this).find(".divCanvasControls").attr("id", "divCanvasControls" + i);
            $(this).find(".divTextControls").attr("id", "divTextControls" + i);
            $(this).find(".inputCanvasColorPicker").attr("id", "inputCanvasColorPicker" + i);
            $(this).find(".inputTextColorPicker").attr("id", "inputTextColorPicker" + i);
            $(this).find(".editorTop").attr("id", "divEditorTop" + i);
            $(this).find(".editorBottom").attr("id", "divEditorBottom" + i);
        });
    },


    // save scene indicies
    saveSceneIndicies: function () {
        var data = [];
        this.$el.find(".divStoryboardSceneItemBasic").each(function (index) {
            data.push({
                "scene_id": $(this).data("scene_id"),
                "storyboard_index": index
            });
        });

        app.server.updateSceneIndicies(data, function (success) {});
    },




    // Save storyboard details
    saveStoryboardDetails: function () {
        var titleTemp = this.$el.find("#inputEditStoryboardTitle").val().trim();

        if (titleTemp.length === 0) {
            app.util.showToast("Error", "You need to enter a Title for your Storyboard");
            return;
        }

        if (titleTemp.length > 70) {
            app.util.showToast("Error", "Storyboard title is 70 character limit.  You have "
                               + titleTemp.length + " characters");
            return;
        }

        // get storyboard data
        var storyboardData = {
            storyboard_id: this.$el.data("storyboard_id"),
            title: titleTemp,
            category: this.$el.find("#selectEditStoryboardCategory option:selected").text(),
            is_private: this.$el.find("#checkboxPrivate").prop('checked'),
            allow_comments: this.$el.find("#checkboxAllowComments").prop('checked'),
            scene_color: this.$el.find("#inputColorPickerSceneBackground").spectrum("get").toHexString(),
            scene_pattern: this.scene_pattern
        }


        // save data
        if (_.isEqual(this.lastStoryboardDetailsData, storyboardData) === false) {
            app.server.updateStoryboardDetails(storyboardData, function (success) {});
        }

        this.lastStoryboardDetailsData = storyboardData;
    },



    // Set background color of all scenes
    setSceneBackgroundColor: function (color) {
        this.$el.find(".divInner").css({ "background-color": color });
    },


    // Set the background patteron of all scenes
    setScenePattern: function () {
        var self = this;

        $("#divDialogContainer").show();
        var selectedColor = this.$el.find("#inputColorPickerSceneBackground").spectrum("get").toHexString();
        new app.dialog.view.ScenePatterns(selectedColor, function (success, result) {
            app.util.hideDialog();

            if (success === true) {
                if (result === "removePattern") {
                    self.$el.find(".divInner").css({ "background-image": "none" });
                    self.scene_pattern = null;
                } else {
                    self.$el.find(".divInner").css({
                        "background-image": "url(../res/patterns/" + result + ")"
                    });

                    self.scene_pattern = result;
                }

                self.saveStoryboardDetails();
            }
        });
    },


    // ----------------------------------- Other things -----------------------------------

    // Remove CKEditor instances
    removeEditorInstances: function () {
        this.$el.find(".divTextControls").hide();
        for (name in CKEDITOR.instances) {
            CKEDITOR.instances[name].destroy(true);
        }
    },


    // Hide canvas controls
    hideCanvasControls: function () {
        this.$el.find(".divCanvasControls").hide();
    }
});


app.editStoryboard.view.main = new app.editStoryboard.view.Main();
