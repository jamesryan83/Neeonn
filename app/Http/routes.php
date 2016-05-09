<?php


// Other routes
Route::get("/image-proxy-public/{user_id}/{name}", "PublicController@imageProxyPublic");



// api routes

// Account
Route::post("/api/login", "Api\ApiAccountController@login");
Route::post("/api/register", "Api\ApiAccountController@register");
Route::get("/api/user-logged-in/{api_token}", "Api\ApiAccountController@userIsLoggedIn");
Route::get("/api/get-account-details/{api_token}", "Api\ApiAccountController@getAccountDetails");
Route::post("/api/change-password", "Api\ApiAccountController@changePassword");
Route::post("/api/update-account", "Api\ApiAccountController@updateAccount");
Route::get("/api/disable-account/{api_token}", "Api\ApiAccountController@disableAccount");
Route::get("/api/enable-account/{api_token}", "Api\ApiAccountController@enableAccount");
Route::get("/api/logout/{api_token}", "Api\ApiAccountController@logout");
Route::get("/api/delete-account/{api_token}", "Api\ApiAccountController@deleteAccount");

// Storyboards
Route::get("/api/get-storyboard/{id}/{api_token}", "Api\ApiStoryboardController@getStoryboard");
Route::get("/api/get-all-storyboards/{api_token}", "Api\ApiStoryboardController@getAllStoryboards");
Route::post("/api/create-storyboard", "Api\ApiStoryboardController@createStoryboard");
Route::post("/api/update-storyboard-details", "Api\ApiStoryboardController@updateStoryboardDetails");
Route::post("/api/delete-storyboard", "Api\ApiStoryboardController@deleteStoryboard");

// Scenes
Route::post("/api/create-scene", "Api\ApiStoryboardController@createScene");
Route::post("/api/update-scene-canvas", "Api\ApiStoryboardController@updateSceneCanvas");
Route::post("/api/update-scene-text", "Api\ApiStoryboardController@updateSceneText");
Route::post("/api/update-scene-indicies", "Api\ApiStoryboardController@updateSceneIndicies");
Route::post("/api/delete-scene", "Api\ApiStoryboardController@deleteScene");

// Images
Route::get("/api/image-proxy/{api_token}/{name}", "Api\ApiImageController@imageProxy");

// Search
Route::post("/api/search", "SearchController@searchFromApi");





// website routes
Route::group(["middleware" => "web"], function () {
    // be careful to not name routes the same as Route::auth() provides, will cause problems
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
    Route::get("/help", "PublicController@getHelpPage");
    Route::get("/comments/{storyboard_id}", "PublicController@getCommentsPage");
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
    Route::post("/get-storyboards-for-image", "ImageController@getStoryboardsForImage");
    Route::post("/delete-image", "ImageController@deleteImage");
    Route::post("/update-gallery-order", "ImageController@updateGalleryOrder");

    // Storyboards
    Route::get("/get-storyboard", "StoryboardController@getStoryboard");
    Route::get("/get-all-storyboards", "StoryboardController@getAllStoryboards");
    Route::post("/create-storyboard", "StoryboardController@createStoryboard");
    Route::post("/update-storyboard-details", "StoryboardController@updateStoryboardDetails");
    Route::post("/delete-storyboard", "StoryboardController@deleteStoryboard");

    // Scenes
    Route::post("/create-scene", "StoryboardController@createScene");
    Route::post("/update-scene-canvas", "StoryboardController@updateSceneCanvas");
    Route::post("/update-scene-text", "StoryboardController@updateSceneText");
    Route::post("/update-scene-indicies", "StoryboardController@updateSceneIndicies");
    Route::post("/delete-scene", "StoryboardController@deleteScene");

    // Comments
    Route::get("/get-comments", "StoryboardController@getComments");
    Route::post("/make-comment", "StoryboardController@makeComment");
    Route::post("/update-comment", "StoryboardController@updateComment");
    Route::post("/vote-on-comment", "StoryboardController@voteOnComment");
    Route::post("/delete-comment", "StoryboardController@deleteComment");

    // Search
    Route::post("/search", "SearchController@search");
});

