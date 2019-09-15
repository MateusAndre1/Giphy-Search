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

function giphyTemplate(giphy) {
    const images = giphy.images;
    const template =`
        <div class="giphy">
        <i class="far fa-star favorite" data-id="${giphy.id}" data-star="false">
        </i>
        <div class="giphy-image">
            <img src="${images.original.url}" data-still="${images.original_still.url}" data-animate="${images.original.url}" data-state="still">
            <i class="fa fa-play img-play"></i>
        </div>
        <div class="giphy-info text-white">
            <p>Rating: g</p>
            <p>Posted A Year Ago</p>
        </div>
      
        <div class="giphy-footer" data-link="${giphy.embed_url}"> 
            <p class="text-danger font-weight-bold">Copy Giphy Link <i class="fa fa-link"></i></p>
        </div>
      </div>
        `;

    return template;
}

function showGiphy(giphys) {
    for (let i = 0; i < giphys.length; i++) {
        const giphy = giphys[i];
        const giphyZone = giphyTemplate(giphy);

    $(".gif-content").append(giphyZone);
    }

}

// call giphy api for data

function getGiphy(value) {
    let url = gifEndpoint + "&q=" + value + "&limit=10";
    
    $.ajax({ url })
    .then(function(response) {
        let giphys = response.data;
        showGiphy(giphys)
        console.log("Giphy: ", giphys);
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