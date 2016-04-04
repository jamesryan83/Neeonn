"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};

// Social
app.account.view.Social = Backbone.View.extend({

    el: "#divContentSocial",

    events: {
        "click #buttonCreateStoryboard": "createStoryboard"
    },

    initialize: function () {

    }

});
