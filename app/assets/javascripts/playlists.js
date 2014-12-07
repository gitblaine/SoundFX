// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).on('page:change', function() {

  // Grab the container div
  var container = $('#soundcloud-results');
        
  // Remove any previous results
  container.empty();

  $("#hidden .url input").each(function(index) { 

      // Create a list item to hold our players
      var list_item = $('<li>').addClass('player-list-item');

      container.append(list_item);

      var link = $( this ).val();

      // Create our player and add it to the page
      addPlayer(list_item, link);

  }); // End callback function

});

function addPlayer(domEle, link) {

  //console.log("player added");
  ToneDen.player.create({
    dom: domEle,
    urls: [
      link
    ],
    //onTrackFinished: playNext(),
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

/*function playNext(){

  $('.player-list-item').


}*/


