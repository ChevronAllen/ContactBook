<?php
require("SQL_Credentials.php");

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

$id = 0;
$username 	= "";
$password 	= "";
$sessionID  = "";

if($conn->connect_error)
{
	returnWithError("Error Connecting to the Server");
}else
{
	//	Sanitize JSON input
	$username 	= mysqli_real_escape_string($conn, $inData["username"]);
	$password 	= mysqli_real_escape_string($conn, $inData["password"]);
	$sessionID  = mysqli_real_escape_string($conn, $inData["sessionID"]);

	//	Call stored procedure that will insert a new user
	$sql = 'CALL contact_book.userLogin("' . $username . '", "' . $password . '", "' . $sessionID . '")';
	
	//	Capture results
	$result = $conn->query($sql);


	if ($result->num_rows == 0)
	{
		returnWithError("Invalid Username/Password.");
	}else
	{
		$row = $result->fetch_assoc();

		$id = $row["userid"];
		$firstName = $row["user_firstname"];
		$lastName = $row["user_lastname"];
		
		$result->close();
		$conn->next_result();

		//	if the id is zero something went wrong
		if($id == 0)
		{
			returnWithError("Invalid Username/Password combination.");
		}else
		{
			/*
				On a succesful login find all the user's contacts
			*/
						

			$searchSQL = 'CALL contact_book.findContacts(' . $id . ', "", "' . $sessionID . '" )';

			$result =  $conn->query($searchSQL);
			
			$jsonArray = array();			
			
			if($result->num_rows != 0)
			{			
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
			}

			returnWithInfo($id, $firstName, $lastName, json_encode($jsonArray) );
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

function createJSONString($id_, $firstName_, $lastName_, $contacts_, $error_)
{
  $ret = '
        {
          "id" : '. $id_ .' ,
          "firstName" : "' . $firstName_ . '",
          "lastName" : "' . $lastName_ . '",
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
  $retValue = createJSONString(0,"","","[]",$err);
  sendResultInfoAsJson( $retValue );
}

function returnWithInfo($id_, $firstName_, $lastName_, $contacts_ )
{
  $retValue = createJSONString($id_, $firstName_, $lastName_, $contacts_,"");
  sendResultInfoAsJson( $retValue );
}


?>
