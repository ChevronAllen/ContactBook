<?php
//php script will not run without the credentials file
require("SQL_Credentials.php");

//	Make Connection
$conn = new mysqli($serverURL, $serverLogin, $serverAuth, $serverDB);

//Get JSON input
$inData = getRequestInfo();

$userID = 0;
$firstName = "";
$lastName = "";
$email = "";
$phoneNumber = "";
$address = "";
$city = "";
$state = "";
$zipCode = "";
$sessionID = "";

if($inData  == NULL){
	returnWithError("Communications Error, NULL input");
//	Test for connection errors
}else if($conn->connect_error){
	returnWithError("Error Connecting to the Server");
}else{

	//	Sanitize JSON input
	$userID = mysqli_real_escape_string($conn, $inData["id"]);
	$firstName = mysqli_real_escape_string($conn, $inData["firstName"]);
	$lastName = mysqli_real_escape_string($conn, $inData["lastName"]);
	$email = mysqli_real_escape_string($conn, $inData["email"]);
	$phoneNumber = mysqli_real_escape_string($conn, $inData["phone"]);
	$address = mysqli_real_escape_string($conn, $inData["address"]);
	$city = mysqli_real_escape_string($conn, $inData["city"]);
	$state = mysqli_real_escape_string($conn, $inData["state"]);
	$zipCode = mysqli_real_escape_string($conn, $inData["zipCode"]);
	$sessionID = mysqli_real_escape_string($conn, $inData["sessionID"]);
	
	
	//	Call stored procedure that will insert a new user
	$sql = 'CALL contact_book.createContact(' . $userID . ',"' . $firstName . '","' 
											  . $lastName . '","' . $phoneNumber . '","' 
											  . $email . '","' . $address . '","' 
											  . $city. '","' . $state . '","' 
											  . $zipCode . '","' . $sessionID . '");';
	
	
	//	Capture results
	$result = $conn->query($sql);

	//check if anything was returned
	if ($result->num_rows == 0)
	{
		returnWithError("There was an error adding contact.");
	}else
	{
    //capture return row from sql result data
		$row = $result->fetch_assoc();
		$contactID = $row["contactid"];
		$userID = $row["userid"];

		//	if the id is zero something went wrong
		if($contactID == 0 || $userID == 0) {
			returnWithError("Error adding new contact.");
		}else {
			returnWithInfo($userID, $contactID, "");
		}
	}
}

 // Close the connection
$conn->close();

 //	Retrieves data sent to the php
function getRequestInfo(){
  return json_decode(file_get_contents('php://input'), true);
}

//create json string from parameters
function createJSONString($userID_, $contactID_, $err_){
  $ret = '
	{
    "id": '.$userID_.',
    "contactID": '.$contactID_.',
    "error": "'.$err_.'"
  }';
  
  return $ret;
}


function sendResultInfoAsJson( $obj ){
  header('Content-type: application/json');
  echo $obj;
}


function returnWithError( $err ){
  $retValue = createJSONString(0,"[]",$err);
  sendResultInfoAsJson( $retValue );
}


function returnWithInfo($userID, $contactID, $err){
  $retValue = createJSONString($userID, $contactID, $err);
  sendResultInfoAsJson( $retValue );
}
?>
