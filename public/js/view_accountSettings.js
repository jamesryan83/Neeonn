"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};


// Settings
app.account.view.Settings = Backbone.View.extend({

    el: "#divContentSettings",

    events: {
        "click #buttonSettingsSave": function () { this.updateAccount("save"); },
        "click #buttonSettingsDisable": function () { this.updateAccount("disable"); },
        "click #buttonSettingsEnable": function () { this.updateAccount("enable"); },
        "click #buttonSettingsDelete": function () { this.deleteAccount(); }
    },


    // Update account
    updateAccount: function (option) {
        $("#pErrors").text("");
        var url;
        var data = null;

        switch(option) {
            case "save":
                url = "/update-account";
                data = {
                    fullname: $("#inputAccountSettingsFullName").val(),
                    username: $("#inputAccountSettingsUsername").val(),
                    email: $("#inputAccountSettingsEmail").val(),
                    website: $("#inputAccountSettingsWebsite").val(),
                    location: $("#inputAccountSettingsLocation").val(),
                    summary: $("#inputAccountSettingsSummary").val()
                };
                break;

            case "disable":
                url = "/disable-account";
                break;

            case "enable":
                url = "/enable-account";
                break;

            case "delete":
                url = "/delete-account";
                break;
        }


        app.server.updateAccount(url, data, function (success, result) {
            if (success === true) {
                app.util.showToast("Success", "Settings Saved");

                setTimeout(function () {
                    location.reload();
                }, 1000);
            }
        });
    },


    // Show confirm delete dialog
    deleteAccount: function () {
        var self = this;

        var dialogData = {
            heading: "Delete Account",
            text1: "Are you sure you want to delete your account ?",
            text2: "You will lose all your content and it cannot be undone"
        }

        $("#divDialogContainer").show();
        new app.dialog.view.OkCancel(dialogData, function (result) {
            app.util.hideDialog();

            if (result !== true) {
                return;
            }

            self.updateAccount("delete");
        });
    }
});


