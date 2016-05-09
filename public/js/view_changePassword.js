"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};


// Change Password
app.account.view.ChangePassword = Backbone.View.extend({
    el: "#divAccountChangePassword",

    events: {
        "click #buttonChangePassword": "changePassword",
        "click #buttonReturn": "return"
    },

    // Change password
    changePassword: function () {
        var data = {
            oldPassword: $("#inputChangePasswordOld").val(),
            newPassword: $("#inputChangePasswordNew").val(),
            newPassword_confirmation: $("#inputChangePasswordNewConfirmation").val()
        }

        app.server.changePassword(data, function (success, result) {
            if (success === true) {
                app.util.showToast("Success", "Password Successfully Changed");
            }
        });
    },

    // Return to settings page
    return: function () {
        location.href = "/account/settings";
    }
});


