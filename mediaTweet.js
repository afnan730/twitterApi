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

    if (await fs.existsSync(filepath)) {
      console.log("checking.....");
      const fileContent = fs.readFileSync(filepath, "utf-8");
      const ids = fileContent.split("\n");

      console.log(ids);
      if (ids.includes(apiKey.toString())) {
        console.log("You have tweeted today");
        const errorMessage = {
          arabic:
            "تحقق من حسابك في تويتر! يبدو أنك قد قمت بنشر التغريدات اليوم، يمكنك نشر التغريدات مرة فقط خلال اليوم",
          english:
            "Check your Twitter profile! It looks like you've tweeted today. You can post tweets once a day",
        };
        throw errorMessage;
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
      const message = {
        arabic: "حدث خطأ ما، يرجى المحاولة لاحقا",
        english: "Something went wrong! Please try again later.",
      };
      throw message;
    }
  } catch (e) {
    console.log("line43" + e);
    throw e;
  }
};
const tweet = async (client, key) => {
  const tweets = [
    {
      path: "v1.mp4",
      text: "In all the laws of humanity, resistance to the occupier was an honor. The Zionist entity is trying to overturn moral standards. It wants to kill and terrorize people, and portray to the world that those who resist are terrorists.#Christmas #Trump New Year.",
      type: "media",
    },
    {
      path: "66.jpeg",
      text: " 14 YEAR OLD YAZEN LOST 3 LIMBS FROM ISRAELI BOMBING #Christmas #Trump New Year",
      type: "media",
    },
    {
      text: "According to the UN charter #51, Israel doesn't have the right to self-defense against Palestinians as it occupies their land.#Christmas #Trump New Year",
      type: "media",
      path: "v2.mp4",
    },
    {
      text: "You can't achieve peace with an apartheid antity that would do anything to steal your land,torture,murder,destruction,etc. The 2 states solution is the only clear path to peace.#Christmas #Trump New Year",
      type: "media",
      path: "v3.mp4",
    },
    {
      text: "The land of Palestine was never  desert, but rather an inhabited land with villages inhabited by people and communities of Muslims, Christians, and Jews, until Zionism came and decided to carry out ethnic cleansing and take their place.#Christmas #Trump New Year",
      type: "media",
      path: "v4.mp4",
    },

    {
      text: "Resistance forced the occupation to withdraw its strongest brigade, the Golani's. This limited resources & basic resistance astonished the world with its military tactics & abilities & managed to destroy the myth of a strong and very advanced army.#Christmas #Trump New Year",
      type: "media",
      path: "p3.jpeg",
    },
    {
      text: "Netanyahu promised freeing the hostages & resistance's elimination. 2+ months in & all he did is innocents' madsacre. Resistance forced their best brigade to withdraw. Israel is eager to have a truce, but it wants to keep its undefeatable image as well.#Christmas #Trump New Year",
      type: "media",
      path: "p1.jpeg",
    },
    {
      text: "إن كان لواء غولاني هو أقوى الألوية، فسحبه من المعركة يضعنا أمام احتمالين: إما أنه قوي بالفعل؛ لكن المقاومة أثبتت أنها أقوى منه ميدانيا، وإما أنه أُعطِي مكانة لا يستحقها، وهذا يعني أن بقية الألوية والفرق هشة، وسيتم سحبها قريبا. #النصر_الاتفاق #يوم_الجمعه #محمد #غزه_تستغيث.",
      type: "media",
      path: "p4.jpeg",
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
      console.log("line83");
      throw "Something went wrong! " + e;
    }
  }
  fs.appendFileSync(filepath, key + "\n", function (err) {
    if (err) {
      const error = {
        arabic: "حدث خطأ ما! يرجى إعادة المحاولة لاحقا",
        english: "Something went wrong, please try again later.",
      };
      console.log("something went wrong while saving in file " + err.data);
      throw error;
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

    await new Promise((resolve) => setTimeout(resolve, 3000));
  } catch (error) {
    const errorMessage = {
      arabic:
        "تحقق من حسابك في تويتر! يبدو أنك قد قمت بنشر التغريدات اليوم، يمكنك نشر التغريدات مرة فقط خلال اليوم",
      english:
        "Check your Twitter profile! It looks like you've tweeted today. You can post tweets once a day",
    };
    console.log(error.data.detail);
    if (
      error.data.detail ==
      "You are not allowed to create a Tweet with duplicate content."
    ) {
      throw errorMessage;
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

    await new Promise((resolve) => setTimeout(resolve, 3000));
  } catch (error) {
    console.log("error while posting media ..." + error);
    console.log(error.data.detail);
    const errorMessage = {
      arabic:
        "تحقق من حسابك في تويتر! يبدو أنك قد قمت بنشر التغريدات اليوم، يمكنك نشر التغريدات مرة فقط خلال اليوم",
      english:
        "Check your Twitter profile! It looks like you've tweeted today. You can post tweets once a day",
    };
    if (
      error.data.detail ==
      "You are not allowed to create a Tweet with duplicate content."
    ) {
      throw errorMessage;
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
