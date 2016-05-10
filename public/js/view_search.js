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
        "click #checkboxSearchText": "checkboxClicked",
        "click .divPaginationItem": "paginationItemClicked"
    },

    initialize: function () {
        var i = 0;

        this.currentPage = 1;

        // permanent scrollbar
        $("html").css({ "overflow-y": "scroll" });

        // Add category options to select element
        $("#selectSearchCategory").append("<option value='All Categories'>All Categories</option>");
        for (i = 0; i < app.data.categories.length; i++) {
            $("#selectSearchCategory").append(
                "<option value='" + app.data.categories[i] + "'>" +
                app.data.categories[i] + "</option>");
        }

        // Add sortby options to select element
        for (i = 0; i < app.data.searchSortBy.length; i++) {
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
            searchText: $("#checkboxSearchText").prop('checked'),
            selectedPage: this.currentPage
        }

        this.$el.find("#divSearchResults").hide();
        this.$el.find("#divNoResults").hide();
        this.$el.find("#divLoading").show();

        // get search results from server
        app.server.search(data, function (success, result) {

            self.$el.find("#divSearchResults").empty();
            self.$el.find("#divSearchResults").unbind();

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

                    self.currentPage = result.selectedPage;

                    // insert scenes into their storyboards
                    if (result.scenes !== undefined && result.scenes !== null && result.scenes.length > 0)
                    for (i = 0; i < result.storyboards.length; i++) {
                        result.storyboards[i].scenes = [];

                        for (var j = 0; j < result.scenes.length; j++) {
                            if (result.storyboards[i].storyboard_id === result.scenes[j].storyboard_id)
                            result.storyboards[i].scenes.push(result.scenes[j]);
                        }
                    }

                    // append storyboards to search
                    for (i = 0; i < result.storyboards.length; i++) {
                        self.$el.find("#divSearchResults")
                            .append(new app.items.view.StoryboardItem("search", result.storyboards[i]).el);
                    }


                    // Create paginator
                    self.createPaginator(result.numStoryboards, result.itemsPerPage, result.selectedPage);

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
    },


    // Create paginator
    createPaginator: function (numStoryboards, itemsPerPage, currentPage) {

        $("#divPaginationContainer").empty();
        $("#divPaginationContainer").unbind();

        var i;
        var numPages = Math.ceil(numStoryboards / itemsPerPage);
        var itemClass;

        for (i = 0; i < numPages; i++) {
            if (i + 1 == currentPage) {
                itemClass = "divPaginationItem selectedPage";
            } else {
                itemClass = "divPaginationItem";
            }

            var t =
                "<div class='" + itemClass + "' data-page='" + (i + 1) + "'>" +
                    "<label>" + (i + 1) + "</label>" +
                "</div>";

            $("#divPaginationContainer").append($(t));
        }

//        $("#divPaginationContainer").append($("<span>...</span>"));
//
//        for (i = numPages - 4; i < numPages; i++) {
//            var t =
//                "<div class='divPaginationItem'>" +
//                    "<label>" + (i + 1) + "</label>" +
//                "</div>";
//
//            $("#divPaginationContainer").append($(t));
//        }
    },


    paginationItemClicked: function (e) {
        this.currentPage = $(e.target).data("page");
        this.search();
    }

});




