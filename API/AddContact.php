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
	$phoneNumber = mysqli_real_escape_string($conn, $inData["phoneNumber"]);
  $address = mysqli_real_escape_string($conn, $inData["address"]);
  $city = mysqli_real_escape_string($conn, $inData["city"]);
  $state = mysqli_real_escape_string($conn, $inData["state"]);
  $zipCode = mysqli_real_escape_string($conn, $inData["zipCode"]);
  $sessionID = mysqli_real_escape_string($conn, $inData["sessionID"]);

	//	Call stored procedure that will insert a new user
	$sql = 'CALL contact_book.createContact("'.$userID.'", "'.$firstName.'",
    "'.$lastName.'","'.$phoneNumber.'","'. $email.'","'. $address.'",
    "'.$city.'","'.$state.'","'.$zipCode.'","'.$sessionID.'")';
	//	Capture results
	$result = $conn->query($sql);
	/*
		result should be a row from the contacts table
		capture the new contact id to be sent back
		we recieve the whole row so that if we need to implement
		a session id that would be sent.
	*/
	if ($result->num_rows <= 0){
		returnWithError("Error adding new contact");
	}else{
    //create array from sql result data
		$row = $result->fetch_assoc();
		$contactID = $row["contactid"];
		$userID = $row["iduser"];
		/*
			FIX:  read in contadtID and usrID from  $row
			then check if either of them is zero
		*/
		//	if the id is zero something went wrong
		if($contactID == 0 || $userID == 0) {
			returnWithError("Error adding new contact");
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
function createJSONString($userID_, $contactID_, $err_){
  $ret = '
	{
    "id": '.$userID_.',
    "contactID": '.$contactID_.',
    "error": '.$err_.';
  }';
}
function sendResultInfoAsJson( $obj ){
  header('Content-type: application/json');
  echo $obj;
}
function returnWithError( $err ){
  $retValue = createJSONString(0,"",$err);
  sendResultInfoAsJson( $retValue );
}
function returnWithInfo($userID, $contactID, $err){
  $retValue = createJSONString($userID, $contactID, $err);
  sendResultInfoAsJson( $retValue );
}
//($userID, $firstName, $lastName, $email, $phoneNumber,
//$address, $city, $state, $zipCode, $contactID, "")
?>
