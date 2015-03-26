<?php
set_include_path('/home/manas/pear/share/pear');
//ini_set('display_errors', 'On');

/* Connection functions */
function startConnection () {
	//$con=mysql_connect("104.131.136.89","manas","test");
	$con=mysql_connect("localhost","manas","test");
	// Check connection
	if (!$con) {
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}	

}

function closeConnection () {	
	mysql_close($con);
}
/* End Connection functions */

/* Get airport data */
function getAirports () {
	mysql_select_db("Travels");
	$result = mysql_query("SELECT City FROM Airports");
	while($row = mysql_fetch_array($result)) {
		echo $row['City'];
		echo ',';
	}
}
/* End Get airport data */

/* User related queries */
function getUsers () {
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}

function searchUser ($action) {
	$fbId = $_GET['fbId'];

	$query = "SELECT * FROM Users WHERE fbID='" .$fbId ."';";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$exists = false;
	while($row = mysql_fetch_assoc($result)) {
		$exists = true;
	}
	echo $exists;
}

function addUser ($action) {
	$emailId = $_GET['emailId'];
	$firstName = $_GET['firstName'];
	$lastName = $_GET['lastName'];
	$fbId = $_GET['fbId'];

	$query = "INSERT INTO Users VALUES ('" .$emailId ."', '" .$firstName  ."', '" .$lastName ."', '" .$fbId  ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}
/* End User related queries */

/* Trip related queries */
function addTrip ($action) {
	$firstName = $_GET['firstName'];
	$lastName = $_GET['lastName'];
	$origin = $_GET['origin'];
	$destination = $_GET['destination'];
	$onDate = $_GET['onDate'];
	$returnDate = $_GET['returnDate'];
	$fbId = $_GET['fbId'];

	$query = "SELECT * FROM Trips WHERE (firstName='" .$firstName  ."' AND lastName='" .$lastName ."' AND origin='" .$origin ."' AND destination='".$destination ."' AND onDate='" .$onDate ."' AND returnDate='".$returnDate ."' AND fbID='" .$fbId ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		echo "The complete trip already exists";
		return;
	}

	// $query = "SELECT * FROM Trips WHERE (firstName='" .$firstName  ."' AND lastName='" .$lastName ."' AND origin='" .$origin ."' AND destination='".$destination ."' AND onDate='" .$onDate ."' AND fbID='" .$fbId  ."');";
	// mysql_select_db("Travels");
	// $result = mysql_query($query);
	// $rows = array();
	// while($row = mysql_fetch_assoc($result)) {
	// 	echo "Forward trip already exists";
	// 	$query = "DELETE FROM Trips WHERE (firstName='" .$firstName  ."' AND lastName='" .$lastName ."' AND origin='" .$origin ."' AND destination='".$destination ."' AND onDate='" .$onDate ."' AND fbID='" .$fbId  ."');";
	// 	$query = "INSERT INTO Trips VALUES ('" .$firstName ."', '" .$lastName ."', '" .$destination ."', '" .$origin ."', '"  .$returnDate  ."', '"  .$onDate ."', '" .$fbId ."');";
	// 	return;
	// }

	// $query = "SELECT * FROM Trips WHERE (firstName='" .$firstName  ."' AND lastName='" .$lastName ."' AND origin='" .$origin ."' AND destination='".$destination ."' AND returnDate='".$returnDate ."' AND fbID='" .$fbId  ."');";
	// mysql_select_db("Travels");
	// $result = mysql_query($query);
	// $rows = array();
	// while($row = mysql_fetch_assoc($result)) {
	// 	echo "Return trip already exists";
	// 	$query = "DELETE FROM Trips WHERE (firstName='" .$firstName  ."' AND lastName='" .$lastName ."' AND origin='" .$origin ."' AND destination='".$destination ."' AND returnDate='".$returnDate ."' AND fbID='" .$fbId  ."');";
	// 	$query = "INSERT INTO Trips VALUES ('" .$firstName ."', '" .$lastName ."', '" .$origin ."', '" .$destination ."', '"  .$onDate ."', '" .$returnDate  ."', '"  .$fbId ."');";
	// 	return;
	// }

	$id_query = "SELECT IFNULL(MAX(Id),0)+1 FROM Trips;";
	mysql_select_db("Travels");
	$id_result = mysql_query($id_query);
	$id_row = mysql_fetch_array($id_result);
	$id =  $id_row["IFNULL(MAX(Id),0)+1"];

	$query = "INSERT INTO Trips VALUES ('" .$firstName ."', '" .$lastName ."', '" .$origin ."', '" .$destination ."', '"  .$onDate ."', '" .$returnDate  ."', '"  .$fbId  ."', '".$id ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo $id;
}

