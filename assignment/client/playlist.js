'use strict';

var Playlist = {
  getMedias: function() {
    var url = new URL('https://api.wistia.com/v1/medias.json');
    url.searchParams.set('api_password', TOKEN);
    return axios.get(String(url));
  },

  renderMedia: function(media, key) {
    
    var template = document.getElementById('media-template');
    var clone = template.content.cloneNode(true);
    var el = clone.children[0];

    el.querySelector('.isPlaying').setAttribute('id', media.hashed_id)
    el.querySelector('.thumbnail').setAttribute('src', media.thumbnail.url);
    el.querySelector('.thumbnail').setAttribute('id', 'thumbnail-' + media.hashed_id);
    el.querySelector('.title').innerText = media.name;
    el.querySelector('.duration').innerText = Utils.formatTime(media.duration);
    el.querySelector('.media-content').setAttribute(
      'href',
      '#wistia_' + media.hashed_id 
      // + '?transitionTime=5000'
    );

    document.getElementById('medias').appendChild(el);
  }, 

  filterActiveMedia: async function(medias) {
    const serverUrl = 'http://localhost:1234/media/active'
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const activeMedia = await axios.get(serverUrl, config)
      .then( res => {
        console.log('res', res.data)
        return res.data
      })
      .catch( error => {
        console.log(JSON.stringify(error, null, 2));
      })
      return medias.filter( media => activeMedia.includes(media.hashed_id) )
  }
};

(function() {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      Playlist.getMedias().then(async function(response) {
        var medias = await Playlist.filterActiveMedia(response.data)
        if (!medias.length) {
          return;
        }

        document
          .querySelector('.wistia_embed')
          .classList.add('wistia_async_' + medias[0].hashed_id, 'playlistLinks=auto');
          

          window._wq = window._wq || [];

          _wq.push({ 
            id: "_all", 
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
              volume: 1,
              wmode: "transparent"
            },
            
            
            onReady: function(video) {

              // medias.forEach((media , i)=> {
              //   if (i !==0) {
              //     video.addToPlaylist(media.hashed_id, {
              //       playerColor: "00ff00"
              //     });
              //   } 
              // })
            console.log("I got a handle to the video!", video.name());
            video.bind("play", function() {
              const isPlayingTag = document.getElementById(video.hashedId())
              isPlayingTag.innerText = " - Playing"

             
              
              var playAlertElem = document.createElement("div");
              playAlertElem.style.padding = "20px";
              playAlertElem.innerHTML = `You played the video! Its name is ${video.name()}.`;
              document.body.appendChild(playAlertElem);
              return video.unbind;
            });

      
            video.bind("secondchange", s => {
              const timer = document.getElementById('timer')   
              const thumbnail = document.getElementById('thumbnail-' + video.hashedId())  
              const image = document.getElementById('playlist-image')
              
             
              if (s === Math.floor(video.duration())) {
                
                console.log('finishing')
                video.pause()
                image.src = thumbnail.src
                let count = 5 
                let interval = setInterval(() => timer.innerText = count--, 1000)
                setTimeout(() => {
                  image.src = ''
                  timer.innerText = ''
                  clearInterval(interval)
                  video.play()
                }, 5000)
              }
              // maybe add some interactive goodness to the page?
            });
        
            video.bind("end", () => {
              const isPlayingTag = document.getElementById(video.hashedId())
              isPlayingTag.innerHTML = ""

              // cellll-e-brate good times COME ON! 🎉
              console.log("The video ended");
            });
            
          }});

     
         

        medias.forEach(function(media, key) {
          Playlist.renderMedia(media, key);
        });
      });
    },
    false
  );
})();
