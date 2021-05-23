const containerEl = $(".container");
const dateEl = $("#currentDay");
// This is a 'let' because I assign to it one time. It's fine. I think it's fine. It's probably fine.
let dayData = {
    "hour09": "",
    "hour10": "",
    "hour11": "",
    "hour12": "",
    "hour13": "",
    "hour14": "",
    "hour15": "",
    "hour16": "",
    "hour17": "",
    "day": ""
};

// The current date and time
let currentTime = moment().format("LT");
let currentDay = moment();

// Keeps the date and time accurate to within a half an hour. If the day changes, it wipes the board.
const updateCurrentTime = setInterval(function() {
    currentTime = currentDay.format("LT");
    currentDay = moment();
    if (currentDay.format("MMM Do, YYYY") !== dateEl.text()) {
        alert("It's a new day! Updating...");
        localStorage.removeItem("dayData");
        loadDayData();
    }

    displayDay();
}, (1000 * 60) * 30);

// Loads the day when the page loads
const loadDayData = () => {
    const loadedDay = JSON.parse(localStorage.getItem("dayData"));
    // If loadedDay isn't a null, then shove it into dayData. Otherwise, dayData remains a blank template as above, a fresh slate to fill.
    if (loadedDay) dayData = loadedDay;

    $(".row").each(function() {
        const hourBlockEl = $(this);
        const descriptionEl = hourBlockEl.children(".description");
        const hourID = descriptionEl.attr("id");
        descriptionEl.text(dayData[hourID]);
    });
    
};

// Generates the day on the top of the page
const displayDay = () => dateEl.text(currentDay.format("MMM Do, YYYY"));

// If this function returns 1, the current time is before the hour block. If it returns 0, the current time is within the hour of the hour block. If it returns -1, the current time is after the hour of the hour block. 
const compareHours = hourEl => {
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
        descriptionEl.addClass("description col-9 pt-2");
        saveBtnEl.addClass("saveBtn");
        saveIconEl.addClass("oi oi-lock-locked");
        // Determine the hour via moment.js both for display and variable purposes
        const hour = moment({hour: i});
        hourEl.text(hour.format("hA"));  
        // The description gets the hour ID because it's more convenient for me when saving stuff later.
        descriptionEl.attr("id", "hour" + hour.format("kk"));

        if (compareHours(descriptionEl) === 1) {
            descriptionEl.addClass("future");
        } else if (compareHours(descriptionEl) === -1) {
            descriptionEl.addClass("past");
        } else if (compareHours(descriptionEl) === 0) {
            descriptionEl.addClass("present");
        }
        // Stick it all on the page
        saveBtnEl.append(saveIconEl);
        
        hourBlockEl.append(hourEl);
        hourBlockEl.append(descriptionEl);
        hourBlockEl.append(saveBtnEl);
        
        dayBlockEl.append(hourBlockEl);
    }
    loadDayData();
};

const saveHour = descriptionEl => {
    // Find the text in the descriptionEl
    const descriptionText = descriptionEl.val().trim();
    // Find the hour for the hourblock
    const descriptionHour = descriptionEl.attr("id");

    // Save the description to the property in the save data object with the matching hour
    dayData[descriptionHour] = descriptionText;
    // And save the day in case that hasn't been done yet
    dayData.day = dateEl.text();
    localStorage.setItem("dayData", JSON.stringify(dayData));
};

const startEditing = descriptionEl => {
    const classes = descriptionEl.attr("class");
    const hourID = descriptionEl.attr("id");
    const contents = descriptionEl.text().trim();
    
    // Create the textarea for input, with fixings
    const textareaEl = $("<textarea>");
    textareaEl.addClass(classes)
    .text(contents)
    .attr("id", hourID);
    // Change lock icon in button to unlock icon
    const saveBtnEl = descriptionEl.next(".saveBtn");
    const spanEl = saveBtnEl.children("span");
    spanEl.removeClass("oi-lock-locked")
        .addClass("oi-lock-unlocked");
    // Swap it in and make it the focus so the user can tell they can change the text now
    descriptionEl.replaceWith(textareaEl);
    textareaEl.trigger("focus");
};

const finishEditing = descriptionEl => {
    const classes = descriptionEl.attr("class");
    const hourID = descriptionEl.attr("id");
    const contents = descriptionEl.val().trim();
    
    // Create the div for the saved description, with fixings
    const divEl = $("<div>");
    divEl.addClass(classes)
    .text(contents)
    .attr("id", hourID);
    // Change unlock icon in button to lock icon
    const saveBtnEl = descriptionEl.next(".saveBtn");
    const spanEl = saveBtnEl.children("span");
    spanEl.removeClass("oi-lock-unlocked")
    .addClass("oi-lock-locked");

    saveHour(descriptionEl);

    // Swap in the div in place of the textarea
    descriptionEl.replaceWith(divEl);
};

// If you press either the description or the button, you get the same result, be that editing or finishing editing. 
containerEl.on("click", ".saveBtn", function() {
    const descriptionEl = $(this).siblings(".description");

    $(this).trigger("blur");
    
    if (descriptionEl.is("div")) startEditing(descriptionEl);
    else finishEditing(descriptionEl);
})
containerEl.on("click", "div.description", function() {
    startEditing($(this));
});
// If the clicked item is not the save button, stop editing -- otherwise, this event fights with the above events
containerEl.on("blur", "textarea.description", function(event) {
    const clickedEl = event.relatedTarget;

    if (!$(clickedEl).is(".saveBtn")) finishEditing($(this));
});


displayDay();
createHourBlocks();