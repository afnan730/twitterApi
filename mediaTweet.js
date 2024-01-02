const { text } = require("express");
const { TwitterApi } = require("twitter-api-v2");
const fs = require("fs");
// let user;
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

    console.log("trying to tweet.......");
    await tweet(client, apiKey);
    console.log("completed.......");
  } catch (e) {
    console.log("line43" + e);
    throw e;
  }
};
const tweet = async (client, key) => {
  const tweets = [
    {
      text: "As per Haaretz's wording,'If death doesn't come by bombing,hunger will bring it'. A 'severe famine' spreads quickly in Gaza due 2 continues boming & the blockade imposed by Israel. Urgent global humanitarian intervention's deemed necessary. #WorldJuniors #OTDirecto2E Epstein MATZ",
      type: "media",
      path: "p5.jpeg",
    },
    {
      text: "If one attack,as barbaric as it was,pushes so many Israelis to  become inhuman,imagine what it's like 4 Palestinians who have lived  under such attacks 4 decades. We always wonder,'How do they become  those monsters?'Here's the answer. #WorldJuniors #OTDirecto2E #Epstein #MATZ",
      type: "media",
      path: "v1.mp4",
    },
    {
      text: "The Israeli occupier openly acknowledges and legalizes torture of detainees, as outlined in Article 4.7 of the Lando report, subjecting thousands of Palestinians arrested by the occupation to the worst forms of torture throughout history. #WorldJuniors #OTDirecto2E Epstein MATZ",
      type: "media",
      path: "p1.jpeg",
    },
    {
      text: "If Israel pretext to wipe Gazans out is October 7th, how should the Palestinians react when they v been living many October 7th for 75+ years. This Israeli scholar is one of many honest voices who dare to expose the truth. #WorldJuniors #OTDirecto2E Epstein MATZ",
      type: "media",
      path: "v2.mp4",
    },

    {
      text: "Kidnapping babies/children is another war crime Israeli occupation is committing against Gazans & some evidence emerged to confirm this atrocity. An urgent return of those children should be demanded immediately. #WorldJuniors #OTDirecto2E Epstein MATZ #Gaza_Genocide",
      type: "media",
      path: "p3.jpeg",
    },
    {
      text: "Palestinian passes away, but his memory remains immortal. This is a story of people seeking for dignity & a beautiful life, but Israeli occupation & his alliance don't allow them to live. #WorldJuniors #OTDirecto2E Epstein MATZ",
      type: "media",
      path: "v4.mp4",
    },
    {
      text: "Brick, an Israeli General, said that all of Israel weapons used in this current Gaza's genocide are Americans and Israel won't be able to continue if not for the U.S's weaponry. https://www.motherjones.com/politics/2023/12/how-joe-biden-became-americas-top-israel-hawk/?s=08 #WorldJuniors #OTDirecto2E Epstein MATZ #Gaza",
      type: "media",
      path: "p4.jpeg",
    },
    {
      text: "Decades of Washington's unconditional support 2 Israel give them impunity 2 the point that they feel no shame bragging about their crimes. One of their soldiers, who just killed a 12 y.o girl, is looking 4 babies as they r his best targets. #WorldJuniors #OTDirecto2E Epstein MATZ",
      type: "media",
      path: "v3.mp4",
    },
    {
      text: "Isreal detained Palestinians' children without charges & put them in prison for long years where they're tortured, humiliated & starved. https://www.addameer.org/sites/default/files/publications/al_dameer_annual_report_english.pdf #WorldJuniors #OTDirecto2E Epstein Epstein MATZ $BRCT #Gaza_Genocide",
      type: "media",
      path: "p6.jpeg",
    },
    // {
    //   text: "2 allegations emerged in the last 24hrs about Gaza's children being kidnapped by Israel. Rushdi, from Gaza, was detained with his wife & 2 children(a 4y.old & a 6month old), however, Rushdi is back 2 Gaza without his children! #WorldJuniors #OTDirecto2E Epstein MATZ #Gaza_Genocide",
    //   type: "media",
    //   path: "v5.mp4",
    // },

    // {
    //   text: "فرحة الأطفال أعيادهم. إلى جانب جبرُ خاطرِ خليل وإسعاده، يظهر في هذا الفيديو إيثار الأسرة لخليل رغم كثرة عددهم وحاجتهم؛ لكنهم يثقون في عطاء الله الذي وسعت خزائنه السماوات والأرض. 'وَاللهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ'. رواه مسلم #ولعت #الهلال #ايران",
    //   type: "media",
    //   path: "i1.jpeg",
    // },
  ];
  for (const tweet of tweets) {
    console.log(tweet);
    console.log(tweet.type);
    try {
      if (tweet.type == "media") {
        await mediaTweet(tweet, client);
      } else {
        await textTweet(tweet);
      }
    } catch (e) {
      console.log("line83");
      console.log(e);
      throw e;
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
  // console.log("lin32:" + user);
  // console.log(typeof id);

  // // console.log(tweet);
  // console.log("37here" + id);

  try {
    await rwClient.v2.tweet(tweet.text);

    // await new Promise((resolve) => setTimeout(resolve, 1000));
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

    // await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.log("error while posting media......");
    console.log(error.data.errors[0].message);

    const errorMessage = {
      arabic:
        "تحقق من حسابك في تويتر! يبدو أنك قد قمت بنشر التغريدات اليوم، يمكنك نشر التغريدات مرة فقط خلال اليوم",
      english:
        "Check your Twitter profile! It looks like you've tweeted today. You can post tweets once a day",
    };
    const message = {
      arabic:
        "يبدو أن المعرفات التي أدخلتها غير صالحة أو منتهية الصلاحية، يرجى التحقق أنك أدخلتها بالشكل الصحيح أو إعادة تجديدها",
      english:
        "Invalid or expired token, please validate that you entered them in the correct form or regenerate them",
    };
    if (
      error.data.detail ==
      "You are not allowed to create a Tweet with duplicate content."
    ) {
      throw errorMessage;
    } else {
      if (
        error.data.errors[0].message == "Invalid or expired token" ||
        error.data.errors[0].message == "Bad Authentication data." ||
        error.data.errors[0].message == "Could not authenticate you"
      ) {
        console.log("exception 1");
        throw message;
      } else {
        throw error;
      }
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
