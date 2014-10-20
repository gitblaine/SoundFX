$(document).on('page:change', function(evt) {
  
  // Set up the validation by attaching a click handler to our form 
  // This defines a function that will run when the button is clicked

  // Hook up soundcloud search
  $('#soundcloud-search-btn').click(function() {
    console.log('soundcloud search clicked');
  });

  $('form.new_song input#submit, form.edit_song input#submit').click(function() {

    // Check if the form is valid
    
    var valid = doValidation();
    return valid;

  });

  $('#soundcloud-search-btn').click(function(){

  console.log('soundcloud search clicked');
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
      for (var i=0; i<tracks.length; i++) {
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

      } // End for loop
    } // End callback function
  ); // End SC.get call

});

/** TODO: Fill in these functions **/
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
      }
    }

  });

  return check;
}

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


// Click handlers take one parameter: the event object
  function addToPlaylist(event) {

    var tgt = $(event.target);
    var parent = tgt.parents('.player-list-item');
    var trackId = parent.data('track-id')
    var trackPermalink = parent.data('track-permalink')
    var trackTitle = parent.data('track-title')
    var trackUser = parent.data('track-user')
    var trackAlbum = parent.data('track-album')
    var trackDur = parent.data('track-duration')
    var trackGenre = parent.data('track-genre')

    //$("div.row ul li.player-list-item[target!=tgt]").hide();
    $(".player-list-item").hide();

    // here is what I want to do
    $(parent).show();

    //$('input').each.val("");

    $("#song_title").val(trackTitle);
    $("#song_soundcloud_id").val(trackId);
    $("#song_soundcloud_permalink").val(trackPermalink);
    $("#song_artist").val(JSON.stringify(trackUser));
    $("#song_album").val(trackAlbum);
    $("#song_time").val(trackDur);
    $("#song_genre").val(trackGenre);

    // For simplicity sake, we can only add a single song at a time to the playlist for now
    // The goal of this function is to auto-populate the form on the page with the values
    // From the selected track (i.e. artist, genre, duration, title, etc)
    // I would recommend clearing out our current search results 
    // (or all of the list items that aren't the clicked one)
  };
});

