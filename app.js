const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config()

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

const MAPI_KEY = process.env.apiKey

const MLIST_ID = process.env.LIST_ID

const MAPI_SERVER = process.env.API_SERVER



mailchimp.setConfig({
  apiKey: MAPI_KEY,
  server: MAPI_SERVER,
});


//  sending the signup page when someone visits the page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/sign-up.html");

})

//Our post function for after they hit submit.  Grabs the data they sent to us so that we can send it to MailChimp.
app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listId = "540612ed20";

  console.log(firstName);
  console.log(lastName);
  console.log(email);

  const data = {
    members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
};

const run = async () => {
    const response = await client.lists.batchListMembers(listId, data);
    console.log(response.error_count);
    if (response.error_count === 0) {
        res.sendFile(__dirname + "/success.html");
    }
    else {
        res.sendFile(__dirname + "/failure.html");
    }
  };



run();

});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

//Our listener that opens the server
app.listen(process.env.PORT || 3000, function() {
console.log("iam running without problem relax darling");
});
