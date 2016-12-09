//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Require Modules
var Article = require("./models/Article.js");

//Scrapping tools
var request = require("request");
var cheerio = require("cheerio");

//Database configuration
var mongojs = require('mongojs');
var databaseUrl = "NPRscraper";
var collections = ["scarpedData"];

//Initialize Express
var app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));

//Make public a static dir
app.use(express.static("public"));

//Database configuration with mongoose
mongoose.connect("mongodb://localhost/NPRscraper");
var db = mongoose.connection;

db.on("error", function(error){
	console.log("Mongoose Error: ", error);
});

db.once("open", function(error){
	console.log("Mongoose connection successful.");
});

//ROUTES

app.get("/", function (req, res){
	res.send(index.html);
});

//Route 1 to retrive all of the data
app.get('/all', function(req, res){
	db.scarpedData.find({}, function (err, data){
		if (err){
			return console.log(err);
		}
		else {
			res.json(data);
		}
	});
});

//Route 2 to scrape data

request("http://www.npr.org/", function(error, response, html){
	var $ = cheerio.load(html);

	var result = [];

	$("article>div.story-wrap>div.story-text>a>h1.title").each(function(i, element){
		var result = {};

		result.title = $(this).children("h1").text();
		result.link = $(this).children("a").attr("href");

		var entry = new Article(result);
	});
});