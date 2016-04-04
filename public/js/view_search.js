"use strict";

var app = app || {};
app.search = {};
app.search.view = {};


// Search
app.search.view.Main = Backbone.View.extend({

    el: "#divSearch",

    events: {
        "click #buttonSearchGo": "search",
        "click #checkboxSearchTitles": "checkboxClicked",
        "click #checkboxSearchUsernames": "checkboxClicked",
        "click #checkboxSearchText": "checkboxClicked"
    },

    initialize: function () {

        // permanent scrollbar
        $("html").css({ "overflow-y": "scroll" });

        // Add category options to select element
        $("#selectSearchCategory").append("<option value='All Categories'>All Categories</option>");
        for (var i = 0; i < app.data.categories.length; i++) {
            $("#selectSearchCategory").append(
                "<option value='" + app.data.categories[i] + "'>" +
                app.data.categories[i] + "</option>");
        }

        // Add sortby options to select element
        for (var i = 0; i < app.data.searchSortBy.length; i++) {
            $("#selectSearchSortBy").append(
                "<option value='" + app.data.searchSortBy[i] + "'>" +
                app.data.searchSortBy[i] + "</option>");
        }

        this.search();
    },


    // Search
    search: function () {
        var self = this;

        var data = {
            searchTerm: $("#inputSearchTerm").val(),
            category: $("#selectSearchCategory option:selected").text(),
            sortBy: $("#selectSearchSortBy option:selected").text(),
            searchTitles: $("#checkboxSearchTitles").prop('checked'),
            searchUsernames: $("#checkboxSearchUsernames").prop('checked'),
            searchText: $("#checkboxSearchText").prop('checked')
        }

        this.$el.find("#divSearchResults").hide();
        this.$el.find("#divNoResults").hide();
        this.$el.find("#divLoading").show();

        // get search results from server
        app.server.search(data, function (success, result) {

            self.$el.find("#divSearchResults").empty();
            self.$el.find("#divSearchResults").unbind();

            //console.log(result)

            if (success === true) {

                // show no results message
                if (result === null || result.length === 0 || result.storyboards === undefined ||
                    result.storyboards === null || result.storyboards.length === 0) {
                    self.$el.find("#divSearchResults").hide();
                    self.$el.find("#divLoading").hide();
                    self.$el.find("#divNoResults").show();

                // append new results
                } else {

                    var i = 0;

                    // insert scenes into their storyboards
                    if (result.scenes !== undefined && result.scenes !== null && result.scenes.length > 0)
                    for (i = 0; i < result.storyboards.length; i++) {
                        result.storyboards[i].scenes = [];

                        for (var j = 0; j < result.scenes.length; j++) {
                            if (result.storyboards[i].storyboard_id === result.scenes[j].storyboard_id)
                            result.storyboards[i].scenes.push(result.scenes[j]);
                        }
                    }

                    // prepend storyboards to search
                    for (i = 0; i < result.storyboards.length; i++) {
                        self.$el.find("#divSearchResults")
                            .prepend(new app.items.view.StoryboardItem("search", result.storyboards[i]).el);
                    }

                    self.$el.find("#divNoResults").hide();
                    self.$el.find("#divLoading").hide();
                    self.$el.find("#divSearchResults").show();
                }
            }
        });
    },


    // Keep at least one checkbox checked
    checkboxClicked: function (e) {
        $("#checkboxSearchTitles").prop('checked', false);
        $("#checkboxSearchUsernames").prop('checked', false);
        $("#checkboxSearchText").prop('checked', false);

        $(e.target).prop("checked", true);
    }

});



new app.search.view.Main();
