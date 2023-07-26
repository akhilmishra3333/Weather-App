//jshint esversion:6

var express = require("express");
var bodyParser = require("body-parser");
var https = require("https");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.listen(3000);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    var place = req.body.city;

    var date = new Date();

    var options = {
        day: "numeric",
        weekday: "long",
        month: "long"

    };

    date = date.toLocaleDateString("en-US", options);

    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + place + "&appid=771cc945bb888fff07f732b3678bae3d&units=metric";
    https.get(url, function (response) {
        response.on("data", function (data) {
            var dat = JSON.parse(data);
            var cond = dat.weather[0].main;
            var cutmp = dat.main.temp;
            var feeltmp = dat.main.feels_like;

            var logoid = dat.weather[0].icon;
            // var logo="http://openweathermap.org/img/wn/"+logoid+"@2x.png";

            res.render("display", { todaydate: date, city: place, condition: cond, currenttemp: cutmp, feeltemp: feeltmp, logoid: logoid });

        });
    });
});