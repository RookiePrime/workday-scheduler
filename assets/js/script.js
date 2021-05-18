const containerEl = $(".container");
const dateEl = $("#currentDay");

// Generates the day on the top of the page
const displayDay = () => dateEl.text(moment().format("MMM Do, YYYY"));

const createTimeBlocks = () => {
    const dayBlockEl = $("<div>");

    dayBlockEl.addClass("column-12");

    containerEl.append(dayBlockEl);

    // The hours are each looped through
    for (let i = 0 ; i < 25 ; i++) {
        const hourBlockEl = $("<div>");
        const hourEl = $("<h6>");
        const descriptionEl = $("<div>");
        const saveBtnEl = $("<button>");

        const saveIconEl = $("<span>");

        hourBlockEl.addClass("row");

        hourEl.addClass("hour col-1 pt-3");
        descriptionEl.addClass("description col-10 past");
        saveBtnEl.addClass("saveBtn");
        saveIconEl.addClass("oi oi-locked");

        if (!i) {
            hourEl.text("12AM");
        } else if (i < 13) {
            hourEl.text(i + "AM");
        } else {
            hourEl.text((i - 12) + "PM");
        }

        saveBtnEl.append(saveIconEl);

        hourBlockEl.append(hourEl);
        hourBlockEl.append(descriptionEl);
        hourBlockEl.append(saveBtnEl);

        dayBlockEl.append(hourBlockEl);
    }
};

displayDay();
createTimeBlocks();