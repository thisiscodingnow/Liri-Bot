//At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var searchOption = process.argv[2];


// Take in the command line arguments 
var nodeArgs = process.argv;

// Create an empty string for holding the searchTitle
var searchTitle = "";

// Capture all the words in the title(which starts from argument[3])
for (var i=3 ; i < nodeArgs.length; i++) {

// Build a string.
searchTitle = searchTitle + " " + nodeArgs[i];
// trim spaces (if any)
searchTitle = searchTitle.trim();
}

// switch-case statement  based on search options & call respective functions
switch(searchOption){

    case "my-tweets":
    getTweets();
    break;

    case "spotify-this-song":
    getSpotify();
    break;

    case "movie-this":
    getMovie();
    break;

    case "do-what-it-says":
    getDoWhatItSays();
    break;

    default:
    // if user types node liri.js (without argument), display the following instruction
    console.log("Select input option:\n" +
    "eg. my-tweets,\n spotify-this-song,\n movie-this & \n do-what-it-says(this option gets value from random.txt file).\n"+
    "After picking option,add value to the option (where needed) \neg. movie-this 'Black Panthers'. \n"+
    "LIRI will display default ... if you only pick option & no value")
    
}

    // twitter  
    function getTweets(){
        var tempArray=[]// this array is for later use by writeTolog  function;
        //accordig to tweeter documentation, count specifies the number of Tweets.
    
        var params = {screen_name: 'Beth69058147',count:20};
    
        client.get('statuses/user_timeline',params, function(error, tweets, response) {
            if (!error) {
                // console.log(tweets);
                for(var i=0; i<tweets.length;i++){
                var tempTweets = tweets[i].text;
                var tempDateCreated = tweets[i].created_at;
                console.log("Tweet"+[tweets.length-i]+": "+tempTweets);
                console.log( "Date Created: "+ tempDateCreated);
                console.log("\n----------------------------------------------------\n")
            
                var getTweetslog= {
                        searchCommand1:searchOption,
                        Tweets:tempTweets,
                        DateCreated: tempDateCreated
                    }

                        tempArray.push(getTweetslog);
                }
            // write output to log.txt after pushing each tweets to an array
            writeTolog(tempArray)

            }
        });
    };

    //spotify 

    function getSpotify(){

        // console.log(spotify);
    
        var title = "";
        // if user has input value use that as a title 
        if(searchTitle){
    
            title = searchTitle;
        }
        // else use Mr.Nobody as default title.
        else{
            title = "The Sign";
        }
    
        // var spotify = require('spotify');
     
        spotify.search({ type: 'track', query: title }, function(err, data) {


            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }        
            // console.log(data.tracks.items[0]);
            var tempArtistName=data.tracks.items[0].album.artists[0].name;
            var tempSongName= data.tracks.items[0].name;
            var tempURL=data.tracks.items[0].album.external_urls.spotify;
            var tempAlbumName=data.tracks.items[0].album.name ;

            console.log("Artist Name: "+tempArtistName +"\n");
            console.log("Song Name: "+tempSongName + "\n");
            console.log("Preview Link-URL: "+tempURL+"\n");
            console.log("Album Name: "+tempAlbumName + "\n");

            var getSpotifylog= {
                    searchCommand1:searchOption,
                    searchCommand2:searchTitle,
                    ArtistName: tempArtistName,
                    SongName: tempSongName,
                    PreviewLinkURL:tempURL,
                    AlbumName:tempAlbumName
                }

            writeTolog(getSpotifylog)

        });
    
    };

    //OMDB API
    function getMovie(){
        var title = "";
        // if user has search Title use it
        if(searchTitle){
            title = searchTitle;
        }
        // else use Mr.Nobody as default title.
        else{
            title = "Mr. Nobody";
        }
    
            request("http://www.omdbapi.com/?&apikey=d6b01163"+"&t="+title,function(error, response, body) {
            // If the request was successful...
            if (!error && response.statusCode === 200) {
            
                var result = JSON.parse(body);
                // console.log(result);
                console.log("Title of Movie: "+result.Title +"\n");
                
                console.log("Year released: "+result.Year +"\n");
                console.log("IMDB Rating: "+result.imdbRating+"\n");
                // not all movies have rotten tomatoes rating... 
                if(result.Ratings[1]!=null){
                console.log("Rotten Tomatoes Rating: "+result.Ratings[1].Value+"\n");}                                      
                console.log("Country: "+result.Country+"\n");
                console.log("Language: "+result.Language+"\n");
                console.log("Plot: "+result.Plot+"\n");
                console.log("Actors: "+result.Actors+"\n");
            }

                var getMovielog= {
                        searchCommand1:searchOption,
                        searchCommand2:searchTitle,
                        Title: result.Title,
                        Year: result.Year,
                        RatingIMDB:result.imdbRating,
                        Country:result.Country,
                        Plot:result.Plot,
                        Actors:[result.Actors]
                    }

                writeTolog(getMovielog)

      
    });
};

    //file system(fs) to read argument/searchTitle from random.txt file 
    function getDoWhatItSays(){

            fs.readFile("random.txt","utf8",function(err,data){
        
                if(err){
                    console.log(err)
                }
                data = data.split(",");

                console.log(data);// for reference only
        
                switch(data[0]){
                    case "my-tweets":
                    getTweets();
                    break;
        
                    case "spotify-this-song":
                    searchTitle = data[1];
                    getSpotify();
                    break;
                    
                    case "movie-this":
                    searchTitle = data[1];
                    getMovie();
                    break;
                }
            })  
        };

    //BONUS In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.

    function writeTolog(data) {

        fs.appendFile("log.txt",JSON.stringify(data)+"\n\n", function(err) {
            if (err) {
                return console.log(err);
            }

            console.log("your search Items and results will be saved under log.txt");
        });
    }