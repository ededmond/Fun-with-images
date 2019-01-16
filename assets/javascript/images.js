var topics =["puppy","kitten","rat","hamster","snake","dog","cat","elephant","pig","spider","lizard",
    "dragon","unicorn"];
var favorites = []; //List of ids for favorites to find later
var gifs = [];
var loading = "https://media0.giphy.com/media/sSgvbe1m3n93G/200.gif";
var topic ="";

//TOPIC BUTTONS
for (var i =0; i <topics.length; i++) {
    makeButton(topics[i]);
}
function makeButton(name) {
    var button = $("<button>").text(name);
    button.addClass("search");
    $("#topics").append(button);
}
//to prevent form from auto triggering; 
$("form").submit(function(event) {  //btn should be type = "submit"; submits form (default refreshes page)
    event.preventDefault();
    makeButton($("#new-topic")[0].value);
    $("#new-topic")[0].value = '';
})
//BUTTON FUNCTIONALITY
$(document).on("click",".search",function() {
    topic = $(this).text();
    var address = "https://api.giphy.com/v1/gifs/search?api_key=khtm4DKu4yNq4qGTofWsRAxuiy0mjsVT&q=" + topic + "&limit=10&offset=0&rating=PG-13&lang=en";
    gifs = [];
    $("#gifs").html("<img src = '"+loading+"'>");
    $.get(address)
    .then(function(response) {
        console.log(response);
        $("#gifs").html('');
        paintResponse(response.data);
    });
    $("#load").removeClass("hidden");
});
function paintResponse(data) {
    var start = gifs.length;
    for (var i= 0; i < data.length; i++) {
        gifs.push({
            still : data[i].images.fixed_height_still.url,
            moving : data[i].images.fixed_height.url
        });
        var card = $("<div class = 'img-box'>");
        var img = $("<img src ='"+ gifs[i +start].still+ "' id ='" +data[i].id +"' >");
        img.addClass("gif paused");
        img.attr("data-value",(i+start));
        card.append(img);
        var rating = $("<div class = rating>").text("rating : " + data[i].rating);
        card.append(rating);
        $("#gifs").append(card);
    }
}
//GIF FUNCTIONALITY
$(document).on("click",".paused",function() {    //play gifs
    var pic = gifs[$(this).attr("data-value")];
    $(this).attr("src",pic.moving);
    $(this).attr("class","gif playing");
})
$(document).on("click",".playing",function() {    //stop gifs
    var pic = gifs[$(this).attr("data-value")];
    $(this).attr("src",pic.still);
    $(this).attr("class","gif paused");
})
//LOAD FUNCTIONALITY
$("#load").on("click",function(){
    var offset = gifs.length;
    var url = "https://api.giphy.com/v1/gifs/search?api_key=khtm4DKu4yNq4qGTofWsRAxuiy0mjsVT&q=" + topic + "&limit=10&offset="+ offset +"&rating=PG-13&lang=en";
    $.get(url)
    .then(function(response) {
        paintResponse(response.data);
    });
})