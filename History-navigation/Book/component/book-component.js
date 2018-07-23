var BookComponent = function() {
    var bookData = {};
    var categoryList = {
        "category" : ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "Android", "Python", "SQL", "Node JS"]
    };

    this.searchSubject = function () {
        return categoryList["category"][0];
    };

    this.createContainer = function (response, totalTiles) {
        bookData = response;
        var books = [];
        var row = "";
        for(var i = 0; i < response.Books.length; i++) {
             (function(count) {
                 $.get('/mustache/tiles.mustache', function(template) {
                    row.append(Mustache.render(template, createTile(count)));
                 });
             })(i);
             if(i % totalTiles == 0) {
                 row = $("<div/>").addClass("row");
             }
            books.push(row);
        }
        return books;
    };

    this.displayModal = function(bookId) {
        var bookInfo = {};
        for(var i = 0; i < bookData.Books.length; i++) {
            if(bookId == bookData.Books[i].ID) {
                bookInfo = bookData.Books[i];
                break;
            }
        }
        $.get('/mustache/modal.mustache', function(template) {
            $("#book-modal").html(Mustache.render(template, bookInfo));
        });
    };

    this.setCategory = function() {
        var self = this;
        $.get('/mustache/category.mustache', function(template) {
            $("#subjects").html(Mustache.to_html(template, categoryList));
            self.selectCategory(categoryList["category"][0]);
        });
    }

    this.selectCategory = function(categoryBook) {
        var tempCategory = $("#subjects .category");
        tempCategory.siblings().removeClass("active");
        var index = categoryList["category"].indexOf(categoryBook)
        tempCategory.eq(index).addClass("active");
    }


    var createTile = function(counter) {
        var bookInfo = {};
        bookInfo = bookData.Books[counter];
        var title = bookData.Books[counter].Title;
        bookInfo["shortTitle"] = (title.length > 50) ? (title.substring(0,50) + "...") : title;
        var description = bookData.Books[counter].Description;
        bookInfo["shortDescription"] = (description.length > 120) ? (description.substring(0, 120) + "...") : description;
        bookInfo["rating"] = ["star-unchecked fa-star-o ", "star-unchecked fa-star-o ", "star-unchecked fa-star-o ", "star-unchecked fa-star-o ", "star-unchecked fa-star-o "];
        return bookInfo;
    };
};
