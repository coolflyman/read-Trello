var express = require('express');
var router = express.Router();
var util = require('util');
var url = require('url');
var OAuth = require('oauth').OAuth;


var requestURL = "https://trello.com/1/OAuthGetRequestToken";
var accessURL = "https://trello.com/1/OAuthGetAccessToken";
var authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
// var appName = "readjson";
// var secret = "cf3204bf4bfc4d79c97d5a97df126378b8c5574cbba2ace03c4d5c60adca1ba4";





// var loginCallback = function(err,data){
//           console.log('err: ',err);
//           console.log('data: ',data);

//       },


// oauth = new OAuth(requestURL, accessURL, key, secret, "1.0", loginCallback, "HMAC-SHA1")

/* GET home page. */
router.get('/', function(req, res, next) {
  var appLocals = req.app.locals;
  // var loginCallback = appLocals.loginCallback;
  // var appName = appLocals.appName;
  // var appKey = appLocals.appkey;
  // var secret = appLocals.secret;

  if (req.session.oauth && req.session.oauth.access_token) {
    console.log('already have oauth !!');
    res.redirect(appLocals.appMain);
    return;
  }

  var oa = new OAuth(requestURL, accessURL, appLocals.appkey, appLocals.secret, "1.0", appLocals.loginCallback, "HMAC-SHA1");
  oa.getOAuthRequestToken(function(err, token, tokenSecret, results) {
    if (err) {
      console.log(err);
      res.send("yeah no. didn't work");
    } else {
      req.session.oauth = {};
      req.session.oauth.token = token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = tokenSecret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
    }
    // oauth_secrets[token] = tokenSecret;
    res.writeHead(302, {
      'Location': authorizeURL + '?oauth_token=' + token + '&name=' + appLocals.appName
    });
    res.end();

  });
  //   res.render('index', { title: 'Express',appKey: appKey,util:util});
});


router.get('/cb', function(req, res, next) {
  var appLocals = req.app.locals;
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    console.log('cb oauth.token: ' + oauth.token);
    console.log('cb oauth.token_secret: ' + oauth.token_secret);

    var oa = new OAuth(requestURL, accessURL, appLocals.appkey, appLocals.secret, "1.0", appLocals.loginCallback, "HMAC-SHA1");
    oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
          //{ statusCode: 500, data: 'token not found' }
          console.log(error);
          res.send("yeah something broke.");
        } else {
          req.session.oauth.access_token = oauth_access_token;
          req.session.oauth.access_token_secret = oauth_access_token_secret;
          console.log('cb oauth_access_token: ' + oauth_access_token);
          console.log('cb oauth_access_token_secret: ' + oauth_access_token_secret);
          console.log(results);
          res.redirect(appLocals.appMain);
        }
      }
    );
  } else {
    next(new Error("you're not supposed to be here."));
  }






  // var query = url.parse(req.url, true).query;
  // var token = query.oauth_token;
  // var tokenSecret = oauth_secrets[token];
  // var verifier = query.oauth_verifier;

  // oauth.getOAuthAccessToken token, tokenSecret, verifier, (error, accessToken, accessTokenSecret, results) ->
  // #in a real app, the accessToken and accessTokenSecret should be stored
  // oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", accessToken, accessTokenSecret, (error, data, response) ->
  //   #respond with data to show that we now have access to your data
  //   res.end(data)
  // )





});

module.exports = router;
