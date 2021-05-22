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
    // TODO: change this to be an a-b return, could potentially shrink this function way down
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

const startEditing = (descriptionEl) => {
    const classes = descriptionEl.attr("class");
    const contents = descriptionEl.text().trim();
    
    // Create the textarea for input, with fixings
    const textareaEl = $("<textarea>");
    textareaEl.addClass(classes)
    .text(contents);
    // Change lock icon in button to unlock icon
    const saveBtnEl = descriptionEl.next(".saveBtn");
    const spanEl = saveBtnEl.children("span");
    spanEl.removeClass("oi-lock-locked")
        .addClass("oi-lock-unlocked");
    // Swap it in and make it the focus so the user can tell they can change the text now
    descriptionEl.replaceWith(textareaEl);
    textareaEl.trigger("focus");
};

const finishEditing = (descriptionEl) => {
    const classes = descriptionEl.attr("class");
    const contents = descriptionEl.val().trim();
    
    // Create the div for the saved description, with fixings
    const divEl = $("<div>");
    divEl.addClass(classes)
    .text(contents);
    // Change unlock icon in button to lock icon
    const saveBtnEl = descriptionEl.next(".saveBtn");
    const spanEl = saveBtnEl.children("span");
    spanEl.removeClass("oi-lock-unlocked")
    .addClass("oi-lock-locked");
    // Swap in the div in place of the textarea
    descriptionEl.replaceWith(divEl);
};

// If you press either the description or the button, you get the same result, be that editing or finishing editing. 
// TODO: Make the button work both to start and end editing. Don't know why it doesn't
containerEl.on("click", "div.description", function() {
    startEditing($(this));
});
containerEl.on("blur", "textarea.description", function() {
    finishEditing($(this));
});

// containerEl.on("click", ".saveBtn", function() {
//     const descriptionEl = $(this).siblings(".description");
//     console.log(descriptionEl)
//     $(this).trigger("blur");
    
//     if (descriptionEl.is("div")) {
//         startEditing(descriptionEl);
//     } else {
//         finishEditing(descriptionEl);
//     }
// })

displayDay();
createHourBlocks();