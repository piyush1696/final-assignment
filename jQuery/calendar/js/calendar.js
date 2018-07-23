var _weekNames = ['Week', 'Sunday', 'Monday', 'Tuesday', 'Wedneday', 'Thrusday', 'Friday', 'Saturday'];
var _shortWeekNames = ['W', 'Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
var _monthNames = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var _eventStartDate = null;
var _eventEndtDate = null;
var _todayDate = new Date();
var _currentYear = _todayDate.getFullYear();
var _currentMonth = _todayDate.getMonth();

var _birthDates = {
    "January" : [{"name" : "Shubham Katariya" , "date" : new Date(1995, 1, 3)},
                 {"name" : "Vipin Joshi" , "date" : new Date(1946, 1, 15)},
                 {"name" : "Shikha Shakarwar", "date" : new Date(1994, 1, 15)},
                 {"name" : "Darshana" , "date" : new Date(1997, 1, 15)} ],
    "Febraury" : [],
    "March" : [],
    "April" : [{"name" : "Gurpreet Chhabra", "date" : new Date(1995, 4, 2)},
               {"name" : "Sonam Ravi Gupta", "date" : new Date(1987, 4, 22)} ],
    "May" : [{"name" : "Siyaram Patidar", "date" : new Date(1985, 5, 3)},
             {"name" : "Shubham Choubey", "date" : new Date(1993, 5, 9)},
             {"name" : "Mayur Vaidya", "date" : new Date(1994, 5, 9)},
             {"name" : "Amit Nagar", "date" : new Date(1986, 5, 10)},
             {"name" : "Deepak Patidar", "date" : new Date(1990, 5, 10)},
             {"name" : "Rahul Kulmi", "date" : new Date(1988, 5, 28)} ],
    "June" : [{"name" : "Vishal Patidar", "date" : new Date(1994, 6, 20)} ],
    "July" : [ {"name" : "Awanish Tiwari", "date" : new Date(1974, 7, 6)},
               {"name" : "Surendra Patidar", "date" : new Date(1988, 7, 21)},
               {"name" : "Anjana Singh", "date" : new Date(1992, 7, 24)} ],
    "August" : [{"name" : "Aditiya Paliwal", "date" : new Date(1994, 8, 8)} ],
    "September" : [{"name" : "Varsha Tyagi", "date" : new Date(1992, 9, 13)} ,
                   {"name" : "Rashmi Soni", "date" : new Date(1993, 9, 19)},
                   {"name" : "Rupak", "date" : new Date(1995, 9, 22)} ],
    "October" : [{"name" : "Priyanshi Asawara", "date" : new Date(1993,10,19)} ,
                 {"name" : "Piyush Chandak", "date" : new Date(1996, 10, 16)} ],
    "November" : [],
    "December" : [{"name" : "Shashank Saxena", "date" : new Date(1990,12,11)} ,
                  {"name" : "Nitesh Thakhur", "date" : new Date(1990, 12, 12)} ,
                  {"name" : "Satya Naryan Patidar", "date" : new Date(1983, 12, 12)} ]
};

$(document).ready(function() {
    $("#previous-year, #next-year").on("click", changeYear);
    $("#previous-month, #next-month").on("click", changeMonth);
    _todayDate.setHours(0);
    _todayDate.setMinutes(0);
    _todayDate.setSeconds(0);
    _todayDate.setMilliseconds(0);
    setInitializer();
    setCalendar();
    $("#current-year").on("change", changeYear);
    $("#current-month").on("change", changeMonth);
});

function setInitializer() {
    var dropdown = $("<select></select>");
    for(var i = 1990; i < 2050; i++) {
        ($("<option></option>").attr("value", i).text(i)).appendTo(dropdown);
    }
    $(".year").html(dropdown.attr("id", "current-year"));

    dropdown = $("<select></select>");
    for(var i = 0; i < _monthNames.length; i++) {
        ($("<option></option>").attr("value", _monthNames[i]).text(_monthNames[i])).appendTo(dropdown);
    }
    $(".month").html(dropdown.attr("id", "current-month"));

    var weekName = $(".calendar-week");
    for(var i = 0; i < _weekNames.length; i++ ){
        weekName.append($("<div></div>").addClass("heading").text(_weekNames[i]));
    }
}

$(window).resize(function() {
    var weekName = $(".calendar-week");
    weekName.html("");
    if($( window ).width() < 469) {
        for(var i = 0; i < _shortWeekNames.length; i++ ){
            weekName.append($("<div></div>").addClass("heading").text(_shortWeekNames[i]));
        }
    } else {
        for(var i = 0; i < _weekNames.length; i++ ){
            weekName.append($("<div></div>").addClass("heading").text(_weekNames[i]));
        }
    }
});

function setCalendar() {
    var presentMonthStart = new Date(_currentYear, _currentMonth, 1);
    var presentMonthEnd = new Date(_currentYear, _currentMonth + 1, 0);
    var startDate  = 1 - presentMonthStart.getDay();
    var totalBlocks =  presentMonthEnd.getDate() + (6 - presentMonthEnd.getDay());
    var i = 0;
    var weekNumber = getWeekCount();
    var displayDate = null;
    var className = [];
    var dateBlock = $(".date-wrapper");
    dateBlock.html("");  //To Clear the Previous content.

    while(startDate <= totalBlocks) {
        displayDate = new Date(_currentYear, _currentMonth, startDate);
        className = ["date"];
        if(i++ % 7 == 0) {
            weekNumber = (weekNumber > 52) ? 1 : weekNumber;
            dateBlock.append($("<div></div>").addClass("week").text(weekNumber++));
        }
        if(startDate <= 0 || startDate > displayDate.getDate()) {
             className.push("off-date");
        }
        if(displayDate.getTime() == _todayDate.getTime()) {
            className.push("today-date");
        }
        dateBlock.append($("<div></div>").addClass(className.join(" ")).text(displayDate.getDate()).attr("title", displayDate.toDateString()).on('click', selectDateRange));
        startDate++;
    }
    $("#current-year").val(_currentYear);
    $("#current-month").val(_monthNames[_currentMonth]);
    setBirthday();
 }

function getWeekCount() {
    var totalDays = 0;
    for (var i = 0; i < _currentMonth; i++) {
        var lastDate = new Date(_currentYear, i + 1, 0);
        totalDays += lastDate.getDate();
    }
    return Math.floor(totalDays / 7) + 1;
}

function setBirthday() {
    var birthdayMonth = _birthDates[_monthNames[_currentMonth]];
    for(var i = 0; i < birthdayMonth.length; i++) {
        var date = birthdayMonth[i].date.getDate() - 1;
        $("div.date").not(".off-date").eq(date).append($("<div></div>").addClass("birthday").on("click", showBirthday));
    }
}

function showBirthday(event) {
     event.stopPropagation();
     var personNames = [];
     var birthdayMonth = _birthDates[_monthNames[_currentMonth]];
     var birthDate = new Date(_currentYear, _currentMonth, $(this).parent().text());
     for(var i = 0; i < birthdayMonth.length; i++) {
        if (birthdayMonth[i].date.getDate() === birthDate.getDate()) {
            personNames.push(birthdayMonth[i].name);
        }
     }
     alert(personNames.join("\n"));
}

function selectDateRange() {
    var selectedClass = "selected";
    if(!$(this).hasClass("off-date")) {
        if (!_eventStartDate) {
            $(this).not(".off-date").addClass(selectedClass);
            _eventStartDate = new Date(_currentYear,_currentMonth,$(this).text());
        } else if (!_eventEndtDate) {
            $(this).not(".off-date").addClass(selectedClass);
            _eventEndtDate = new Date(_currentYear, _currentMonth, $(this).text());
        //    var conditionClass = not(".week, .off-date").addClass(selectedClass);
            if(_eventStartDate.getMonth() === _eventEndtDate.getMonth()) {
                if (_eventStartDate.getDate() > _eventEndtDate.getDate()) {
                    $(this).nextUntil(".selected").not(".week, .off-date").addClass(selectedClass);
                } else if (_eventStartDate.getDate() < _eventEndtDate.getDate()) {
                    $(this).prevUntil(".selected").not(".week, .off-date").addClass(selectedClass);
                }//For Current Date
                if($(this).siblings(".today-date").hasClass(selectedClass)) {
                    $(this).siblings(".today-date").removeClass(selectedClass).css("opacity", ".7");
                }
            }
            if(_eventStartDate.getDate() > _eventEndtDate.getDate()) {
                var temp = _eventStartDate;
                _eventStartDate = _eventEndtDate;
                _eventEndtDate = temp;
            }
            var selectedDates = _eventStartDate.getDate() + " " + _monthNames[_eventStartDate.getMonth()] + " - " + _eventEndtDate.getDate() + " " + _monthNames[_eventEndtDate.getMonth()];
            $("#date-range").append(selectedDates);
        } else {
            unSelect($(this));
        }
    } else {
        unSelect($(this));
    }
}

function unSelect(block) {
    _eventStartDate = null;
    _eventEndtDate = null;
    block.siblings(".selected").removeClass("selected");
    block.siblings(".today-date").css("opacity","1");
    $("#date-range").text("");
}

function changeYear(event) {
    if(event.type == "click") {
        if($(this).is("#previous-year")) {
            _currentYear--;
        } else if($(this).is("#next-year")) {
            _currentYear++;
        }
    } else if(event.type == "change") {
        _currentYear = $("#current-year").val();
    }
    setCalendar();
}

function changeMonth(event) {
    if(event.type == "click") {
        if($(this).is("#previous-month")) {
            _currentMonth--;
            if(_currentMonth < 0) {
                _currentYear--;
                _currentMonth = 11;
            }
        } else if($(this).is("#next-month")) {
            _currentMonth++;
            if(_currentMonth >= 12) {
                _currentMonth = 0;
                _currentYear++;
            }
        }
    } else if(event.type == "change") {
        _currentMonth = _monthNames.indexOf($("#current-month").val());
    }
    setCalendar();
}
