"use strict";

var app = app || {};
app.server = {};



// ---------------------------------------- Images ----------------------------------------

// get images for gallery
app.server.getGalleryImages = function (callback) {
    app.server.ajaxRequest("GET", "/get-gallery-images",
                           null, "Error getting gallery images", callback);
}


// Returns an image from a provided url
app.server.getImageFromUrl = function (providedUrl, callback) {
    app.server.ajaxRequest("POST", "/upload-image-url", {
        url: providedUrl
    }, "Error getting image from url", callback);
}


// Get storyboards for image
app.server.getStoryboardsForImage = function (imageName, callback) {
    app.server.ajaxRequest("POST", "/get-storyboards-for-image", {
        imageName: imageName
    }, "Error getting storyboards for image", callback);
}


// Delete an image
app.server.deleteImage = function (imageName, callback) {
    app.server.ajaxRequest("POST", "/delete-image", {
        imageName: imageName
    }, "Error deleting image", callback);
}


// Update gallery order
app.server.updateGalleryOrder = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-gallery-order", {
        data: data
    }, "Error updating gallery order", callback);
}








// ------------------------------------- Storyboards -------------------------------------

// Get storyboard
app.server.getStoryboard = function (storyboard_id, callback) {
    app.server.ajaxRequest("GET", "/get-storyboard", {
        storyboard_id: storyboard_id
    }, "Error getting Storyboard", callback);
}


// Get all storyboards
app.server.getAllStoryboards = function (callback) {
    app.server.ajaxRequest("GET", "/get-all-storyboards",
                           null, "Error getting Storyboards", callback);
}


// Create storyboard
app.server.createStoryboard = function (data, callback) {
    app.server.ajaxRequest("POST", "/create-storyboard", {
        data: data
    }, "Error creating Storyboard", callback);
}


// Update storyboard details
app.server.updateStoryboardDetails = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-storyboard-details", {
        data: data
    }, "Error saving Storyboard details", callback);
}


// Delete storyboard
app.server.deleteStoryboard = function (storyboard_id, callback) {
    app.server.ajaxRequest("POST", "/delete-storyboard", {
        storyboard_id: storyboard_id
    }, "Error deleting Storyboard", callback);
}








// ------------------------------------- Scenes -------------------------------------

// Create scene
app.server.createScene = function (data, callback) {
    app.server.ajaxRequest("POST", "/create-scene", {
        data: data
    }, "Error creating Scene", callback);
}


// Update scene canvas
app.server.updateSceneCanvas = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-scene-canvas", {
        data: data
    }, "Error updating Scene canvas", callback);
}


// Update scene text
app.server.updateSceneText = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-scene-text", {
        data: data
    }, "Error updating Scene text", callback);
}


// Update scene indicies
app.server.updateSceneIndicies = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-scene-indicies", {
        data: data
    }, "Error updating Scene order", callback);
}


// Delete scene
app.server.deleteScene = function (data, callback) {
    app.server.ajaxRequest("POST", "/delete-scene", {
        data: data
    }, "Error deleting Scene", callback);
}








// ------------------------------------- Comments -------------------------------------

// Get comments
app.server.getComments = function (storyboard_id, callback) {
    app.server.ajaxRequest("GET", "/get-comments", {
        storyboard_id: storyboard_id
    }, "Error getting Comments", callback);
}


// Make comment
app.server.makeComment = function (data, callback) {
    app.server.ajaxRequest("POST", "/make-comment", {
        data: data
    }, "Error making Comment", callback);
}


// Update comment
app.server.updateComment = function (data, callback) {
    app.server.ajaxRequest("POST", "/update-comment", {
        data: data
    }, "Error updating Comment", callback);
}


// Vote on comment
app.server.voteOnComment = function (data, callback) {
    app.server.ajaxRequest("POST", "/vote-on-comment", {
        data: data
    }, "Error voting on comment", callback);
}









// ------------------------------------- Account -------------------------------------

// Change password
app.server.changePassword = function (data, callback) {
    app.server.ajaxRequest("POST", "/account/change-password", {
        data: data
    }, "Error changing password", callback);
}


// Update an account setting (routes in view_accountSettings)
app.server.updateAccount = function (url, data, callback) {
    app.server.ajaxRequest("POST", url, {
        data: data
    }, "Error updating account", callback);
}










// ------------------------------------- Search -------------------------------------

// Search storyboards
app.server.search = function (data, callback) {
    app.server.ajaxRequest("POST", "/search", {
        data: data
    }, "Error searching", callback);
}






// ------------------------------------- Ajax -------------------------------------

// Generic ajax request
app.server.ajaxRequest = function (type, url, data, errorMessage, callback) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        success: function (result) {
            if (result.success === true) {
                callback(true, result.data);
            } else {
                app.util.showToast("Error", result.message);
                callback(false, result);
            }
        },
        error: function (err) {
            console.log(err);
            app.util.showToast("Error", errorMessage);
            callback(false, errorMessage);
        }
    });
}

// ajax responses from server are expected to be...
// success: { "success": true, "data": result }
// fail: { "success": false, "message": "error message" }



