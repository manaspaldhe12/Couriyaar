function getAirportData () {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			autocomplete(xmlhttp.responseText);
    		}
    	}
    	xmlhttp.open("GET","server.php?action=getAirports",true);
    	xmlhttp.send();
};

function autocomplete (data) {
	var data = data.toString();
	var availableTags = data.split(',');
	var airportData= availableTags;
    	// TODO: Change the tags #to and #from to one single function as both do the same.
    	$("#to").autocomplete({
    		source: airportData,
      		create: function(event, ui) {
      			},
      		select: function (event, ui) {
          			event.preventDefault();
          			$("#to").val(ui.item.label);
      		},
      		focus: function(event, ui) {
          			event.preventDefault();
          			$("#to").val(ui.item.label);
      		}
  	});
    	$("#from").autocomplete({
    		source: airportData,
      		create: function(event, ui) {
      			},
      		select: function (event, ui) {
          			event.preventDefault();
          			$("#from").val(ui.item.label);
      			},
      		focus: function(event, ui) {
          			event.preventDefault();
          			$("#from").val(ui.item.label);
      			}
  	});
};

function datepicker () {
	var dates = $("#on, #return").datepicker({
    		dateFormat: 'yy/mm/dd',
     		defaultDate: "+1w",
     		changeMonth: true,
     		numberOfMonths: 3,
     		minDate: new Date(),
     		onSelect: function (selectedDate) {
        	  	  	var option = this.id == "on" ? "minDate" : "maxDate",
         			instance = $(this).data("datepicker"),
         			date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
         			dates.not(this).datepicker("option", option, date);
     		  	  }
 	});
};

function googleAnalytics () {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
     		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
     		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
 	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

 	ga('create', 'UA-28478526-2', 'auto');
 	ga('send', 'pageview');
}


function main () {
	var firstName = readCookie("firstName");
	var lastName = readCookie("lastName");
	var fbId = readCookie("fbId");
	if (firstName && lastName && fbId) {
		datepicker();
		getAirportData();
	} else{
		window.location.replace("/index.html");
	}
	googleAnalytics ();
}

function sendEmails (selfFbId, fbId, number_mutual_friends, mutual_friend0, mutual_friend1, mutual_friend_link0, mutual_friend_link1, match) {
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    		}
    	}

    	var request = "server.php?action=sendEmail";
    	request = request + "&selfFbId=" + selfFbId;
    	request = request + "&fbId=" + fbId;
    	request = request + "&nmf=" + number_mutual_friends;
    	request = request + "&mf0=" + mutual_friend0;
    	request = request + "&mf1=" + mutual_friend1;
    	request = request + "&mfl0=" + mutual_friend_link0;
    	request = request + "&mfl1=" + mutual_friend_link1;
    	request = request + "&match=" + match;

    	xmlhttp.open("GET", request, true);
    	xmlhttp.send();    
}

function findIfFriends (selfFbId, response) {
	if (response && response.friends && response.friends.data) {
		for (i = 0; i < response.friends.data.length; i++) {
			var currentFbId = response.friends.data[i];
			if (response.friends.data[i].id === selfFbId) {
				return true;
			}
		}
	}
	return false;
}


