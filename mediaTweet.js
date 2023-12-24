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
      text: "\"I'll remain steadfast on my land,ready to defend till the last drop of my blood\" She isn't just a little girl;she represents all Palestinians steadfast in protecting their homeland until the very last drop of their blood. #Chelsea #Christmas #Sterling #Santa #Wilde",
      type: "media",
    },
    {
      path: "p3.jpeg",
      text: "احفظوا الشركات التي تظهر أسماؤها مطبوعة على مأكولات أو مشروبات بأيدي الجنود الصهاينة أو على طاولات الساسة، وعاقبوها بالمقاطعة. أروهم قوة سلاحنا الذي يستهينوا به. اجعلوا تجاراتهم تنهار عليهم كما جعلوا غزة تنهار على ساكنيها.#غزه_تنتصر#Chelsea #Christmas #Liverpool",
      type: "media",
    },
    {
      text: "Look out 4 all food/beverage companies that the occupation's soldiers & world politicians appear consuming/holding. Boycot is the answer 2 their arrogance & underestimatation of the mass power. Hit them where it hurts: their pockets #Chelsea #Christmas #Sterling #Santa #Wilde",
      type: "media",
      path: "v2.mp4",
    },
    {
      text: "Gaza's situation's disastrous: lack of infrastructure,healthcare,life necessities & people R killed,injured&kidnapped. Moreover,civilians suffer from pollution due 2 bombing&diseases due 2 lack of water. Urgent ceasefire's a must. #Chelsea #Christmas #Sterling #Santa",
      type: "media",
      path: "v3.mp4",
    },
    {
      text: 'Resistance recycle bombs debris and turned them into weapons used in their defense against the occupation\'s soldiers"Resistance is giving them a taste of their own medicine" #Chelsea #Christmas #Sterling #Santa #Wilder',
      type: "media",
      path: "p1.jpeg",
    },

    {
      text: "The major world players have to stop providing immunity to Israeli occupations. This political protection made it 'an above law' entity & allowed it to torture Palestinians, steal their land, kill & displace them for over 75 years. #Chelsea #Christmas #Sterling #Santa #Wilder",
      type: "media",
      path: "p4.jpeg",
    },
    {
      text: "Khaled story,The Soul of My Soul,touches millions of hearts worldwide. People memorize his late granddaughter & his BD &send him their best wishes. He helped correct the global misconception of Islam &show how tolerant & noble it is. #Chelsea #Christmas #Sterling #Santa #Wilder",
      type: "media",
      path: "v4.mp4",
    },
    {
      text: "Killed, with 2 shots, only because he stood up against the genocide. However, truth will always be louder no matter what criminals do to silence it. #Chelsea #Christmas #Sterling #Santa #Wilder",
      type: "media",
      path: "p7.jpeg",
    },
    {
      text: "إن كان لواء غولاني هو أقوى الألوية، فسحبه من المعركة يضعنا أمام احتمالين: إما أنه قوي بالفعل؛ لكن المقاومة أثبتت أنها أقوى منتعيد المقاومة تصنيع الأسلحة التي تتساقط على غزة ولا تنفجر، فتضرب بها الصهاينة بعد أن تردها للخدمة بطريقة أفضل مما كانت عليه وهي بأيديهم، فيُقتَلون بأسلحتهم التي قتلوا بها الأبرياء ظلما، مغلفة بعبارة: ذوقوا من نفس الكأس الذي تجرعونه غيركم. #غزه_تنتصر #Chelsea #Christmas #Liverpool",
      type: "media",
      path: "66.jpeg",
    },
    {
      text: "إن من يمسك مقود المفاوضات والسيطرة الميدانية هو المنتصر، والواقع يخبرنا أن المقاومة متمسكة بشروطها، وتجبر الأطراف على قبولها وعلى رأسها وقف الحرب كليا، ثم تبييض السجون الصهيونية، وإعادة إعمار غزة، في حين يتنازل الصهاينة عن شروطهم تدريجيا. #غزه_تنتصر #Chelsea #Christmas #Liverpool",
      type: "media",
      path: "p5.jpeg",
    },
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
