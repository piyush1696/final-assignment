var _subjectList = ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "Android", "Python", "SQL", "Node JS"];
var _selectedSubject = _subjectList[0];
var _currentPage = 1;
var _initialPageNumber = 1;
var _totalPages = 0;
var _URL_API = "http://it-ebooks-api.info/v1/";
var _NUMBER_OF_PAGES = 10;
var _storeResponse = "";
var _columnCount = 4;


$(document).ready(function() {
    $("#search-button").on("click", searchBook);
    $("#search-field").on("keypress", searchBook);
    setBookCategory();
    var winWidth = $(window).width();
    _columnCount = (winWidth > 769) ? 4 : (winWidth < 769 && winWidth > 468) ? 3 : 1;
    _NUMBER_OF_PAGES = (winWidth < 468) ? 5 : 10;
    loadBooks();
});

function setBookCategory() {
    var list = $("<ul/>").addClass("book-category nav nav-pills nav-stacked");
    for(var i = 0; i < _subjectList.length; i++) {
        var className = (_selectedSubject == _subjectList[i]) ? "category active" : "category";
        list.append($("<li/>").addClass(className).attr("role", "presentation").html($("<a>").text(_subjectList[i])).on("click", getSubjectBooks));
    }
    $("#subjects").append(list);
}

function getSubjectBooks() {
    if($(this).children().text() != _selectedSubject) {
        $(this).siblings().removeClass("active");
        _selectedSubject = $(this).addClass("active").children().text();
        _initialPageNumber = 1;
        _currentPage = 1;
        loadBooks();
    }
}

function searchBook() {
    if (event.keyCode == 13 || event.button == 0 ) {
        var searchFor = $("#search-field").val().toUpperCase();
        if(searchFor.length != 0 && searchFor != _selectedSubject) {
            _selectedSubject = searchFor;
            _initialPageNumber = 1;
            _currentPage = 1;
            $(".book-category").children().removeClass("active");
            loadBooks();
        }
    }
}

function loadBooks() {
    $("#book-collection").children().remove();
    $(".loader").fadeIn();
    $.ajax({
        method: "GET",
        url: _URL_API + "search/" + _selectedSubject + "/page/" + _currentPage,
        dataType: 'json',
        success: displayBook,
        error: displayError
    });
}

function displayError() {
    $(".loader").fadeOut(100,function() {
        $(".collection-wrapper").append($("<div/>").addClass("error").text("Something went Wrong :("));
    });
}

function displayBook(response) {
    var bookCollection = [];
    if(response.Total == 0) {
        bookCollection.push($("<div/>").addClass("error").text("Opps!!! Book not Found :("));
    } else {
        var booksDetail = response.Books;
        _storeResponse = booksDetail;
        _totalPages = Math.floor(response.Total / 10) + 1;
        var row = "";
        for(var i = 0; i < booksDetail.length; i++) {

            var bookContainer = $("<div/>").addClass("col-xs-12 col-sm-4 col-md-3");
            var bookWrapper = $("<div></div>").addClass("thumbnail book-wrapper");

            var contentWrapper = $("<div/>").addClass("content-wrapper");
            var bookImageWrapper = $("<div/>").addClass("book-image-wrapper");
            var bookImage = $("<img/>").addClass('img-responsive book-image').attr("src", "asset/images/default-book.png").attr("alt", booksDetail[i].Title);
            var bookISBN = $("<div/>").addClass("book-isbn").html("Book ISBN").append($("<div/>").addClass("isbn-number").html(booksDetail[i].isbn));
            bookImageWrapper.append(bookImage, bookISBN);

            var bookName = "<div class='book-name'>" + booksDetail[i].Title.substring(0, 50) + "</div>";
            var bookDescription = "<p class='book-description'>" + booksDetail[i].Description.substring(0, 100) + "..." + "</p>";
            contentWrapper.append(bookImageWrapper, bookName, bookDescription);

            let id = booksDetail[i].ID;
            var bookButton = $("<button/>",{
                class : "button btn btn-primary button",
                click : function() { showBookDetail(id);},
                "data-toggle" : "modal",
                "data-target" : "#book-modal",
                text : "Detail"
            });

            var actionWraper = $("<div/>").addClass("action-wrapper");
            var ratingBar = $("<div/>").addClass("rating-bar");
            var list = $("<ul/>").addClass('list-inline');
            for(var j = 0; j < 5; j++) {
                list.append($("<li/>").addClass("icon").html($('<i class="star-unchecked fa fa-star-o"></i>').on("click", setRatingBar)));
            }
            ratingBar.append(list);
            var favourite = $("<div/>").addClass("icon favourite").html($('<i class="heart-unchecked fa fa-heart-o"></i>').on("click", setFavourite));
            actionWraper.append(ratingBar, favourite);

            bookWrapper.append(contentWrapper, actionWraper, bookButton);
            bookContainer.append(bookWrapper);


            if(i % _columnCount == 0) {
                row = $("<div/>").addClass("row");
            }
            row.append(bookContainer);
            bookCollection.push(row);
            originalImage(bookImage, booksDetail[i].Image);
        }
        bookCollection.push(setPagination());
    }
    $(".loader").fadeOut(100,function() {
        $("#book-collection").append(bookCollection);
        $(".next, .previous, .page").on("click", pageNavigate);
    });
}

