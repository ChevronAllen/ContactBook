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
$sessionID  = "";


if($conn->connect_error)
{
	returnWithError("Error Connecting to the Server");
}else
{
	//	Sanitize JSON input
	$firstName 	= mysqli_real_escape_string($conn, $inData["firstName"]);
	$lastName 	= mysqli_real_escape_string($conn, $inData["lastName"]);
	$username 	= mysqli_real_escape_string($conn, $inData["username"]);
	$password 	= mysqli_real_escape_string($conn, $inData["password"]);

	//	Call stored procedure that will insert a new user
	$sql = 'CALL contact_book.createUser("'  . $firstName . '",
							"' . $lastName . '",
							"' . $username . '",
							"' . $password . '",
							"' . $sessionID .'");';

	//	Capture results
	$result = $conn->query($sql);

	/*
		result should be a row from the users table
		capture the new users id to be sent back
		we recieve the whole row so that if we need to implement
		a session id that would be sent.
	*/

	if ($result->num_rows == 0){
		returnWithError("Error: User already exists , $result");
	}else
	{

		$row = $result->fetch_assoc();

		$id = $row["userid"];
		$firstName = $row["user_firstname"];
		$lastName = $row["user_lastname"];

		//	if the id is zero something went wrong
		if($id == 0)
		{
			returnWithError("Error adding new user id is zero");
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

function createJSONString($id_, $firstName_, $lastName_ ,$error_)
{
  $ret = '
        {
          "id" : '. $id_ .' ,
          "firstName" : "' . $firstName_ . '",
          "lastName" : "' . $lastName_ . '",
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
  $retValue = createJSONString(0,"","",$err);
  sendResultInfoAsJson( $retValue );
}

function returnWithInfo($id, $firstName, $lastName )
{
  $retValue = createJSONString($id, $firstName, $lastName, "");
  sendResultInfoAsJson( $retValue );
}


 ?>
