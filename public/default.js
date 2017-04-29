$( document ).ready(function() {
	window.fbAsyncInit = function() {
		FB.init({
		appId      : '407125566336031',
		xfbml      : true,
		version    : 'v2.9'
		});
		FB.AppEvents.logPageView();

		FB.Event.subscribe('auth.statusChange', function(response) {
			//Log.info('Status Change Event', response);
			if (response.status === 'connected') {
				showAccountInfo();
			} else {
				document.getElementById('loginBtn').style.display = 'block';
				clearAll();
			}
		});

		FB.getLoginStatus(function(response) {
			//Log.info('Login Status', response);
			if (response.status === 'connected') {
				showAccountInfo();
			} else {
				document.getElementById('loginBtn').style.display = 'block';
				clearAll();
			}
		});

		function showAccountInfo() {
			FB.api('/me?fields=name,picture', function(response) {
				//Log.info('API response', response);
				document.getElementById('accountInfo').innerHTML = ('<img src="' + response.picture.data.url + '"> ' + response.name);
				document.getElementById('wishlist').innerHTML = (
					'<h1>' + response.name + '\'s wish list' + '</h1>' +
					'<br>' +
					'<nav>' +
					'	<ul>' +
					'	  <li>Link 1</li>' +
					'	  <li>Link 2</li>' +
					'	  <li>Link 3</li>' +
					'	  <li>Link 4</li>' +
					'	  <li>Link 5</li>' +
					'	  <li>Link 6</li>' +
					'	  <li>Link 7</li>' +
					'	  <li>Link 8</li>' +
					'	  <li>Link 9</li>' +
					'	  <li>Link 10</li>' +
					'	  <li>Link 11</li>' +
					'	  <li>Link 13</li>' +
					'	  <li>Link 13</li>' +
					'  </ul>' +
					'</nav>'
				);
			});
			document.getElementById('loginBtn').style.display = 'block';
		}

		function clearAll() {
			document.getElementById('accountInfo').innerHTML = '';
			document.getElementById('wishlist').innerHTML = '';
		}
	};



		(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// Set up analytics
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-66598892-4', 'auto');
	ga('send', 'pageview');

	// Connect to firebase db
	var config = {
		apiKey: "AIzaSyCidyScU0JPxzkRABwMf7L7SNjxNqz2NXo",
		authDomain: "wishlist-70b60.firebaseapp.com",
		databaseURL: "https://wishlist-70b60.firebaseio.com",
		projectId: "wishlist-70b60",
		storageBucket: "wishlist-70b60.appspot.com",
		messagingSenderId: "460744046950"
	};
	firebase.initializeApp(config);


	// media query event handler
	if (matchMedia) {
		var mq = window.matchMedia("(max-width: 850px)");
		mq.addListener(WidthChange);
		WidthChange(mq);
	}

	firebase.database().ref().on("value", function(snapshot) {
		console.log(snapshot.val());
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
})

// Fill map
function WidthChange(mq) {
	if (mq.matches) {
		console.log('1')
		var map = new GMaps({
			div: '#map',
			lat: -33.8701004,
			lng: 151.2082666,
			zoom: 11
		})
		map.addMarker({
			lat: -33.8701004,
			lng: 151.2082666
		})
	} else {
		console.log('2')
		var map = new GMaps({
			div: '#map',
			lat: -33.8701004,
			lng: 151.3582666,
			zoom: 11
		})
		map.addMarker({
			lat: -33.8701004,
			lng: 151.2082666
		})
	}
}

function sendMail() {
	var name = document.getElementById('name').value
	var email = document.getElementById('email').value
	var phone = document.getElementById('phone').value
	var enquiry = document.getElementById('enquiry').value
	var message = document.getElementById('message').value

	if (name == '') {
		document.getElementById('invalidName').innerHTML = "Name required"
	} 
	if (email == '') {
		document.getElementById('invalidEmail').innerHTML = "Email required"
	}
	if (phone == '') {
		document.getElementById('invalidNumber').innerHTML = "Phone number required"
	}
	if (enquiry == 'None') {
		document.getElementById('invalidEnquiry').innerHTML = "Subject required"
	}
	if (message == '') {
		document.getElementById('invalidMessage').innerHTML = "Message required"
	}

	if (name != '' && email != '' && phone != '' && enquiry != 'None' && message != '') {
		writeUserData(name, email, phone, enquiry, message)
	}
}

function writeUserData(name, email, phone, enquiry, message) {
    console.log(name+email+phone+message)
    firebase.database().ref().push().set({
	    name: name,
	    email: email,
	    phone: phone,
	    enquiry: enquiry,
	    message: message
    })
	$('#sent').append("<div class='alert alert-success alert-dismissable' \
		role='alert' id='appended'><a href='#' class='close' data-dismiss='alert' \
		aria-label='close'>&times;</a>Successfully sent!</div>")
	$('html,body').scrollTop(0)

	// Reset form values
	document.getElementById('name').value = ''
	document.getElementById('invalidName').innerHTML = ''
	document.getElementById('email').value = ''
	document.getElementById('invalidEmail').innerHTML = ''
	document.getElementById('phone').value = ''
	document.getElementById('invalidNumber').innerHTML = ''
	document.getElementById('enquiry').value = 'None'
	document.getElementById('invalidEnquiry').innerHTML = ''
	document.getElementById('message').value = ''
	document.getElementById('invalidMessage').innerHTML = ''

	// Dismiss successful submission notification
	setTimeout(function() {
		//do something special
		$('#appended').fadeOut(500)
		setTimeout(function() {
			$('#appended').remove()
		}, 500)
	}, 4000)
}
/*
$(window).scroll(function () {
	if ($('#hero-title').offset().top - $(document).scrollTop() > 50) {
		$('hero-title').addClass("animated fadeIn")
	}
	$('godown').addClass("animated slideInUp")
})
*/
function findOutMore() {
    $("#about-btn").click(function() {
        $('html, body').animate({
            scrollTop: $("#about").offset().top
        }, 1500)
    })
}

function contactUs() {
    $("#contact-btn").click(function() {
        $('html, body').animate({
            scrollTop: $("#contact-div").offset().top
        }, 2000)
    });
}

function contactDown() {
	$('html, body').animate({
        scrollTop: $("#contact-div").offset().top
    }, 1000)
}




