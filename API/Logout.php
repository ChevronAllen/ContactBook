<?php
//php script will not run without the credentials file
require("SQL_Credentials.php");

//	Make Connection
$conn = new mysqli($serverURL, $serverLogin, $serverAuth, $serverDB);

//Get JSON input
$inData = getRequestInfo();
$userID = 0;
$sessionID = "";

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
  $userID = mysqli_real_escape_string($conn, $inData["id"]);
  $sessionID = mysqli_real_escape_string($conn, $inData["sessionID"]);

	//	Call stored procedure that will delete a contact
	$sql = 'CALL contact_book.logoutUser('.$userID.',"'.$sessionID.'");';

	//	Capture results
	$result = $conn->query($sql);

	//result should be the row of the contacts table of the contact that was deleted
	if ($result->num_rows <= 0)
	{
		returnWithError("Logout failed.");
	}else
	{
		returnWithInfo($userID, "");
	}
}

 // Close the connection
$conn->close();

 //	Retrieves data sent to the php
function getRequestInfo()
{
  return json_decode(file_get_contents('php://input'), true);
}


function createJSONString($userID_, $err_)
{
  $ret = '
	{
    "id": '.$userID_.',
    "error": "'.$err_.'"
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
  $retValue = createJSONString(0,$err);
  sendResultInfoAsJson( $retValue );
}


function returnWithInfo($userID, $err)
{
  $retValue = createJSONString($userID, $err);
  sendResultInfoAsJson( $retValue );
}
?>
