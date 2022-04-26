const { default: axios } = require("axios");
var express = require("express");
var app = express();

const dotenv = require('dotenv');
dotenv.config();


app.get("/", function (req, res) {
    const token = process.env.token
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    axios
        .get(
            "https://api.twitter.com/2/users/1508492625711878145/tweets?start_time=2022-03-25T00:00:01Z&max_results=100",
            config
        )
        .then((resp) => {
            res.send(resp.data);
        });
});

app.listen(process.env.port, function () {
    console.log(`App listening on port ${process.env.port}!`);
});
