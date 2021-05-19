const containerEl = $(".container");
const dateEl = $("#currentDay");

// The current date and time
let currentTime = moment().format("LT");
let currentDay = moment();

// Keeps the date and time accurate to within a half an hour
const updateCurrentTime = setInterval(function() {
    currentTime = currentDay.format("LT");
    currentDay = moment();
    displayDay();
    console.log(currentTime);
}, (1000 * 60) * 30);

// Generates the day on the top of the page
const displayDay = () => dateEl.text(currentDay.format("MMM Do, YYYY"));

// If this function returns 1, the current time is before the hour block. If it returns 0, the current time is within the hour of the hour block. If it returns -1, the current time is after the hour of the hour block. 
const compareHours = (hourEl) => {
    const hour = hourEl.attr("id");
    const parsedHour = hour.slice(4, 6);

    const newTime = moment(currentDay).hour(parsedHour);

    if (moment(currentDay).isBefore(newTime)) return 1;
    else if (moment(currentDay).isAfter(newTime)) return -1;
    return 0;
};

const createHourBlocks = () => {
    const dayBlockEl = $("<div>");

    dayBlockEl.addClass("column-12");

    containerEl.append(dayBlockEl);

    // The hours are each looped through
    for (let i = 9 ; i < 18 ; i++) {
        const hourBlockEl = $("<div>");
        const hourEl = $("<h6>");
        const descriptionEl = $("<div>");
        const saveBtnEl = $("<button>");
        const saveIconEl = $("<span>");

        hourBlockEl.addClass("row");

        hourEl.addClass("hour col-1 pt-3");
        descriptionEl.addClass("description col-9");
        saveBtnEl.addClass("saveBtn");
        saveIconEl.addClass("oi oi-lock-locked");
        // Determine the hour via moment.js both for display and variable purposes
        const hour = moment({hour: i});
        hourEl.text(hour.format("hA"));  
        hourEl.attr("id", "hour" + hour.format("kk"));  

        if (compareHours(hourEl) === 1) {
            descriptionEl.addClass("future");
        } else if (compareHours(hourEl) === -1) {
            descriptionEl.addClass("past");
        } else if (compareHours(hourEl) === 0) {
            descriptionEl.addClass("present");
        }

        saveBtnEl.append(saveIconEl);

        hourBlockEl.append(hourEl);
        hourBlockEl.append(descriptionEl);
        hourBlockEl.append(saveBtnEl);

        dayBlockEl.append(hourBlockEl);
    }
};

displayDay();
createHourBlocks();