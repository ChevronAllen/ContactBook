<?php
require("SQL_Credentials.php");
//	Make Connection
$conn = new mysqli($serverURL, $serverLogin, $serverAuth, $serverDB);
//	Get JSON input
$inData = getRequestInfo();

$userID = 0;
$matchString 	= "";
$sessionID  = "";

if($conn->connect_error)
{
	returnWithError("Error Connecting to the Server");
}else
{
	//	Sanitize JSON input
	$userID 	= mysqli_real_escape_string($inData["id"]);
	$matchString 	= mysqli_real_escape_string($inData["matchString"]);
	$sessionID  = mysqli_real_escape_string($inData["sessionID"]);

	$sql = 'CALL contact_book.findContacts("'	. $userID 	. '",
					"' 	. $matchString 	. '","' 	. $sessionID 	.'");';

	//capture results from sql
	$result = $conn->query($sql);

	if ($result->num_rows <= 0){
		returnWithError("No rows returned");
	}else{

		$list = array();	// Empty array

		while($row = $result->fetch_assoc())//mysql_fetch_assoc($result))
		{
			//add rows to array individually
			$list[] = $row;
		}
		//	convert array of rows to json data
		$contacts = json_encode($data);
		returnWithInfo($id,  $contacts,"");
	}

}
// Close the connection
$conn->close();
//	Retrieves data sent to the php
function getRequestInfo()
{
  return json_decode(file_get_contents('php://input'), true);
}
function createJSONString($id_,  $contacts_, $error_)
{
  $ret = '
        {
          "id" : '. $id_ .' ,
          "contacts" : '. ($contacts_ == "" ? "[]":$contacts_) . ' ,
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
  $retValue = createJSONString(0,"",$err);
  sendResultInfoAsJson( $retValue );
}
function returnWithInfo($id_,  $contacts_, $err)
{
  $retValue = createJSONString($id_, $firstName_, $lastName_, $contacts_,"");
  sendResultInfoAsJson( $retValue );
}
?>
