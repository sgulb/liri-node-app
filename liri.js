//Require keys file
var keys = require("./keys.js");

//Require the npm's
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//Grab twitterKeys from keys file
var keysList = keys.twitterKeys;

//Store the dynamic node arguments
var command = process.argv[2];
var value = process.argv[3];

var s = "--------------------------";

//If statements to decide which function to run based on the user commands
if (command === "my-tweets") {
	myTweets();
} else if (command === "spotify-this-song" && process.argv.length > 3) {
	  spotify();
} else if (command === "spotify-this-song" && process.argv.length < 4) {
	  spotifyDefault();
} else if (command === "movie-this") {
	  movie();
} else if (command === "do-what-it-says") {
	  randomSong();
}

//Function for if user command "my-tweets"
function myTweets() {

//User authentication
	var client = new Twitter ({
		consumer_key: 'teDNBRpTw2D8J1q3K6f1Ldoo1',
	  consumer_secret: 'aRFVHdcJ8ycegz3FD8rae6nDkk7GiXT7hF9cj6Ndc9Eh6Ag6Zi',
	  access_token_key: '900887246294851584-hqqm4cvVyCTUyHIueliHka2ZAxjB8MS',
	  access_token_secret: 'f52DqkghT2pVz8YK33UwYy7OJ4iyERqoAa3rShXgFOntX',
	});

	//Get the specific twitter account statuses from api
	var userId = {user_id: "900887246294851584"};

	client.get("statuses/user_timeline", userId, function(error, tweets, response) {
		if (!error) {

			//Loop through the JSON object to target the date and text of statuses
			for (var i = 0; i < tweets.length; i++) {
				var date = tweets[i].created_at;
				var text = tweets[i].text;

				//Print date and text
				console.log(s + "\n" + date + "\nLiri Bot Tweeted: " + text);
			}
		}
	});
}

//Function for spotify-this-song command
function spotify() {
	var nodeArg = process.argv;
	var songName = [];

	if (nodeArg.length > 3) {
		for (var i = 3; i < nodeArg.length; i++) {
			songName.push(nodeArg[i]);
		}

		var spotify = new Spotify({
		  id: "7fd7f341f6f74406b73f27ed0b6893c3",
      secret: "2a6eb9f7c8394ab09ddd4f957704c50b"
	  });

	  //Spotify search method
		spotify.search({ type: "track", query: songName, limit: 1 }, function(err, data) {
			if (err) {
				return console.log("Error Occurred: " + err);
			}

			var params = data.tracks.items[0];
			var obj = {
				artist: params.artists[0].name,
				song: params.name,
				album: params.album.name,
				preview: params.preview_url
			};

			if (obj.preview === null) {
				var holder = "Not available at this time :(";
				obj.preview = holder;
			}
			console.log(s + "\nArtist: " + obj.artist + "\nSong: " + obj.song + "\nAlbum: " + obj.album + "\nPreview Link: " + obj.preview + "\n" + s);
		});
	}
}

//Function used if no song given
function spotifyDefault() {
	var nodeArg = process.argv;
  if (nodeArg.length < 4) { 
		var spotify = new Spotify({
		  id: "7fd7f341f6f74406b73f27ed0b6893c3",
		  secret: "2a6eb9f7c8394ab09ddd4f957704c50b"
    });
		spotify
		  .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
      .then(function(data) {
      	var obj = {
      		artist: data.artists[0].name,
      		song: data.name,
      		album: data.album.name,
      		preview: data.preview_url
      	};

      	if (obj.preview === null) {
      		var holder = "Not available at this time :(";
      		obj.preview = holder;
      	}
      	console.log(s + "\nArtist: " + obj.artist + "\nSong: " + obj.song + "\nAlbum: " + obj.album + "\nPreview Link: " + obj.preview + "\n" + s);
		  })
		  .catch(function(err) {
		    console.error('Error occurred: ' + err); 
		  });
  }
}

//Function for user command "movie-this"
function movie() {

	var movieName = [];
	var nobody = ["mr", "nobody"];
	var nodeArg = process.argv;

	//If the user types in a movie name, push the string into the empty movieName array
	if (nodeArg.length > 3) {
		for (var i = 3; i < nodeArg.length; i++) {
			movieName.push(nodeArg[i]);	
		}

		//If they don't enter a name, set the call to the movie mr nobody
	} else if (nodeArg.length < 4) {
		  movieName = nobody;
		}
	
	//Make the call from the api
	request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
	  if (!error && response.statusCode === 200) {
	  	console.log(s + "\nMovie: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nProduced In: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors + "\n" + s);
	  }
  });
}

function randomSong() {

	fs.readFile("random.txt", "utf8", function(err, data) {
	if(err) {
		return console.log(err);
	}
  
  data = data.split(",");
  var nodeArg = [];
  for (var i = 0; i < data.length; i++) {
  	nodeArg.push(data[i]);
  }
  
  var random = function() {
  	var spotify = new Spotify({
		  id: "7fd7f341f6f74406b73f27ed0b6893c3",
      secret: "2a6eb9f7c8394ab09ddd4f957704c50b"
	  });

	  //Spotify search method
		spotify.search({ type: "track", query: nodeArg[1], limit: 1 }, function(err, data) {
			if (err) {
				return console.log("Error Occurred: " + err);
			}

			var params = data.tracks.items[0];
			var obj = {
				artist: params.artists[0].name,
				song: params.name,
				album: params.album.name,
				preview: params.preview_url
			};

			if (obj.preview === null) {
				var holder = "Not available at this time :(";
				obj.preview = holder;
			}
			console.log(s + "\nArtist: " + obj.artist + "\nSong: " + obj.song + "\nAlbum: " + obj.album + "\nPreview Link: " + obj.preview + "\n" + s);
		});
  };
  random();
  });
}





