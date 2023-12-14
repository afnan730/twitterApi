const { checkIfUserTweeted } = require("./mediaTweet.js");
const express = require("express");
const app = express();
var cors = require("cors");
var bodyParser = require("body-parser");

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
    throw "appKey can't be empty";
  }
  if (!req.body.appSecret || req.body.appSecret.trim().length == 0) {
    throw "appSecret can't be empty";
  }
  if (!req.body.accessToken || req.body.accessToken.trim().length == 0) {
    throw "accessToken can't be empty";
  }
  if (!req.body.accessSecret || req.body.accessSecret.trim().length == 0) {
    throw "accessSecret can't be empty";
  }
  if (!req.body.bearerToken || req.body.bearerToken.trim().length == 0) {
    throw "bearerToken can't be empty";
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
app.post("/tweet", async (req, res) => {
  try {
    validate(req);
    const data = getData(req);
    await checkIfUserTweeted(data);

    res.send("You have posted successfully");
  } catch (e) {
    console.log("app85" + e);
    res.status(500).send(e ? e : "something went wrong");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
