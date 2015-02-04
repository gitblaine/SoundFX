// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).on('page:change', function() {

  var playlistID = $("#hidden .playlist_id input").val();

  var shuffleCheck = 0;

/*  if(window.location.pathname == '/playlists/' + playlistID) {
    killAllPlayers();
  }*/

  //else{

  var links = [];

  $("#hidden .url input").each(function(index) {

    links.push($(this).val());

  }); // End callback function

  var count = 0;

  if(window.location.pathname == '/playlists/' + playlistID) {

  // too tired to fix this right now. harcoding this for now
  if(count > 0 && shuffleCheck > 1){
    return;
  }

  else{

    //console.log("whoa");
    //console.log(playlistID);

    // Grab the container div
    var container = $('#soundcloud-results');
    
    // Remove any previous results
    container.empty();

    // Create a list item to hold our players
    var player = $('<li>').addClass('player-list-item');
    
    container.append(player);

    addPlaylistPlayer(container, links, count, shuffleCheck);

    $('.player').each(function () {
      //console.log('called');
      console.log(ToneDen.players[0].getAllTracks());//.getInstanceByDom('.player').getTrack());
    });

    $('#shuffle-button').click(function(){

      shuffleCheck ++;

      if(shuffleCheck == 1){
        $(this).hide();
      }

      var shuffled = shuffle(ToneDen.players[0].getAllTracks());

      killAllPlayers();

      addPlaylistPlayer(container, shuffled, count, shuffleCheck);

      //console.log('button clicked');
    });

    count ++;

  }

    //playerSelected();

    function addPlaylistPlayer(domEle, links, count, shuffleCheck) {

      // too tired to fix this right now. harcoding this for now
      if(count > 0 && shuffleCheck > 1){
        return;
      }

      else{
      
        //console.log("player added");
        ToneDen.player.create({
          dom: domEle,
          urls: links,
          //keyboardEvents: true,
          shrink: false
          //onTrackFinished: playNext(),
        });

        //console.log(links);

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
          //playlist_link.parent().removeClass('tdlarge-6').addClass('tdlarge-12');


          // Add our own event handler (and remove the default one)
          //playlist_link.off('click').click(addToPlaylist);
        }, 200);
      }
    };
  };

  // playlist validate
  $('input.button').click(function() {
    // Check if the form is valid
    console.log('clicked');
    var valid = doValidation();
    return valid;
  });

  function doValidation() {

    // If the form is valid, return true
    // Otherwise return false
    // We can get all the inputs in the form by doing the following:
    // $('input')
    // And loop through them using an each loop (http://api.jquery.com/each/)
    //console.log("send to func");

    var check = true;

    $('input#playlist_title').each(function(){

      console.log($(this).val());

      if($(this).val() == ""){
        check = false;
        var selector = $(this).attr("id");

        var checker = $("label[for=" + selector + "] strong");

        if(checker.length === 0){
          $("label[for=" + selector + "]").append( "<strong> *Cannot be empty</strong>");
        };
      };

    });

    return check;
  };

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function killAllPlayers(){
    console.log(ToneDen.players.length);
    for(var i = 1; i < ToneDen.players.length; i++){
      ToneDen.players[i].destroy(); 
    }
  }

//}

});

