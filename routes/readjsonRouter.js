var express = require('express');
var router = express.Router();
var util = require('util');
var Trello = require("node-trello");
var TrelloData = require("../lib/TrelloData");
var md = require("node-markdown").Markdown;
// var _this = this;

module.exports = router;


router.get('/', function(req, res, next) {
    console.log("### req.session.id #### : " + req.session.id);
    var seesioOauth = req.session.oauth;
    if (!seesioOauth || !seesioOauth.access_token) {
        req.session.destroy(function(err) {
            // cannot access session here
        });
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
	
});