function originalImage(bookImage, imgRef) {
    var downloadImage = $("<img/>");
    downloadImage.on("load", function() {
        bookImage.attr("src", $(this).attr("src"));
    });
    downloadImage.attr("src", imgRef);
}

function setRatingBar() {
    var clickStar = $(this);
    if(!clickStar.hasClass("star-checked")) {
        clickStar.parent().siblings().children().removeClass("star-checked fa-star").addClass("star-unchecked fa-star-o");
        clickStar.removeClass("star-unchecked fa-star-o").addClass("star-checked fa-star");
        clickStar.parent().prevAll().children().removeClass("star-unchecked fa-star-o").addClass("star-checked fa-star");
    } else {
        clickStar.parent().siblings().children().removeClass("star-checked fa-star").addClass("star-unchecked fa-star-o");
        clickStar.removeClass("star-checked fa-star").addClass("star-unchecked fa-star-o");
    }

}

function setFavourite() {
    $(this).toggleClass("heart-checked fa-heart heart-unchecked fa-heart-o");
}

function setPagination() {
    var pageNumber = _initialPageNumber;
    var paginationWrapper = $("<div/>").addClass("pagination-wrapper");
    var pagination = $("<ul>").addClass("pagination");

    var previousClass = (_initialPageNumber < _NUMBER_OF_PAGES) ? "previous disabled" : "previous";
    pagination.append("<li class='" + previousClass + "'><a>&laquo;</a></li>");

    for(var i = 0; i < _NUMBER_OF_PAGES && pageNumber <= _totalPages; i++) {
        var pageClass = (pageNumber == _currentPage) ? "page active" : "page";
        pagination.append("<li class='" + pageClass + "'><a>" + pageNumber++ + "</a></li>");
    }

    var nextClass = (pageNumber > _totalPages) ? "next disabled" : "next";
    pagination.append("<li class='" + nextClass + "'><a>&raquo;</a></li>");
    paginationWrapper.append(pagination);
    return paginationWrapper;
}

function pageNavigate() {
    if($(this).hasClass("next")){
        if(_initialPageNumber + _NUMBER_OF_PAGES <= _totalPages) {
            _initialPageNumber += _NUMBER_OF_PAGES;
            _currentPage = _initialPageNumber;
            loadBooks();
        }
    } else if($(this).hasClass("previous")) {
        if(_initialPageNumber - _NUMBER_OF_PAGES > 0) {
            _initialPageNumber -= _NUMBER_OF_PAGES;
            _currentPage = _initialPageNumber;
            loadBooks();
        }
    } else if($(this).hasClass("page")) {
        _currentPage = $(this).text();
        loadBooks();
    }
}

function showBookDetail(bookId) {
    for(var i = 0; i < _storeResponse.length; i++) {
        if(bookId == _storeResponse[i].ID) {
            break;
        }
    }
    var buttonRef = event.target;
    var modal = '<div id="book-modal" class="modal fade" role="dialog" data-backdrop="static">' +
                    '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                            '<div class="modal-body">' +
                                '<button type="button" class="close-button close" data-dismiss="modal">&times;</button>' +
                                '<div class="row">' +
                                    '<div class="col-xs-12 col-sm-4">' +
                                        '<img class="modal-image-wrapper img-responsive" src="asset/images/default-book.png">' +
                                    '</div>' +
                                    '<div class="col-xs-12 col-sm-8">' +
                                        '<h4 class="book-title">Title: <strong>' + _storeResponse[i].Title + '</strong></h4>' +
                                        '<h5 class="book-subtitle">Sub title: <strong>' + _storeResponse[i].SubTitle + '</strong></h5>' +
                                        '<h5 class="bok-isbn">ISBN: <strong>' + _storeResponse[i].isbn + '</strong></h5>' +
                                        '<p class="book-description">' + _storeResponse[i].Description + '</p>' +
                                     '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                                '<button class="button-close btn btn-default" data-dismiss="modal">Close</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    $(".collection-wrapper").append(modal);
    originalImage($(".modal-image-wrapper"), _storeResponse[i].Image);

    $('#book-modal').on('hidden.bs.modal', function (e) {
        $(buttonRef).html("Detail <i class='fa fa-check'></i>");
    });
}
