var socket = io.connect();

socket.on('ListsByBoardId', function(data){
    console.log('+++data : ' + data);
    docRoot[data.boardId] = data;
    lists[data.boardId] = data.listData;
    console.log(data);
    console.log(divs);
    var $div = divs[data.boardId]; 
    if($div){
        var $target = $div.next('.row').find('.list-group');
        var i;
        for(i in data.listData){
            var obj = data.listData[i];
            $target.append('<div class="list-group-item trello-list" data-key="'+ obj.id +'">' + obj.name +'</div>');
        }
    }
    // divs[data.boardId].find('ul').html('<li>777</li>');
});

socket.on('CardsByListId', function(data){
    console.log('XXXXXdata : ');
    console.log(data);
    // docRoot[data.boardId] = data;
    cards[data.listId] = data.cardsData;
    
    
    $displayDiv = $('#displayDiv');
    $displayDiv.empty();
    var i;
    for(i in data.cardsData){
        var obj = data.cardsData[i];
        
        $displayDiv.append('<div class="panel panel-default"><div class="panel-heading">' + obj.name 
        + '</div><div class="panel-body">'+ markdown.toHTML(obj.desc) +'</div></div>');
    }
    
    
    // var $div = divs[data.boardId]; 
    // if($div){
    //     var i;
    //     for(i in data.listData){
    //         $div.next('.row').find('.list-group').append('<div class="list-group-item trello-list" data-key="'+ data.listData[i].id +'">' + data.listData[i].name +'</div>');
    //     }
    // }
    // divs[data.boardId].find('ul').html('<li>777</li>');
});

var docRoot = {};
var divs = {};
var lists ={};
var cards ={};

$(function(){
    $('.trello-board').bind('click',function(){
        var $div = $(this);
        // console.log("A :" + $div.val());
        // console.log("B :" + $div.html());
        // console.log("C :" + $div.text());
        // console.log("D :" + $div.data('key'));
        
        var boardId = $div.data('key');
        console.log('---boardId : ' + boardId);
        if(!docRoot[boardId]) {
            socket.emit('getListsByBoardId', boardId);
        }
        if(!divs[boardId]){
            divs[boardId] = $div;
            //$div.find('ul').html('<li>123</li>');
            
        }
        $div.next('.row').find('.list-group').toggle();
        
    });
    
    $('.trello-list-group').delegate('div.trello-list','click',function(){
        console.log('.trello-list click ------------');
        var $div = $(this);
        console.log($div);
        var listId = $div.data('key');
        console.log(listId);
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
