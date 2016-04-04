<?php

// Public routes (website or mobile)
Route::get("/api/v1/user-logged-in", "PublicController@userLoggedIn");
Route::post("/api/v1/login", "PublicController@loginUser");
Route::post("/api/v1/register", "PublicController@registerUser");
Route::get("/api/v1/test", "PublicController@test");
Route::get("/image-proxy-public/{userid}/{name}", "PublicController@imageProxyPublic");


// website routes
Route::group(["middleware" => "web"], function () {
    Route::auth(); // https://mattstauffer.co/blog/the-auth-scaffold-in-laravel-5-2#routeauth

    // Pages
    Route::get("/", "PublicController@getHomePage");
    Route::get("/search", "PublicController@getSearchPage");
    Route::get("/account/storyboards", "PrivateController@getAccountStoryboardsPage");
    Route::get("/account/gallery", "PrivateController@getAccountGalleryPage");
    Route::get("/account/social", "PrivateController@getAccountSocialPage");
    Route::get("/account/settings", "PrivateController@getAccountSettingsPage");
    Route::get("/account/change-password", "PrivateController@getAccountChangePasswordPage");
    Route::get("/edit-storyboard/{id}", "PrivateController@getEditStoryboardPage");
    Route::get("/edit-image/{name}", "PrivateController@getEditImagePage");
    Route::get("/help", "PublicController@getHelpPage");
    Route::get("/user/{username}", "PublicController@getUserPage");

    // Account
    Route::post("/update-account", "AccountController@updateAccount");
    Route::post("/disable-account", "AccountController@disableAccount");
    Route::post("/enable-account", "AccountController@enableAccount");
    Route::post("/delete-account", "AccountController@deleteAccount");
    Route::post("/account/change-password", "AccountController@changePassword");

    // Images
    Route::get("/image-proxy/{name}", "ImageController@imageProxy");
    Route::get("/get-gallery-images", "ImageController@getGalleryImages");
    Route::post("/upload-image", "ImageController@uploadImage");
    Route::post("/upload-image-url", "ImageController@uploadImageFromUrl");
    Route::post("/update-image", "ImageController@updateImage");
    Route::post("/delete-image", "ImageController@deleteImage");
    Route::post("/delete-temp-image", "ImageController@deleteTempImage");

    // Storyboards
    Route::get("/get-storyboard", "StoryboardController@getStoryboard");
    Route::get("/get-all-storyboards", "StoryboardController@getAllStoryboards");
    Route::post("/create-storyboard", "StoryboardController@createStoryboard");
    Route::post("/save-storyboard", "StoryboardController@saveStoryboard");
    Route::post("/delete-storyboard", "StoryboardController@deleteStoryboard");

    // Search
    Route::post("/search", "SearchController@search");

});


// mobile routes
// Using api guard - config/auth.php
// https://gistlog.co/JacobBennett/090369fbab0b31130b51
Route::group(["middleware" => "auth:api"], function () {
    Route::post("/api/v1/image-upload", "ApiController@imageUpload");
});
