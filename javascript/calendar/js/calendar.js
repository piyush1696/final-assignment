var _weekName = ['Sunday', 'Monday', 'Tuesday', 'Wedneday', 'Thrusday', 'Friday', 'Saturday'];
var _monthName = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
var _dateRangeList = "";
var _startDate = null;
var _endDate = null;
var _todayDate = new Date();
var _currentYear = _todayDate.getFullYear();
var _currentMonth = _todayDate.getMonth();
_todayDate.setHours(0);
_todayDate.setMinutes(0);
_todayDate.setSeconds(0);
_todayDate.setMilliseconds(0);
var _birthdates = {
    "January" : [{"name" : "Shubham Katariya" , "date" : "3-1-1995"},
                 {"name" : "Vipin Joshi" , "date" : "15-1-1946"},
                 {"name" : "Shikha Shakarwar" , "date" : "15-1-1994"},
                 {"name" : "Darshana" , "date" : "15-1-1997"} ],
    "Febraury" : [],
    "March" : [],
    "April" : [{"name" : "Gurpreet Chhabra", "date" : "2-4-1995"},
               {"name" : "Sonam Ravi Gupta", "date" : "22-4-1987"} ],
    "May" : [{"name" : "Siyaram Patidar", "date" : "3-5-1985"},
             {"name" : "Shubham Choubey", "date" : "9-5-1993"},
             {"name" : "Mayur Vaidya", "date" : "9-5-1994"},
             {"name" : "Amit Nagar", "date" : "10-5-1986"},
             {"name" : "Deepak Patidar", "date" : "10-5-1990"},
             {"name" : "Rahul Kulmi", "date" : "28-5-1988"} ],
    "June" : [{"name" : "Vishal Patidar", "date" : "20-6-1994"} ],
    "July" : [{"name" : "Awanish Tiwari", "date" : "6-7-1974"},
              {"name" : "Surendra Patidar", "date" : "21-7-1988"},
              {"name" : "Anjana Singh", "date" : "24-7-1992"}],
    "August" : [{"name" : "Aditiya Paliwal", "date" : "8-8-1994"} ],
    "September" : [{"name" : "Varsha Tyagi", "date" : "13-9-1992"} ,
                   {"name" : "Rashmi Soni", "date" : "19-9-1993"},
                   {"name" : "Rupak", "date" : "22-9-1995"} ],
    "October" : [{"name" : "Priyanshi Asawara", "date" : "19-10-1993"} ,
                 {"name" : "Piyush ", "date" : "16-10-1996"} ],
    "November" : [],
    "December" : [{"name" : "Shashank Saxena", "date" : "11-12-1990"} ,
                  {"name" : "Nitesh Thakhur", "date" : "12-12-1990"} ,
                  {"name" : "Satya Naryan Patidar", "date" : "12-12-1983"} ]
};

//By default Method
setCalendar();
setBirthday();

function setCalendar() {
    var presentMonthStart = new Date(_currentYear, _currentMonth, 1);
    var presentMonthEnd = new Date(_currentYear, _currentMonth + 1, 0);
    var startDate  = 1 - presentMonthStart.getDay();
    var totalBlocks =  presentMonthEnd.getDate() + (6 - presentMonthEnd.getDay());
    var i = 0;
    var displayDate = null;
    var className = [];
    var weekNumber = getWeekCount(presentMonthStart);
    var dateElement = "";

    while(startDate <= totalBlocks) {
        className = ["date"];
        displayDate = new Date(_currentYear, _currentMonth, startDate);
        if(displayDate.getTime() == _todayDate.getTime()) {
            className.push(" today-date");
        }
        if(i++ % 7 == 0) {
            weekNumber = (weekNumber > 52) ? 1 : weekNumber;
            dateElement += "<div class='date-container'>" +
                                "<div class='week'> " + weekNumber++ + "</div>" +
                                "</div>";
        }
        if(startDate <= 0 || startDate > displayDate.getDate()) {
            var tempIdName = displayDate.getDate() + "-" + displayDate.getMonth() + "-" + displayDate.getFullYear();
            dateElement +=  "<div title='" + displayDate.toDateString() + "' class='date-container hidden-date'> " +
                            "<div class='" + className.join(" ") + "' id='date-" + tempIdName + "'> " + displayDate.getDate() + "</div>" +
                            "</div>";
        }
        else {
            var tempIdName = displayDate.getDate() + "-" + displayDate.getMonth() + "-" + displayDate.getFullYear();
            var extraData = "onclick='selectDateRange(" + displayDate.getDate() + ")'" ;
            dateElement +=  "<div title='" + displayDate.toDateString()+ "' "+ "class='date-container' " + extraData + ">" +
                            "<div class='" + className.join(" ") + "' id='date-" + tempIdName + "'> " + displayDate.getDate() + "</div>" +
                            "</div>";
        }
        startDate++;
    }
    document.getElementById("display-dates").innerHTML = dateElement;
    document.getElementById("year").innerHTML = _currentYear;
    document.getElementById("month").innerHTML = _monthName[_currentMonth];
}