function searchTrip ($action) {
	$origin = $_GET['origin'];
	$destination = $_GET['destination'];
	$onDate = $_GET['onDate'];
	$returnDate = $_GET['returnDate'];

	if ($returnDate == ''){
		$query = "SELECT * FROM Trips, Users  WHERE ((origin='" .$origin ."' AND destination='" .$destination ."' AND onDate='"  .$onDate ."') OR (destination='" .$origin ."' AND origin='" .$destination ."' AND returnDate='"  .$onDate ."'));";
	}
	else{
		$query = "SELECT * FROM Trips, Users  WHERE origin='" .$origin ."' AND destination='" .$destination ."' AND onDate='"  .$onDate ."' AND returnDate='" .$returnDate ."';";
	}
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}

function deleteTrip ($action) {
	$firstName = $_GET['firstName'];
	$lastName = $_GET['lastName'];
	$origin = $_GET['origin'];
	$destination = $_GET['destination'];
	$onDate = $_GET['onDate'];
	$returnDate = $_GET['returnDate'];

	$query = "DELETE FROM Trips WHERE (firstName='" .$firstName ."' AND lastName='" .$lastName ."' AND origin='" .$origin ."' AND destination='" .$destination ."' AND onDate='"  .$onDate ."' AND returnDate='" .$returnDate ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}

function showAllTrips ($action) {
	$firstName = $_GET['firstName'];
	$lastName = $_GET['lastName'];
	$date = $_GET['date'];

	$query = "SELECT * FROM Trips WHERE (firstName='" .$firstName ."' AND lastName='" .$lastName ."' AND onDate>'" .$date  ."')  limit 5;";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}

function getTrips ($action) {
	$firstName = $_GET['firstName'];
	$lastName = $_GET['lastName'];
	
	$query = "SELECT * FROM Trips WHERE (firstName='" .$firstName ."' AND lastName='" .$lastName  ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}

function getProbableTravelMatches ($action) {
	$origin = $_GET['origin'];
	$destination = $_GET['destination'];
	$onDate = $_GET['onDate'];
	$returnDate = $_GET['returnDate'];
	$fbId = $_GET['fbId'];

	$query = "SELECT * FROM Users WHERE (fbID='" .$fbId ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$email = $row['emailId'];
		$name = $row['firstName'];
	}

	$query = "SELECT * FROM Requests WHERE (origin='" .$origin ."' AND destination='" .$destination ."' AND DATE_SUB(onDate, INTERVAL dateRange DAY)<' " .$onDate ." ' AND DATE_ADD(onDate, INTERVAL dateRange DAY)>'" .$onDate ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}

	echo json_encode($rows);
}
/* End Trip related queries */

/* Request related queries */
function addRequest ($action) {
	$firstName = $_GET['firstName'];
	$lastName = $_GET['lastName'];
	$origin = $_GET['origin'];
	$destination = $_GET['destination'];
	$onDate = $_GET['onDate'];
	$fbId = $_GET['fbId'];
	$range = $_GET['range'];

	$query = "SELECT * FROM Requests WHERE (firstName='" .$firstName  ."' AND lastName='" .$lastName ."' AND origin='" .$origin ."' AND destination='".$destination ."' AND onDate='" .$onDate ."' AND fbID='" .$fbId ."' AND range='" .$range  ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		echo "Request already exists";
		return;
	}

	$id_query = "SELECT IFNULL(MAX(Id),0)+1 FROM Requests;";
	mysql_select_db("Travels");
	$id_result = mysql_query($id_query);
	$id_row = mysql_fetch_array($id_result);
	$id =  $id_row["IFNULL(MAX(Id),0)+1"];

	$query = "INSERT INTO Requests VALUES ('" .$firstName  ."', '" .$lastName ."', '" .$origin ."', '".$destination ."', '" .$onDate ."', '" .$fbId  ."', '" .$range   ."', '" .$id  ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo $id;
}

function showAllRequests ($action) {
	$firstName = $_GET['firstName'];
	$lastName = $_GET['lastName'];
	$date = $_GET['date'];

	$query = "SELECT * FROM Requests WHERE (firstName='" .$firstName ."' AND lastName='" .$lastName ."' AND onDate>'" .$date  ."')  ORDER BY onDate limit 5;";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}

function deleteRequest ($action) {
	$firstName = $_GET['firstName'];
	$lastName = $_GET['lastName'];
	$origin = $_GET['origin'];
	$destination = $_GET['destination'];
	$onDate = $_GET['onDate'];

	$query = "DELETE FROM Requests WHERE (firstName='" .$firstName ."' AND lastName='" .$lastName ."' AND origin='" .$origin ."' AND destination='" .$destination ."' AND onDate='"  .$onDate ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}

