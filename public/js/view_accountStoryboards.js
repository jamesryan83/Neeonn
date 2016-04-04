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

        var item = new app.items.view.StoryboardItem("account", data);
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


app.account.view.storyboards = new app.account.view.Storyboards();