function updateFbId (tableName, selfFbId, match) {
	var table = document.getElementById(tableName);
	var numberOfRows = table.rows.length;
	var fbIdArray = [];
	for (var i = 1; i < numberOfRows; i++){
	       	var fbId = table.rows[i].cells[1].innerHTML;
	       	fbIdArray[i] = fbId;
	       	FB.api(
	        	"/" + fbId,
	           	{"fields": "context.fields(mutual_friends)"},	 
	           	function(response) {
	             		for (var j = 1; j < numberOfRows; j++) {
	                		if (response && (response.id === table.rows[j].cells[1].innerHTML) && response.context && response.context.mutual_friends && response.context.mutual_friends.data) {
					
						FB.api(
				    			"/" + selfFbId + "/friends/" + response.id,
    							function (this_response) {
      								if (this_response && !this_response.error) {
									if (this_response.data.length !== 0) {
										for (var k in fbIdArray) {
											if (this_response.data[0].id === fbIdArray[k]) {
												table.rows[k].cells[1].innerHTML = "You are already friends!";
											}
										}			
									}
      								}
    							}
						);

						var possiblefriends = "";
		                   		var mutual_friend_count = response.context.mutual_friends.summary.total_count; 
		                   		if (response.context.mutual_friends.data.length === 0 ) {
	        	              			if (mutual_friend_count === 0){
	                	        			table.rows[j].cells[1].innerHTML = "0 mutual friends. Please be careful while dealing with people with no mutual friends";
	                	        			return;
	                	    			}
	                	    			else {
	                	        			table.rows[j].cells[1].innerHTML = " " + mutual_friend_count + " mutual friends. ";
	                	        			return;
	                	    			} 
	                			}
	                			else if (response.context.mutual_friends.data.length === 1){
	                	  			possiblefriends = possiblefriends + "<a href=https://www.facebook.com/app_scoped_user_id/" + response.context.mutual_friends.data[0].id + ">" + response.context.mutual_friends.data[0].name + "</a>";
	                	  			table.rows[j].cells[1].innerHTML = " " + mutual_friend_count + " mutual friends, including: " + possiblefriends;
	                	  			sendEmails (selfFbId, fbId, response.context.mutual_friend_count, response.context.mutual_friends.data[0].name, "", "https://www.facebook.com/app_scoped_user_id/" + response.context.mutual_friends.data[0].id, "", match);
	              				}
	              				else{
	                	  			possiblefriends = possiblefriends + "<a href=https://www.facebook.com/app_scoped_user_id/" + response.context.mutual_friends.data[0].id + ">" + response.context.mutual_friends.data[0].name + "</a>" + " and " + "<a href=https://www.facebook.com/app_scoped_user_id/" + response.context.mutual_friends.data[1].id + ">" + response.context.mutual_friends.data[1].name + "</a>";
	                	  			table.rows[j].cells[1].innerHTML = " " + mutual_friend_count + " mutual friends including:  " + possiblefriends;
	                	  			sendEmails (selfFbId, fbId, response.context.mutual_friends.data.length, response.context.mutual_friends.data[0].name, response.context.mutual_friends.data[1].name, "https://www.facebook.com/app_scoped_user_id/" + response.context.mutual_friends.data[0].id, "https://www.facebook.com/app_scoped_user_id/" + response.context.mutual_friends.data[1].id, match);
	              				}
	          			} else if (response && (response.id === table.rows[j].cells[1].innerHTML)) {
		 				table.rows[j].cells[1].innerHTML = "0 mutual friends. Please be careful while dealing with people with no mutual friends";
	            				return;	
		  			}
				}
			}
		);
	}
}

function attachListners () {
	for (var buttonCounter = 0; buttonCounter<10; buttonCounter++) {
		if (document.getElementById("deleteButton" + buttonCounter.toString())){
			document.getElementById("deleteButton" + buttonCounter.toString()).addEventListener("click",
													    function() {
             												    	deleteTrip(buttonCounter);
         												    },
													     false
													    );	
		}
	}
}

function logout () {
	eraseCookie("emailId");
    	eraseCookie("firstName");
    	eraseCookie("lastName");
    	eraseCookie("fbId");	
    	FB.logout(function(response) {});
    	window.location.replace("");
}

/* Request related functions */
function addRequest () {
	var firstName = readCookie("firstName");
	var lastName = readCookie("lastName");
	var origin = document.getElementById("from").value;
	var destination = document.getElementById("to").value;
	var onDate = document.getElementById("on").value;
	var fbId = readCookie("fbId");
	var range = document.getElementById("daterangeselect").value;

    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			document.getElementById("result").innerHTML = "Request successfully added!";
    			getProbableRequestMatches(origin, destination, onDate, fbId, range, "request_" + xmlhttp.response);
            		$('.ui-autocomplete-input').val('');
            		$.datepicker._clearDate("#on");
            		showAllRequests();
        	}
    	}

    	var request = "server.php?action=addRequest";
    	request = request + "&firstName=" + firstName;
    	request = request + "&lastName=" + lastName;
    	request = request + "&origin=" + origin;
    	request = request + "&destination=" + destination;
    	request = request + "&onDate=" + onDate;
    	request = request + "&fbId=" + fbId;
    	request = request + "&range=" + range;
    
    	xmlhttp.open("GET", request, true);
    	xmlhttp.send();
}

