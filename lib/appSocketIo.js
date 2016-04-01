var socketIo = require('socket.io');
var cookieParser = require('cookie-parser');
var util = require('util');
var Trello = require("node-trello");
var md = require("node-markdown").Markdown;


var io, app, applocals;

function AppSocketIo(server, expressApp) {
    io = socketIo(server);
    app = expressApp;
    applocals = app.locals;
    
    //session binding
    io.use(function(socket, next) {
        applocals.sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.on('connection', function (socket) {
        // console.log("@@@@@@@ : " + util.inspect(socket.request.session,{depth:1}));
        socket.on('getListsByBoardIdx', function (data) {
            console.log("@@@@@@@ : " + util.inspect(data,{depth:1}));
        });
        socket.on('getListsByBoardId', function (boardId) {
            console.log("XXXX socket.request.session.oauth XXXX : " + util.inspect(socket.request.session.oauth,{depth:1}));
            console.log("YYYY  on getListByBoardId YYYY");
            console.log(applocals.appkey);
            console.log(socket.request.session.oauth.access_token);
            var t = new Trello(applocals.appkey, socket.request.session.oauth.access_token);
            
            var qrystr = applocals.queryByBoardIdStr.replace(/\$/, boardId);
            
            console.log("====  on getListByBoardId ====");
            console.log(qrystr);
            console.log(boardId);
            
            t.get(qrystr, function(err, listData) {
                if(err) {
                    console.log(err);
                    // socket.request.session.oauth = null;
                }
                socket.emit('ListsByBoardId', {
                    boardId: boardId,
                    listData: listData
                });
            });
        });
        
        socket.on('getCardsByListId', function (listId) {
            var t = new Trello(applocals.appkey, socket.request.session.oauth.access_token);
            var qrystr = applocals.queryByListIdStr.replace(/\$/, listId);
            t.get(qrystr, function(err, cardsData) {
                if(err) {
                    console.log(err);
                    // socket.request.session.oauth = null;
                }
                // console.log("@@@@@@@ : " + util.inspect(cardsData,{depth:1}));
                socket.emit('CardsByListId', {
                    listId: listId,
                    cardsData: cardsData
                });
            });
            
        });
    });
}

module.exports = AppSocketIo;