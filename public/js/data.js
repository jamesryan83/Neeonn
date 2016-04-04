"use strict";

var app = app || {};
app.data = {};

// Storyboard Categories
app.data.categories = [ "Uncategorized", "Action", "Adventure", "Adult", "Animals", "Apparel", "Art", "Articles", "Autobiography", "Beauty", "Biography", "Bizzare", "Business", "Cars", "Children", "Computers", "Design", "Education", "Electronics", "Entertainment", "Fantasy", "Film", "Finance", "Fitness", "Food", "Funny", "Games", "General", "Health", "History", "Home and Garden", "Horror", "Internet", "Journals", "Music", "Mystery", "News", "Outdoors", "Pets", "Photography", "Poetry", "Politics", "Real Estate", "Religion", "Restaurants", "Romance", "Science", "Science Fiction", "Social", "Spirituality", "Sports", "Technology", "Television", "Travel", "Tutorial", "Video Games", "Weddings", "Writing" ];

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

// Search sortBy options
app.data.searchSortBy = [
    "Latest",
    "Oldest",
    "A to Z",
    "Z to A"
];


// Scene item content sizes
app.data.sceneHeight = 290;
app.data.sceneWidth = 580;
app.data.sceneWidthHalf = 290;

// Colors
app.data.colorNeonPink = "#ff4081";
app.data.colorGrayMedium2 = "#838383";

// Regexs
app.data.regexHashtag = /(^|\s)(#[\w]+)/ig;
app.data.regexUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ig;
