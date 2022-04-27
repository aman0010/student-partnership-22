function countTweet(tweets) {
    let tweet_count = 0;

    tweets.forEach((element) => {
        if (element.entities && element.entities.hashtags) {
            const hashtags_list = element.entities.hashtags.map((hashtag) => hashtag.tag);
            if (
                hashtags_list.includes("60DaysOfLearning") &&
                hashtags_list.includes("LearningWithLeapfrog") &&
                hashtags_list.find((hashtag) => hashtag.includes("LSPPD"))
            )
                tweet_count++;
        }
    });

    return tweet_count;
}

module.exports = countTweet;
