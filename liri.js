require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var action = process.argv[2];
var arg1 = process.argv[3];
var nodeArg = process.argv;
var nodeArr = [];
for (var i = 3; i < nodeArg.length; i++) {
    nodeArr.push(nodeArg[i]);
};
var nodeValue = nodeArr.join("+");

var queryUrl = "http://www.omdbapi.com/?t=" + nodeValue + "&y=&plot=short&apikey=trilogy";
var options = {
    url: queryUrl,
    method: "GET",
};

function tweets() {
    var params = { screen_name: "MrFullStack1" };
    client.get("statuses/user_timeline", params, function (err, tweets, res) {
        if (err) {
            console.log("Error occurred: " + (err));
        } else {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweets: \n  Tweet #" + (i + 1) + "\n  Text: " + tweets[i].text + "\n  Created on: " + tweets[i].created_at);
                console.log("*********************************");
            };
            fs.appendFile("log.txt", "\nChecked Tweets - " + new Date(), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("log.txt was updated!");
                };
            });
        };
    });
};

function spotifySong() {
    spotify.search({
        type: "track",
        query: nodeValue
    }, function (err, data) {
        if (err) {
            console.log("Error occurred: " + err);
        } else {
            console.log("*********************************");
            for (i = 0; i < data.tracks.items.length; i++) {
                console.log("Result # " + (i + 1));
                console.log("Artist: " + data.tracks.items[i].artists[0].name);
                console.log("Track: " + data.tracks.items[i].name);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("Explicit content: " + data.tracks.items[i].explicit);
                console.log("Link to song: " + data.tracks.items[i].external_urls.spotify);
                console.log("*********************************");
            };
            fs.appendFile("log.txt", "\nSpotified " + nodeValue + " - " + new Date(), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("log.txt was updated!");
                };
            });
        };
    });
};

function movie() {
    request(options, function (err, res, body) {
        if (err) {
            console.log("Error occurred: " + err);
        } else {
            var json = JSON.parse(body);
            console.log("*********************************");
            console.log("Title: " + json.Title);
            console.log("Director: " + json.Director);
            console.log("Release date: " + json.Released);
            console.log("Rating: " + json.Rated);
            console.log("Language: " + json.Language);
            console.log("Plot: " + json.Plot);
            console.log("Cast: " + json.Actors);
            console.log("Ratings: \n  IMDB: " + json.Ratings[0].Value + "\n  Rotten Tomatoes: " + json.Ratings[1].Value + "\n  Metacritic: " + json.Ratings[2].Value);
            console.log("*********************************");
            fs.appendFile("log.txt", "\nOMBDed " + nodeValue + " - " + new Date(), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("log.txt was updated!");
                };
            });
        };
    });
};

function command() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            console.log("Error occurred: " + err);
        } else {
            var dataArr = data.split(",");
            for (var i = 1; i < dataArr.length; i++) {
                nodeArr.push(dataArr[i]);
            };
            nodeValue = nodeArr.join("+");
            if (dataArr[0] == "my-tweets") {
                tweets();
            } else if (dataArr[0] == "spotify-this-song") {
                spotifySong();
            } else if (dataArr[0] == "movie-this") {
                movie();
            } else {
                console.log("Error occured");
            };
            fs.appendFile("log.txt", "\nUsed do-what-it-says - " + new Date(), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("log.txt was updated!");
                };
            });
        };
    });
};

if (action == "my-tweets") {
    tweets();
} else if (action == "spotify-this-song") {
    if (arg1 === undefined) {
        nodeValue = "the+sign+ace+of+base";
        spotifySong();
    } else {
        spotifySong();
    };
} else if (action == "movie-this") {
    if (arg1 === undefined) {
        nodeValue = "mr+nobody";
        queryUrl = "http://www.omdbapi.com/?t=" + nodeValue + "&y=&plot=short&apikey=trilogy";
        options = {
            url: queryUrl,
            method: "GET",
        };
        movie();
    } else {
        movie();
    };
} else if (action == "do-what-it-says") {
    command();
} else {
    console.log("Invalid command");
};