function getProbableRequestMatches (origin, destination, onDate, fbId, range, requestId) {
	var xmlhttp = new XMLHttpRequest();
   	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			var matches = "The following are some possible matches for your request ";
    			fillProbableMatches("probableRequestMatchTable", matches, xmlhttp.response, fbId, requestId);
         		$(document).ready(function() { 
           			$("#probableRequestMatchTable").tablesorter({sortList: [[1,0], [0,0]]} ); 
       			});	
     		}
	}

 	var request = "server.php?action=getProbableRequestMatches";
 	request = request + "&origin=" + origin;
 	request = request + "&destination=" + destination;
 	request = request + "&onDate=" + onDate;
 	request = request + "&fbId=" + fbId;
 	request = request + "&range=" + range;
 
 	xmlhttp.open("GET", request, true);
 	xmlhttp.send();
}

function showAllRequests () {
	var firstName = readCookie("firstName");
	var lastName = readCookie("lastName");
	var date = new Date();
	var month = date.getMonth()+1;
	var dateString = date.getFullYear().toString() + '-' + month.toString() + '-' + date.getDate().toString();

    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function () {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			var upcoming = "Your upcoming requests are:";
          		showAllUpcoming("delete-trips", upcoming, xmlhttp.response, "deleteRequest", "request");
      		}
  	}

  	var request = "server.php?action=showAllRequests";
  	request = request + "&firstName=" + firstName;
  	request = request + "&lastName=" + lastName;
  	request = request + "&date=" + dateString;
  
  	xmlhttp.open("GET", request, true);
  	xmlhttp.send();
}

function deleteRequest (origin, destination, onDate) {
	var firstName = readCookie("firstName");
	var lastName = readCookie("lastName");
	var fbId = readCookie("fbId");

	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			document.getElementById("result").innerHTML = "Request successfully deleted!";
         	 	showAllRequests();
      		}
  	}

  	var request = "server.php?action=deleteRequest";
  	request = request + "&firstName=" + firstName;
  	request = request + "&lastName=" + lastName;
  	request = request + "&origin=" + origin;
  	request = request + "&destination=" + destination;
 	request = request + "&onDate=" + onDate;
  	request = request + "&fbId=" + fbId;
  
  	xmlhttp.open("GET", request, true);
  	xmlhttp.send();
}


/* Travel related functions */
function addTrip () {
	var firstName = readCookie("firstName");
	var lastName = readCookie("lastName");
	var origin = document.getElementById("from").value;
	var destination = document.getElementById("to").value;
	var onDate = document.getElementById("on").value;
	var returnDate = document.getElementById("return").value;
	var fbId = readCookie("fbId");

    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			document.getElementById("result").innerHTML = "Trip successfully added!";
            		$('.ui-autocomplete-input').val('');
            		$.datepicker._clearDate("#on");
            		$.datepicker._clearDate("#return");
            		getProbableTravelMatches(origin, destination, onDate, returnDate, fbId, "trip_" + xmlhttp.response );
            		showAllTrips();
        	}

    	}

   	var request = "server.php?action=addTrip";
   	request = request + "&firstName=" + firstName;
   	request = request + "&lastName=" + lastName;
   	request = request + "&origin=" + origin;
    	request = request + "&destination=" + destination;
    	request = request + "&onDate=" + onDate;
    	request = request + "&returnDate=" + returnDate;
    	request = request + "&fbId=" + fbId;
    
    	xmlhttp.open("GET", request, true);
    	xmlhttp.send();
}

