var express = require('express');
var router = express.Router();
var util = require('util');
var Trello = require("node-trello");
var TrelloData = require("../lib/TrelloData");
var md = require("node-markdown").Markdown;
// var appKey = 'a788a8642a5a25d1ad93d69280d9bcc5'


// var queryMemStr = "1/members/me/boards";
// var queryByBoardIdStr = "1/boards/$/lists";
// var queryByListIdStr = "1/lists/$/cards";
// var queryStr = "1/lists/53c34a3e439520900777caa7/cards";

var _this = this;
/* GET home page. */


module.exports = router;


router.get('/', function(req, res, next) {
    console.log("### req.session.id #### : " + req.session.id);
    var seesioOauth = req.session.oauth;
    // console.log("### seesioOauth #### : " + seesioOauth);
    // console.log("### seesioOauth.access_token #### : " + seesioOauth.access_token);
    if (!seesioOauth || !seesioOauth.access_token) {
        req.session.destroy(function(err) {
            // cannot access session here
        });
        // seesioOauth = req.session.oauth = null;
        console.log('should to login');
        res.redirect('/');
        return;
    } 
    
    
    var appLocals = req.app.locals;
    var t = new Trello(appLocals.appkey, req.session.oauth.access_token);
	t.get(appLocals.queryMemStr, function(err, data) {
		if (err) {
			throw err;
		}
		// var index;
		// for(index in data){
		//     if(data[index].name == req.body)
		// }
		// rootData = new TrelloData(data);
		// t.get()
		req.session.rootData = data;
		res.render('readjson/index', {
			title : 'read Trello',
			req : req,
			util : util,
			data : data,
			md : md,
			listData:null
		});

	});

});

router.post('/', function(req, res, next) {
    
	var form = req.body;
	var rootData = req.session.rootData;
	var boardObj;
	var index;
	
	var appLocals = req.app.locals;
    var t = new Trello(appLocals.appkey, req.session.oauth.access_token);

	if(form.listId){
		var qrystr = appLocals.queryByListIdStr.replace(/\$/, form.listId);
		console.log('post qrystr : ' + qrystr);
		t.get(qrystr, function(err, data) {
			res.render('readjson/index', {
				data : rootData,
				listData : data,
				title : 'read json',
				req : req,
				util : util
			});
			
		});
		return;
	}
	
	if(form.boardId){
		for (index in rootData) {
			if (rootData[index].id == form.boardId) {
				boardObj = rootData[index];
				break;
			}
		}
		if (boardObj) {
			var qrystr = appLocals.queryByBoardIdStr.replace(/\$/, boardObj.id);
			console.log('post qrystr : ' + qrystr);
			t.get(qrystr, function(err, data) {
				res.render('readjson/index', {
					data : rootData,
					listData : data,
					title : 'read json',
					req : req,
					util : util
				});
				
			});
			
		}
		return;
	}
	
	res.redirect(appLocals.appMain);
	

	/*    
	 console.log("##########");
	 // console.log(util.inspect(req));
	 console.log(util.inspect(req.body));
	 console.log(util.inspect(req.params));
	 // console.log('#####query : ' + query);
	 //res.render('index', { title: 'read json' });
	 //   console.log();
	 //   console.log(req.params);
	 //   console.log(req);
	 */

	//   res.redirect(req.baseUrl);
});

// t.get("1/boards/UWTvQoDs/lists", function(err, data) {
//   if (err) throw err;
// //   console.log(data);
//     var key;
//     for(key in data){
//         console.log(key + ') ' + data[key]);

//     }
//     console.log(util.inspect(data[3]));

// });

