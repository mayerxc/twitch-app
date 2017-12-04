//have to use the go through api instead of twitch's API
var baseUrl = "https://wind-bow.gomix.me/twitch-api/";
var users = [
  "freecodecamp",
  "ESL_SC2",
  "OgamingSC2",
  "cretetion",
  "storbeck",
  "habathcx",
  "RobotCaleb",
  "noobs2ninjas",
  "comster404",
  "brunofin"
];
var channels = baseUrl + "channels/";
var streams = baseUrl + "streams/";
var callback = "?callback=?"; //&client_id=gr7u224uc5zfyvaufcfdnoqfz3chfve"
var status; //what it says about their game
var game; //what game they are playing
var logoUrl;
var name; //the name that comes back in JSON
var channelUrl;
var missingLogo = 'https://res.cloudinary.com/mayerxc/image/upload/v1470519076/non-user-missing-person_iv6rnr.png'


function getApis(user) {
  $.getJSON(streams + user + callback, function(data) {
    //console.log(data);
    if (data.stream === null) {
      //do something with null
      channelUrl = baseUrl + "channels/" + user;
      status = "Offline";
      console.log("stream is null: " + channelUrl);
      offline(channelUrl, user);
    } else if (data.stream === undefined) {
      //this doesn't work anymore after they changed the API
      channelUrl = baseUrl + "/channels/" + user;
      status = data.message;
      name = user;
      console.log("stream is closed: " + channelUrl + "message is: " + status);
      accountClosed(name);
    } else {
      //end else if
      status = data.status;
      game = data.stream.game;
      logo = data.stream.channel.logo;
      name = data.stream.channel.name;
      channelUrl = data.stream.channel.url;
      console.log("Online url is: " + channelUrl);
      online(name, logo, game, channelUrl);
    } //end else
  }); //getJSON end for streams
} //end getApis function

function online(currentUser, currentLogo, currentGame, currentUrl) {
  $(".online").append(
    '<tr><td class="short"><img src="' +
      currentLogo +
      '"> </td><td><a href="' +
      currentUrl +
      '" target="blank">' +
      currentUser +
      "</a> is currently streaming " +
      currentGame +
      ".</td></tr>"
  );
}


function offline(currentChannelUrl, currentUser) {
  $.getJSON(currentChannelUrl + callback, function(data2) {
    //check to see if the account is closed
    if (data2.status === 404) {
      accountClosed(currentUser);
    } else {
      name = data2.name;
      
      //some users don't have a logo so use ternary
      logo = data2.logo === null ? missingLogo : data2.logo;
      channelUrl = data2.url;
      console.log("Offline channel name: " + name);
      $("table.offline").append(
        '<tr><td class="short offline"><img src="' +
          logo +
          '"> </td><td class="offline"><a class="offline" href="' +
          channelUrl +
          '" target="blank">' +
          name +
          "</a> is currently offline. </td></tr>"
      );
    }
  }); //end getJSON for channel
}

function accountClosed(currentName) {
  $(".unavailable").append(
    "<tr><td class='short'><img src='https://res.cloudinary.com/mayerxc/image/upload/v1470519076/non-user-missing-person_iv6rnr.png'></td><td> Channel " +
      currentName +
      " account has closed.</td></tr>"
  );
}

$(document).ready(function() {
  for (var i = 0; i < users.length; i++) {
    //go through all the users and see if they are online, offline or don't have a channel anymore
    getApis(users[i]);
  } //end for loop
}); //end doc ready