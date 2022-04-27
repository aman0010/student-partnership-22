const { default: axios } = require("axios");
var express = require("express");
var app = express();

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const datediff = require("./utils/dateDiff");
const countTweet = require("./utils/countTweet");
app.use(cors());

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

app.get("/validate/:username", function (req, res) {
    const username = req.params.username;
    axios
        .get(`https://api.twitter.com/2/users/by/username/${username}`, config)
        .then((resp) => {
            if (!!resp.data.errors) {
                res.send({ msg: resp.data.errors[0].detail });
            }
            const userId = resp.data.data.id;
            axios
                .get(
                    `https://api.twitter.com/2/users/${userId}/tweets?start_time=2022-04-14T00:00:01Z&max_results=100&tweet.fields=entities`,
                    config
                )
                .then((resp) => {
                    let isValid = false
                    if (resp.data.data) {
                        const tweet_count = countTweet(resp.data.data);
                        const days_gone = datediff();
                        isValid = tweet_count >= days_gone - 2;
                    }

                    if (isValid) res.send({ msg: "You are on track!" });
                    else res.send({ msg: "You are not on track!" });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.listen(process.env.PORT, function () {
    console.log(`App listening on port ${process.env.PORT}!`);
});
