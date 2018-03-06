var ListenWithMe = (function() {

  // Add your own config here
  var LASTFM_API_KEY = "27c99cb8d57854d6853f054e70fe94d6";
  var LASTFM_USERNAME = "itchy1337";

  // Elements
  var $trackTitle = document.getElementsByClassName('track-info--title')[0]
  var $trackArtist = document.getElementsByClassName('track-info--artist')[0]
  var $trackAlbum = document.getElementsByClassName('track-info--album')[0]
  var $trackImage = document.getElementsByClassName('track-artwork--image')[0]

  var currentSong = {};
  var REFRESH_INTERVAL = 10000;
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

    }).then(function(data) {
      console.log(data)
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

  // Make a call to Last FM to get album info;
  function getAlbumInfo() {
    var url = "//ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=" + LASTFM_API_KEY + "&artist=" + currentSong.artist + "&album=" + currentSong.album + "&format=json";

    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200) {
          var data = JSON.parse(req.response);
          try {
            resolve(data.tracks);
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
    $trackTitle.innerHTML = currentSong.track;
    $trackArtist.innerHTML = currentSong.artist;
    $trackAlbum.innerHTML = currentSong.album;
    $trackImage.src = currentSong.image.replace('/300x300', '');
  }

})();

ListenWithMe.init();
