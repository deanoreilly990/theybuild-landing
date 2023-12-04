
jQuery(document).ready(function() {	
	
    /*
        Background slideshow
    */
	$('.banner-area').backstretch([
	                     "images/alexandre-caron-18ekxPdeVQw-unsplash.jpg"
	                   , "images/debby-hudson-gJylsVMSf-k-unsplash.jpg",
                            "images/famara-marmiesse-Gbgid8-6WEQ-unsplash.jpg",
							"images/image-3.jpg",
							"images/jazon-kovats-UES2PnGjiCU-unsplash.jpg"
	                  ], {duration: 3000, fade: 750});
	

	$("#typed").typed({
		// strings: ["Typed.js is a <strong>jQuery</strong> plugin.", "It <em>types</em> out sentences.", "And then deletes them.", "Try it out!"],
		stringsElement: $('#typed-strings'),
		typeSpeed: 50,
		backDelay: 1000,
		loop: true,
		contentType: 'html', // or text
		// defaults to false for infinite loop
		loopCount: false,
		callback: function(){ foo(); },
		resetCallback: function() { newTyped(); }
	});

	$(".reset").click(function(){
		$("#typed").typed('reset');
	});
 
 
    function newTyped(){ /* A new typed object */ }

    function foo(){ console.log("Callback"); }

	
});
