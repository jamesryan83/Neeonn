"use strict";

var app = app || {};
app.account = app.account || {};
app.account.view = app.account.view || {};


// Account Gallery
app.account.view.Gallery = app.base.view.GalleryBase.extend({
    el: "#divContentGallery",

    // Go to edit image page
    editImage: function (e) {
        var name = $(e.target).data("imgname");
        this.appendGalleryLoadingItem(true, $(e.target).closest(".divGalleryItem"));
        Cookies.set("previousPage", "accountGallery");
        location.href = "/edit-image/" + name;
    }
})



new app.account.view.Gallery();
