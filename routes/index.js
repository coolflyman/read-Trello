var express = require('express');
var router = express.Router();
var util = require('util');
var url = require('url');
var OAuth = require('oauth').OAuth;


var requestURL = "https://trello.com/1/OAuthGetRequestToken";
var accessURL = "https://trello.com/1/OAuthGetAccessToken";
var authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";

/* GET home page. */
router.get('/', function(req, res, next) {
  var appLocals = req.app.locals;

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
    res.writeHead(302, {
      'Location': authorizeURL + '?oauth_token=' + token + '&name=' + appLocals.appName
    });
    res.end();

  });
});


router.get('/cb', function(req, res, next) {
  var appLocals = req.app.locals;
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;
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
          res.redirect(appLocals.appMain);
        }
      }
    );
  } else {
    next(new Error("you're not supposed to be here."));
  }
});

module.exports = router;
