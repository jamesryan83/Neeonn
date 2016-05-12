"use script";
var app = app || {};


(function () {
    var path = window.location.pathname;

    new app.main.view.Main();

    app.editStoryboard.view.main = null;
    app.account.view.storyboards = null;
    app.comments.view.main = null;

    if (path === "/") {
        new app.home.view.Main();

    } else if (app.util.stringStartsWith(path, "/search")) {
        new app.search.view.Main();

    } else if (app.util.stringStartsWith(path, "/account/storyboards")) {
        app.account.view.storyboards = new app.account.view.Storyboards();

    } else if (app.util.stringStartsWith(path, "/account/gallery")) {
        new app.account.view.Gallery();

    } else if (app.util.stringStartsWith(path, "/account/social")) {


    } else if (app.util.stringStartsWith(path, "/account/settings")) {
        new app.account.view.Settings();

    } else if (app.util.stringStartsWith(path, "/account/change-password")) {
        new app.account.view.ChangePassword();

    } else if (app.util.stringStartsWith(path, "/edit-storyboard")) {
        app.editStoryboard.view.main = new app.editStoryboard.view.Main();

    } else if (app.util.stringStartsWith(path, "/help")) {
        new app.help.view.Main();

    } else if (app.util.stringStartsWith(path, "/comments")) {
        app.comments.view.main = new app.comments.view.Main();
    }

})();
