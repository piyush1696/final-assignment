var _selectedSubject = "";
var _currentPage = 1;
var _pageScaleInitialNo = 1;
var _totalPages = 0;
var _pageNoScale = 10;
var _storeResponse = {};
var _tilesToShow = 4;
var _bookComponent = null;
var _URL_API = "http://it-ebooks-api.info/v1/";

$(document).ready(function() {
    var winWidth = $(window).width();
    _tilesToShow = (winWidth > 769) ? 4 : (winWidth < 769 && winWidth > 468) ? 3 : 1;
    _pageNoScale = (winWidth < 468) ? 5 : 10;

    _bookComponent = new BookComponent();
    _selectedSubject = _bookComponent.searchSubject();

    _bookComponent.setCategory();
    doHistoryPush(_selectedSubject, _currentPage);
    loadBooks();
});

function getBookName(subject) {
    if(subject != _selectedSubject) {
        _selectedSubject = subject;
        _pageScaleInitialNo = 1;
        _currentPage = 1;
        _bookComponent.selectCategory(_selectedSubject);
        loadBooks();
    }
};

function searchBook() {
    if (event.keyCode == 13 || event.button == 0 ) {
        var searchFor = $("#search-field").val();
        if(searchFor.length != 0 && searchFor != _selectedSubject) {
            _selectedSubject = $("#search-field").val();
            _pageScaleInitialNo = 1;
            _currentPage = 1;
            loadBooks();
        }
    }
};

function loadBooks() {
    $.ajax({
        method: "GET",
        url: _URL_API + "search/" + _selectedSubject + "/page/" + _currentPage,
        dataType: 'json',
        success: displayBook,
        beforeSend : function(){
            var historyState = window.history.state;
            if(historyState.selectedSubject != _selectedSubject || historyState.selectedPage != _currentPage) {
                doHistoryPush(_selectedSubject, _currentPage);
            }
            $("#book-collection").children().remove();
            $(".loader").fadeIn()
        }
    });
};


function doHistoryPush(subject, page) {
    var state = {
        selectedSubject : subject,
        selectedPage : page
    };
    var title = subject;
    var path = "/" + subject + "/" + page;
    if(_selectedSubject == subject) {
        history.pushState(state, title, path);
    }
}

$(window).on('popstate', function(event) {
    var state = event.originalEvent.state;
    if (state) {
        _selectedSubject = state.selectedSubject;
        _currentPage = state.selectedPage;
        loadBooks();
    }
});

function displayBook(response) {
    var bookCollection = [];
    if(parseInt(response.Error)) {
        $(".loader").fadeOut(100,function() {
            $("#book-collection").append($("<div/>").addClass("error").text("Opps!!! Something went Wrong :("));
        });
    }
    else if(!parseInt(response.Total)) {
        $(".loader").fadeOut(100,function() {
            $("#book-collection").append($("<div/>").addClass("error").text("Opps!!! Books not found :("));
        });
    } else {
        _storeResponse = response;
        var bookInfo = {};
        _totalPages = Math.floor(response.Total / 10) + 1;
        $("#book-collection").append(_bookComponent.createContainer(_storeResponse, _tilesToShow)).append(setPagination());
        $(".loader").fadeOut(100,function() {
            $("#book-collection").append(bookCollection);
            for(var i = 0; i < _storeResponse.Books.length; i++) {
                downloadImage($(".book-image")[i], _storeResponse.Books[i].Image);
            }
        });
    }
};

function downloadImage(bookImage, imgRef) {
    var downloadImage = $("<img/>");
    downloadImage.on("load", function() {
        bookImage.src = $(this).attr("src");
    });
    downloadImage.attr("src", imgRef);
};

function setRatingBar(event) {
    var clickStar = $(event.target);
    if(!clickStar.hasClass("star-checked")) {
        clickStar.parent().siblings().children().removeClass("star-checked fa-star").addClass("star-unchecked fa-star-o");
        clickStar.removeClass("star-unchecked fa-star-o").addClass("star-checked fa-star");
        clickStar.parent().prevAll().children().removeClass("star-unchecked fa-star-o").addClass("star-checked fa-star");
    } else {
        clickStar.parent().siblings().children().removeClass("star-checked fa-star").addClass("star-unchecked fa-star-o");
        clickStar.removeClass("star-checked fa-star").addClass("star-unchecked fa-star-o");
    }
};

function setFavourite(event) {
    $(event.target).toggleClass("heart-checked fa-heart heart-unchecked fa-heart-o");
};

function setPagination() {
    var pageNumber = _pageScaleInitialNo;
    var paginationWrapper = $("<div/>").addClass("page-navigation");
    var pagination = $("<ul>").addClass("pagination");

    var previousClass = (_pageScaleInitialNo < _pageNoScale) ? "previous disabled" : "previous";
    pagination.append("<li class='" + previousClass + "' onclick='onPageNoChange(\"previous\")' ><a>&laquo;</a></li>");

    for(var i = 0; i < _pageNoScale && pageNumber <= _totalPages; i++) {
        var pageClass = (pageNumber == _currentPage) ? "page active" : "page";
        pagination.append("<li class='" + pageClass + "' onclick='onPageNoChange(" + pageNumber + ")'><a>" + pageNumber++ + "</a></li>");
    }
    var nextClass = (pageNumber > _totalPages) ? "next disabled" : "next";
    pagination.append("<li class='" + nextClass + "' onclick='onPageNoChange(\"next\")'><a>&raquo;</a></li>");
    return paginationWrapper.append(pagination);
};

function onPageNoChange(direction) {
    if(direction === "next") {
        if(_pageScaleInitialNo + _pageNoScale <= _totalPages) {
            _pageScaleInitialNo += _pageNoScale;
            _currentPage = _pageScaleInitialNo;
            loadBooks();
        }
    } else if(direction === "previous") {
        if(_pageScaleInitialNo - _pageNoScale > 0) {
            _pageScaleInitialNo -= _pageNoScale;
            _currentPage = _pageScaleInitialNo;
            loadBooks();
        }
    } else {
        _currentPage = direction;
        loadBooks();
    }
};

function showBookDetail(bookId) {
    _bookComponent.displayModal(bookId);
    var buttonRef = event.target;
    $("#book-modal").on('hidden.bs.modal', function(e) {
        $(buttonRef).html("Detail <i class='fa fa-check'></i>");
    });
};
