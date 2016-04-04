"use strict";

var app = app || {};
app.items = app.items || {};
app.items.view = app.items.view || {};


// A Single Scene Item
app.items.view.SceneItem = Backbone.View.extend({

    className: "divStoryboardSceneItem",

    template: _.template($("#templateStoryboardSceneItemBasic").html()),

    events: {
        "click .divSettingsButton": "settings",
        "click .divMoveUpButton": "moveUp",
        "click .divMoveDownButton": "moveDown",
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
            case "canvastext":
            case "textcanvas":
                this.$el.find("canvas").attr("width", app.data.sceneWidthHalf);
                this.$el.find("canvas").attr("height", app.data.sceneHeight);
                this.$el.find(".divActualText").css({ "max-width": app.data.sceneWidthHalf });
                break;

            case "text":
                this.$el.find(".divCanvas").hide();
                this.$el.find(".divActualText").css({ "max-width": app.data.sceneWidth });
                break;

            case "canvas":
                this.$el.find(".divText").hide();
                this.$el.find("canvas").attr("width", app.data.sceneWidth);
                this.$el.find("canvas").attr("height", app.data.sceneHeight);
                break;
        }



        // when text is on the right float the editor to the right
        if (this.type === "canvastext") {
            this.$el.find(".editorTop").css({ "float": "right" });
        }

        // Add type to scene element
        this.$el.find(".divInner > div").addClass("divType_" + this.type);


        // Add data to scene
        if (this.data !== undefined && this.type !== "canvas") {
            this.$el.find(".divActualText").append(this.data.text);
        }


        // hide canvas controls until canvas is clicked
        this.$el.find(".divCanvasControls").hide();

        // prevent window scroll when over a div
        app.util.preventWindowScroll(this.$el.find(".divActualText"));

        return this;
    },







    // ----------------------------------- Scene Actions -----------------------------------

    settings: function () {

    },


    // Move scene up
    moveUp: function () {
        app.editStoryboard.view.main.moveSceneUp(this.$el);
    },


    // Move scene down
    moveDown: function () {
        app.editStoryboard.view.main.moveSceneDown(this.$el);
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

                // show picture gallery dialog
                if (result === "addPicture" || result === "addBackgroundPicture") {

                    $("#divGalleryContainer").show();
                    new app.dialog.view.PictureGallery(function (success, imageName, editImage) {
                        $("#divGalleryContainer").hide();
                        $("#divGalleryContainer").empty();
                        $("#divGalleryContainer").unbind();

                        if (success === true) {

                            // save storyboard and go to edit-image page
                            if (editImage === true) {
                                app.editStoryboard.view.main.save(function (success, result) {
                                    if (success === true) {
                                        Cookies.set("previousPage", location.pathname);
                                        location.href = "/edit-image/" + imageName;
                                    }
                                });
                            } else {

                                // add regular image
                                if (result === "addPicture") {
                                    fabric.Image.fromURL("/image-proxy/" + imageName, function (img) {
                                        // scale down image to fit canvas
                                        img.left = 20;
                                        img.top = 20;
                                        img.scaleToHeight(app.data.sceneHeight - 100);
                                        
                                        self.canvas.add(img);
                                    });

                                // add full canvas image
                                } else if (result === "addBackgroundPicture") {
                                    self.canvas.setBackgroundImage("/image-proxy/" + imageName,
                                                                self.canvas.renderAll.bind(self.canvas), {
                                        width: self.canvas.width,
                                        height: self.canvas.height,
                                        backgroundImageStretch: false
                                    });
                                }
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
