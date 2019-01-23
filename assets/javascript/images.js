var topics =["puppy","kitten","rat","hamster","snake","dog","cat","elephant","pig","spider","lizard",
    "dragon","unicorn"];
var localStorage = window.localStorage;
var loading = "https://media0.giphy.com/media/sSgvbe1m3n93G/200.gif";
var topic ="";
var localFavorites = "giphy-favorites";
var favorites = JSON.parse(localStorage.getItem(localFavorites));
var ascending = false;
if (favorites) {
    $("#favorites").attr("class",'');
} else {
    favorites = [];
}
//TOPIC BUTTONS
for (var i =0; i <topics.length; i++) {
    makeButton(topics[i]);
}
function makeButton(name) {
    var button = $("<button>").text(name);
    button.val(name);
    button.addClass("search");
    $("#topics").append(button);
}
//to prevent form from auto triggering; 
$("form").submit(function(event) {  //btn should be type = "submit"; submits form (default refreshes page)
    event.preventDefault();
    console.log($("#new-topic"));
    var value = $("#new-topic")[0].value.trim();
    if (topics.includes(value) || value === ""){

    } else {
        makeButton(value);
        topics.push(value);
    }
    $("#new-topic")[0].value = '';
})
//BUTTON FUNCTIONALITY
$(document).on("click",".search",function() {
    $("#ascending").attr("class","hidden");
    topic = $(this).val();
    var address = "https://api.giphy.com/v1/gifs/search?api_key=khtm4DKu4yNq4qGTofWsRAxuiy0mjsVT&q=" + topic + "&limit=10&offset=0&rating=PG-13&lang=en";
    gifs = [];
    $("#gifs").html("<img src = '"+loading+"'>");
    $.get(address)
    .then(function(response) {
        console.log(response);
        $("#gifs").html('');
        paintResponse(response.data);
    }).catch(function(error) {
        console.log(error);
    })
    $("#load").removeClass("hidden");
});
function paintResponse(data) {
    var start = gifs.length;
    for (var i= 0; i < data.length; i++) {
        var card = $("<div class = 'img-box'>");
        var img = $("<img src ='"+ data[i].images.fixed_height_still.url+ "' >");
        // img.id(data[i].id);
        img.addClass("gif");
        img.attr("alt",data[i].title);
        img.attr("data-paused",data[i].images.fixed_height_still.url);
        img.attr("data-animated",data[i].images.fixed_height.url);
        img.attr("data-state","paused");
        card.append(img);
        //SETUP RATING
        var rating = $("<div class = rating>").text("rating : " + data[i].rating);
        card.append(rating);
        //SETUP FAVORITES
        var heartIcon = $("<i>");
        heartIcon.addClass("fa-heart")
        // var heart = $("<img>");
        if (favorites.indexOf(data[i].id)!==-1) {
            // heart.attr("src","assets/images/loved.png");
            // heart.addClass("loved");
            heartIcon.addClass("fas loved");
        } else {
            // heart.attr("src","assets/images/unloved.png");
            // heart.addClass("unloved");
            heartIcon.addClass("far unloved");
        }
        // heart.attr("id",data[i].id);
        // heart.addClass("fav-icon");
        // rating.append(heart);
        heartIcon.attr("id",data[i].id);
        rating.append(heartIcon);
        //APPEND EVERYTHING TO GIFS
        $("#gifs").append(card);
    }
}
//GIF FUNCTIONALITY
$(document).on("click",".gif",function() {    //play gifs
    var state = $(this).attr("data-state");
    if (state === "paused") {
        $(this).attr("src",$(this).attr("data-animated"));
        $(this).attr("data-state","playing");
    } else {
        $(this).attr("src",$(this).attr("data-paused"));
        $(this).attr("data-state","paused");
    }
})
//FAVORITE FUNCTIONALITY
$("#favorites").on("click",showFavorites);
function showFavorites() {
    if (favorites.length > 0) {
        $("#ascending").attr("class",'');
        var url = "https://api.giphy.com/v1/gifs?api_key=khtm4DKu4yNq4qGTofWsRAxuiy0mjsVT&ids="
        if (ascending) {
            url = url + favorites[0];
            for (var i =1; i < favorites.length; i++) {
                url = url + "," +favorites[i];
            }
        } else {
            url = url + favorites[favorites.length-1];
            for (var i =favorites.length-2; i >= 0; i--) {
                url = url + "," +favorites[i];
            }
        }
        
        topic = "Favorites";
        gifs = [];
        $("#gifs").html("<img src = '"+loading+"'>");
        $.get(url)
        .then(function(response) {
            console.log(response);
            $("#gifs").html('');
            paintResponse(response.data);
        });
        
        $("#load").addClass("hidden");
    } else {
        $("#gifs").html("");
    }
}
//ADD/REMOVE FAVORITES
function unlike(obj) {
    $(obj).attr("class","fa-heart far unloved");
    // $(obj).attr("src","assets/images/unloved.png");
    // var index = favorites.indexOf(this.id);
    // favorites.splice(index,1);
    favorites.splice(favorites.indexOf(obj.id),1);
    if (favorites.length < 1) {
        $("#favorites").attr("class",'hidden');
    }
    if (topic === "Favorites") {   //favorites page is open; refresh the page because removing favorite
        showFavorites();
    }
    localStorage.setItem(localFavorites,JSON.stringify(favorites));
}
function like(obj) {
    $(obj).attr("class","loved fa-heart fas");
    // $(obj).attr("src","assets/images/loved.png");
    favorites.push(obj.id);
    // favorites.push($(this).attr("id"));
    $("#favorites").attr("class",'');
    localStorage.setItem(localFavorites,JSON.stringify(favorites));
}
$(document).on("click",".loved",function() {
    unlike(this);
})
$(document).on("click",".unloved",function() {
    like(this);
})
$(document).on("dblclick",".img-box",function() {
    var love = this.childNodes[1].childNodes[1];
    if ($(love).hasClass("loved")) {
        unlike(love);
    } else {
        like(love);
    }

})
//LOAD MORE FUNCTIONALITY
$("#load").on("click",function(){
    var offset = gifs.length;
    var url = "https://api.giphy.com/v1/gifs/search?api_key=khtm4DKu4yNq4qGTofWsRAxuiy0mjsVT&q=" + topic + "&limit=10&offset="+ offset +"&rating=PG-13&lang=en";
    $.get(url)
    .then(function(response) {
        paintResponse(response.data);
    });
})
$("#ascending").on("click",function() {
    ascending = !ascending;
    showFavorites();
})