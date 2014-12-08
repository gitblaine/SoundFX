$.ajaxSetup({ headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') } });
  
$(document).on('page:change', function() {
  // Set up the validation by attaching a click handler to our form 
  // This defines a function that will run when the button is clicked

  $('form.new_song input#submit, form.edit_song input#submit').click(function() {
    // Check if the form is valid
    var valid = doValidation();
    return valid;
  });

  var playlistID = $("#hidden .playlist_id input").val();

  if(window.location.pathname == '/playlists/' + playlistID + '/songs/new') {

    // Grab the container div
    var emptycontainer = $('#soundcloud-results');
          
    // Remove any previous results
    emptycontainer.empty();

    $('#soundcloud-search-btn').click(function(){

    //console.log('soundcloud search clicked');
    var query = $('#soundcloud-search').val();

    // Call our API using the SDK
    SC.get("/tracks", 
        { q: query, limit: 5 }, 
        function(tracks) {

          // Grab the container div
          var container = $('#soundcloud-results');
          
          // Remove any previous results
          container.empty();
          
          // Loop through our track objects
          for (var i = 0; i < tracks.length; i ++) {
            
            // Create a list item to hold our players
            var list_item = $('<li>').addClass('player-list-item');

            // Set the data attribute so we can retrieve the track later
            list_item.data('track-id', tracks[i].id)
            list_item.data('track-permalink', tracks[i].permalink_url)
            list_item.data('track-title', tracks[i].title)
            list_item.data('track-user', tracks[i].user.username)
            list_item.data('track-album', tracks[i].label_name)
            list_item.data('track-duration', tracks[i].duration)
            list_item.data('track-genre', tracks[i].genre)

            container.append(list_item);
            
            // Create our player and add it to the page
            addPlayer(list_item, tracks[i]);

          }; // End for loop
        } // End callback function
      ); // End SC.get call
    });
  };

  function doValidation() {

    // If the form is valid, return true
    // Otherwise return false
    // We can get all the inputs in the form by doing the following:
    // $('input')
    // And loop through them using an each loop (http://api.jquery.com/each/)
    //console.log("send to func");

    var check = true;
    $(".required_field > input").each(function(index){

      //console.log(index);

      if($(this).val() == ""){
        check = false;
        var selector = $(this).attr("id");

        var checker = $("label[for=" + selector + "] strong");

        if(checker.length === 0){
          $("label[for=" + selector + "]").append( "<strong> *Required Field</strong>");
        };
      };

    });

    return check;
  };

  // Create and add a streamable player (using ToneDen)
  function addPlayer(domEle, track) {

    ToneDen.player.create({
      dom: domEle,
      single: true,
      mini: true,
      urls: [
        track.permalink_url
      ],
    });

    // This is a bit hacky, but ToneDen doesn't give us a DOMReady event
    // And the trackReady event doesn't fire if the track fails to load
    var interval = setInterval(function() {
      var playlist_link = $('.follow-link', domEle);
      if (playlist_link.length === 0) {
        return;
      }
      else {
        clearInterval(interval);
      }
      // Hijack the "follow" link to use our playlist functionality instead
      playlist_link.text('ADD TO PLAYLIST').attr('href', 'javascript:;').attr('target', '');

      // Make sure the playlist link takes up the full available space
      playlist_link.parent().removeClass('tdlarge-6').addClass('tdlarge-12');


      // Add our own event handler (and remove the default one)
      playlist_link.off('click').click(addToPlaylist);
    }, 200);
  }

  var songID = $("#hidden .song_id input").val();

  if(window.location.pathname == '/playlists/' + playlistID + '/songs/' + songID) {

    // Grab the container div
    var container = $('#song-player');

    container.append(container);

    //console.log(document.getElementById("url").value);
    // Create our player and add it to the page
    addSongPlayer(container, document.getElementById("url").value);

    function addSongPlayer(domEle, link) {

      //console.log("player added");
      ToneDen.player.create({
        dom: domEle,
        single: true,
        mini: true,
        urls: [
          link
        ],
      });

      // This is a bit hacky, but ToneDen doesn't give us a DOMReady event
      // And the trackReady event doesn't fire if the track fails to load
      var interval = setInterval(function() {
        var playlist_link = $('.follow-link', domEle);
        if (playlist_link.length === 0) {
          return;
        }
        else {
          clearInterval(interval);
        }
        // Hijack the "follow" link to use our playlist functionality instead
        //playlist_link.text('ADD TO PLAYLIST').attr('href', 'javascript:;').attr('target', '');

        // Make sure the playlist link takes up the full available space
        playlist_link.parent().removeClass('tdlarge-6').addClass('tdlarge-12');


        // Add our own event handler (and remove the default one)
        //playlist_link.off('click').click(addToPlaylist);
      }, 200);
    }
  };

  // These are the things you need:  an API key, the track ID, and the path to the track
    var apiKey = 'A41YIDYMISIIKLHJI';
    var trackID = 'THE_TRACK_ID';
    var trackURL = 'audio/THE_AUDIO_FILE.mp3'

    // Set up the key variables
    var remixer;
    var player;
    var track;
    var remixed;

    // The main function.
    function init() {

    // Make sure the browser supports Web Audio.
    if (window.webkitAudioContext === undefined) {
        error("Sorry, this app needs advanced web audio. Your browser doesn't"
            + " support it. Try the latest version of Chrome");
    } else {
        
        // These set up the WebAudio playback environment, and create the remixer and player.
        var context = new webkitAudioContext();
        remixer = createJRemixer(context, $, apiKey);
        player = remixer.getPlayer();
        $("#info").text("Loading analysis data...");

        // The key line.  This prepares the track for remixing:  it gets
        // data from the Echo Nest analyze API and connects it with the audio file.
        // All the remixing takes place in the callback function.
        remixer.remixTrackById(trackID, trackURL, function(t, percent) {
            track = t;

            // Keep the user update with load times
            $("#info").text(percent + "% of the track loaded");
            if (percent == 100) {
                $("#info").text(percent + "% of the track loaded, remixing...");
            }

            // Do the remixing!
            if (track.status == 'ok') {
                // This array holds the chunks of audio that we're going to play back
                remixed = new Array();

                // This loops over each beat in the track.
                // If the index of the beat is a multiple of four, we append the beat to the playback array.
                for (var i=0; i < track.analysis.beats.length; i++) {
                    if (i % 4 == 0) {
                        remixed.push(track.analysis.beats[i])
                    }
                }
                $("#info").text("Remix complete!");
            }
        });
    }
}

  function addToPlaylist(event) {
    var tgt = $(event.target);
    var parent = tgt.parents('.player-list-item');
    var trackId = parent.data('track-id');
    console.log("Clicked track ID is " + trackId);

    var playlist_id = $('#hidden .playlist_id').val();
    var url = '/playlists/' + playlist_id + '/songs';

    SC.get('/tracks/' + trackId, {}, function(track) {
      // Create our data payload. Start by just using the track object we got back from the soundcloud API
      // as it's already in JSON format.
      var data = track;

      // Set the soundcloud_id based on the id of the track
      data.soundcloud_id = track.id;
      // Set the artist attribute from the user that uploaded the track
      data.artist = track.user.username;
      data.album = track.label_name;
      data.soundcloud_permalink = track.permalink_url;
      
      data.duration = millisToMinutesAndSeconds(track.duration);
      console.log(data.duration);
      data.genre = track.genre;

      
      // Replace the results with a loading message
      $('#soundcloud-results').html('Adding to playlist...')
      
      var send = $.ajax({
        type: 'POST',
        url: url,
        data: {song: data},
        dataType: 'json',
        error: playlistAddError(XMLHttpRequest.status, XMLHttpRequest.statusText),
        success: playlistAddSuccess(data)
      })

    });

  };

  function playlistAddSuccess(response_data) {
    //console.log(response_data);
    $('#soundcloud-results').html(
      '<div data-alert class="alert-box success radius">' +
        'Track ' + response_data.title + ' succesfully added to the playlist' + 
        '<a href="#" class="close">&times;</a>' +
      '</div>'
    )
  };

  function playlistAddError(response, errors) {
    //console.log(errors);
    $('#soundcloud-results').html(
      '<div data-alert class="alert-box alert radius">' + 
        'There were some errors adding the track:' + errors +
        '<a href="#" class="close">&times;</a>' +
      '</div>'
    );
  };

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  };

});