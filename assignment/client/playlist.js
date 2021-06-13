'use strict';

var Playlist = {
  getMedias: function() {
    var url = new URL('https://api.wistia.com/v1/medias.json');
    url.searchParams.set('api_password', TOKEN);
    return axios.get(String(url));
  },

  renderMedia: function(media) {
    var template = document.getElementById('media-template');
    var clone = template.content.cloneNode(true);
    var el = clone.children[0];

    el.querySelector('.thumbnail').setAttribute('src', media.thumbnail.url);
    el.querySelector('.title').innerText = media.name;
    el.querySelector('.duration').innerText = Utils.formatTime(media.duration);
    el.querySelector('.media-content').setAttribute(
      'href',
      '#wistia_' + media.hashed_id
    );

    document.getElementById('medias').appendChild(el);
  }
};

(function() {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      Playlist.getMedias().then(function(response) {
        var medias = response.data;
        if (!medias) {
          return;
        }

        document
          .querySelector('.wistia_embed')
          .classList.add('wistia_async_' + medias[0].hashed_id);

          window._wq = window._wq || [];
          _wq.push({ 
            id: medias[0].hashed_id, 
            options: {
              autoPlay: true,
              // controlsVisibleOnLoad: false,
              // email: "lennythedog@wistia.com",
              // endVideoBehavior: "loop",
              // fullscreenButton: false,
              // googleAnalytics: true,
              // playButton: false,
              playerColor: "#fff",
              // seo: true,
              // stillUrl: "https://my-awesome-website.com/my-thumbnail-url.jpg",
              volume: 0,
              wmode: "transparent"
            },
            
            
            onReady: function(video) {
            console.log("I got a handle to the video!", video);
            video.bind("play", function() {
              var playAlertElem = document.createElement("div");
              playAlertElem.style.padding = "20px";
              playAlertElem.innerHTML = `You played the video! Its name is ${video.name()}.`;
              document.body.appendChild(playAlertElem);
              return video.unbind;
            });

      
            video.bind("secondchange", s => {
              // maybe add some interactive goodness to the page?
            });
        
            video.bind("end", () => {
              // cellll-e-brate good times COME ON! 🎉
              console.log("The video ended");
            });
            
          }});

        medias.forEach(function(media) {
          Playlist.renderMedia(media);
        });
      });
    },
    false
  );
})();
