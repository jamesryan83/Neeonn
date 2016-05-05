"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};


// Account Gallery
app.account.view.Gallery = app.base.view.GalleryBase.extend({
    el: "#divContentGallery",
});



new app.account.view.Gallery();
