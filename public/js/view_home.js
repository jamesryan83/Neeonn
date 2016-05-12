"use strict";

var app = app || {};
app.home = app.home || {};
app.home.view = app.home.view || {};



// Home div
app.home.view.Main = Backbone.View.extend({

    el: "#divHome",

    events: {
        "click #buttonDownloadApp": "downloadApp",
        "click #buttonLookInside": function () { location.href = "/search"; }
    },

    initialize: function () {
        var self = this;

        // preload phone images
        for (var i = 1; i < 7; i++) {
            var img = new Image();
            img.src = "../../res/homescreenimages/" + i + ".png";
        }

        // cycle through phone images
        var count = 2;
        $("#imgPhone").attr("src", "../../res/homescreenimages/1.png").hide().fadeIn();
        setInterval(function () {
            $("#imgPhone").fadeOut(function () {
                $(this).attr("src", "../../res/homescreenimages/" + count + ".png").hide().fadeIn();
                count = count < 6 ? count = count + 1 : 1;
            });
        }, 3000);

    },


    // Download the neeonn app
    downloadApp: function () {
        location.href = "/res/neeonn_android_app.apk";
    }
});


