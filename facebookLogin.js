
function statusChangeCallback(response) {
  if (response.status === 'connected') {
	checkPermissions();
  } 

  return response;
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1489846651264715',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.2' // use version 2.2
    });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function mainFunction() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    checkIfFacebookUserExists (response.email, response.first_name, response.last_name, response.id);
  });
}

function permissionsDeclined (response) {
	var permissionsReq = {};

	if (response && response.data) {
	var data = response.data;
		for (var i = 0; i < data.length; i++) {
			var perm = data[i].permission;
			var granted = data[i].status;
			permissionsReq[perm] = granted; 
		}		
	}

	var declinedArray = [];
	if (permissionsReq["public_profile"] !== "granted") {
		declinedArray.push("public_profile");
	} 
	if (permissionsReq["email"] !== "granted") {
		declinedArray.push("email");
	}
	if (permissionsReq["user_friends"] !== "granted") {
		declinedArray.push("user_friends");
	}

	return declinedArray;
}

function checkPermissions (response) {
	FB.api(
    		"/me/permissions",
    		function (response) {
      			if (response && !response.error) {
				var declined = permissionsDeclined(response);	
				if (declined.length === 0) {
        				/* handle the result */
					mainFunction();
				} else {
					var reqParams = "";
					for (var i = 0; i < declined.length - 1; i++) {
						reqParams = reqParams + declined[i] + ", ";
					}
					reqParams = reqParams + declined[declined.length - 1];
					FB.login(
  						function(response) {
    							console.log(response);
  						},
  						{
    							scope: reqParams,
    							auth_type: 'rerequest'
 	 					}
					);	
				}
      			}
    		}
	);
}

function sendMessage() {
  FB.ui({
    method: 'send',
    link: "www.yahoo.com",
  });
}

function getFriends (id) {
  FB.api(
    "/" + id,
    {
      "fields": "context.fields(mutual_friends), link"
    },
    function(response) {
      if(response && response.context && response.context.mutual_friends && response.context.mutual_friends.data) {
        return response.context.mutual_friends.data.length;
      } else{
        return 0;
      }
    }
    );
}
