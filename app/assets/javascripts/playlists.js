// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.


$("#hidden .url").each(function(tracks){
	console.log($("#hidden .url input").val());
});

/*var container = $('#soundcloud-results-pl');

// Remove any previous results
container.empty();

// Loop through our track objects
for (var i=0; i<tracks.length; i++) {
	// Create a list item to hold our players
	var list_item = $('<li>').addClass('player-list-item');

	container.append(list_item);

	// Create our player and add it to the page
	addPlayer(list_item, tracks[i]);

}; // End for loop

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
}*/

//use each