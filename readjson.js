var Trello = require("node-trello");
var util = require('util');
var t = new Trello("a788a8642a5a25d1ad93d69280d9bcc5", "769a4c79373ce4ab0592513a5fde95e05a97869beecedf244a2a63a322262646");

t.get("1/boards/UWTvQoDs/lists", function(err, data) {
  if (err) throw err;
//   console.log(data);
    var key;
    for(key in data){
        console.log(key + ') ' + data[key]);
        
    }
    console.log(util.inspect(data[3]));
    
});


t.get("1/lists/53c34a3e439520900777caa7/cards", function(err, data) {
  if (err) throw err;
//   console.log(data);
    var key;
    for(key in data){
        console.log(key + ') ' + data[key]);
        
    }
    console.log(util.inspect(data[3]));
    
});
// URL arguments are passed in as an object.
// t.get("/1/members/me", { cards: "open" }, function(err, data) {
//   if (err) throw err;
//   console.log(data);
// });
