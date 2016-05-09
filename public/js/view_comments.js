"use strict";

var app = app || {};
app.comments = {};
app.comments.view = {};



// Comments page Main
app.comments.view.Main = Backbone.View.extend({

    el: "#divComments",

    events: {

    },

    initialize: function () {
        var self = this;

        this.storyboard_id = this.$el.data("storyboard_id");


        // get storyboard
        app.server.getStoryboard(this.storyboard_id, function (success, data) {
            $("#divLoading").hide();
            if (success === true) {
                $("#divStoryboard").append(new app.items.view.StoryboardItem("comments", data).el);
            }
        });


        // get comments
        app.server.getComments(this.storyboard_id, function (success, data) {
            $("#divLoading").hide();
            if (success === true) {
                var i = 0;
                var commentList = self.$el.find("#divCommentsList");

                // add comments to commentList
                for (i = 0; i < data.comments.length; i++) {
                    var comment = new app.comments.view.CommentItem(data.comments[i]);

                    if (data.comments[i].is_deleted !== undefined && data.comments[i].is_deleted == 1) {
                        comment.isDeleted();
                    } else if (data.user_id !== undefined) {
                        if (data.user_id == data.comments[i].user_id) {
                            comment.showEditAndDelete();
                        }
                    }

                    if (data.comments[i].parent_id == 0) {
                        $(commentList).append(comment.el);
                    } else {
                        $(commentList)
                            .find("[data-comment_id='" + data.comments[i].parent_id + "']")
                            .find(".divCommentChild").first().append(comment.el);
                    }
                }


                // add user votes to comments
                if (data.votes !== undefined) {
                    for (i = 0; i < data.votes.length; i++) {
                        var divClass = null;
                        if (data.votes[i].direction === "u") {
                            divClass = "divButtonUpvote";
                        } else if (data.votes[i].direction === "d") {
                            divClass = "divButtonDownvote";
                        }

                        var el = $(commentList)
                            .find("[data-comment_id='" + data.votes[i].comment_id + "']")
                            .find("." + divClass).first().addClass(divClass + "Highlight");
                    }
                }


                self.colorComments();

                self.updateCommentsLabel();
            }
        });


        // Add main comment inputs
        var commentInputs = new app.comments.view.CommentInputs(null, true, false).el;
        $("#divCommentInputsMain").append(commentInputs);


        // Number of characters label
        $("#textareaComment").on("input selectionchange propertychange", function () {
            $("#labelNumCharacters").text($(this).val().length + "/3000");
        });
    },



    // set the background color of comments
    colorComments: function () {
        // put elements into array
        var elements = [];
        $("#divCommentsList").find(".divCommentItem").each(function () {
            elements.push({ element: this, level: $(this).parents().length });
        });

        if (elements.length > 0) {
            elements = app.util.sortIntegerArray(elements, "level");

            // set dom level background color, alternates between 2 colors
            var isZero = true;
            for (var i = 1; i < elements.length; i++) {
                if (elements[i].level !== elements[i - 1].level) {
                    isZero = !isZero;
                }

                $(elements[i].element).css({
                    "background-color": isZero ? app.data.colorComment1 : app.data.colorComment2
                });
            }

            // Timeago
            $("time.timeago").timeago();
        }
    },


    // Update total number of comments label
    updateCommentsLabel: function () {
        var numComments = this.$el.find(".divCommentItem").length;

        if (numComments === 1) {
            $("#labelNumComments").text("1 Comment");
        }
        else {
            $("#labelNumComments").text(numComments + " Comments");
        }
    }


});









// Comment Inputs
app.comments.view.CommentInputs = Backbone.View.extend({

    className: "divCommentInputsContainer",

    template: _.template($("#templateCommentInputs").html()),

    events: {
        "click .buttonSaveComment": "saveComment",
        "click .buttonCancelComment": "cancelComment",
    },

    initialize: function (item, isMainCommentInput, isEdit, editData) {
        this.item = item;
        this.isMainCommentInput = isMainCommentInput;
        this.isEdit = isEdit;
        this.editData = editData;
        this.render();
    },

    render: function () {
        this.$el.html(this.template());

        // cancel button not required on main comment input
        if (this.isMainCommentInput === true) {
            this.$el.find(".buttonCancelComment").hide();
        }

        // set existing text if edit mode
        if (this.isEdit === true) {
            this.$el.find(".textareaComment").first().val(this.editData.text);
        }

        return this;
    },


    // Save comment
    saveComment: function () {
        var self = this;
        var text = this.$el.find(".textareaComment").val();

        if (text.length === 0) {
            app.util.showToast("You need to enter some text");
            return;
        }

        if (text.length > 3000) {
            app.util.showToast("Comment limit is 1000 characters");
            return;
        }


        // update comment
        if (this.isEdit === true) {
            var commentData = {
                comment_id: this.editData.comment_id,
                text: text
            }

            app.server.updateComment(commentData, function (success, result) {
                var el = $("#divCommentsList")
                    .find("[data-comment_id='" + commentData.comment_id + "']")
                    .find(".divCommentItemText").first().text(text);

                self.cancelComment();
            });

        // create comment
        } else {

            // find parent id of comment for this input box
            var parent_id = this.$el.closest(".divCommentItem").data("comment_id");
            if (parent_id === undefined) {
                parent_id = 0;
            }

            var commentData = {
                storyboard_id: app.comments.view.main.storyboard_id,
                text: text,
                parent_id: parent_id
            }


            app.server.makeComment(commentData, function (success, result) {
                if (success === true) {
                    commentData.comment_id = result.comment_id;
                    commentData.username = result.username;
                    commentData.updated_at = result.updated_at.date;
                    commentData.points = 1;

                    // add new comment to root or another comment
                    var comment = new app.comments.view.CommentItem(commentData);
                    if (self.item === null) {
                        $("#divCommentsList").prepend(comment.el);
                    } else {
                        $(self.item).find(".divCommentChild").first().prepend(comment.el);
                    }

                    comment.setUpvote();
                    comment.showEditAndDelete();

                    // hide input box
                    if (!self.isMainCommentInput) {
                        self.cancelComment();
                    }

                    app.comments.view.main.colorComments();

                    app.comments.view.main.updateCommentsLabel();
                }
            });
        }

    },


    // Hide comment input
    cancelComment: function () {
        this.$el.remove();
    }

});