function selectDateRange(date) {
    if (_startDate == null) {
        _startDate = new Date(_currentYear, _currentMonth, date);
        setColor(_startDate);
    } else if (_endDate == null) {
        _endDate = new Date(_currentYear, _currentMonth, date);
        if (_startDate.getDate() > _endDate.getDate()) {
            tempDate = _startDate;
            _startDate = _endDate;
            _endDate = tempDate;
        }
        if (_startDate.getMonth() == _endDate.getMonth()) {
            for (i = _startDate.getDate(); i <= _endDate.getDate(); i++) {
                setColor(new Date(_currentYear, _currentMonth, i));
            }
            _dateRangeList = _startDate.getDate() + " " + _monthName[_startDate.getMonth()] + " - " + _endDate.getDate() + " " + _monthName[_startDate.getMonth()];
        }
    } else {
        _startDate = null;
        _endDate = null;
        setCalendar();
        setBirthday();
        selectDateRange(date);
        _dateRangeList = "";
    }
    document.getElementById("date-range").innerHTML = _dateRangeList;
}

function setColor(selectedDate) {
    var tempIdName = selectedDate.getDate() + "-" + selectedDate.getMonth() + "-" + selectedDate.getFullYear();
    document.getElementById("date-" + tempIdName).className += " date-range";
    if (selectedDate.getTime() === _todayDate.getTime()) {
           document.getElementById("date-" + tempIdName ).style.opacity = "1";
    }
}

function getWeekCount(selectedDate) {
    var totalDays = 0;
    for (i = 0; i < selectedDate.getMonth(); i++) {
        var lastDate = new Date(selectedDate.getFullYear(), i+1, 0);
        totalDays += lastDate.getDate();
    }
    totalDays += selectedDate.getDate();
    return  Math.floor(totalDays / 7) + 1;
}

function setBirthday() {
    var presentMonthStart = new Date(_currentYear, _currentMonth, 1);
    var presentMonthEnd = new Date(_currentYear, _currentMonth + 1, 0);
    setBirthdayMark(0, "circle color");
    if(presentMonthEnd.getDay() > 0) {
        setBirthdayMark(1, "light-circle color");
    }
    if(presentMonthStart.getDay() > 0) {
        setBirthdayMark(-1, "light-circle color");
    }
}

function setBirthdayMark(otherMonth, className) {
    for(var i = 0; i < _birthdates[_monthName[(_currentMonth + otherMonth)]].length; i++) {
        var birthDate = _birthdates[_monthName[(_currentMonth + otherMonth)]][i].date;
        var tempIdName = birthDate.substring(0, birthDate.indexOf('-')) + "-" + (_currentMonth + otherMonth) + "-" + _currentYear;
        var otherMonthBithday = document.getElementById("date-" + tempIdName);
        if(otherMonthBithday) {
            otherMonthBithday.innerHTML += '<div class="' + className + '" onclick="showBirthday(event,\'' + birthDate + '\')"> </div>';
        }
    }
}

function showBirthday(event, getDate) {
    event.stopPropagation();
    var personNames = "";
    var date = getDate.substring(0, getDate.indexOf('-'));
    var month = getDate.substring(getDate.indexOf('-') + 1, getDate.lastIndexOf("-"));
    var birthDate = new Date(_currentYear, month, date);
    for(var i = 0; i < _birthdates[_monthName[_currentMonth]].length; i++) {
        var birthdayDate = _birthdates[_monthName[_currentMonth]][i].date;
        if (birthdayDate.substring(0, birthdayDate.indexOf('-')) == birthDate.getDate()) {
            personNames += _birthdates[_monthName[_currentMonth]][i].name + "\n";
        }
    }
    alert(personNames)
}

function previousYear() {
    _currentYear--;
    setCalendar();
    setBirthday();
}

function nextYear() {
    _currentYear++;
    setCalendar();
    setBirthday();
}

function previousMonth() {
    _currentMonth--;
    if(_currentMonth < 0) {
        _currentYear--;
        _currentMonth = 11;
    }
    setCalendar();
    setBirthday();
}

function nextMonth() {
    _currentMonth++;
    if(_currentMonth >= 12) {
        _currentMonth = 0;
        _currentYear++;
    }
    setCalendar();
    setBirthday();
}
