const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config()

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

const MAPI_KEY = process.env.apiKey

const MLIST_ID = process.env.LIST_ID

const MAPI_SERVER = process.env.API_SERVER



mailchimp.setConfig({
  apiKey: MAPI_KEY,
  server: MAPI_SERVER,
  listId: MLIST_ID
});


//  sending the signup page when someone visits the page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/sign-up.html");

})

//Our post function for after they hit submit.  Grabs the data they sent to us so that we can send it to MailChimp.
app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listId = "540612ed20";

  console.log(firstName);
  console.log(lastName);
  console.log(email);

  //This creates a function for us to run later that sends the info to MailChimp.  This comes straight from the MailChimp guide.
  async function addMember() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }).then(
      (value) => {
        console.log("successfully added contact as an audience member.");
        res.sendFile(__dirname + "/success.html");

      },
      (reason) => {
        res.sendFile(__dirname + "/failure.html");

      },
    );
  }
  addMember();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

//Our listener that opens the server
app.listen(process.env.PORT || 3000, function () {
  console.log("iam running without problem relax darling");
});
