// Pseudo Code
// create an array of searchs for my giphys
// call giphy api
// link the api to my array of searchs
// create a search bar for users to search giphys
// allow users to click on their favorites
// allow users to be displayed only their favorite api

// add an array of gifs to search, i chose some of my favorite movies and shows

$(document).ready(function() {

let buttons2 = ["Hulk", "Star-Lord", "Thor", "Iron Man", "Spider-Man", "Groot", "Captain America", "Doctor Strange"];

let buttons = [];

let favoriteOnly = false;

let favorites = [];

const apiKey = "LtqywBXq9kH3OPnHFeNxDGKgsOFRqKyR";

const gifEndpoint = "https://api.giphy.com/v1/gifs/search?api_key=LtqywBXq9kH3OPnHFeNxDGKgsOFRqKyR";

let searchReturn = [];

//  console.log(buttons2)

// get items from localstorage so that when user refreshs their search stays
function savedButtons() {
    let searchedButtons = JSON.parse(localStorage.getItem("buttons") || "[]");
    buttons = searchedButtons;

};

// create an array of buttons for my favorites

function displayButtons() {
    $(".my-search").empty();
    for (let i = 0; i < buttons2.length; i++) {
        let buttonName = buttons2[i];
        let button = `
        <div class="wrap-buttons">
        <button class="btn btn3 btn-search" data-name="${buttonName}">${buttonName}</button>
        </div>
        `;
        $(".my-search").append(button);
        // buttons = [];


    };

};

// show buttons for user's search

function displaySearched() {
    $(".recent-search").empty();

    for (let i = 0; i < buttons.length; i++) {
        let buttonName2 = buttons[i];
        let button = `
    <div class="wrap-buttons">
    <button class="btn btn-delete fas fa-gavel" data-name="${buttonName2}" data-index="${i}"></button>
    <button class="btn btn3 btn-search" data-name="${buttonName2}">${buttonName2}</button>
    </div>
    `;
        $(".recent-search").append(button)
    };
    localStorage.setItem("buttons", JSON.stringify(buttons));

};

// removes selected user search if they choose to delete it

function deleteBtn() {
    $(".recent-search").empty();
    let buttonDelete = $(this).attr("data-index");
    buttons.splice(buttonDelete, 1);
    displaySearched();
    console.log("value: ", buttonDelete);
};

// display search results from user with a new button

function createBtn(value) {
    buttons.push(value);
    displaySearched();

};

// make another function to add the elements to display the gifs to make it easier to see

function giphyTemplate(giphy) {
    const favoritesIndex = favorites.indexOf(giphy.id);
    const isFavorites = favoritesIndex !== -1 ? "fas" : "far";
    const images = giphy.images;
    const template = `
        <div class="giphy text-center mx-auto mb-4">
        <div class="giphy-image text-center"><img src="${images.original_still.url}" data-still="${images.original_still.url}" data-animate="${images.original.url}" data-state="still">
            <i class="fab fa-youtube"></i><i class="${isFavorites} fa-star favorite" data-id="${giphy.id}" data-star="${isFavorites}"></i>
        </div>
        <div class="giphy-info">
            <p>Rating: ${giphy.rating}</p>
            <p>Title: ${giphy.title}</p>
        </div>
        <div class="giphy-footer" data-link="${giphy.embed_url}"> 
            <p><i class="fas fa-external-link-alt"></i>Copy Giphy Link</p>
        </div>
      </div>
        `;

    return template;
};

// after getting giphys from api render those in a loop for limit set and show it on the webpage

function showGiphy(giphys) {
    for (let i = 0; i < giphys.length; i++) {
        const giphy = giphys[i];
        const giphyZone = giphyTemplate(giphy);

        $(".gif-content").prepend(giphyZone);
    };

};

// call giphy api for data

function getGiphy(value) {
    let url = gifEndpoint + "&q=" + value + "&limit=10";

    $.ajax({
            url
        })
        .then(function (response) {
            let giphys = response.data;
            showGiphy(giphys);
            previousSearch = giphys;
            // console.log("Giphy: ", giphys);
        })
        .catch(function (error) {
            // console.log("Error: ", error)
        });
};

// create the value for use to search

function searchGiphy(event) {
    event.preventDefault();
    let value = $("#search").val().trim();
    if (buttons.includes(value)) {
        console.log("This search already exists!")
    } else {
        createBtn(value);
        getGiphy(value);
    }
    $("#search").val("");
    // console.log("Value: ", value)
};

// be able to click on the image/playbutton to begin the giphy animation, and click again to make it still

function playGiphy() {
    const giphyPlay = $(this);
    const img = giphyPlay.find("img");
    // const icon = giphyPlay.find("i");

    const still = img.attr("data-still");
    const animate = img.attr("data-animate");
    const state = img.attr("data-state");

    if (state === "still") {
        img.attr({
            src: animate,
            "data-state": "animate"
        });
    } else {
        img.attr({
            src: still,
            "data-state": "still"
        });
    };

};

// create a temporary element to retrieve the users selected image to be able to save it to their copy clipboard

function clipLink(value) {
    const tempElement = $("<input>");
    $("body").append(tempElement);
    tempElement.val(value).select();
    document.execCommand("copy");
    tempElement.remove();
};

// copy the users select image

function copyLink() {
    const link = $(this).attr("data-link");
    const preCopy = $(this).html();
    clipLink(link);
    $(this).html("Copy Completed!!");
    setTimeout(() => $(this).html(preCopy), 3000)
};

// allow searched buttons to be clicked to pull up a search

function btnSearch() {
    let btnName = $(this).attr("data-name");
    const parent = $(this).parent();
    $(".btn").parent().removeClass("active");
    parent.addClass("active");
    getGiphy(btnName);
};

// allow user to clear the giphy content area

function clearResult(event) {
    event.preventDefault();
    $(".btn").parent().removeClass("active");
    $(".gif-content").html(`<p class="cleared">Results have been cleared!</p>`);
};

// save favorites to local storage so that they presist through refresh

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function loadFavorites() {
    const stars = JSON.parse(localStorage.getItem("favorites"));
    if (Array.isArray(stars)) {
        favorites = stars;
    }
}

function addFavorite(id) {
    favorites.push(id);
    saveFavorites();
}

function removeFavorite(id) {
    favorites = favorites.filter((el) => el != id);
    saveFavorites();
}

function favoritesStar() {
    const starState = $(this).attr("data-star");
    const id = $(this).attr("data-id");
    if (starState === "far") {
        addFavorite(id);
        $(this).removeClass("far").addClass("fas");
        $(this).attr("data-star", "fas");
    } else {
        removeFavorite(id);
        $(this).removeClass("fas").addClass("far");
        $(this).attr("data-star", "far");
    }
};

function renderFavorites(giphy) {
    const createNewTemplate = giphyTemplate(giphy);
    $(".gif-content").append(createNewTemplate);
}

function selectFavorites() {
    const favoriteOnly = $(this).is(":checked");
    if (favoriteOnly) {
        $(".gif-content").empty();
        for (let i = 0; i < favorites.length; i++) {
            const id = favorites[i];
            let url = `https://api.giphy.com/v1/gifs/${id}?api_key=LtqywBXq9kH3OPnHFeNxDGKgsOFRqKyR`;
            $.ajax({ url })
                .then((response) => 
                    renderFavorites(response.data))
                .catch(() => {
                    console.log("Error: ",);
                });
        }
    } else {
        showGiphy(previousSearch);
    }
}

function callApp() {

    loadFavorites();
    displayButtons();
    savedButtons();
    displaySearched();
    getGiphy("Thor");

}

callApp();



// global events to be listened to

$(document).on("click", ".btn-delete", deleteBtn);

$(document).on("click", ".giphy-image", playGiphy);

$(document).on("click", ".giphy-footer", copyLink);

$(document).on("click", ".btn-search", btnSearch);

$(document).on("click", ".favorite", favoritesStar);

$("#submit-button").on("click", searchGiphy);

$("#clear-button").on("click", clearResult);

$("#favoritesonly").on("click", selectFavorites);

});