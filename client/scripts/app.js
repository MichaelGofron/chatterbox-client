// YOUR CODE HERE:
var app = {};
app.init = function(){

};
app.send = function(msg){
  $.ajax({
    type: "POST",
    url: "https://api.parse.com/1/classes/chatterbox",
    data: JSON.stringify(msg),
    contentType: "application/json",
    success:function(data){
      console.log("Message sent!");
    },
    error: function(data){
      console.error("Message not sent..");
    }
  });
};
app.fetch = function(){
  $.ajax({
    type: "GET",
    url: "https://api.parse.com/1/classes/chatterbox",
    success: function(data){
      return JSON.Parse(data);
    }
  });
}
$(document).ready(function(){
  $("#refresh").on("click",function(){
    $.ajax("https://api.parse.com/1/classes/chatterbox",{
      success: function(response){
        console.log(response.results);
      }
    });
  });
});