function getProbableTravelMatches (origin, destination, onDate, returnDate, fbId, tripId) {
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			var matches = "The following are some possible matches for your trip ";
    			fillProbableMatches("probableTravelMatchTable", matches, xmlhttp.response, fbId, tripId);    		    		
           		$("#probableTravelMatchTable").tablesorter({sortList: [[1,0], [0,0]]} ); 
       		}
   	}

   	var request = "server.php?action=getProbableTravelMatches";
   	request = request + "&origin=" + origin;
   	request = request + "&destination=" + destination;
   	request = request + "&onDate=" + onDate;
   	request = request + "&returnDate=" + returnDate;
   	request = request + "&fbId=" + fbId;
   
   	xmlhttp.open("GET", request, true);
   	xmlhttp.send();
}

function showAllTrips () {
	var firstName = readCookie("firstName");
	var lastName = readCookie("lastName");
	var date = new Date();
	var month = date.getMonth()+1;
	var dateString = date.getFullYear().toString() + '-' + month.toString() + '-' + date.getDate().toString();

    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function () {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			var upcoming = "Your upcoming trips are:";
          		showAllUpcoming("delete-requests", upcoming, xmlhttp.response, "deleteTrip", "trip");
      		}
  	}

  	var request = "server.php?action=showAllTrips";
  	request = request + "&firstName=" + firstName;
  	request = request + "&lastName=" + lastName;
  	request = request + "&date=" + dateString;
  
  	xmlhttp.open("GET", request, true);
  	xmlhttp.send();
}

function deleteTrip (origin, destination, onDate, returnDate) {
	var firstName = readCookie("firstName");
	var lastName = readCookie("lastName");
	var fbId = readCookie("fbId");

	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			document.getElementById("result").innerHTML = "Trip successfully deleted!";
          		showAllTrips();
      		}
  	}

  	var request = "server.php?action=deleteTrip";
  	request = request + "&firstName=" + firstName;
  	request = request + "&lastName=" + lastName;
  	request = request + "&origin=" + origin;
  	request = request + "&destination=" + destination;
  	request = request + "&onDate=" + onDate;
  	request = request + "&returnDate=" + returnDate;
  	request = request + "&fbId=" + fbId;
  
  	xmlhttp.open("GET", request, true);
  	xmlhttp.send();
}
/* End of  travel related functions */

/* Functions common to trips and requests */
function showAllUpcoming(table_elementId, upcoming, response, deleteElem, identifier){
	var table = document.getElementById(table_elementId);
	var data = JSON.parse(response);

	if (data.length === 0) {
		table_element = "";
        	table.innerHTML =  table_element;
        	return;
    	}

    	var table_element;
    	if (identifier === "trip") {
      		table_element = upcoming + '<table border="0" style="width:40%" align="center">	<col width="%25">	<col width="%25">	<col width="%25">	<col width="%25">	<tr> 	<td> <b> From </b> </td> 	<td> <b> To </b> </td> 	<td> <b> Onward Journey Date </b> </td>  	<td> <b> Return Journey Date   </b> </td>  	<td> <b> </b> </td>	</tr>';
  	} else if (identifier === "request"){
      		table_element = upcoming + '<table border="0" style="width:40%" align="center">	<col width="%25">	<col width="%25">	<col width="%25">	<col width="%25">	<tr> 	<td> <b> From </b> </td> 	<td> <b> To </b> </td> 	<td> <b> Onward Journey Date </b> </td> <td> <b> </b> </td>	</tr>';
  	}

  	for (var i = 0; i < data.length; i++) {
      		var data_object = data[i];
      		if (identifier === "trip") {
       			var params = "'" + data_object.origin + "', '" + data_object.destination + "', '" + data_object.onDate + "', '" + data_object.returnDate  + "'";
       			table_element = table_element + '<tr>  		<td>' + data_object.origin + '</td>  		<td>' + data_object.destination + '</td>  		<td>' + data_object.onDate + '</td>  		<td>' + (data_object.returnDate || 'N/A') + '</td>   		<td> <button id="deleteButton" type="button"  class="delButton" onClick="' + deleteElem + '(' + params  + ')" >Delete</button> </td>		</tr>'
   		} else if (identifier === "request"){
       			var params = "'" + data_object.origin + "', '" + data_object.destination + "', '" + data_object.onDate + "'";
       			table_element = table_element + '<tr>  		<td>' + data_object.origin + '</td>  		<td>' + data_object.destination + '</td>  		<td>' + data_object.onDate + '</td>  <td> <button id="deleteButton" type="button" class="delButton" onClick="' + deleteElem + '(' + params  + ')" >Delete?</button> </td>		</tr>'
   		}
	}		

	table_element = table_element + '</table>';
	table.innerHTML =  table_element;
}

