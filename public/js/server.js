"use strict";

var app = app || {};
app.server = {};



// ---------------------------------------- Images ----------------------------------------

// get images for gallery
app.server.getGalleryImages = function (callback) {
    app.server.ajaxRequest("GET", "/get-gallery-images", null, "Error getting gallery images", callback);
}


// Returns an image from a provided url
app.server.getImageFromUrl = function (providedUrl, callback) {
    app.server.ajaxRequest("POST", "/upload-image-url", {
        url: providedUrl
    }, "Error getting image from url", callback);
}


// Save updated image
app.server.saveUpdatedImage = function (cropData, imageName, imageString, callback) {
    app.server.ajaxRequest("POST", "/update-image", {
        cropData: cropData,
        imageName: imageName,
        imageString: imageString
    }, "Error saving image", callback);
}


// Delete a temporary image (for edit-image page)
app.server.deleteTempImage = function (imageName, callback) {
    app.server.deleteImage(imageName, callback, true);
}


// Delete an image
app.server.deleteImage = function (imageName, callback, isTempImage) {
    var url = "/delete-image";
    if (isTempImage === true) {
        url = "/delete-temp-image";
    }

    app.server.ajaxRequest("POST", url, {
        imageName: imageName
    }, "Error deleting image", callback);
}







// ------------------------------------- Storyboards -------------------------------------


// Get storyboard
app.server.getStoryboard = function (storyboardId, callback) {
    app.server.ajaxRequest("GET", "/get-storyboard", {
        storyboardId: storyboardId
    }, "Error getting Storyboard", callback);
}


// Get all storyboards
app.server.getAllStoryboards = function (callback) {
    app.server.ajaxRequest("GET", "/get-all-storyboards", null, "Error getting Storyboards", callback);
}


// Create storyboard
app.server.createStoryboard = function (data, callback) {
    app.server.ajaxRequest("POST", "/create-storyboard", {
        data: data
    }, "Error creating Storyboard", callback);
}


// Save storyboard
app.server.saveStoryboard = function (storyboardData, callback) {
    app.server.ajaxRequest("POST", "/save-storyboard", {
        storyboardData: storyboardData
    }, "Error saving Storyboard", callback);
}


// Delete storyboard
app.server.deleteStoryboard = function (storyboardId, callback) {
    app.server.ajaxRequest("POST", "/delete-storyboard", {
        storyboardId: storyboardId
    }, "Error deleting Storyboard", callback);
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



