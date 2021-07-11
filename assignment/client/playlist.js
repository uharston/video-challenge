'use strict';


var Server = {
  updatePlayCount: async function(hashed_id) {
    const serverUrl = 'http://localhost:1234/media/total-plays'
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = { hashed_id: hashed_id }
    const response = await axios.patch(serverUrl, body, config)
      .then( res => {
        console.log('res', res)
      })
      .catch( error => {
        console.log(JSON.stringify(error, null, 2));
      })
    return response
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
}
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
    el.querySelector('.title').setAttribute('id', 'title-' + media.hashed_id);
    el.querySelector('.duration').innerText = Utils.formatTime(media.duration);
    el.querySelector('.media-content').setAttribute(
      'href',
      '#wistia_' + media.hashed_id 
      // + '?transitionTime=5000'
    );

    document.getElementById('medias').appendChild(el);
  }, 

  sendPlayingStatusToColumn: function(hashed_id, isPlaying) {
    const allIsPlayingTags = document.getElementsByClassName('isPlaying') 
    for (const tag of allIsPlayingTags) {
      if (tag.id === hashed_id) {
        tag.innerText = " - Playing"
      } else {
        tag.innerText = ""
      }
    }
  }, 

  addCountDownBanner: function(nextVideo, currentVideo, second) {
    console.log('finishing')
    if (second === Math.floor(currentVideo.duration())) { 
      const nextThumbnail = document.getElementById('thumbnail-' + nextVideo.hashedId)  
      const nextTitle = document.getElementById('title-' + nextVideo.hashedId)
  
      const endContainer = document.getElementById('video_end')
      const endTimer = document.getElementById('timer')   
      const endThumbnail = document.getElementById('playlist-image')
      const endTitle = document.getElementById("end_title")

      currentVideo.pause()
      let interval = setInterval(() => endTimer.innerText = count--, 1000)
      endContainer.style.display = 'flex'
      endTitle.innerText = nextTitle.innerText
      endThumbnail.src = nextThumbnail.src
      let count = 4
      setTimeout(() => {
        endContainer.style.display = 'none'
        endThumbnail.src = ''
        endTimer.innerText = 5
        clearInterval(interval)
        currentVideo.play()
      }, 5000)
    };
  }


};

(function() {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      Playlist.getMedias().then(async function(response) {
        var medias = await Server.filterActiveMedia(response.data)
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
              playerColor: "#fff",
              volume: 0,
              wmode: "transparent"
            },
            
            
            onReady: function(video) {
            console.log("I got a handle to the video!", video.name());
            video.bind("play", function() {

              Playlist.sendPlayingStatusToColumn(video.hashedId())

              var playAlertElem = document.createElement("div");
              playAlertElem.style.padding = "20px";
              playAlertElem.innerHTML = `You played the video! Its name is ${video.name()}.`;
              document.body.appendChild(playAlertElem);
              return video.unbind;
            });

      
            video.bind("secondchange", s => {

              const nextVideo = video._playlist[video._playlistIndex + 1]

              if (nextVideo) Playlist.addCountDownBanner(nextVideo, video, s)

            });
        
            video.bind("end", async () => {

              const hashed_id = video.hashedId()

              await Server.updatePlayCount(hashed_id)

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
