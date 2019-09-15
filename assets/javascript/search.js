// Pseudo Code
// create an array of searchs for my giphys
// call giphy api
// link the api to my array of searchs
// create a search bar for users to search giphys
// allow users to click on their favorites
// allow users to be displayed only their favorite api

// add an array of gifs to search, i chose some of my favorite movies and shows

let buttons = ["The Office", "The Simpsons", "Harold & Kumar", "School of Rock", "Ron Swanson"];

const apiKey = "LtqywBXq9kH3OPnHFeNxDGKgsOFRqKyR";

const gifEndpoint = "https://api.giphy.com/v1/gifs/search?api_key=LtqywBXq9kH3OPnHFeNxDGKgsOFRqKyR";

// get items from localstorage so that when user refreshs their search stays

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
        <button class="btn btn-delete fas fa-snowplow" data-name="${buttonName}" data-index="${i}"></button>
        <button class="btn btn-search" data-name="${buttonName}">${buttonName}</button>
        </div>
        `;
        $(".recent-search").append(button)
    };
    localStorage.setItem("buttons", JSON.stringify(buttons));
};

savedButtons ();

displayButtons();

// removes selected user search if they choose to delete it

function deleteBtn() {
    let buttonDelete = $(this).attr("data-index");
    buttons.splice(buttonDelete, 1);
    displayButtons();
    console.log("value: ", buttonDelete);
};

// display search results from user with a new button

function createBtn (value) {
    buttons.push(value);
    displayButtons();
}

function getGiphy(value) {
    let url = gifEndpoint + "&q=" + value + "&limit=10";
    
    $.ajax({ url })
    .then(function(response) {
        let giphys = response.data;
        console.log("Data: ", data);
    })
    .catch(function(error) {
        console.log("Error: ", error)
    });
}

// create the value for use to search

function searchGiphy(event) {
    event.preventDefault();
    let value = $("#search").val().trim();
    createBtn(value);
    getGiphy(value);
    // console.log("Value: ", value)
}

// global events to be listened to

$(document).on("click", ".btn-delete", deleteBtn);

$("#submit-button").on("click", searchGiphy);