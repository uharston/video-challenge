# Uriah's Video Challenge Submission

## Operation Specs 

The project was developed on macOS 11.3.1 ARM chip and Google Chrome Version 91.0.4472.106 (Official Build) (arm64). 

Node version: v14.17.1

Client side utilized plain HTML/CSS/Vanilla.js. 

Server side utilizes Nest.js, a Node.js framework, with Sequelize for an ORM connnecting to an MSSQL instance in a Docker container. You can use any SQL language. Just input the env variable at /assignment/server/src/app.module.ts. If using a different SQL language, you will have to install the relevant drivers. For more information see: (https://docs.nestjs.com/techniques/database#database)

## Client Side 

### Code Style 

Methods implemented to accomplish features are available through current and newly made Prototype objects. 

Here is an example of a send playing status method inside the existing Playlist object:

    var Playlist = {
        sendPlayingStatusToColumn: function(hashed_id, isPlaying) {
            const tag = document.getElementById(hashed_id)
            isPlaying ? tag.innerText = " - Playing" : isPlayingTag.innerHTML = ""
        }
    }

### Create a Playlist

I used the "_all" matcher from the Wistia Javascript Player API to tap into the event callbacks and utilize the appropiate player methods to create a uniform playlist experience. 

Embed links were leveraged to create a fluid playlist by setting playlistLinks=true to the first video.

    document
        .querySelector('.wistia_embed')
        .classList.add('wistia_async_' + medias[0].hashed_id, 'playlistLinks=auto');

Referring back the events driven behavior that the Wistia Javascript Player API support, I utilized the `'play'`, `'secondsChange'`, and `'end'` callbacks implement real time features. You will notice the features involve sending info to be displayed on the video column from various source, or retrieving info from the video column to display on the embed area. 

`Playlist.sendPlayingStatusToColumn(hashed_id: string, isPlaying: boolean)` is used to send is playing status to column. 

`Playlist.addCountDownBanner(nextVideo, currentVideo, second)` retrieves thumbnail and title information from column via `hashed_id `lookup available `video._playlist` object. 


## Server Side





