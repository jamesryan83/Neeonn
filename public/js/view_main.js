"use strict";

var app = app || {};
app.main = app.main || {};
app.main.view = app.main.view || {};



// Main div
app.main.view.Main = Backbone.View.extend({

    el: "#divContentApp",

    events: {
        "click #divGoToTop": "scrollToTop"
    },

    initialize: function () {
        var self = this;

        // show/hide scroll to top button
        $(document).scroll(function () {
            if ($(document).scrollTop() > 200) {
                $("#divGoToTop").show();
            } else {
                $("#divGoToTop").hide();
            }
        })
    },

    // scroll document to top of page
    scrollToTop: function () {
        // http://stackoverflow.com/a/9359619
        var completeCalled = false;
        $("html, body").animate({ scrollTop: "0" }, {
            complete : function(){
                if(completeCalled === false) {
                    completeCalled = true;
                }
            }
        });
    }

});


