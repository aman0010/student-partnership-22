const { default: axios } = require("axios");
var express = require("express");
var app = express();

const dotenv = require("dotenv");
dotenv.config();

const user_list = {};

const token = process.env.TOKEN;
const config = {
    headers: { Authorization: `Bearer ${token}` },
};
app.get("/", function (req, res) {
    axios
        .get(
            "https://api.twitter.com/2/users/1508492625711878145/tweets?start_time=2022-03-25T00:00:01Z&max_results=100",
            config
        )
        .then((resp) => {
            res.send(resp.data);
        });
});

app.get("/user/:username", function (req, res) {
    const username = req.params.username;
    axios.get(`https://api.twitter.com/2/users/by/username/${username}`, config).then((resp) => {
        res.send(resp.data);
    });
});

app.get("/batch/username", function (req, res) {
    const username = req.params.username;
    axios
        .post(
            `https://api.twitter.com/2/compliance/jobs`,
            {
                type: "tweets",
                resumable: true,
            },
            config
        )
        .then((resp) => {
            res.send(resp.data);
        });
});

app.listen(process.env.PORT, function () {
    console.log(`App listening on port ${process.env.PORT}!`);
});
