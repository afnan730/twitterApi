const { checkIfUserTweeted } = require("./mediaTweet.js");
const express = require("express");
const app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

const port = 3000;

app.use(cors());

function validate(req) {
  if (!req.body.appKey || req.body.appKey.trim().length == 0) {
    throw {
      english: "Consumer key can't be empty",
      arabic: "الحقل الأول يجب ألا يكون فارغا",
    };
  }
  if (!req.body.appSecret || req.body.appSecret.trim().length == 0) {
    throw {
      english: "Consumer secret key can't be empty",
      arabic: "الحقل الثاني يجب ألا يكون فارغا",
    };
  }
  if (!req.body.accessToken || req.body.accessToken.trim().length == 0) {
    throw {
      english: "Access token key can't be empty",
      arabic: "الحقل الثالث يجب ألا يكون فارغا",
    };
  }
  if (!req.body.accessSecret || req.body.accessSecret.trim().length == 0) {
    throw {
      english: "Access token secret key can't be empty",
      arabic: "الحقل الرابع يجب ألا يكون فارغا",
    };
  }
  if (!req.body.bearerToken || req.body.bearerToken.trim().length == 0) {
    throw {
      english: "Bearer token key can't be empty",
      arabic: "الحقل الأخير يجب ألا يكون فارغا",
    };
  }
}

function getData(req) {
  const data = {
    appKey: req.body.appKey,
    appSecret: req.body.appSecret,
    accessToken: req.body.accessToken,
    accessSecret: req.body.accessSecret,
    bearerToken: req.body.bearerToken,
  };

  return data;
}

// app.post("/tweet", async (req, res) => {

//   try {
//     validate(req);
//     const data = getData(req);
//     tweets.forEach(async (tweet, index, array) => {
//       console.log(tweet);
//       console.log(tweet.type);

//         if (tweet.type == "media") {
//           try {
//             await mediaTweet(data, tweet);
//           } catch (e) {
//             throw e.data;
//           }
//         } else {
//           try {
//             await textTweet(data, tweet);
//           } catch (e) {
//             throw e.data;
//           }
//         }
//     });
//     res.send("Success");
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });
// app.post("/api/tweet", async (req, res) => {
//   try {
//     validate(req);
//     const data = getData(req);
//     await checkIfUserTweeted(data);
//     const response = {
//       arabic:
//         ".تم النشر بحمد الله. تحقق من حسابك على تويتر لمشاهدة التغريدات التي نشرتها",
//       english:
//         "Tweets have been successfully posted, check your Twitter profile to see the tweets.",
//     };
//     res.send(response);
//   } catch (e) {
//     console.log("app85" + e);
//     const message = {
//       arabic: "حدث خطأ ما، يرجى المحاولة لاحقا",
//       english: "Something went wrong! Please try again later.",
//     };
//     res.status(500).send(e ? e : message);
//   }
// });

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Fork a new worker to replace the dead one
    cluster.fork();
  });
} else {
  // Worker process code

  // Your existing code

  app.post("/api/tweet", async (req, res) => {
    try {
      validate(req);
      const data = getData(req);
      await checkIfUserTweeted(data);
      const response = {
        arabic:
          ".تم النشر بحمد الله. تحقق من حسابك على تويتر لمشاهدة التغريدات التي نشرتها",
        english:
          "Tweets have been successfully posted, check your Twitter profile to see the tweets.",
      };
      res.send(response);
    } catch (e) {
      console.log("app85" + e);
      console.log(e);
      const message = {
        arabic: "حدث خطأ ما، يرجى المحاولة لاحقا",
        english: "Something went wrong! Please try again later.",
      };
      res.status(500).send(e ? e : message);
    }
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
