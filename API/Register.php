<?php

/* TODO:
  Read JSON input
  Sanitize fields
  Run stored procedure
  Echo Response JSON
*/

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

function returnWithInfo( $firstName, $lastName, $id )
{
  $retValue = createJSONString($id,$firstName,$lastName,"","","","");
  sendResultInfoAsJson( $retValue );
}


 ?>
