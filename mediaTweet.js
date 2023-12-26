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
      path: "i1.jpeg",
      text: "According 2 the Palestinian Prisoner's Society, 4695 were detained since  October 7th in the West Bank & the raids R still going on, during  which whole families R threatened &some of their members R severely  beaten #Inoue Boxing Day #Christmas",
      type: "media",
    },
    {
      path: "i3.jpeg",
      text: "تعيد المقاومة تصنيع الأسلحة التي تتساقط على غزة ولا تنفجر، فتضرب بها الصهاينة بعد أن تردها للخدمة بطريقة أفضل مما كانت عليه وهي بأيديهم، فيُقتَلون بأسلحتهم التي قتلوا بها الأبرياء ظلما، مغلفة بعبارة: ذوقوا من نفس الكأس الذي تجرعونه غيركم.#رساله_اليوم #غزه_تنتصر #Christma",
      type: "media",
    },
    {
      text: "If you still believe that the occupying entity Israel is 'the only democratic country in the Middle East' please listen to this.#Inoue Boxing Day #Christma",
      type: "media",
      path: "video3.mp4",
    },
    {
      text: "إسرائيل تعتقل أكثر من 4695 فلسطينيا في الضفة الغربية، منذ 7 أكتوبر، وفق آخر الإحصائيات الرسمية الصادرة عن جمعية نادي الأسير الفلسطيني، وتواصل عمليات الاقتحام وتهديد العوائل والضرب المبرّح وعمليات التنكيل الواسعة خلال الاعتقال.#رساله_اليوم #غزه_تنتصر #Christma",
      type: "media",
      path: "i1.jpeg",
    },
    {
      text: "After only 6 hrs of traveling from Jerusalem to Ramallah & witnessing  the apartheid regime's treatment 2 Palestinians,this is his answer when asked about his reaction if he were to endure what they've been suffering 4 decades #Inoue Boxing Day #Christma",
      type: "media",
      path: "video12.mp4",
    },

    {
      text: "Western influencers use holidays 2 raise awareness about Zionist actions in Palestine, urging continued boycotts that effectively pressure rule-breakers, & enforce some brands to close some branches,change their names or back down! #Inoue Boxing Day #Christma",
      type: "media",
      path: "video2.mp4",
    },
    {
      text: "These war crimes occurred moments after Biden's announcement that he didn't request a ceasefire,& a few weeks ago,the U.S also vetoed against a ceasefire. What Gazans endure is a genocide by American weapons,while the UN & the whole world is watching #Inoue Boxing Day #Christma",
      type: "media",
      path: "i2.jpeg",
    },

    {
      text: "After 80+ days of continuous bombardment of civilians, Gazans either killed,  injured, or homeless facing the threat of death from bombs,infectious diseases,starvation, etc. How much must they endure before the world may react? #Inoue Boxing Day #Christmas",
      type: "media",
      path: "i4.jpeg",
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
