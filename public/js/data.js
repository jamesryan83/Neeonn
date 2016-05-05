"use strict";

var app = app || {};
app.data = {};

//app.data.serverHost = "http://192.168.1.1:8101";
app.data.serverHost = "http://shoteratetest.azurewebsites.net";

// Storyboard Categories
app.data.categories = [ "Uncategorized", "Action", "Adventure", "Adult", "Animals", "Apparel", "Art", "Articles", "Autobiography", "Beauty", "Biography", "Bizzare", "Business", "Cars", "Children", "Computers", "Design", "Education", "Electronics", "Entertainment", "Fantasy", "Film", "Finance", "Fitness", "Food", "Funny", "Games", "General", "Health", "History", "Home and Garden", "Horror", "Internet", "Journals", "Music", "Mystery", "News", "Outdoors", "Pets", "Photography", "Poetry", "Politics", "Real Estate", "Religion", "Restaurants", "Romance", "Science", "Science Fiction", "Social", "Space", "Spirituality", "Sports", "Technology", "Television", "Travel", "Tutorial", "Video Games", "Weddings", "Writing" ];

// Pattern Images
app.data.patternImages = [
    "60-lines.png",
    "asfalt-dark.png",
    "black-linen.png",
    "black-paper.png",
    "brick-wall.png",
    "concrete-wall-3.png",
    "cubes.png",
    "dark-denim.png",
    "dark-leather.png",
    "dark-matter.png",
    "dark-wood.png",
    "diagmonds-light.png",
    "flowers.png",
    "foggy-birds.png",
    "food.png",
    "gray-floral.png",
    "inflicted.png",
    "inspiration-geometry.png"
];

app.data.emojiImages = [
    "1f197.png", "1f308.png", "1f332.png", "1f334.png", "1f335.png", "1f349.png", "1f34d.png", "1f352.png", "1f354.png", "1f355.png", "1f357.png", "1f367.png", "1f36d.png", "1f378.png", "1f3a8.png", "1f3a9.png", "1f3b5.png", "1f433.png", "1f444.png", "1f44d-1f3fb.png", "1f453.png", "1f48e.png", "1f49c.png", "1f49e.png", "1f4a3.png", "1f4a5.png", "1f4aa-1f3fc.png", "1f4b0.png", "1f4f1.png", "1f4f7.png", "1f50d.png", "1f525.png", "1f52b.png", "1f5e1.png", "1f600.png", "1f601.png", "1f602.png", "1f603.png", "1f604.png", "1f605.png", "1f606.png", "1f607.png", "1f608.png", "1f609.png", "1f610.png", "1f611.png", "1f612.png", "1f613.png", "1f614.png", "1f615.png", "1f616.png", "1f617.png", "1f618.png", "1f619.png", "1f620.png", "1f621.png", "1f622.png", "1f623.png", "1f624.png", "1f625.png", "1f626.png", "1f627.png", "1f628.png", "1f629.png", "1f630.png", "1f631.png", "1f632.png", "1f633.png", "1f634.png", "1f636.png", "1f637.png", "1f638.png", "1f642.png", "1f644.png", "1f680.png", "1f6e0.png", "1f6e9.png", "26a0.png", "26c5.png", "2b50.png"
]

// Search sortBy options
app.data.searchSortBy = [
    "Latest",
    "Oldest"
];


// Scene item content sizes
app.data.sceneHeight = 290;
app.data.sceneWidth = 580;
app.data.sceneWidthHalf = 290;

// Colors
app.data.colorNeonPink = "#ff4081";
app.data.colorGrayMedium2 = "#838383";
app.data.colorComment1 = "#eaeaea";
app.data.colorComment2 = "#d3d3d3";
app.data.colorBlack = "#000000";

// Regexs
app.data.regexHashtag = /(^|\s)(#[\w]+)/ig;
app.data.regexUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ig;

//app.data.regexImageProxy = /http:\/\/shoterate.localhost:8101\/image-proxy/g;
app.data.regexImageProxy = /http:\/\/shoteratetest.azurewebsites.net\/image-proxy/g;
