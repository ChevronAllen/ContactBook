var urlbase = //'website address';
var extension = 'php';

var userId = 0;
var firstName = '';
var lastName = '';

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("LogUser").value;	//obtaining value held in loginname and placing it inside the login variable
	var password = document.getElementById("LogPassword").value; //obtaining value held in loginpassoword and placing it inside password variable

	//document.getElementById("").innerHTML = "Need an ID inside HTML file to manipulate"; This line holds a place to change to error message to inform user they have entered an incorrect username or password

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	//async for login?
	xhr.open("POST", url, true);	//true associates with asyncrous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse(xhr.responseText);
		userId = jsonObject.id;

		if(userId < 1)	//checking if the username entered exists in the database
		{
			//document.getElementById("need section on login page of HTML to alert user that they have entered an incorrect username or password").innerHTML = "User/Password combination is incorrect";
			//return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		document.getElementById(//"id for section to show users first and last name").innerHTML = firstName + " " + lastName;

		document.getElementById("LogUser").value = "";		//resetting username
		document.getElementById("LogPassword").value = "";	//resetting password

		//hideOrShow("div for the logged in div", true);
		//hideOrShow("accessUIDiv", true);
		hideOrShow("SignIn", false);
		}
		catch(err)
		{
			//document.getElementById("section to hold to see if the login in process worked correctly").innerHTML = err.message;
		}
	}
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
	userId = 0;
	firstName = "";
	lastName = "";

	doHideorShow("//name of logged in div in html code", false); //hiding logged in div section
	doHideorShow("//name of access div in html code", false);	//hiding access interface section
	doHideorShow("SignIn", true);		//showing login section
}

function doRegister()
{
	// TODO:
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