function getProbableRequestMatches ($action) {
	$origin = $_GET['origin'];
	$destination = $_GET['destination'];
	$onDate = $_GET['onDate'];
	$fbId = $_GET['fbId'];
	$range = $_GET['range'];

	$query = "SELECT * FROM Users WHERE (fbID='" .$fbId ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$email = $row['emailId'];
		$name = $row['firstName'];
	}
	$midDate = new DateTime($onDate);
	$startDate = new DateTime($onDate);
	$endDate = new DateTime($onDate);
	$endDate = $endDate->modify("+" .$range ." day")->format('Y-m-d');
	$startDate =  $startDate->modify("-" .$range ." day")->format('Y-m-d');

	$query = "SELECT * FROM Trips WHERE (origin='" .$origin ."' AND destination='" .$destination ."' AND onDate>='"  .$startDate ."' AND onDate<='"  .$endDate ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}

	$query = "SELECT * FROM Trips WHERE (origin='" .$destination ."' AND destination='" .$origin ."' AND returnDate>='" .$startDate ."' AND returnDate<='"  .$endDate ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo json_encode($rows);
}
/* End Request related queries */

/*Generic functions */
function sendEmail ($action) {
	
	echo "here";
/*	require_once "Mail.php";
	
	$self_fbId = $_GET['selfFbId'];
	$fbId = $_GET['fbId'];
	$nmf = $_GET['nmf'];
	$mf0 = $_GET['mf0'];
	$mf1 = $_GET['mf1'];
	$mfl0 = $_GET['mfl0'];
	$mfl1 = $_GET['mfl1'];
	$match = $_GET['match'];

	
	$query = "SELECT * FROM Users WHERE (fbID='" .$self_fbId ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$self_name = $row['firstName'];
	}

	$query = "SELECT * FROM Users WHERE (fbID='" .$fbId ."');";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)) {
		$email = $row['emailId'];
		$name = $row['firstName'];
	}

	
	$from = '<couriyaar.gmail.com>';
	$subject = 'Possible match for your ' . $match;
	if ($nmf == 0){
		$body = "Hi " . $name . ",\n\n We hope that you are doing good! We have a possible match for you. " . $self_name . " might be able to fulfill it.  You and " . $self_name . " have " . $nmf . " mutual friends. Please be careful when doing transactions with users with no mutual friends.";
	}
	else if ($nmf == 1){
		$body = "Hi " . $name . ",\n\n We hope that you are doing good! We have a possible match for you. " . $self_name . " might be able to fulfill it.  You and " . $self_name . " have " . $nmf . " mutual friend: " . $mfl0 . " (" . $mf0 . ").";
	}
	else{
		$body = "Hi " . $name . ",\n\n We hope that you are doing good! We have a possible match for you. " . $self_name . " might be able to fulfill it.  You and " . $self_name . " have " . $nmf . " mutual friends including " . $mfl0 . " (" . $mf0 . ")  and  " . $mfl1 ." (" . $mf1 . ").";
	}

  	$headers = array(
	    'From' => $from,
	    'To' => $email,
	    'Subject' => $subject
	);
	
	$smtp = Mail::factory('smtp', array(
	        'host' => 'ssl://smtp.gmail.com',
	        'port' => '465',
	        'auth' => true,
	        'username' => 'couriyaar@gmail.com',
	        'password' => 'test'
	    ));

	$mail = $smtp->send($email, $headers, $body);
	if (PEAR::isError($mail)) {
	     echo('<p>' . $mail->getMessage() . '</p>');
	} else {
	     echo('<p>Message successfully sent!</p>');
	 }*/
}

function logMessageSend($action) {
	$fbId = $_GET['fbId'];
	$addedId = $_GET['addedId'];

	$query = "INSERT INTO SendMessageLogs Values ('" .$fbId  ."', now(),  '" .$addedId ."'); ";
	mysql_select_db("Travels");
	$result = mysql_query($query);
	$rows = array();
	while($row = mysql_fetch_assoc($result)) {
		$rows[] = $row;
	}
	echo $query;
	//echo json_encode($rows);
}

	startConnection();
	$action = $_GET['action'];

	switch ($action){

		case 'getAirports':
		getAirports();
		break;

		case 'addUser':
		addUser($action);
		break;

		case 'getUsers':
		getUsers();
		break;

		case 'searchUser':
		searchUser($action);
		break;

		case 'addTrip':
		addTrip($action);
		break;

		case 'showAllTrips':
		showAllTrips($action);
		break;

		case 'deleteTrip':
		deleteTrip($action);
		break;

		case 'getProbableTravelMatches':
		getProbableTravelMatches($action);
		break;

		case 'searchTrip':
		searchTrip($action);
		break;

		case 'getTrips':
		getTrips($action);
		break;

		case 'addRequest':
		addRequest($action);
		break;

		case 'showAllRequests':
		showAllRequests($action);
		break;

		case 'deleteRequest':
		deleteRequest($action);
		break;

		case 'getProbableRequestMatches':
		getProbableRequestMatches($action);
		break;

		case 'sendEmail':
		sendEmail($action);
		break;

		case 'logMessageSend':
		logMessageSend($action);
		break;

		default:
		echo "Incorrect action";
		break;
	}

	closeConnection();

	?>
