var show_bg, rotate_bg, show_title, show_artist, show_album, rotate_speed;

function updateSettings() {
  show_bg = $("#menu-show-bg").prop("checked");
  rotate_bg = $("#menu-rotate-bg").prop("checked");
  rotate_speed = $("#menu-text-speed").val();
  show_title = $("#menu-show-title").prop("checked");
  show_artist = $("#menu-show-artist").prop("checked");
  show_album = $("#menu-show-album").prop("checked");
  
  rotate_bg ? $("#menu-text-speed").animate({opacity: "show"}) : $("#menu-text-speed").animate({opacity: "hide"});
};

$(document).ready(function () {
  var idleMouseTimer;
  var forceMouseHide = false;

  $("body").css('cursor', 'none');

  $("body").mousemove(function(ev) {
          if(!forceMouseHide) {
                  $("body").css('cursor', '');

                  clearTimeout(idleMouseTimer);

                  idleMouseTimer = setTimeout(function() {
                          $("body").css('cursor', 'none');

                          forceMouseHide = true;
                          setTimeout(function() {
                                  forceMouseHide = false;
                          }, 200);
                  }, 1000);
          }
  });
  
  $(":input").click(updateSettings);
  
  updateSettings();
});

$(document).keydown(function (keyEvent) {
  if (keyEvent.keyCode == 77) {
    $("#js-menu-container").animate({width: "toggle", opacity: "toggle"});
  };
});

var ListenWithMe = (function() {

  // Add your own config here
  var LASTFM_API_KEY = "27c99cb8d57854d6853f054e70fe94d6";
  var LASTFM_USERNAME = "itchy1337";

  // Elements

  var currentSong = {};
  var REFRESH_INTERVAL = 1000;
  var refreshTimer = null;

  return {
    init: init
  }

  function init() {
    getCurrentTrack().then(function(data) {
      //console.log(data['@attr'])
      try {
        currentSong.nowPlaying = data['@attr'].nowplaying;
      } catch(err) {
        console.log(err);
      }

      currentSong.track = data.name;
      currentSong.artist = data.artist['#text'];
      currentSong.album = data.album['#text'];
      currentSong.image = data.image[3]['#text'];
      updateTitle();
      updateInfo();

    })

    if(!refreshTimer) {
      refreshTimer = setInterval(refresh, REFRESH_INTERVAL)
    }
  }

  function refresh() {
    console.log("ping");
    getCurrentTrack().then(function(data) {
      //if(currentSong.track !== data.name && currentSong.track !== data.artist['#text']) {
      if(currentSong.track !== data.name) {
        // kinda lazy
        init();
      }
      updateInfo();
    })
  }

  // Make a call to Last FM to get your latest played tracks;
  function getCurrentTrack() {
    var url = "//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=" + LASTFM_USERNAME + "&api_key=" + LASTFM_API_KEY + "&format=json";

    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200) {
          var data = JSON.parse(req.response);
          try {
            resolve(data.recenttracks.track[0]);
          } catch(err) {
            reject(err);
          }
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    })
  }

  function updateTitle() {
    if (currentSong.nowPlaying) {
      document.title = "▷ " + currentSong.track + " by " + currentSong.artist;
    } else {
      document.title = currentSong.track + " by " + currentSong.artist;
    }
  }

  function updateInfo() {
    $(".track-artwork--image").attr("src", currentSong.image.replace('/300x300', ''));
    
    show_title ? $(".track-info--title").show().text(currentSong.track) : $(".track-info--title").hide();
    show_artist ? $(".track-info--artist").show().text(currentSong.artist) : $(".track-info--artist").hide();
    show_album ? $(".track-info--album").show().text(currentSong.album) : $(".track-info--album").hide();
    
    if (show_bg) {
      $(".background").css("background-image", "url("+currentSong.image.replace('/300x300', '')+")");
    } else {
      $(".background").css("background-image", "")
    }
    
    if (rotate_bg) {
      var width = $(window).width();
      var height = $(window).height();
      var diagonal = Math.sqrt(width * width + height * height);
      var factor = -1.0 * (diagonal / height - 1.0) / 2.0 * 100.0;
      $(".background").css("background-size", "contain").css("left", factor+"%").css("right", factor+"%").css("top", factor+"%").css("bottom", factor+"%");
      $(".background").css("-webkit-animation-duration", rotate_speed+"s").css("-moz-animation-duration", rotate_speed+"s").css("-ms-animation-duration", rotate_speed+"s").css("-o-animation-duration", rotate_speed+"s").css("animation-duration", rotate_speed+"s");
    } else {
      $(".background").css("background-size", "cover").css("left", "0%").css("right", "0%").css("top", "0%").css("bottom", "0%");
      $(".background").css("-webkit-animation-duration", "0s").css("-moz-animation-duration", "0s").css("-ms-animation-duration", "0s").css("-o-animation-duration", "0s").css("animation-duration", "0s");
    }
  }

})();

ListenWithMe.init();
