var app = new Vue({
  el: '#app',
  data: {
    title: "Spotify Cover Art Search",
    client_id: "11dbb424a8c74af8962cba30e3b8edb2",
  },
  created: function () {
    var vm = this;
    
    const width = 450;
    const height = 730;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;
    const w = window.open(
      'https://accounts.spotify.com/authorize?' +
        'client_id=11dbb424a8c74af8962cba30e3b8edb2' +
        '&redirect_uri=http://127.0.0.1:5500/index.html' +
        '&scope=user-read-private' +
        '&response_type=token' +
        '&state=123'
      ,
      'Spotify',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
        width +
        ', height=' +
        height +
        ', top=' +
        top +
        ', left=' +
        left
    );
    
  }
})