var app = {};

app.server = "https://api.parse.com/1/classes/chatterbox";

app.init = function(){
  this.friends = {};
};

app.send = function(message){
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  })
};

app.clearMessages = function(){
  $("#chats").remove();
};

app.addMessage = function(msg){
  this.send(msg);
  this.fetch();
}

app._displayRoomNames = function(roomNames, roomName) {
  $("#rooms").empty();
  var $rooms = $("#rooms");
  _.each(roomNames,function(room){
    if (room === roomName){
      $rooms.append($("<option selected>" + room + "</option>"));
    }else{
      $rooms.append($("<option>" + room + "</option>"));
    }
  });
};

app._displayMessages = function(messages, roomName) {
  app.clearMessages();
  var $chats = $("<div id='chats'></div>");
  $("#main").append($chats);

  //var roomName = app._findSelectedRoom();

  _.each(messages,function(msg){
    if (!roomName || msg.roomname === roomName){
      var $msg = $("<div class='message'></div>");
      var $username = $("<div class='username'>" + msg.username + "</div>");
      var $roomname = $("<div class='roomname'> room name: " + msg.roomname + "</div>");
      //var $createdAt = $("<div class='created-at'> created at: " + msg.createdAt+ "</div>");
      //var $updatedAt = $("<div class='updated-at'> updated at: " + msg.updatedAt+ "</div>");
      if (app.friends[msg.username]) {
        var $text = $("<div class='msg-body friend-msg-body'>" + msg.text + "</div>");
      } else {
        var $text = $("<div class='msg-body'>" + msg.text + "</div>");
      }
      
      //$msg.append($username).append($roomname).append($createdAt).append($updatedAt).append($text);
      

      $msg.append($username).append($roomname).append($text);
      $chats.append($msg);
    }
  });
  $('.username').on("click", function(e) {
    app.friends[$(this).text()] = true;
  });
};

app._findSelectedRoom = function(){
  var $rooms = $("#rooms");
  var roomName = $rooms[0].selectedIndex ? $rooms[0].options[$rooms[0].selectedIndex].text : undefined;
  console.log(roomName);
  return roomName;
}

app.fetch = function(roomName) {
  $.ajax({
    url: this.server,
    type: 'GET',
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    success: function (data) {
      var sanitizedMessages = sanitizeMessages(data.results);
      // var sanitizedMessages = data.results;
      var roomNames = app._getRoomNames(sanitizedMessages);
      app._displayRoomNames(roomNames, roomName);
      app._displayMessages(sanitizedMessages, roomName);
    },
    error: function (data) {
      console.error('chatterbox: Failed to fetch messages');
    }
  });
};

app.refresh = function() {
  app.clearMessages();
  var roomName = app._findSelectedRoom();
  app.fetch(roomName);
};

app._getRoomNames = function(messages){
  var roomNames = {};
  _.each(messages,function(msg){
    roomNames[msg.roomname] = true;
  });
  return Object.keys(roomNames);
};

$(document).ready(function(){

  $("#refresh").on("click",app.refresh);

  $('#message-form').submit(function() {
    var $inputs = $('#message-form :input');

    var message = {};
    $inputs.each(function() {
      message[this.name] = $(this).val();
    });

    app.addMessage(message);
  });

  app.init();
  app.fetch();



  // setInterval(function() {
  //   console.log("Printing selected room: "+app._findSelectedRoom());
  // },1000);

});

var sanitize = function(input) {
  var output = "";
  if (input) {
    output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
         replace(/<[\/\!]*?[^<>]*?>/gi, '').
         replace(/<style[^>]*?>.*?<\/style>/gi, '').
         replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
  }
  return output;
};

var sanitizeMessages = function(messages){
  var sanitizedMessages = _.map(messages, function(msg) {
    var sanitizedMsg = {};
    for (var key in msg) {
      sanitizedMsg[key] = sanitize(msg[key]);
    }
    return sanitizedMsg;
  });
  return sanitizedMessages;
};