function sendMessageLogs (fbId, addedId) {
	var xmlhttp = new XMLHttpRequest();
  	var request = "server.php?action=logMessageSend";
  	request = request + "&addedId=" + addedId;
  	request = request + "&fbId=" + fbId;
  
  	xmlhttp.open("GET", request, true);
  	xmlhttp.send();
}

function fillProbableMatches(tableName, matches, response, selfFbId, addedId) {
    	var table = document.getElementById("see-possible-matches");
    	var data = JSON.parse(response);

    	$(table).empty(); 
    	para =  document.createElement("p");

    	var paranode = document.createTextNode(matches);

    	if (data.length === 0) {
      		if (tableName === "probableRequestMatchTable") {
          		matches = "Sorry! There are currently no matches for your request.";
      		} else if ("probableTravelMatchTable") {
          		matches = "Sorry! There are currently no matches for your travel.";
      		} else {
          		matches = "Sorry! There are currently no matches.";
      		}
      		var paranode = document.createTextNode(matches);
      		para.appendChild(paranode);
      		table.appendChild(para);
      		return;
  	}

  	para.appendChild(paranode);
  	table.appendChild(para);

  	var divNode = document.createElement("div");
  	divNode.innerHTML = '<div id="sendElem" class="fb-send" data-href="https://developers.facebook.com/docs/plugins/" data-colorscheme="light" > </div>';
  	table.appendChild(divNode);

	FB.Event.subscribe('message.send', function () {sendMessageLogs(selfFbId, addedId);});	

  	var table_element = '<table id="' + tableName + '"  class="tablesorter" border="0"  align="center" style="width:60%; margin-top:20px; margin-bottom:50px;">	<col width="%20">	<col width="%30">	<col width="%10">	<col width="%10">	<col width="%10">	<col width="%10">	<thead> <tr style="cursor:pointer;"> 	<th> <b> User </b> </th> 	<th> <b> Mutual Friends </b> </th> 	<th> <b> From </b> </th>  	<th> <b> To </b> </th>  	<th> <b> onDate </b> </th>  	<th> <b> </b> </th>	 </tr>  </thead> <tbody>';
  	var match;

  	for (var i = 0; i < data.length; i++) {
      		var data_object = data[i];
      		table_element = table_element + "<tr>       <td> <a href='https://www.facebook.com/app_scoped_user_id/" + data_object.fbID +  "'>" + data_object.firstName + " " + data_object.lastName + " </a> </td>       <td>" + data_object.fbID + "</td>       <td> " + data_object.origin + "</td>        <td> " + data_object.destination + "</td>       <td> " + data_object.onDate + "</td>        </tr>";
  	}

  	table_element = table_element + "</tbody> </table>";

  	var tableNode = document.createElement("div");    
  	tableNode.innerHTML = table_element;
  	table.appendChild(tableNode);

  	if (tableName === "probableRequestMatchTable") {
    		match = "request";
	} else if (tableName === "probableTravelMatchTable") {
    		match = "travel";
	}

	updateFbId(tableName, selfFbId, match);
	FB.XFBML.parse(document.getElementById("see-possible-matches"));
}

/* End of Functions common to trips and requests */

