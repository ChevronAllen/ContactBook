var apiFolder = 'API/'
var extension = 'php';

var userId = 0;	// userId is an int that must match with the database id for contact manipulation
var firstName = ''; // user first name
var lastName = '';	// user last name
var sessionID = 0;	// generated sessionID that is created and sent on login/registration
var contacts = [];	// array of contacts for user

function hideOrShow(elementId, showState)
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

// Changes visibility to Sign In view
function switchToSignIn()
{
	var signUpItems = document.getElementsByClassName("Reg");
	var i = 1;
	for( i = 0; i < signUpItems.length; i++ )
	{
		signUpItems[i].style.visibility = "hidden";
	}

	var signInItems = document.getElementsByClassName("SignIn");
	for( i = 0; i < signInItems.length; i++ )
	{
		signInItems[i].style.visibility = "visible";
	}

	var title = document.getElementById("title").innerHTML = "Sign-In";
	console.log("sign in");
}

// Changes visibility to Registration view
function switchToSignUp()
{
	var signUpItems = document.getElementsByClassName("Reg");
	var i = 1;
	for( i = 0; i < signUpItems.length; i++ )
	{
		signUpItems[i].style.visibility = "visible";
	}

	var signInItems = document.getElementsByClassName("SignIn");
	for( i = 0; i < signInItems.length; i++ )
	{
		signInItems[i].style.visibility = "hidden";
	}

	var title = document.getElementById("title").innerHTML = "Register";
	console.log("sign up");
}

// doLogin takes a username and password from LogUser and LogPassword id
// sessionID is created as a 10 alphanumeric char string
// JSON payload is then created and sent asynchronously
// the wait for the response will then continue in the background
// once a response is recieved the JSON recieved will be parsed for an error
// if no error is found the user fields are filled
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	sessionID = 0;
	contacts = [];
	document.getElementById("loginResult").innerHTML = "";

	username = document.getElementById("LogUser").value;	//obtaining value held in loginname and placing it inside the login variable
	password = document.getElementById("LogPassword").value; //obtaining value held in loginpassoword and placing it inside password variable

	if(!isAlphaNumeric(username))
	{
		document.getElementById("loginResult").innerHTML = "Username can only consist of alphabetical, numerical, or _ characters";
		return;
	}

	hashedPassword = md5(password);

	// creates a unique 10 character string in base 36 ranging from 0-9 to a-z
	sessionID = Math.random().toString(36).substr(2, 10);

	var jsonPayload = '{'
		+ '"username":"'   + username  + '", '
		+ '"password":"'   + hashedPassword  + '", '
		+ '"sessionID":"'  + sessionID
		+ '"}';

	var url = apiFolder + 'Login.' + extension;

	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);	//true associates with asyncrous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// xhr.onreadystatechange is called when xhr.send recieves a response
	// readyState == 4 means done with XMLHttpRequest
	// status == 200 is a successful request once finished
	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4)
		{
			if(this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.id;

				if(userId < 1)	//checking if the username entered exists in the database
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName  = jsonObject.lastName;
				contacts  = jsonObject.contacts;
				error     = jsonObject.error;

				//document.getElementById("id for section to show users first and last name").innerHTML = firstName + " " + lastName;
				document.getElementById("LogUser").value = "";		//resetting username
				document.getElementById("LogPassword").value = "";	//resetting password

			}
			else
			{
				document.getElementById("loginResult").innerHTML = " error " + this.status;
			}
		}
	}

	xhr.send(jsonPayload);
}

// erases logged in fields
function doLogout()
{
	//resetting these three variables to empty
	userId    = 0;
	firstName = "";
	lastName  = "";
	contacts = [];
	sessionID = 0;

	doHideorShow("name of logged in div in html code", false); //hiding logged in div section
	doHideorShow("name of access div in html code", false);	//hiding access interface section
	doHideorShow("SignIn", true); //showing login section
}

