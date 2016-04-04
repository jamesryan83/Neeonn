"use strict";

var app = app || {};
app.editStoryboard = {};
app.editStoryboard.view = {};



// Edit storyboard page Main
app.editStoryboard.view.Main = Backbone.View.extend({

    el: "#divEditStoryboard",

    events: {
        "click #buttonBackToStoryboards": "backToStoryboards",
        "click #buttonSave": "save",
        "click #buttonAddScenePattern": "setScenePattern",
        "click #buttonAddSceneCanvasText": function () { this.addScene("canvastext") },
        "click #buttonAddSceneTextCanvas": function () { this.addScene("textcanvas") },
        "click #buttonAddSceneText": function () { this.addScene("text") },
        "click #buttonAddSceneCanvas": function () { this.addScene("canvas") }
    },

    initialize: function () {
        var self = this;

        // Add category options to select element
        for (var i = 0; i < app.data.categories.length; i++) {
            $("#selectEditStoryboardCategory").append(
                "<option value='" + app.data.categories[i] + "'>" +
                app.data.categories[i] + "</option>");
        }

        // Get storyboard
        //setTimeout(function () { // give a bit of time to load, was getting error with spectrum
        app.server.getStoryboard(self.$el.data("storyboardid"), function (success, data) {
            if (success === true) {

                // Redirect to storyboards if no data
                if (data === undefined) {
                    location.href = "../account/storyboards"
                }

                // update storyboard details
                $("#inputEditStoryboardTitle").val(data.title);
                $("#selectEditStoryboardCategory").val(data.category || "Uncategorized");
                $("#checkboxPrivate").prop("checked", data.is_private === "1" ? true : false);
                $("#checkboxAllowComments").prop("checked", data.allow_comments === "1" ? true : false);

                // story storyboard colors and pattern
                self.sceneColor = data.scene_color;
                self.textColor = data.text_color;
                self.scenePattern = data.scene_pattern;


                // add storyboard scenes
                if (data.scenes.length > 0) {
                    var sortedScenes = app.util.sortArray(data.scenes, "storyboard_index");

                    for (var i = 0; i < sortedScenes.length; i++) {
                        var item = new app.items.view.SceneItem(
                            sortedScenes[i].type, sortedScenes[i]);
                        $("#divScenes").append(item.el);
                    }

                    self.refreshSceneIndicies();
                }



                // setup scene color picker background
                $("#inputColorPickerSceneBackground").spectrum({
                    showPalette: true,
                    showAlpha: true,
                    color: self.sceneColor,
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
                    },
                    move: function(color) {
                        self.setSceneBackgroundColor(color.toHexString());
                    }
                });


                // setup scene color picker text
                $("#inputColorPickerSceneText").spectrum({
                    showPalette: true,
                    showAlpha: true,
                    color: self.textColor,
                    clickoutFiresChange: false,
                    show: function () {
                        // event to select same color when choose is clicked
                        // (instead of change event which doesn't fire when same color is picked)
                        $("body > .sp-container").find(".sp-choose").on("click.myChooseClick", function () {
                            self.setSceneTextColor($("#inputColorPickerSceneText")
                                                         .spectrum("get").toHexString());
                        });
                    },
                    hide: function () {
                        $("body > .sp-container").find(".sp-choose").off("click.myChooseClick");
                    },
                    move: function(color) {
                        self.setSceneTextColor(color.toHexString());
                    }
                });


                // set scene color & text color
                self.setSceneBackgroundColor(self.sceneColor);
                self.setSceneTextColor(self.textColor);


                // set scene pattern
                if (self.scenePattern !== null) {
                    self.$el.find(".divInner").css({
                        "background-image": "url(../res/patterns/" + self.scenePattern + ")"
                    });
                }
            }
        });
        //}, 500);







//        // auto-save every 5 minutes
//        setInterval(function () {
//            console.log("saved");
//        }, 300000);
    },


    // Return to Storyboards page
    backToStoryboards: function () {
        location.href = "../account/storyboards";
    },






    // ----------------------------------- Scene Actions -----------------------------------

    // Add a scene
    addScene: function (type) {
        this.removeEditorInstances();
        this.hideCanvasControls();

        var index = $("#divScenes").children().length;
        $("#divScenes").append(new app.items.view.SceneItem(type, { storyboard_index: index }).el);
        this.refreshSceneIndicies();
        this.$el.find(".divStoryboardSceneItemBasic")[index].scrollIntoView();
    },


    // Remove a scene
    removeScene: function (scene) {
        this.removeEditorInstances();
        this.hideCanvasControls();

        scene.remove();
        this.refreshSceneIndicies();
    },


    // Move scene up
    moveSceneUp: function (currentScene) {
        this.removeEditorInstances();
        this.hideCanvasControls();

        var sceneAbove = currentScene.prev(".divStoryboardSceneItem");
        if (sceneAbove.length !== 0) {
            currentScene.insertBefore(sceneAbove);
            this.refreshSceneIndicies();
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
        }
    },


    // Save storyboard
    save: function (callback) {

        // get storyboard data
        var storyboardData = {
            storyboardId: this.$el.data("storyboardid"),
            title: $("#inputEditStoryboardTitle").val(),
            category: $("#selectEditStoryboardCategory option:selected").text(),
            isPrivate: $("#checkboxPrivate").prop('checked'),
            allowComments: $("#checkboxAllowComments").prop('checked'),
            sceneColor: this.sceneColor,
            textColor: this.textColor,
            scenePattern: this.scenePattern,
            scenes: []
        }

        // for each scene
        $("#divScenes").children().each(function (i) {

            var type = $(this).find(".divStoryboardSceneItemBasic").data("type");
            var text = $(this).find(".divActualText").html();
            var canvas = $(this).find("#canvas" + i);

            var canvasDataJson = "";
            var canvasDataSvg = "";
            if (type === "canvastext" || type === "textcanvas" || type === "canvas") {
                canvasDataSvg = canvas[0].fabric.toSVG();
                canvasDataJson = JSON.stringify(canvas[0].fabric);
            }

            // TODO : is there something in fabricjs to do this
            canvasDataSvg.replace('<?xml version="1.0" encoding="UTF-8" standalone="no" ?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', "");

            storyboardData.scenes.push({
                index: i,
                type: type,
                text: text,
                canvasDataJson: canvasDataJson,
                canvasDataSvg: canvasDataSvg
            });
        });

        // save to server
        app.server.saveStoryboard(storyboardData, function (success, result) {
            if (success === true) {
                app.util.showToast("Saved", "Storyboard Saved");
            }

            if (callback !== null && typeof callback === "function") {
                callback(success, result);
            }
        });
    },


    // Update the scene indexes and ckeditor and canvas ids
    refreshSceneIndicies: function () {
        var self = this;
        $("#divScenes").children().each(function (i) {
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

            // update element ids
            $(this).find(".canvasMain").attr("id", "canvas" + i);
            $(this).find(".divActualText").attr("id", "editor" + i);
            $(this).find(".divCanvasControls").attr("id", "divCanvasControls" + i);
            $(this).find(".inputColorPicker").attr("id", "inputColorPicker" + i);
            $(this).find(".editorTop").attr("id", "divEditorTop" + i);
            $(this).find(".editorBottom").attr("id", "divEditorBottom" + i);
        });
    },



    // Set background color of all scenes
    setSceneBackgroundColor: function (color) {
        $(".divInner").css({ "background-color": color });
        this.sceneColor = color;
    },



    // Set text color of all scenes
    setSceneTextColor: function (color) {
        $(".divActualText *").css({ "color": color });
        this.textColor = color;
    },


    // Set the background patteron of all scenes
    setScenePattern: function () {
        var self = this;

        $("#divDialogContainer").show();
        var selectedColor = $("#inputColorPickerSceneBackground").spectrum("get").toHexString();
        new app.dialog.view.ScenePatterns(selectedColor, function (success, result) {
            app.util.hideDialog();

            if (success === true) {
                if (result === "removePattern") {
                    self.$el.find(".divInner").css({ "background-image": "none" });
                    self.scenePattern = null;
                } else {
                    self.$el.find(".divInner").css({
                        "background-image": "url(../res/patterns/" + result + ")"
                    });

                    self.scenePattern = result;
                }
            }
        });
    },


    // ----------------------------------- Other things -----------------------------------

    // Remove CKEditor instances
    removeEditorInstances: function () {
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
