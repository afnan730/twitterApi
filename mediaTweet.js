const { text } = require("express");
const { TwitterApi } = require("twitter-api-v2");
const fs = require("fs");
let user;
let rwClient;

const filepath = "./ids.txt";
let id;
const checkIfUserTweeted = async (data) => {
  try {
    console.log(data);

    console.log("checking if user in file....");
    const apiKey = data.appKey;
    // try {
    //   user = await rwClient.v2.me();
    // } catch (e) {
    //   console.log("failed to fetch user " + e);
    //   throw e;
    // }

    // console.log(user);
    // id = user.data.id;
    // console.log(id);
    // console.log(filepath);
    if (await fs.existsSync(filepath)) {
      console.log("checking.....");
      const fileContent = fs.readFileSync(filepath, "utf-8");
      const ids = fileContent.split("\n");

      console.log(ids);
      if (ids.includes(apiKey.toString())) {
        console.log("You have tweeted today");
        throw "You have tweeted today";
      }
    } else {
      fs.writeFileSync(filepath, "", { flag: "wx" });
    }
    const client = new TwitterApi(data);
    console.log("twitter client created");
    rwClient = client.readWrite;
    try {
      console.log("trying to tweet.......");
      await tweet(client, apiKey);
      console.log("completed.......");
    } catch (e) {
      console.log("line39" + e);
      throw e;
    }
  } catch (e) {
    console.log("line43" + e);
    throw e;
  }
};
const tweet = async (client, key) => {
  const tweets = [
    {
      path: "video_2023-12-03_20-27-44.mp4",
      text: "Attempt to rescue a young man from under the rubble of a house bombed by the occupation in the Beshara neighborhood in Deir al-Balah, central Gaza Strip, this evening.",
      type: "media",
    },
    {
      path: "66.jpeg",
      text: " 14 YEAR OLD YAZEN LOST 3 LIMBS FROM ISRAELI BOMBING",
      type: "media",
    },
    {
      text: "Hamas treated their prisoners well. They even exchanged their goodbyes W a contentement's smiles.This is the true tolerant face of Islam.",
      type: "media",
      path: "p3.jpeg",
    },
    {
      text: "Israeli occupation forces raids last night on the central Gaza Strip caused a massive destruction in residential buildings",
      type: "media",
      path: "v2.mp4",
    },
  ];
  for (const tweet of tweets) {
    // console.log(tweet);
    console.log(tweet.type);
    try {
      if (tweet.type == "media") {
        await mediaTweet(tweet, client);
      } else {
        await textTweet(tweet);
      }
    } catch (e) {
      console.log("line70");
      throw "تحقق من صحة المفاتيح التي أدخلتها";
    }
  }
  fs.appendFileSync(filepath, key + "\n", function (err) {
    if (err) {
      console.log("something went wrong while saving in file " + err.data);
      throw err;
    } else {
      console.log("It's saved!");
    }
  });
};
//create textTweet function
const textTweet = async (tweet) => {
  console.log("lin32:" + user);
  console.log(typeof id);

  // console.log(tweet);
  console.log("37here" + id);

  try {
    await rwClient.v2.tweet(tweet.text);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.log(error.data.detail);
    if (
      error.data.detail ==
      "You are not allowed to create a Tweet with duplicate content."
    ) {
      throw "It looks like you've tweeted today. You can tweet once a day";
    } else {
      throw error;
    }
  }
};

const mediaTweet = async (tweet, client) => {
  // console.log(tweet);
  try {
    // Create mediaID
    const mediaId = await client.v1.uploadMedia(tweet.path);

    await rwClient.v2.tweet({
      text: tweet.text,
      media: { media_ids: [mediaId] },
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.log("error while posting media ..." + error);
    console.log(error.data.detail);
    if (
      error.data.detail ==
      "You are not allowed to create a Tweet with duplicate content."
    ) {
      throw "It looks like you've tweeted today. You can tweet once a day";
    } else {
      throw error;
    }
  }
};
//textTweet();
// mediaTweet();

module.exports = {
  mediaTweet,
  textTweet,
  checkIfUserTweeted,
};
