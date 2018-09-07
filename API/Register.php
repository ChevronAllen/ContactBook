<?php
require("SQL_Credentials.php");

//	Make Connection
$conn = new mysqli($serverURL, $serverLogin, $serverAuth, $serverDB);

//	Get JSON input
$inData = getRequestInfo();

$id = 0;
$firstName 	= "";
$lastName 	= "";
$username 	= "";
$password 	= "";


//	TODO:	proper check for JSON POST data http://thisinterestsme.com/receiving-json-post-data-via-php/
if($inData  == NULL)
{
	returnWithError("Communications Error, NULL input");

//	Test for connection errors
}else if($conn->connect_error)
{
	returnWithError("Error Connecting to the Server");
}else
{
	//	Sanitize JSON input
	$username = $mysqli->real_escape_string($inData["username"]);
	$firstName = $mysqli->real_escape_string($inData["firstName"]);
	$lastName = $mysqli->real_escape_string($inData["lastName"]);
	$password = $mysqli->real_escape_string($inData["password"]);

	//	Call stored procedure that will insert a new user
	$sql = 'CALL proc_Add_New_User('  . $firstName . ',
									' . $lastName . ',
									' . $username . ',
									' . $password . ')';
	//	Capture results
	$results = $conn->query($sql);

	/*
		result should be a row from the users table
		capture the new users id to be sent back
		we recieve the whole row so that if we need to implement
		a session id that would be sent.
	*/
	if ($result->num_rows <= 0){
		returnWithError("Error adding new user");
	}else{


		$row = $result->fetch_assoc();
		//$firstName = $row["user_firstname"];
		//$lastName = $row["user_lastname"];
		$id = $row["iduser"];


		//	if the id is zero somethign went wrong
		if($id == 0)
		{
			returnWithError("Error adding new user");
		}else
		{
			returnWithInfo($id, $firstName, $lastName);
		}
	}
}

// Close the connection
$conn->close();

//	Retrieves data sent to the php
function getRequestInfo()
{
  return json_decode(file_get_contents('php://input'), true);
}

function createJSONString($id_,$firstName_,$lastName_,$username_,$password_,$contacts_,$error_)
{
  $ret = '
        {
          "id" : '. $id_ .' ,
          "firstName" : "' . $firstName_ . '",
          "lastName" : "' . $lastName_ . '",
          "username" : "'. $username_ . '",
          "password" : "'. $password_ . '",
          "contacts" : '. $contacts_ . ' ,
          "error" : "' . $error_ . '"
        }';
  return $ret;
}

function sendResultInfoAsJson( $obj )
{
  header('Content-type: application/json');
  echo $obj;
}

function returnWithError( $err )
{
  $retValue = createJSONString(0,"","","","","",$err);
  sendResultInfoAsJson( $retValue );
}

function returnWithInfo($id, $firstName, $lastName )
{
  $retValue = createJSONString($id,$firstName,$lastName,"","","","");
  sendResultInfoAsJson( $retValue );
}


 ?>
