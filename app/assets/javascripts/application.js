// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
<<<<<<< HEAD
//= require turbolinks
//= require_tree .
=======
//= require foundation
//= require turbolinks
//= require_tree .

// $(function(){ $(document).foundation(); });

$(document).foundation();

(function() {
        var script = document.createElement("script");

        script.type = "text/javascript";
        script.async = true;
        script.src = "//sd.toneden.io/production/toneden.loader.js"

        var entry = document.getElementsByTagName("script")[0];
        entry.parentNode.insertBefore(script, entry);
        //console.log("Toneden loaded");
}());

$(document).on('page:change', function(){
	
	SC.initialize({
		client_id: "a62d5827b18b0fa49e0e57e1dcc2788a"
	});

});

//console.log('initializing soundcloud');
SC.initialize({
  client_id: "YOUR_CLIENT_ID"
});

>>>>>>> d6e4864157f4e06b206409147fa69fc9166e9abd
