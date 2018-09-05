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
	$username = $mysqli->real_escape_string($inData["username"]);
	$password = $mysqli->real_escape_string($inData["password"]);
	$sessionID  = $mysqli->real_escape_string($inData["sessionID"]);
	
	//	Call stored procedure that will insert a new user
	$sql = 'CALL userLogin("'	. $username 	. '",
							"' 	. $password 	. '",
							"' 	. $sessionID 	.'");';
	//	Capture results
	$results = conn->query($sql);

	/*
		result should be a row from the users table
		capture the new users id to be sent back
		we recieve the whole row so that if we need to implement
		a session id that would be sent.
	*/
	if ($result->num_rows <= 0){
		returnWithError("Invalid Username/Password.");
	}else{


		$row = $result->fetch_assoc();
		$id = $row["iduser"];


		//	if the id is zero something went wrong
		if($id == 0)
		{
			returnWithError("Invalid Username/Password.");
		}else
		{
			// Successful login
			
			// find contacts
			
			$sql = 'CALL findContacts ("' . $id . '","","' . $sessionID .'");';
			
			$results =  conn->query($sql);
			$list = array();
			while($row = mysql_fetch_assoc($result))
			{
				$list[] = $row;
			}
			
			$contacts = json_decode($data); 
			returnWithInfo($id, $firstName, $lastName, $contacts,"");
			
			
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

function createJSONString($id_,$firstName_,$lastName_,$contacts_,$error_)
{
  $ret = '
        {
          "id" : '. $id_ .' ,
          "firstName" : "' . $firstName_ . '",
          "lastName" : "' . $lastName_ . '",
          "contacts" : '. $contacts_ . ' ,
          "error" : "' . $error_ . '"
        }';
		
		

}
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