// Comment Item
app.comments.view.CommentItem = Backbone.View.extend({

    className: "divCommentItemContainer",

    template: _.template($("#templateCommentItem").html()),

    events: {
        "click .divButtonUpvote": "clickedUpvote",
        "click .divButtonDownvote": "clickedDownvote",
        "click .aCommentItemUsername": "goToUserPage",
        "click .aCommentItemReply": "replyToComment",
        "click .aCommentItemEdit": "editComment",
        "click .aCommentItemDelete": "deleteComment"
    },

    initialize: function (data) {
        this.data = data;
        this.render();
    },

    render: function () {
        var self = this;

        this.$el.html(this.template({
            comment_id: this.data.comment_id,
            user_id: this.data.user_id,
            username: this.data.username,
            points: this.data.points,
            updated_at: this.data.updated_at.replace(" ", "T") + "-02:00",
            text: this.data.text,
        }));

        return this;
    },







    // ------------------------------------- Comment Actions -------------------------------------

    // Go to page of owner of this comment
    goToUserPage: function () {
        // TODO
    },


    // Show Comment Inputs box below this comment
    replyToComment: function () {
        this.showInput(false);
    },


    // Edit comment
    editComment: function () {
        this.showInput(true, {
            comment_id: this.data.comment_id,
            text: this.$el.find(".divCommentItemText").first().html()
        });
    },


    // Delete comment
    deleteComment: function () {
        var self = this;

        var data = {
            comment_id: this.data.comment_id
        }

        app.server.deleteComment(data, function (success) {
            console.log(success);
            if (success === true) {
                self.isDeleted();
            }
        });
    },


    // Show inputs
    showInput: function (isEdit, editData) {
        var childContainer = this.$el.find(".divCommentChild").first();
        var inputs = $(childContainer).find(".divCommentInputsContainer").first();

        if (inputs.length === 0) {
            var commentInputs = new app.comments.view.CommentInputs(this.$el, false, isEdit, editData).el;
            $(childContainer).prepend(commentInputs);
        } else {
            $(inputs).show();
        }
    },


    // Show edit and delete buttons if current user owns this comment
    showEditAndDelete: function () {
        this.$el.find(".divCommentItemEdit").first().css({ "display": "inline-block" });
        this.$el.find(".divCommentItemDelete").first().css({ "display": "inline-block" });
    },


    // Hide stuff when comment is deleted
    isDeleted: function () {
        this.$el.find(".divCommentItemText").first().text("Comment Deleted");

        this.$el.find(".divCommentItemVoteButtons").first().children().hide();
        this.$el.find(".divCommentItemUsername").first().hide();
        this.$el.find(".divCommentItemPoints").first().hide();
        this.$el.find(".divCommentItemEdit").first().hide();
        this.$el.find(".divCommentItemReply").first().hide();
        this.$el.find(".divCommentItemDelete").first().hide();
    },


    // ------------------------------------- Voting -------------------------------------

    // Vote on a comment
    vote: function (e, direction) {
        e.stopPropagation();

        var self = this;
        var data = {
            storyboard_id: app.comments.view.main.storyboard_id,
            comment_id: this.data.comment_id,
            direction: direction
        }

        app.server.voteOnComment(data, function (success, result) {
            if (success === true) {
                self.$el.find(".divCommentItemPoints").first().text("Points " + result.points);
            }
        });
    },


    // clicked upvote
    clickedUpvote: function (e) {
        this.setDownvote(true);

        if (this.$el.find(".divButtonUpvote").first().hasClass("divButtonUpvoteHighlight") === false) {
            this.vote(e, "u");
            this.setUpvote();
        } else {
            this.vote(e, "n");
            this.setUpvote(true);
        }
    },


    // clicked downvote
    clickedDownvote: function (e) {
        this.setUpvote(true);

        if (this.$el.find(".divButtonDownvote").first().hasClass("divButtonDownvoteHighlight") === false) {
            this.vote(e, "d");
            this.setDownvote();
        } else {
            this.vote(e, "n");
            this.setDownvote(true);
        }
    },


    // set upvote class
    setUpvote: function (remove) {
        if (remove === true) {
            this.$el.find(".divButtonUpvote").first().removeClass("divButtonUpvoteHighlight");
        } else {
            this.$el.find(".divButtonUpvote").first().addClass("divButtonUpvoteHighlight");
        }
    },


    // set downvote class
    setDownvote: function (remove) {
        if (remove === true) {
            this.$el.find(".divButtonDownvote").first().removeClass("divButtonDownvoteHighlight");
        } else {
            this.$el.find(".divButtonDownvote").first().addClass("divButtonDownvoteHighlight");
        }
    },




});




