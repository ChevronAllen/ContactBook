var urlbase = ''  //'website address';
var extension = 'php';

var userId = 0;
var firstName = '';
var lastName = '';
var sessionID = 0;
var contacts = [];

function doLogin()
{
  userId = 0;
  firstName = "";
  lastName = "";
  sessionID = 0;
  contacts = [];

  username = document.getElementById("LogUser").value;	//obtaining value held in loginname and placing it inside the login variable
  password = document.getElementById("LogPassword").value; //obtaining value held in loginpassoword and placing it inside password variable

  if(!isAlphaNumeric(username))
  {
    console.log("username invalid");  // temp notification
    //document.getElementById("loginResult").innerHTML = "Username can only consist of alphabetical, numerical, or _ characters";
    return;
  }

  hashedPassword = md5(password);

  // creates a unique 10 character string in base 36 ranging from 0-9 to a-z
  sessionID = Math.random().toString(36).substr(2, 10);

  var jsonPayload = '{'
      + '"username":"'   + username  + '", '
      + '"password":"'   + hashedPassword  + '", '
      + '"sessionID":"'  + sessionID + '", '
      + '"}';

  var url = urlBase + '/Login.' + extension;

  var xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);	//true associates with asyncrous
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  // xhr.onreadystatechange is called when xhr.send recieves a response
  // readyState == 4 means done with XMLHttpRequest
  // status == 200 is a successful request once finished
  xhr.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      var jsonObject = JSON.parse(xhr.responseText);

  		userId = jsonObject.id;

      if(userId < 1)	//checking if the username entered exists in the database
      {
        console.log("not a user");  // temp notification
        //document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
        return;
      }

      firstName = jsonObject.firstName;
      lastName  = jsonObject.lastName;
      contacts  = jsonObject.contacts;
      error     = jsonObject.error;

      //document.getElementById("id for section to show users first and last name").innerHTML = firstName + " " + lastName;
      document.getElementById("LogUser").value = "";		//resetting username
      document.getElementById("LogPassword").value = "";	//resetting password

      //hideOrShow("div for the logged in div", true);
      //hideOrShow("accessUIDiv", true);
      hideOrShow("SignIn", false);
    }
    else
    {
      console.log("error with response");
      //document.getElementById("loginResult").innerHTML = err.message;
    }
  }

  xhr.send(jsonPayload);
}

function doHideorShow(elementId, showState)
{
	var visible = "visible";
	var display = "block";
	if(!showState)
	{
		visible = "hidden";
		display = "none";
	}

	document.getElementById(elementId).style.visibility = visible;
	document.getElementById(elementId).style.display = display;
}

function doLogout()
{
  //resetting these three variables to empty
  userId    = 0;
  firstName = "";
  lastName  = "";
  sessionID = 0;

  doHideorShow("//name of logged in div in html code", false); //hiding logged in div section
  doHideorShow("//name of access div in html code", false);	//hiding access interface section
  doHideorShow("SignIn", true);		//showing login section
}

function doRegister()
{
  userId    = 0;
  firstName = "";
  lastName  = "";
  sessionID = 0;
  contacts  = [];

  firstName   = document.getElementById("RegFirst").value;	//obtaining value held in loginname and placing it inside the login variable
  lastName    = document.getElementById("RegLast").value; //obtaining value held in loginpassoword and placing it inside password variable
  username    = document.getElementById("LogUser").value;	//obtaining value held in loginname and placing it inside the login variable
  password    = document.getElementById("LogPassword").value; //obtaining value held in loginpassoword and placing it inside password variable
  rePassword  = document.getElementById("RePassword").value; //obtaining value held in loginpassoword and placing it inside password variable


  if(!isAlphaNumeric(username))
  {
    console.log("username invalid");  // temp notification
    //document.getElementById("loginResult").innerHTML = "Username can only consist of alphabetical, numerical, or _ characters";
    return;
  }

  if(password != rePassword)
  {
    console.log("password mismatch");  // temp notification
    //document.getElementById("loginResult").innerHTML = "Passwords are not identical";
    return;
  }

  hashedPassword = md5(password);

  // creates a unique 10 character string in base 36 ranging from 0-9 to a-z
  sessionID = Math.random().toString(36).substr(2, 10);

  var jsonPayload = '{'
      + '"firstName":"'   + firstName       + '", '
      + '"lastName":"'    + lasteName       + '", '
      + '"username":"'    + username        + '", '
      + '"password":"'    + hashedPassword  + '", '
      + '"sessionID":"'   + sessionID
      + '"}';

  var url = urlBase + '/Register.' + extension;

  var xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);	//true associates with asyncrous
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function()
  {
    if (this.readyState == 4 && this.status == 200)
    {
      var jsonObject = JSON.parse(xhr.responseText);

      userId = jsonObject.id;

      if(userId < 1)	//checking if the username entered exists in the database
      {
        console.log("not a user");  // temp notification
        //document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
        return;
      }

      firstName = jsonObject.firstName;
      lastName  = jsonObject.lastName;
      error     = jsonObject.error;

      //document.getElementById("id for section to show users first and last name").innerHTML = firstName + " " + lastName;
      document.getElementById("LogUser").value = "";		//resetting username
      document.getElementById("LogPassword").value = "";	//resetting password

      //hideOrShow("div for the logged in div", true);
      //hideOrShow("accessUIDiv", true);
      hideOrShow("SignIn", false);
    }
    else
    {
      console.log("error with response");
      //document.getElementById("loginResult").innerHTML = err.message;
    }
  }

  xhr.send(jsonPayload);
}

function addContact()
{
  var contactFirstName;
	var contactLastName;
	var contactAddress;
	var contactZipcode;
	var contactCity;
	var contactState;
	var contactPhoneNumber;
}

function searchContact()
{
	// TODO:
}

function deleteContact()
{
	// TODO:
}
