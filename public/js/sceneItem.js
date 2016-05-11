"use strict";

var app = app || {};
app.items = app.items || {};
app.items.view = app.items.view || {};


// A Single Scene Item
app.items.view.SceneItem = Backbone.View.extend({

    className: "divStoryboardSceneItem",

    template: _.template($("#templateStoryboardSceneItemBasic").html()),

    events: {
        "click .divMoveUpButton": "moveUp",
        "click .divMoveDownButton": "moveDown",
        "click .divDeleteSceneButton": "deleteScene",
        "click .divTextContainer": "focusTextArea",
        "click .divActualText": "startCkEditor",
        "click .canvasMain": "canvasClicked",
        "focusin .divActualText": "startSaveText",
        "focusout .divActualText": "endSaveText",
        "focusin .divCanvasContainer": "startSaveCanvas",
        "focusout .divCanvasContainer": "endSaveCanvas",

        "click .divCanvasButtonSelect": function () { this.canvasAction("select"); },
        "click .divCanvasButtonSketch": function () { this.canvasAction("sketch"); },
        "click .divCanvasButtonText": function () { this.canvasAction("text"); },
        "click .divCanvasButtonPicture": function () { this.canvasAction("picture"); },
        "click .divCanvasButtonEmoji": function () { this.canvasAction("emoji"); },
        "click .divCanvasButtonClear": function () { this.canvasAction("clear"); },
        "change .selectPathThickness": "setPathThickness"
    },


    initialize: function (data) {
        var self = this;
        this.scene_id = data.scene_id;
        this.data = data;
        this.canvasSelectedColor = "#000000";
        this.textSelectedColor = "#000000";
        this.canvasIsRedoing = false;
        this.canvasItems = []; // TODO : update when items loaded from server
        this.lastText = data.text;
        this.lastCanvas = data.canvas_data_json;
        this.image_name = null;
        this.debugSaveOff = false;
        this.render();

        // after render is finished
        setTimeout(function () {

            // setup canvas if required
            if (self.data.type === "canvastext" || self.data.type === "textcanvas" ||
                    self.data.type === "canvas") {
                self.canvas = new fabric.Canvas("canvas" + self.data.storyboard_index);
                self.canvas.selection = true;
                self.canvas.freeDrawingBrush.width = 5;
                self.canvas.freeDrawingBrush.color = app.data.colorNeonPink;

                self.image_name = app.data.image_name;
                if (self.image_name === undefined) {
                    self.image_name = null;
                }

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
                    self.canvas.loadFromJSON(self.data.canvas_data_json,
                                             self.canvas.renderAll.bind(self.canvas));
                }


                // canvas keydown
                self.$el.find(".divCanvasContainer").keydown(function (e) {
                    if (e.keyCode === 46) { // delete
                        self.canvasAction("delete");
                    } else if (e.ctrlKey && e.keyCode == 89) { // ctrl + y
                        self.canvasAction("redo");
                    } else if (e.ctrlKey && e.keyCode == 90) { // ctrl + z
                        self.canvasAction("undo");
                    } else if (e.keyCode == 38) { // up arrow
                        e.preventDefault();
                        self.canvasAction("moveUp");
                    } else if (e.keyCode == 40) { // down arrow
                        e.preventDefault();
                        self.canvasAction("undo");
                        self.canvasAction("moveDown");
                    }
                });


                // setup canvas color picker
                $("#inputCanvasColorPicker" + self.data.storyboard_index).spectrum({
                    showPalette: true,
                    showAlpha: true,
                    color: self.canvasSelectedColor,
                    clickoutFiresChange: false,
                    show: function () {
                        // event to select same color when choose is clicked
                        // (instead of change event which doesn't fire when same color is picked)
                        $("body > .sp-container").find(".sp-choose").on("click.myChooseClick", function () {
                            self.updateSelectedCanvasColor(
                                $("#inputCanvasColorPicker" + self.data.storyboard_index)
                                .spectrum("get").toHexString());
                        });
                    },
                    hide: function () {
                        $("body > .sp-container").find(".sp-choose").off("click.myChooseClick");
                    }
                });
            }


            if (self.data.type === "canvastext" || self.data.type === "textcanvas" ||
                    self.data.type === "text") {

                // setup text color picker
                $("#inputTextColorPicker" + self.data.storyboard_index).spectrum({
                    showPalette: true,
                    showAlpha: true,
                    color: self.textSelectedColor,
                    clickoutFiresChange: false,
                    show: function () {
                        // event to select same color when choose is clicked
                        // (instead of change event which doesn't fire when same color is picked)
                        $("body > .sp-container").find(".sp-choose").on("click.myChooseClick", function () {
                            self.updateSelectedTextColor(
                                $("#inputTextColorPicker" + self.data.storyboard_index)
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
        this.$el.html(this.template({
            scene_id: this.data.scene_id,
            type: this.data.type,
            storyboard_index: this.data.storyboard_index
        }));

        // show html elements based on scene type
        switch (this.data.type) {
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


        // Add type to scene element
        this.$el.find(".divInner > div").addClass("divType_" + this.data.type);


        // Add data to scene
        if (this.data !== undefined && this.data.type !== "canvas") {
            this.$el.find(".divActualText").append(this.data.text);
        }


        // hide canvas controls until canvas is clicked
        this.$el.find(".divCanvasControls").hide();


        // prevent window scroll when over a div
        app.util.preventWindowScroll(this.$el.find(".divActualText"));

        return this;
    },




    // ----------------------------------- Scene Actions -----------------------------------

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
        this.$el.find(".divTextControls").hide();
        this.$el.find(".divActualText").attr("contenteditable", false);
        app.editStoryboard.view.main.removeEditorInstances();
        app.editStoryboard.view.main.hideCanvasControls();
        this.$el.find(".divCanvasControls").show();
    },


    // set sketch path thickness
    setPathThickness: function () {
        this.canvas.freeDrawingBrush.width = this.$el.find(".selectPathThickness").val();
    },


    // Set the selected color and change color of selected obejct
    updateSelectedCanvasColor: function (color) {
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

        // show choose picture dialog
        $("#divDialogContainer").show();
        new app.dialog.view.CanvasChoosePicture(function (success, result) {
            app.util.hideDialog();

            if (success === true) {

                // show picture gallery dialog
                if (result === "addBackgroundPicture") {

                    $("#divGalleryContainer").show();
                    new app.dialog.view.PictureGallery(function (success, imageName) {
                        $("#divGalleryContainer").hide();
                        $("#divGalleryContainer").empty();
                        $("#divGalleryContainer").unbind();

                        if (success === true) {
                            var isFullWidth = self.data.type === "canvas" ? true : false;

                            // show position background image dialog
                            $("#divDialogContainer").show();
                            new app.dialog.view.PositionBackgroundImage(isFullWidth, imageName,
                                    function (success, data) {
                                app.util.hideDialog();

                                if (success === true) {
                                    // add image to canvas
                                    fabric.Image.fromURL("/image-proxy/" + imageName, function (img) {
                                        self.canvas.setBackgroundImage(img,
                                            self.canvas.renderAll.bind(self.canvas), {
                                            left: data.left,
                                            top: data.top,
                                            width: data.width,
                                            height: data.height,
                                            backgroundImageStretch: false
                                        });

                                        self.image_name = imageName;
                                        self.saveCanvasData();
                                    });
                                }
                            });
                        }
                    });

                // background color
                } else if (result === "addBackgroundColor") {
                    self.canvas.backgroundColor = self.canvasSelectedColor;
                    self.canvas.renderAll();
                    self.saveCanvasData();

                // remove background
                }   else if (result === "removeBackground") {
                    self.canvas.backgroundColor = null;
                    self.canvas.backgroundImage = null;
                    self.canvas.renderAll();

                    self.image_name = null;
                    self.saveCanvasData();
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
                    fontFamily: "open-sans, Helvetica Neue, Helvetica, Arial, sans-serif",
                    fill: this.canvasSelectedColor
                });
                break;

            case "picture":
                this.addPictureToCanvas();
                break;


            case "emoji":
                $("#divGalleryContainer").show();
                new app.dialog.view.Emoji(function (success, imagePath) {
                    $("#divGalleryContainer").hide();
                    $("#divGalleryContainer").empty();
                    $("#divGalleryContainer").unbind();

                    if (success === true) {
                        fabric.Image.fromURL(imagePath, function(img) {
                            img.scaleToWidth(30);
                            img.set("left", 100);
                            img.set("top", 100);
                            self.canvas.add(img);

                            self.saveCanvasData();
                        });
                    }
                });

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


    // Start save canvas timer
    startSaveCanvas: function () {
        if (this.debugSaveOff === true) return;
        var self = this;
        this.saveCanvasTimer = setInterval(function () {
            var canvasData = JSON.stringify(self.canvas);

            if (canvasData !== self.lastCanvas) {
                self.saveCanvasData();
            }

            self.lastCanvas = canvasData;
        }, 2000)
    },


    // End save canvas timer
    endSaveCanvas: function () {
        if (this.debugSaveOff === true) return;
        clearInterval(this.saveCanvasTimer);
        var canvasData = JSON.stringify(this.canvas);

        if (canvasData !== this.lastCanvas) {
            this.saveCanvasData();
        }

        this.lastCanvas = canvasData;
    },


    // Save canvas data
    saveCanvasData: function () {
        app.server.updateSceneCanvas({
            scene_id: this.scene_id,
            image_name: this.image_name,
            canvas_data_json: JSON.stringify(this.canvas),
            canvas_data_svg: this.canvas.toSVG({
                suppressPreamble: true,
                width: this.data.type === "canvas" ? app.data.sceneWidth : app.data.sceneWidthHalf,
                height: app.data.sceneHeight,
                viewBox: {
                    x: 0,
                    y: 0,
                    width: this.data.type === "canvas" ? app.data.sceneWidth : app.data.sceneWidthHalf,
                    height: app.data.sceneHeight
                }
            })
        }, function (success) { console.log("canvas saved") });
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
        editor.on("instanceReady", function (e) {
            self.$el.find(".divTextControls").css({ "display": "inline-block" });
            app.util.placeCaretAtEnd(self.$el.find(".divActualText")[0]);

            editor.on('afterPaste', function(evt) {
                // remove &nbsp; and sometimes a <p> is also added at the start
                var html = editor.getData().replace(/&nbsp;/g, " ");
                html = html.replace(/<p><\/p>/, "");
                editor.editable().setHtml(html) // setHtml bypasses html filter
            });
        });
    },


    // TODO : color doesn't seem to be working
    // Set the selected color and change color of selected obejct
    updateSelectedTextColor: function (color) {
        this.textSelectedColor = color;

        var editorId = this.$el.find(".divStoryboardSceneItemBasic").data("storyboard_index");
        var editor = CKEDITOR.instances["editor" + editorId];

        if (editor.getSelection().getSelectedText().trim().length === 0) {
            return;
        }

        editor.applyStyle(new CKEDITOR.style({
            element: "span",
            attributes: {
                "style": "color: " + color
            }
        }));
    },


    // Start save text timer
    startSaveText: function () {
        if (this.debugSaveOff === true) return;
        var self = this;

        this.saveTextTimer = setInterval(function () {
            var text = self.$el.find(".divActualText").html();

            if (text !== self.lastText) {
                app.server.updateSceneText({
                    scene_id: self.scene_id,
                    text: text
                }, function (success) { console.log("text saved") });
            }

            self.lastText = text;
        }, 20000)
    },


    // End save text timer
    endSaveText: function () {
        if (this.debugSaveOff === true) return;
        clearInterval(this.saveTextTimer);
        var text = this.$el.find(".divActualText").html();

        if (text !== this.lastText) {
            app.server.updateSceneText({
                scene_id: this.scene_id,
                text: text
            }, function (success) { console.log("text saved") });
        }

        this.lastText = text;
    },

});
