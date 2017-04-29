var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
	var pair = vars[i].split("=");
		// If first entry with this name
	if (typeof query_string[pair[0]] === "undefined") {
	  query_string[pair[0]] = decodeURIComponent(pair[1]);
		// If second entry with this name
	} else if (typeof query_string[pair[0]] === "string") {
	  var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
	  query_string[pair[0]] = arr;
		// If third or later entry with this name
	} else {
	  query_string[pair[0]].push(decodeURIComponent(pair[1]));
	}
  } 
  return query_string;
}();
var facebook_id = '';
var parentObj = null;
var product_name = QueryString.product_name;
var item_url = QueryString.url;
var price = QueryString.price;
var img = QueryString.img;
var wishlist = document.getElementById('wishlist');
var item_detail = document.getElementById('item_detail');

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
				if (window.location.pathname == '/') {
					window.location.pathname = '/wishlist.html'
				}
				showAccountInfo();
			} else {
				if (window.location.pathname == '/wishlist.html') {
					window.location.pathname = '/'
				}
			}
		});

		FB.getLoginStatus(function(response) {
			//Log.info('Login Status', response);
			if (response.status === 'connected') {
				if (window.location.pathname == '/') {
					window.location.pathname = '/wishlist.html'
				}
				showAccountInfo();
			} else {
				if (window.location.pathname == '/wishlist.html') {
					window.location.pathname = '/'
				}
			}
		});

		function showAccountInfo() {
			FB.api('/me?fields=name,picture', function(response) {
				//Log.info('API response', response);
				facebook_id = response.name;
				facebook_picture_url = response.picture.data.url;
				document.getElementById('accountInfo').innerHTML = ('<img src="' + facebook_picture_url + '"> ' + facebook_id);
				getItems();
				if (item_detail != null) {
					item_detail.innerHTML = (
						'<div class="row"><div class="col-md-2 col-sm-2"><img class="thumbnail" src="' + img + '"></div>' +
						'<div class="col-md-10 col-sm-10"><h2><a href="' + item_url + '">' + product_name + '</a></h2>' +
						price + '<br><br>' +
						'<button class="btn btn-success" type="button" onclick="add_item(facebook_id, facebook_picture_url, product_name, item_url, price, img)">Add to wish list</button>' +
						'</div></div>'
					);
				}
			});
			document.getElementById('loginBtn').style.display = 'block';
		}
	};

		(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

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
})

function writeUserData(name, email, phone, enquiry, message) {
	firebase.database().ref().push().set({
		name: name,
		email: email,
		phone: phone,
		enquiry: enquiry,
		message: message
	})
}

function add_item(facebook_id, facebook_picture_url, product_name, item_url, price, img) {
	firebase.database().ref().push().set({
		facebook_id: facebook_id,
		facebook_picture_url: facebook_picture_url,
		product_name: product_name,
		item_url: item_url,
		price: price,
		img: img
	})
	document.getElementById('alert').innerHTML = 'Add successfully!';
    document.getElementById('alert').setAttribute('class', 'alert alert-success alert-dismissible');
    window.setTimeout(function() {
        $(".alert").fadeTo(1000, 0).slideUp(1000, function(){
            $(this).alert('close');
        });
    }, 1000);
}

function updateWishList(items, query_facebook_id) {
	if (wishlist != null) {
		var s = '';
		var userWishListId = null;
		var userPictureUrl = '';
		if (query_facebook_id == '')
			userWishListId = 'Friends\'';
		Object.keys(items).forEach(function(key) {
			if (query_facebook_id == '') {
				if (items[key].facebook_id != null && 
					!items[key].facebook_id.toLowerCase().includes(facebook_id.toLowerCase())) {
					s += '<li>';
					s += '<div class="row"><div class="col-md-2 col-sm-2"><img class="thumbnail" src="' + items[key].img + '"></div>';
					s += '<div class="col-md-10 col-sm-10"><h2><a href="' + items[key].item_url + '">' + items[key].product_name + '</a></h2>';
					s += items[key].price + '<br>';
					s += '<img style="width: 32px; height: 32px" src="' + items[key].facebook_picture_url + '"> ' + items[key].facebook_id + '</div></div>';
					s += '</li>';
				}
			}
			else if (items[key].facebook_id != null && 
				items[key].facebook_id.toLowerCase().includes(query_facebook_id.toLowerCase())) {
				userWishListId = items[key].facebook_id + '\'s';
				userPictureUrl = items[key].facebook_picture_url;
				s += '<li>';
				s += '<div class="row"><div class="col-md-2 col-sm-2"><img class="thumbnail" src="' + items[key].img + '"></div>';
				s += '<div class="col-md-10 col-sm-10"><h2><a href="' + items[key].item_url + '">' + items[key].product_name + '</a></h2>';
				s += items[key].price + '</div></div>';
				s += '</li>';
			}
		})
		wishlist.innerHTML = (
			'<h1><img src="' + userPictureUrl + '"> ' + userWishListId + ' wish list' + '</h1>' +
			'<br>' +
			'<nav>' +
			'	<ul>' +
			s +
			'  </ul>' +
			'</nav>'
		);
	}	
}

function getItems () {
	firebase.database().ref().on("value", function(snapshot) {
		parentObj = snapshot.val();
		updateWishList(parentObj, facebook_id);
		console.log(snapshot.val());
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
}

function getSearchValue () {
	var username = document.getElementById('searchName').value;
	console.log(username);
	document.getElementById('searchName').value = '';
	updateWishList(parentObj, username);
}
