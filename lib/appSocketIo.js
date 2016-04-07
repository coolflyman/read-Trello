var socketIo = require('socket.io');
var cookieParser = require('cookie-parser');
var util = require('util');
var Trello = require("node-trello");
// var md = require("node-markdown").Markdown;


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
        socket.on('getListsByBoardId', function (boardId) {
            var t = new Trello(applocals.appkey, socket.request.session.oauth.access_token);
            
            var qrystr = applocals.queryByBoardIdStr.replace(/\$/, boardId);
            
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
                socket.emit('CardsByListId', {
                    listId: listId,
                    cardsData: cardsData
                });
            });
            
        });
    });
}

module.exports = AppSocketIo;