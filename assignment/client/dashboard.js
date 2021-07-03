'use strict';

var Server = { 
  seedMedias: async function(media) {
    const serverUrl = 'http://localhost:1234/media'
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios.post(serverUrl, media, config)
      .then( res => {
        console.log('res', res)
      })
      .catch( error => {
        console.log(JSON.stringify(error, null, 2));
      })
  },
  findAllMedia: async function() {
    const serverUrl = 'http://localhost:1234/media'
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const serverMedia = await axios.get(serverUrl, config)
      .then( res => {
        console.log('res', res.data)
        return res.data
      })
      .catch( error => {
        console.log(JSON.stringify(error, null, 2));
      })
      return serverMedia
  },

  toggleMedia: async function(event, active) { 
    const serverUrl = 'http://localhost:1234/media/toggle'
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = {
      hashed_id: event.target.parentNode.dataset.hashedId, 
      active: active
    }
    await axios.patch(serverUrl, body, config)
      .then( res => {
        console.log('res', res.data)
      })
      .catch( error => {
        console.log(JSON.stringify(error, null, 2));
      })

  }, 


}
var Dashboard = {
  getMedias: function() {
    var url = new URL('https://api.wistia.com/v1/medias.json');
    url.searchParams.set('api_password', TOKEN);
    return axios.get(String(url));
  },

  renderTag: function(mediaEl, tag) {
    var template = document.getElementById('tag-template');
    var clone = template.content.cloneNode(true);
    var tagEl = clone.children[0];

    tagEl.innerText = tag;
    mediaEl.querySelector('.tags').append(tagEl);
  },

  renderTags: function(mediaEl, tags) {
    tags.forEach(function(tag) {
      Dashboard.renderTag(mediaEl, tag);
    });
  },

  renderMedia: function(media, activeMedia, serverMedia) {
    var template = document.getElementById('media-template');
    var clone = template.content.cloneNode(true);
    var el = clone.children[0];

    el.querySelector('.thumbnail').setAttribute('src', media.thumbnail.url);
    el.querySelector('.title').innerText = media.name;
    el.querySelector('.duration').innerText = Utils.formatTime(media.duration);
    el.querySelector('.count').innerText = media.totalPlays;
    el.setAttribute('data-hashed-id', media.hashed_id);
    
    if (!media.active) {
      // set eye to inactive
      el.querySelector(".media--hidden").style.display = ''
      el.querySelector(".media--visible").style.display = 'none'
    }
  
    this.renderTags(el, ['tag-1', 'tag-2']);

    document.getElementById('medias').appendChild(el);
  },

  openModal: function() {
    document.querySelector('.modal').classList.add('modal--open');
  },

  closeModal: function() {
    document.querySelector('.modal').classList.remove('modal--open');
  },

  addTag: function() {
    var el = document.createElement('li');
    el.querySelector('.tags').appendChild(el);
  },

  toggleEye: function(event) {
    let isActive
    for (let index = 0; index < event.target.children.length; index++) {
      const svg = event.target.children[index];
      if (svg.style.display === "none") {
         svg.style.display = ""
         event.target.children[0].dataset === 'eye' ? isEye = false : isEye = true 
      } else {
        svg.style.display = "none"
        event.target.children[0].dataset === 'eye' ? isEye = true : isEye = false 
      } 
    }
    return isActive
  },

};

(function() {
  document.addEventListener(
    'DOMContentLoaded',
    async function() {
      const serverMedias = await Server.findAllMedia()
      Dashboard.getMedias().then(function(response) {
        response.data.map(function(media) {
          // Server.seedMedias(media)
          const serverMedia = serverMedias.find( m => m.hashed_id === media.hashed_id)
          const combinedMediaInfo = {...media, totalPlays: serverMedia.totalPlays, active: serverMedia.active }
      
          Dashboard.renderMedia(combinedMediaInfo);
        });
      });
    },
    { useCapture: false }
  );

  document.addEventListener(
    'click',
    function(event) {
      if (event && event.target.matches('.visibility-toggle')) {
        /* toggle visibility */
        const isActive = Dashboard.toggleEye(event)
        Server.toggleMedia(event, isActive)
      }

      if (event && event.target.matches('.tag-button')) {
        Dashboard.openModal();
      }

      if (event && event.target.matches('.modal__button--close')) {
        Dashboard.closeModal();
      }
    },
    { useCapture: true }
  );
})();
