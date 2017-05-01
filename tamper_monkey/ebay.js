// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.ebay.com.au/itm*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var input=document.createElement("input");
	input.type="button";
	input.value="Add to FB Wish List";

	input.onclick = showAlert;

	input.setAttribute("style","padding:5px;font-family:Tahoma;color:white;font-size:18px;position:absolute;top:358px;right:380px;background-color:#4a67b8");

	document.body.appendChild(input);
	
function showAlert()
{
    var params = "url=" + window.location.href + "&" +
            "price=" + document.querySelectorAll('[itemprop="price"]')[0].innerHTML + "&" +
            "img=" + document.querySelectorAll('[itemprop="image"]')[0].currentSrc + "&" +
            "product_name=" + document.getElementById("itemTitle").innerText
            ;

    var html_url = "https://wishlist-70b60.firebaseapp.com/add.html?";

    window.open(html_url + params, "Add to my facebook wish list", "height=480, width=800");

}
})();