<?php
require("SQL_Credentials.php");

//create a class contact for store contacts from sql results
class Contact {
    function __construct() {
		$this->contactID = "";
		$this->firstName = "";
		$this->lastName = "";
		$this->address = "";
		$this->city = "";
		$this->state = "";
		$this->zipCode = "";
		$this->email = "";
		$this->phone = "";
    }
}

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
	$userID 		= mysqli_real_escape_string($conn, $inData["id"]);
	$matchString	= mysqli_real_escape_string($conn, $inData["matchString"]);
	$sessionID  	= mysqli_real_escape_string($conn, $inData["sessionID"]);

	$sql = 'CALL contact_book.findContacts(' . $userID . ', "' . $matchString . '", "' . $sessionID .'");';

	//capture results from sql
	$result = $conn->query($sql);

	//if no rows are return then there is no contacts or an error happened
	if ($result->num_rows == 0)
	{
		returnWithError("No contacts found.");
	}else
	{

		//create json array to store contacts
		$jsonArray = array();

		//iterate through search results adding the contacts to an array
		while($row = $result->fetch_assoc())
		{
			$jsonObject = new Contact();
			$jsonObject->contactID = $row["contactid"];
			$jsonObject->firstName = $row["contact_firstname"];
			$jsonObject->lastName = $row["contact_lastname"];
			$jsonObject->address = $row["contact_address"];
			$jsonObject->city = $row["contact_city"];
			$jsonObject->state = $row["contact_state"];
			$jsonObject->zipCode = $row["contact_zipcode"];
			$jsonObject->email = $row["contact_email"];
			$jsonObject->phone = $row["contact_phone"];
			$jsonArray[] = $jsonObject;
		}

		//sends userid and contacts array via json
		returnWithInfo($userID, json_encode($jsonArray), "");

	}
}

// Close the connection
$conn->close();

//	Retrieves data sent to the php
function getRequestInfo()
{
  return json_decode(file_get_contents('php://input'), true);
}

//creates json string from parameters
function createJSONString($id_,  $contacts_, $error_)
{
  $ret = '
        {
          "id" : '. $id_ .' ,
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
  $retValue = createJSONString(0,"",$err);
  sendResultInfoAsJson( $retValue );
}


function returnWithInfo($id_,  $contacts_, $err)
{
  $retValue = createJSONString($id_, ($contacts_ == NULL ? "[]":$contacts_), "");
  sendResultInfoAsJson( $retValue );
}
?>