// doRegister takes a username and password from LogUser and LogPassword id
// a first name from RegFirst, last name from RegLast id
// sessionID is created as a 10 alphanumeric char string
// JSON payload is then created and sent asynchronously
// the wait for the response will then continue in the background
// once a response is recieved the JSON recieved will be parsed for an error
// if no error is found the user fields are filled
function doRegister()
{
	userId    = 0;
	firstName = "";
	lastName  = "";
	sessionID = 0;
	contacts  = [];
	document.getElementById("loginResult").innerHTML = "";

	firstName   = document.getElementById("RegFirst").value;	//obtaining value held in loginname and placing it inside the login variable
	lastName    = document.getElementById("RegLast").value; //obtaining value held in loginpassoword and placing it inside password variable
	username    = document.getElementById("LogUser").value;	//obtaining value held in loginname and placing it inside the login variable
	password    = document.getElementById("LogPassword").value; //obtaining value held in loginpassoword and placing it inside password variable
	rePassword  = document.getElementById("RePassword").value; //obtaining value held in loginpassoword and placing it inside password variable


	if(!isAlphaNumeric(username) || !isAlphaNumeric(firstName) || !isAlphaNumeric(lastName))
	{
		document.getElementById("loginResult").innerHTML = "Username and name fields can only consist of alphabetical characters, numerical characters, or _";
		return;
	}

	if(password != rePassword)
	{
		document.getElementById("loginResult").innerHTML = "Passwords are not identical";
		return;
	}

	hashedPassword = md5(password);

	// creates a unique 10 character string in base 36 ranging from 0-9 to a-z
	sessionID = Math.random().toString(36).substr(2, 10);

	var jsonPayload = '{'
		+ '"firstName":"'   + firstName       + '", '
		+ '"lastName":"'    + lastName       + '", '
		+ '"username":"'    + username        + '", '
		+ '"password":"'    + hashedPassword  + '", '
		+ '"sessionID":"'   + sessionID
		+ '"}';

	var url =  apiFolder + 'Register.' + extension;

	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true); //true associates with asyncrous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4)
		{
			if (this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.id;
				error  = jsonObject.error;
				if(userId < 1)	//checking if the username entered exists in the database
				{
					document.getElementById("loginResult").innerHTML = error;
					return;
				}

				firstName = jsonObject.firstName;
				lastName  = jsonObject.lastName;
				contacts  = jsonObject.contacts;

				//document.getElementById("id for section to show users first and last name").innerHTML = firstName + " " + lastName;
				document.getElementById("LogUser").value = "";		//resetting username
				document.getElementById("LogPassword").value = "";	//resetting password

				//hideOrShow("div for the logged in div", true);
				//hideOrShow("accessUIDiv", true);
				//hideOrShow("loginContainer", false);
				document.getElementById("loginResult").innerHTML = "Logged in";

			}
			else
			{
				document.getElementById("loginResult").innerHTML = " error " + this.status;
			}
		}
	}

	xhr.send(jsonPayload);
}

// TODO: comment on addContact
function addContact()
{
	//initailizing variable to empty strings
	var contactFirstName = "";
	var contactLastName = "";
	var contactAddress = "";
	var contactState = "";
	var contactCity	= "";
	var contactZipcode = "";
	var contactAPT = "";
	var contactEmail = "";
	var contactPhoneNumber = "";

	//obtaining and storing the values entered by user into the specified variable
	contactFirstName = document.getElementById("firstname").value;
	contactLastName = document.getElementById("lastname").value;
	contactAddress = document.getElementById("contactaddress").value;
	contactState = document.getElementById("state").value;
	contactCity = document.getElementById("city").value;
	contactZipcode = document.getElementById("zipcode").value;
	contactAPT = document.getElementById("aptnum").value;
	contactEmail = document.getElementById("emailaddress").value;
	contactPhoneNumber = document.getElementById("phonenumber").value;

	var jsonPayload = '{'
			+ '"id":'			+ userId              + ','
			+ '"firstName":"'	+ contactFirstName    + '",'
			+ '"lastName":"'	+ contactLastName     + '",'
			+ '"address":"'		+ contactAddress      + '",'
			+ '"city":"'		+ contactCity         + '",'
			+ '"state":"'		+ contactState        + '",'
			+ '"zipCode":"'		+ contactZipcode      + '",'
			+ '"email":"'		+ contactEmail        + '",'
			+ '"phone":"'		+ contactPhoneNumber  + '",'
			+ '"sessionID":"'	+ sessionID
			+ '"}';

	var url =  apiFolder + 'AddContact.' + extension;
	var xhr = new XMLHttpRequest();

  	xhr.open("POST", url, true);	//true associates with asyncrous
  	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  	xhr.onreadystatechange = function()
  	{
    	if (this.readyState == 4)
		{
			if (this.status == 200)
    		{
      			var jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.id;
				error  = jsonObject.error;

				if(userId < 1)	//checking if the username entered exists in the database
				{
					console.log(error);  // temp notification
					//document.getElementById("loginResult").innerHTML = error;
					return;
				}

				var contactID = jsonObject.contactID;

				var jsonContact = '{'
					+ '"contactID":""' + contactID           + '",'
					+ '"firstName":"'  + contactFirstName    + '",'
					+ '"lastName":"'   + contactLastName     + '",'
					+ '"address":"'    + contactAddress      + '",'
					+ '"city":"'       + contactCity         + '",'
					+ '"state":"'      + contactState        + '",'
					+ '"zipCode":"'    + contactZipcode      + '",'
					+ '"email":"'      + contactEmail        + '",'
					+ '"phone":"'      + contactPhoneNumber  +
					+ '"}';

				// WARNING Hasnt been tested
				// local storage of added contact
				contacts.push(JSON.parse(jsonContact));
				// TODO: fill contacts on html
    		}
    		else
    		{
      			console.log("error with response");
      			//document.getElementById("loginResult").innerHTML = this.status;
    		}
		}
	}

  xhr.send(jsonPayload);
}

