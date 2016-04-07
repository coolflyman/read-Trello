var socket = io.connect();
var docRoot = {};
var divs = {};
var lists ={};
var cards ={};

socket.on('ListsByBoardId', function(data){
    docRoot[data.boardId] = data;
    lists[data.boardId] = data.listData;
    var $div = divs[data.boardId]; 
    if($div){
        var $target = $div.next('.row').find('.list-group');
        var i;
        for(i in data.listData){
            var obj = data.listData[i];
            $target.append('<div class="list-group-item trello-list" data-key="'+ obj.id +'">' + obj.name +'</div>');
        }
    }
});

socket.on('CardsByListId', function(data){
    cards[data.listId] = data.cardsData;
    $displayDiv = $('#displayDiv');
    $displayDiv.empty();
    var i;
    for(i in data.cardsData){
        var obj = data.cardsData[i];
        $displayDiv.append('<div class="panel panel-default"><div class="panel-heading">' + obj.name 
        + '</div><div class="panel-body">'+ markdown.toHTML(obj.desc) +'</div></div>');
    }
    
});

$(function(){
    $('.trello-board').bind('click',function(){
        var $div = $(this);
        var boardId = $div.data('key');
        if(!docRoot[boardId]) {
            socket.emit('getListsByBoardId', boardId);
        }
        if(!divs[boardId]){
            divs[boardId] = $div;
        }
        $div.next('.row').find('.list-group').toggle();
        
    });
    
    $('.trello-list-group').delegate('div.trello-list','click',function(){
        var $div = $(this);
        var listId = $div.data('key');
        if(!cards[listId]) {
            socket.emit('getCardsByListId', listId);
        } else {
            $displayDiv = $('#displayDiv');
            $displayDiv.empty();
            var i;
            for(i in cards[listId]){
                var obj = cards[listId][i];
                
                $displayDiv.append('<div class="panel panel-default"><div class="panel-heading">' + obj.name 
                + '</div><div class="panel-body">'+ markdown.toHTML(obj.desc) +'</div></div>');
            }
        }
    });
});
