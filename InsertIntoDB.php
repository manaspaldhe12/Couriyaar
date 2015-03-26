<?php
$con=mysql_connect("localhost","manas","startupRocks!");
if (!$con) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
echo $con;	
mysql_select_db("Travels");

$file = "airports.dat";

$myfile = fopen($file, "r") or die("Unable to open file");
echo "done";
mysql_close($con);
?>