// searches local contacts array for a match
function searchContact()
{
  	var search = new RegExp(document.getElementById("").innerHTML);

  	contacts.forEach(
    	function displayIfMatch(element)
    	{
			var match = 0;
			for(var key in element)
			{
				if(search.test(element[key]))
				{
					match = 1;
				}
			}
			if(match == 1)
			{
				// TODO: display contact to html
			}
		}
	);
}

// TODO: comments
function deleteContact()
{
	//initailizing variable to empty strings
	var contactFirstName = "";
	var contactLastName = "";
	var contactAddress = "";
	var contactState = "";
	var contactCity	= "";
	var contactZipcode = "";
	var contactAPT = "";
	var contactEmail = "";
	var contactPhoneNumber = "";

	//obtaining and storing the values entered by user into the specified variable
	contactFirstName = document.getElementById("firstname").value;
	contactLastName = document.getElementById("lastname").value;
	contactAddress = document.getElementById("contactaddress").value;
	contactState = document.getElementById("state").value;
	contactCity = document.getElementById("city").value;
	contactZipcode = document.getElementById("zipcode").value;
	contactAPT = document.getElementById("aptnum").value;
	contactEmail = document.getElementById("emailaddress").value;
	contactPhoneNumber = document.getElementById("phonenumber").value;

	var jsonPayload = '{'
			+ '"id":'			+ userId              + ','
			+ '"firstName":"'	+ contactFirstName    + '",'
			+ '"lastName":"'	+ contactLastName     + '",'
			+ '"address":"'		+ contactAddress      + '",'
			+ '"city":"'		+ contactCity         + '",'
			+ '"state":"'		+ contactState        + '",'
			+ '"zipCode":"'		+ contactZipcode      + '",'
			+ '"email":"'		+ contactEmail        + '",'
			+ '"phone":"'		+ contactPhoneNumber  + '",'
			+ '"sessionID":"'	+ sessionID
			+ '"}';

	var url =  apiFolder + 'DeleteContact.' + extension;
	var xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);	//true associates with asyncrous
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function()
  {
  	if (this.readyState == 4)
	{
		if (this.status == 200)
		{
			var jsonObject = JSON.parse(xhr.responseText);

			userId = jsonObject.id;
			error  = jsonObject.error;

			if(userId < 1)	//checking if the username entered exists in the database
			{
				console.log(error);  // temp notification
				//document.getElementById("loginResult").innerHTML = error;
				return;
			}

			var contactID = jsonObject.contactID;

			var jsonContact = '{'
					+ '"contactID":""' + contactID           + '",'
					+ '"firstName":"'  + contactFirstName    + '",'
					+ '"lastName":"'   + contactLastName     + '",'
					+ '"address":"'    + contactAddress      + '",'
					+ '"city":"'       + contactCity         + '",'
					+ '"state":"'      + contactState        + '",'
					+ '"zipCode":"'    + contactZipcode      + '",'
					+ '"email":"'      + contactEmail        + '",'
					+ '"phone":"'      + contactPhoneNumber  +
					+ '"}';

			// WARNING HASNT BEEN TESTED
			// this should remove the contact locally
			var index = contacts.indexof(JSON.parse(jsonContact));
			contacts.splice(JSON.parse(jsonContact), 1);
			// TODO: fill contacts on html
  		}
  		else
  		{
    			console.log("error with response");
    			//document.getElementById("loginResult").innerHTML = this.status;
  		}
		}
	}

  xhr.send(jsonPayload);
}
