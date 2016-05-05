"use strict";

var app = app || {};
app.util = {};



// --------------------------------------- Strings ---------------------------------------


// Returns the filename from an image url
app.util.getFilenameFromImageUrl = function (url) {
    var temp = url.split("/");
    return temp[temp.length - 1];
}


// check string starts with http or https
app.util.stringStartsWithHttpOrHttps = function (text) {
    if (app.util.stringStartsWith(text, "http://") === false &&
        app.util.stringStartsWith(text, "https://") === false) {
        app.util.showToast("Error", "Url must start with http:// or https://");
        return false;
    }

    return true;
}


// check string ends with jpg, jpeg, png or gif
app.util.stringEndsWithImageExtension = function (text) {
    if (app.util.stringEndsWith(text, ".jpg") === false &&
            app.util.stringEndsWith(text, ".jpeg") === false &&
            app.util.stringEndsWith(text, ".png") === false &&
            app.util.stringEndsWith(text, ".gif") === false) {
            app.util.showToast("Error", "Url must end with .jpg, .jpeg, .png or.gif");
            return false;
        }

    return true;
}


// check if string starts with *
app.util.stringStartsWith = function(text, textToFind) {
    return text.indexOf(textToFind) === 0;
};


// check if string ends with *
app.util.stringEndsWith = function(text, textToFind) {
    var index = text.length - textToFind.length;
    return index >= 0 && text.lastIndexOf(textToFind) === index;
};





// --------------------------------------- Other ---------------------------------------

// Prevents the windown scrolling when scrolling inside an element
app.util.preventWindowScroll = function (element) {
    element.on("mousewheel", function (e) {
        var event = e.originalEvent;
        var d = event.wheelDelta || -event.detail;
        this.scrollTop += ( d < 0 ? 1 : -1 ) * 30;
        e.preventDefault();
    });
}


// sort array
// http://stackoverflow.com/a/8837505
app.util.sortArray = function (array, property) {
    return array.sort(function(a, b) {
        var x = a[property]; var y = b[property];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// sort integer array
app.util.sortIntegerArray = function (array, property) {
    return array.sort(function(a, b) {
        return a[property] - b[property];
    });
}


// Show a popup message
app.util.showToast = function (heading, text) {
    $.toast({
        text: text,
        heading: heading,
        allowToastClose: false,
        hideAfter: 3000,
        stack: 5,
        position: 'bottom-right',
        bgColor: '#333333',
        textColor: '#ff2f77',
        textAlign: 'center',
        loader: false
    });
}


// Hide dialog
app.util.hideDialog = function () {
    $("#divDialogContainer").hide();
    $("#divDialogContainer").empty();
    $("#divDialogContainer").unbind();
}


// Scroll a divs scrollbar to the bottom
// http://stackoverflow.com/a/6853354
app.util.scrollDivToBottom = function (selector) {
    $(selector).scrollTop($(selector)[0].scrollHeight);
}


// Move caret to end of contenteditable
// http://stackoverflow.com/a/4238971
app.util.placeCaretAtEnd = function (el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

