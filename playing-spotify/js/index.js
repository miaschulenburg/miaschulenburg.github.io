var spotifyPlayer = new SpotifyPlayer();

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

$(document).ready(function () {
  $("#js-btn-login").click(function () {
    spotifyPlayer.login();
  });
});

var show_bg = true;
$(document).keydown(function (keyEvent) {
  if (keyEvent.keyCode == 66) {
    show_bg = !show_bg;
  };
});

$(document).keydown(function (keyEvent) {
  if(keyEvent.keyCode == 76){
    spotifyPlayer.logout();
  };
});

spotifyPlayer.on('update', response => {
  $(".now-playing__img").html("<img src="+response.item.album.images[0].url+">");
  $(".now-playing__name").text(response.item.name);
  $(".now-playing__artist").text(response.item.artists[0].name);
  $(".now_playing__album").text(response.item.album.name);
  var symbol = response.is_playing ? '► ' : '❙❙ ';
  $(".now-playing__status").text(symbol + millisToMinutesAndSeconds(response.item.duration_ms));
  $(".progress__bar").css("width", response.progress_ms * 100 / response.item.duration_ms+"%");
  //$(".background").css("style", "background-image:url("+response.item.album.images[0].url+")");
  
  if(show_bg) {
    $(".background").html("<img src="+response.item.album.images[0].url+">");
  } else {
    $(".background").html("");
  }
});

spotifyPlayer.on('login', user => {
  if (user === null) {
    $("#js-login-container").css("display", "block");
    $("#js-main-container").css("display", "none");
  } else {
    $("#js-login-container").css("display", "none");
    $("#js-main-container").css("display", "block");
  }
});

spotifyPlayer.init();