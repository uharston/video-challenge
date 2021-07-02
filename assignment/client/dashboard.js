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

  renderMedia: function(media) {
    var template = document.getElementById('media-template');
    var clone = template.content.cloneNode(true);
    var el = clone.children[0];

    el.querySelector('.thumbnail').setAttribute('src', media.thumbnail.url);
    el.querySelector('.title').innerText = media.name;
    el.querySelector('.duration').innerText = Utils.formatTime(media.duration);
    el.querySelector('.count').innerText = '?';
    el.setAttribute('data-hashed-id', media.hashed_id);

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
    let isEye
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
    console.log(isEye)
    return isEye
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
    await axios.post(serverUrl, body, config)
      .then( res => {
        console.log('res', res.data)
      })
      .catch( error => {
        console.log(JSON.stringify(error, null, 2));
      })

  }
};

(function() {
  document.addEventListener(
    'DOMContentLoaded',
    function() {
      Dashboard.getMedias().then(function(response) {
        response.data.map(function(media) {
          // Server.seedMedias(media)
          Dashboard.renderMedia(media);
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
        const isEye = Dashboard.toggleEye(event)
        Dashboard.toggleMedia(event, isEye)
        // toggle button slash 
        // update db 
          // grab hashed_id
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
