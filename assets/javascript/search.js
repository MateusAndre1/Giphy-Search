// Pseudo Code
// create an array of searchs for my giphys
// call giphy api
// link the api to my array of searchs
// create a search bar for users to search giphys
// allow users to click on their favorites
// allow users to be displayed only their favorite api

// add an array of gifs to search, i chose some of my favorite movies and shows

let buttons = ["The Office", "The Simpsons", "Harold & Kumar", "School of Rock", "Ron Swanson"];

function savedButtons() {
    let searchedButtons = JSON.parse(localStorage.getItem("buttons"));
    buttons = searchedButtons;
}

// create an array of buttons for my favorites, along with a button to remove selected search

function displayButtons() {
    $(".recent-search").empty();
    for (let i = 0; i < buttons.length; i++) {
        const buttonName = buttons[i];
        
        const button = `
        <div class="wrap-buttons">
        <button class="btn btn-delete fas fa-snowplow" data-name="${buttonName}"></button>
        <button class="btn btn-search" data-name="${buttonName}">${buttonName}</button>
        </div>
        `;
        $(".recent-search").append(button)
    };
    localStorage.setItem("buttons", JSON.stringify(buttons));
};

displayButtons();

// display search results from user with a new button

$("#submit-button").on("click", function(event) {
    event.preventDefault();
    let value = $("#search").val().trim();
    buttons.push(value);
    displayButtons();
    console.log("Value: ", value)
});