/* User login related function */
function checkIfFacebookUserExists (emailId, firstName, lastName, fbId) {
    	var xmlhttp = new XMLHttpRequest();
    	createCookie("emailId", emailId, 1);
    	createCookie("firstName", firstName, 1);
    	createCookie("lastName", lastName, 1);
    	createCookie("fbId", fbId, 1);

    	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			var response = xmlhttp.responseText;
    			if (response !== "1"){
             			addUser (emailId, firstName, lastName, fbId);
         		}
         		document.getElementById("user-welcome").innerHTML = "Welcome " + firstName + "!"
         		if (firstName){
            			document.getElementById("logout").innerHTML = '<button id="logoutButton" type="button" class="notUser" onclick=logout()> Logout </button>';
            			document.getElementById("logoutButton").firstChild.data = "Not " + firstName + "? Logout?";
        		} else{
         			document.getElementById("logoutButton").innerHTML = "";
     			}
     			if (document.getElementById("login")){
         			document.getElementById("login").style.display = "none";
     			}
 		}
	}

	var request = "server.php?action=searchUser";
	request = request + "&fbId=" + fbId;

	xmlhttp.open("GET", request, true);
	xmlhttp.send();
}

function addUser (emailId, firstName, lastName, fbId) {
    	var xmlhttp = new XMLHttpRequest();
    	xmlhttp.onreadystatechange = function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    			var response = xmlhttp.responseText;
    		}
    	}

    	var request = "server.php?action=addUser";
    	request = request + "&emailId=" + emailId + "&firstName=" + firstName + "&lastName=" + lastName + "&fbId=" + fbId;
    
    	xmlhttp.open("GET", request, true);
    	xmlhttp.send();
}

function addTripLoginCheck () {
	if (readCookie("emailId") && readCookie("firstName") && readCookie("lastName")){
		window.open("add-trip.html", "_self");
	} else{
		alert("Please login before adding travel plans.");
	}
}

function addShopLoginCheck () {
	if (readCookie("emailId") && readCookie("firstName") && readCookie("lastName")){
		window.open("add-request.html", "_self");
	} else{
		alert("Please login before shopping.");
	}
}
/* End User login related function */


/* Cookie functions */
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
/* End of Cookie functions */

/* Main page functions */
function changeTravelImage () {
	var numberOfTravelImages = 5;
	var travelImages = [];
	for (var i = 1; i <= numberOfTravelImages; i++) {
		travelImages.push("./MainPage/Travel/travel" + i.toString() + ".jpg");
	}

	var counter = 0;
	var thread = setInterval (function () {
     		counter++;
     		if (counter === numberOfTravelImages){
        		counter = 0;
    		}
    		var image = document.getElementById("travel_image")
    		image.src = travelImages[counter];
    		image.style.height = '400px';
    		image.style.width = '800px';
	}, 6000);
}

function changeShoppingImage () {
	var numberOfTravelImages = 5;
	var travelImages = [];
	for (var i = 1; i <= numberOfTravelImages; i++) {
		travelImages.push("./MainPage/Shopping/shopping" + i.toString() + ".jpg");
	}

	var counter = 0;
	var thread = setInterval (function () {
     		counter++;
     		if (counter === numberOfTravelImages){
        		counter = 0;
    		}
    		var image = document.getElementById("shopping_image")
    		image.src = travelImages[counter];
    		image.style.height = '400px';
    		image.style.width = '800px';
	}, 6000);
}


function switchTrip () {
    	var returnTrip = document.getElementById("returnOrOneWay").innerHTML;
    	if (returnTrip.indexOf("one-way") >= 0) {
        	document.getElementById("returnOrOneWay").innerHTML = "Add return trip?";
        	document.getElementById("return").style.display = 'none';
        	document.getElementById("returnlabel").style.display = 'none';
    	} else {
        	document.getElementById("returnOrOneWay").innerHTML = "Add one-way trip?";
        	document.getElementById("return").style.display = 'inline-block';
        	document.getElementById("returnlabel").style.display = 'inline-block';
    	}
}

