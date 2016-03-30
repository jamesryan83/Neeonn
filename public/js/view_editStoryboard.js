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
        "click #buttonAddSceneImageText": function () { this.addScene("imagetext") },
        "click #buttonAddSceneTextImage": function () { this.addScene("textimage") },
        "click #buttonAddSceneText": function () { this.addScene("text") },
        "click #buttonAddSceneImage": function () { this.addScene("image") },
        "click #buttonAddSceneCanvasText": function () { this.addScene("canvastext") },
        "click #buttonAddSceneTextCanvas": function () { this.addScene("textcanvas") },
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
        setTimeout(function () { // give a bit of time to load, was getting error with spectrum
            app.server.getStoryboard(self.$el.data("storyboardid"), function (success, data) {
                if (success === true) {

                    // update storyboard details
                    $("#inputEditStoryboardTitle").val(data.title);
                    $("#selectEditStoryboardCategory").val(data.category || "Uncategorized");
                    $("#checkboxShowTitle").prop("checked", data.show_title === "1" ? true : false);
                    $("#checkboxPrivate").prop("checked", data.is_private === "1" ? true : false);
                    $("#checkboxAllowComments").prop("checked", data.allow_comments === "1" ? true : false);

                    // add storyboard scenes
                    if (data.scenes.length > 0) {
                        var sortedScenes = app.util.sortArray(data.scenes, "storyboard_index");

                        for (var i = 0; i < sortedScenes.length; i++) {
                            var item = new app.editStoryboard.view.Scene(sortedScenes[i].type, sortedScenes[i]);
                            $("#divScenes").append(item.el);
                        }

                        self.refreshSceneIndicies();
                    }
                }
            });
        }, 500);


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

    // Add a text/image scene
    addScene: function (type) {
        this.removeEditorInstances();
        this.hideCanvasControls();

        var index = $("#divScenes").children().length;
        $("#divScenes").append(new app.editStoryboard.view.Scene(type, { storyboard_index: index }).el);
        this.refreshSceneIndicies();
        //app.util.scrollDivToBottom("#divContentMain");
        this.$el.find(".divStoryboardSceneItem")[index - 1].scrollIntoView();
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
    save: function () {

        // get storyboard data
        var storyboardData = {
            storyboardId: this.$el.data("storyboardid"),
            title: $("#inputEditStoryboardTitle").val(),
            category: $("#selectEditStoryboardCategory option:selected").text(),
            showTitle: $("#checkboxShowTitle").prop('checked'),
            isPrivate: $("#checkboxPrivate").prop('checked'),
            allowComments: $("#checkboxAllowComments").prop('checked'),
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

            canvasDataSvg.replace('<?xml version="1.0" encoding="UTF-8" standalone="no" ?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', "");

            storyboardData.scenes.push({
                index: i,
                type: type,
                image: $(this).find(".divPicture img").prop("src") || "",
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
                case "imagetext": sceneHeading += " - Image/Text"; break;
                case "textimage": sceneHeading += " - Text/Image"; break;
                case "text": sceneHeading += " - Text Only"; break;
                case "image": sceneHeading += " - Image Only"; break;
                case "canvastext": sceneHeading += " - Canvas/Text"; break;
                case "textcanvas": sceneHeading += " - Text/Canvas"; break;
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











// A Single Scene Item
app.editStoryboard.view.Scene = Backbone.View.extend({

    className: "divStoryboardSceneItem",

    template: _.template($("#templateStoryboardSceneItemBasic").html()),

    events: {
        "click .divSettingsButton": "settings",
        "click .divMoveUpButton": "moveUp",
        "click .divMoveDownButton": "moveDown",
        "click .divAddImageButton": "addImage",
        "click .divDeleteSceneButton": "deleteScene",
        "click .divTextContainer": "focusTextArea",
        "click .divActualText": "startCkEditor",
        "click .canvasMain": "canvasClicked",

        "click .divCanvasButtonSelect": function () { this.canvasAction("select"); },
        "click .divCanvasButtonSketch": function () { this.canvasAction("sketch"); },
        "click .divCanvasButtonText": function () { this.canvasAction("text"); },
        "click .divCanvasButtonPicture": function () { this.canvasAction("picture"); },
        "click .divCanvasButtonCircle": function () { this.canvasAction("circle"); },
        "click .divCanvasButtonTriangle": function () { this.canvasAction("triangle"); },
        "click .divCanvasButtonRectangle": function () { this.canvasAction("rectangle"); },
        "click .divCanvasButtonStar": function () { this.canvasAction("star"); },
        "click .divCanvasButtonMoveBottom": function () { this.canvasAction("moveBottom"); },
        "click .divCanvasButtonMoveDown": function () { this.canvasAction("moveDown"); },
        "click .divCanvasButtonMoveUp": function () { this.canvasAction("moveUp"); },
        "click .divCanvasButtonMoveTop": function () { this.canvasAction("moveTop"); },
        "click .divCanvasButtonClear": function () { this.canvasAction("clear"); },
        "change .selectPathThickness": "setPathThickness"
    },


    initialize: function (type, data) {
        var self = this;
        this.type = type;
        this.data = data;
        this.canvasSelectedColor = app.data.colorNeonPink;
        this.canvasIsRedoing = false;
        this.canvasItems = []; // TODO : update when items loaded from server
        this.render();

        // after render is finished
        setTimeout(function () {

            // setup canvas if required
            if (self.type === "canvastext" || self.type === "textcanvas" || self.type === "canvas") {
                self.canvas = new fabric.Canvas("canvas" + self.data.storyboard_index);
                self.canvas.selection = true;
                self.canvas.freeDrawingBrush.width = 5;
                self.canvas.freeDrawingBrush.color = app.data.colorNeonPink;


                // store fabricjs reference on canvas for access outside this view
                document.getElementById("canvas" + self.data.storyboard_index).fabric = self.canvas;


                // object added to canvas event
                self.canvas.on('object:added', function(e) {
                    // change default selection handles
                    // options -> http://fabricjs.com/docs/fabric.Object.html
                    e.target.set({
                        borderColor: app.data.colorNeonPink,
                        cornerColor: app.data.colorNeonPink,
                        cornerSize: 8,
                        padding: 3,
                        rotatingPointOffset: 20,
                        hoverCursor: "pointer",
                        transparentCorners: false
                    });


                    // for undo/redo
                    // http://codepen.io/keerotic/pen/yYXeaR
                    if (self.canvasIsRedoing === false) {
                        self.canvasItems = [];
                    }
                    self.canvasIsRedoing = false;
                });


                // load existing canvas data
                if (self.data.canvas_data_json && self.data.canvas_data_json.length > 0) {
                    self.canvas.loadFromJSON(self.data.canvas_data_json, self.canvas.renderAll.bind(self.canvas));
                    //self.canvas.renderAll();
                }


                // canvas keydown
                self.$el.find(".divCanvasContainer").keydown(function (e) {
                    if (e.keyCode === 46) { // delete
                        self.canvasAction("delete");
                    } else if (e.ctrlKey && e.keyCode == 89) { // ctrl + y
                        self.canvasAction("redo");
                    } else if (e.ctrlKey && e.keyCode == 90) { // ctrl + z
                        self.canvasAction("undo");
                    }
                });


                // setup canvas color picker
                $("#inputColorPicker" + self.data.storyboard_index).spectrum({
                    showPalette: true,
                    showAlpha: true,
                    color: self.canvasSelectedColor,
                    clickoutFiresChange: false,
                    show: function () {
                        // event to select same color when choose is clicked
                        // (instead of change event which doesn't fire when same color is picked)
                        $("body > .sp-container").find(".sp-choose").on("click.myChooseClick", function () {
                            self.updateSelectedColor($("#inputColorPicker" + self.data.storyboard_index)
                                .spectrum("get").toHexString());
                        });
                    },
                    hide: function () {
                        $("body > .sp-container").find(".sp-choose").off("click.myChooseClick");
                    }
                });

            }

        }, 0);
    },


    render: function () {
        this.$el.html(this.template({ sceneType: this.type, sceneIndex: this.data.storyboard_index }));

        // show html elements based on scene type
        switch (this.type) {
            case "imagetext":
            case "textimage":
                this.$el.find(".divCanvas").hide();
                this.$el.find(".divActualText").css({ "max-width": app.data.sceneWidthHalf });
                break;

            case "text":
                this.$el.find(".divCanvas").hide();
                this.$el.find(".divPicture").hide();
                this.$el.find(".divAddImageButton").hide();
                this.$el.find(".divActualText").css({ "max-width": app.data.sceneWidth });
                break;

            case "image":
                this.$el.find(".divText").hide();
                this.$el.find(".divCanvas").hide();
                break;

            case "canvastext":
            case "textcanvas":
                this.$el.find(".divPicture").hide();
                this.$el.find(".divAddImageButton").hide();
                this.$el.find("canvas").attr("width", app.data.sceneWidthHalf);
                this.$el.find("canvas").attr("height", app.data.sceneHeight);
                this.$el.find(".divActualText").css({ "max-width": app.data.sceneWidthHalf });
                break;

            case "canvas":
                this.$el.find(".divPicture").hide();
                this.$el.find(".divText").hide();
                this.$el.find(".divAddImageButton").hide();
                this.$el.find("canvas").attr("width", app.data.sceneWidth);
                this.$el.find("canvas").attr("height", app.data.sceneHeight);
                break;
        }


        // when text is on the right float the editor to the right
        if (this.type === "imagetext" || this.type === "canvastext") {
            this.$el.find(".editorTop").css({ "float": "right" });
        }

        // Add type to scene
        this.$el.find(".divInner > div").addClass("divType_" + this.type);


        // Add data to scene
        if (this.data !== undefined) {
            if (this.type !== "image" && this.type !== "canvas") {
                this.$el.find(".divActualText").append(this.data.text);
            }

            if (this.type === "imagetext" || this.type === "textimage" || this.type === "image") {
                if (this.data.image_url && this.data.image_url.length > 0) {
                    this.$el.find(".divPictureContainer > img").attr("src", this.data.image_url);
                }
            }
        }

        this.$el.find(".divCanvasControls").hide();

        // prevent window scroll when over a div
        app.util.preventWindowScroll(this.$el.find(".divActualText"));

        return this;
    },







    // ----------------------------------- Scene Actions -----------------------------------

    settings: function () {
        // TODO : should be a color picker to change scene background color
    },


    // Move scene up
    moveUp: function () {
        app.editStoryboard.view.main.moveSceneUp(this.$el);
    },


    // Move scene down
    moveDown: function () {
        app.editStoryboard.view.main.moveSceneDown(this.$el);
    },



    // Show the add image dialog
    addImage: function () {
        var self = this;

        app.editStoryboard.view.main.removeEditorInstances();
        app.editStoryboard.view.main.hideCanvasControls();

        $("#divDialogContainer").show();
        new app.dialog.view.ChoosePicture(function (success, option, data) {
            app.util.hideDialog();

            switch (option) {
                case "cancel" :
                    return;
                    break;

                case "fromGallery" :
                    $("#divDialogContainer").show();
                    new app.dialog.view.PictureGallery(function (success, imageUrl) {
                        app.util.hideDialog();

                        if (success === true) {
                            self.$el.find(".divPictureContainer > img").remove();
                            self.$el.find(".divPictureContainer")
                                .append("<img src='" + imageUrl.replace("thumb_", "") + "' />");
                        }
                    });
                    break;

                case "remove" :
                    self.$el.find(".divPictureContainer > img").remove();
                    self.$el.find(".divPictureContainer").append("<img />");
                    break;
            }
        });
    },


    // Delete scene from storyboard
    deleteScene: function () {
        var self = this;
        var dialogData = {
            heading: "Delete Scene",
            text1: "Are you sure you want to delete this Scene ?",
            text2: ""
        }

        $("#divDialogContainer").show();
        new app.dialog.view.OkCancel(dialogData, function (result) {
            app.util.hideDialog();

            if (result === true) {
                app.editStoryboard.view.main.removeScene(self);
            }
        });
    },








    // ----------------------------------- Canvas -----------------------------------

    // canvas focused
    canvasClicked: function () {
        this.$el.find(".divActualText").attr("contenteditable", false);
        app.editStoryboard.view.main.removeEditorInstances();
        app.editStoryboard.view.main.hideCanvasControls();
        this.$el.find(".divCanvasControls").show();
        this.$el.find(".divActualText").blur();
        this.$el.find(".divTextContainer").blur();
    },


    // set sketch path thickness
    setPathThickness: function () {
        this.canvas.freeDrawingBrush.width = this.$el.find(".selectPathThickness").val();
    },


    // Set the selected color and change color of selected obejct
    updateSelectedColor: function (color) {
        this.canvasSelectedColor = color;
        this.canvas.freeDrawingBrush.color = color;

        // update fill of selected object
        var selectedObject = this.canvas.getActiveObject();
        if (selectedObject !== undefined && selectedObject !== null) {
            // for free draw, change stroke and not fill
            if (selectedObject.fill === null) {
                selectedObject.set("stroke", color);
            } else {
                selectedObject.set("fill", color);
            }

            this.canvas.renderAll();
        }
    },


    // add picture to canvas
    addPictureToCanvas: function () {
        var self = this;

        // choose picture dialog
        $("#divDialogContainer").show();
        new app.dialog.view.CanvasChoosePicture(function (success, result) {
            app.util.hideDialog();

            if (success === true) {

                // show gallery dialog
                if (result === "addPicture" || result === "addBackgroundPicture") {

                    $("#divDialogContainer").show();
                    new app.dialog.view.PictureGallery(function (success, url) {
                        app.util.hideDialog();

                        if (success === true) {

                            var tempArray = url.split("/");
                            var imageName = tempArray[tempArray.length - 1].replace("thumb_", "");

                            url = "/image-proxy/" + imageName;

                            // add regular image
                            if (result === "addPicture") {
                                fabric.Image.fromURL(url, function (img) {
                                    self.canvas.add(img);
                                }); //, { crossOrigin: 'Anonymous' });

                            // add full canvas image
                            } else if (result === "addBackgroundPicture") {
                                url = url.replace("thumb_", "");
                                self.canvas.setBackgroundImage(url,
                                                            self.canvas.renderAll.bind(self.canvas), {
                                    width: self.canvas.width,
                                    height: self.canvas.height,
                                    backgroundImageStretch: false
                                });
                            }
                        }
                    });

                // background color
                } else if (result === "addBackgroundColor") {
                    self.canvas.backgroundColor = self.canvasSelectedColor;
                    self.canvas.renderAll();

                // remove background
                }   else if (result === "removeBackground") {
                    self.canvas.backgroundColor = null;
                    self.canvas.backgroundImage = null;
                    self.canvas.renderAll();
                }
            }
        })
    },


    // Remove all items from canvas
    clearCanvas: function () {
        var self = this;

        var dialogData = {
            heading: "Clear Canvas",
            text1: "Are you sure you want to clear the canvas ?",
            text2: "It cannot be undone"
        }

        $("#divDialogContainer").show();
        new app.dialog.view.OkCancel(dialogData, function (result) {
            app.util.hideDialog();

            if (result === true) {
                self.canvas.clear();
                self.canvas.backgroundColor = null;
                self.canvas.backgroundImage = null;
                self.canvas.renderAll();
            }
        });
    },


    // canvas actions
    canvasAction: function (action) {
        var self = this;

        if (action !== "delete") {
            this.canvas.isDrawingMode = false;
        }

        var selectedObject = this.canvas.getActiveObject();
        var newObject = null;

        switch (action) {
            case "select":
                return;

            case "sketch":
                this.canvas.isDrawingMode = true;
                break;

            case "text":
                newObject = new fabric.IText("Text", {
                    fontSize: 20,
                    fill: this.canvasSelectedColor
                });
                break;

            case "picture":
                this.addPictureToCanvas();
                break;

            case "circle":
                newObject = new fabric.Circle({
                    radius: 20, fill: this.canvasSelectedColor, left: 20, top: 20
                });
                break;

            case "triangle":
                newObject = new fabric.Triangle({
                    width: 40, height: 40, fill: this.canvasSelectedColor, left: 60, top: 60
                });
                break;

            case "rectangle":
                newObject = new fabric.Rect({
                    width: 40, height: 40, fill: this.canvasSelectedColor, left: 100, top: 100
                });
                break;

            case "star":
                newObject = new fabric.Polygon([
                    {x: 36, y: 0},
                    {x: 46, y: 26},
                    {x: 72, y: 28},
                    {x: 54, y: 46},
                    {x: 62, y: 72},
                    {x: 36, y: 59},
                    {x: 10, y: 72},
                    {x: 18, y: 46},
                    {x: 0, y: 28},
                    {x: 26, y: 26}], {
                    left: 140, top: 140, fill: this.canvasSelectedColor
                });
                break;

            case "moveBottom":
                if (selectedObject !== undefined && selectedObject !== null) {
                    selectedObject.sendToBack();
                }
                break;

            case "moveDown":
                if (selectedObject !== undefined && selectedObject !== null) {
                    selectedObject.sendBackwards();
                }
                break;

            case "moveUp":
                if (selectedObject !== undefined && selectedObject !== null) {
                    selectedObject.bringForward();
                }
                break;

            case "moveTop":
                if (selectedObject !== undefined && selectedObject !== null) {
                    selectedObject.bringToFront();
                }
                break;

            case "delete":
                if (selectedObject !== undefined && selectedObject !== null) {
                    this.canvas.remove(selectedObject);
                }
                break;

            case "clear":
                this.clearCanvas();
                break;

            case "undo":
                if (this.canvas._objects.length > 0) {
                    this.canvasItems.push(this.canvas._objects.pop());
                    this.canvas.renderAll();
                }
                break;

            case "redo":
                if (this.canvasItems.length > 0) {
                    this.canvasIsRedoing = true;
                    this.canvas.add(this.canvasItems.pop());
                }
                break;
        }


        // setup newObject and add to canvas
        if (newObject !== undefined && newObject !== null) {
            this.canvas.add(newObject);
        }
    },







    // ----------------------------------- Text Editor -----------------------------------


    // Focus on contenteditable when parent div is clicked
    focusTextArea: function (e) {
        if ($(".divActualText").is(":focus") === false) {
            this.$el.find(".divActualText").focus();
            this.startCkEditor();
        }
    },


    // Shows the CKeditor thing
    startCkEditor: function () {

        var self = this;
        var editorId = this.$el.find(".divActualText").attr("id");

        app.editStoryboard.view.main.hideCanvasControls();

        // return if already editing
        if (editorId in CKEDITOR.instances) {
            return;
        }

        // remove other instances
        app.editStoryboard.view.main.removeEditorInstances();

        // add attributes
        self.$el.find(".divActualText").attr("contenteditable", true);

        // add editor
        CKEDITOR.disableAutoInline = true;
        var editor = CKEDITOR.inline(editorId, {
            removePlugins: "floatingspace,maximize,resize",
            sharedSpaces: {
                top: this.$el.find(".editorTop").attr("id"),
                bottom: this.$el.find(".editorBottom").attr("id")
            }
        });

        // editor loaded
        editor.on("instanceReady", function () {
            app.util.placeCaretAtEnd(self.$el.find(".divActualText")[0]);
        });
    },


});


app.editStoryboard.view.main = new app.editStoryboard.view.Main();
