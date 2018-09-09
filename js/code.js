var apiFolder = 'API/'
var extension = 'php';

var userId = 0;	// userId is an int that must match with the database id for contact manipulation
var firstName = ''; // user first name
var lastName = '';	// user last name
var sessionID = 0;	// generated sessionID that is created and sent on login/registration
var contacts = [];	// array of contacts for user
var currentSelected = -1;

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

// WARNING: hasn't been TESTED
// shows all contacts in the contact array to contact list
function showAllContacts()
{
	document.getElementById("contactListBox").innerHTML = '';
	var html = '';
	for(let i = 0; i < contacts.length; i++)
	{
		html = '<div id ="contactCard'+i+'" class="card contactCard" onclick="selectContact('+i+')">'+ contacts[i].firstName + ' ' + contacts[i].lastName + '</div>';
		document.getElementById("contactListBox").innerHTML += html;
	}
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
					var error = jsonObject.error;
					document.getElementById("loginResult").innerHTML = error;
					document.getElementById("loginButton").disabled = false;
					return;
				}

				firstName = jsonObject.firstName;
				lastName  = jsonObject.lastName;
				contacts  = jsonObject.contacts;

				//document.getElementById("id for section to show users first and last name").innerHTML = firstName + " " + lastName;
				document.getElementById("LogUser").value = "";		//resetting username
				document.getElementById("LogPassword").value = "";	//resetting password

				hideOrShow("loginContainer", false); //showing login section
				hideOrShow("contactPageContainer", true);
				showAllContacts();
			}
			else
			{
				document.getElementById("loginResult").innerHTML = " error " + this.status;
				document.getElementById("loginButton").disabled = false;
				return;
			}
		}
	}
	document.getElementById("loginButton").disabled = true;
	xhr.send(jsonPayload);
}

// erases logged in fields
function doLogout()
{
	var jsonPayload = '{'
		+ '"userID":"'   + userId  + '", '
		+ '"sessionID":"'  + sessionID
		+ '"}';

	var url = apiFolder + 'Logout.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);	//true associates with asyncrous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4)
		{
			if(this.status == 200)
			{
				//resetting these three variables to empty
				userId    = 0;
				firstName = "";
				lastName  = "";
				contacts = [];
				sessionID = 0;
				hideOrShow("contactPageContainer", false);
				hideOrShow("loginContainer", true); //showing login section
			}
		}
	}
	xhr.send(jsonPayload);
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
					document.getElementById("loginButton").disabled = false;
					return;
				}

				firstName = jsonObject.firstName;
				lastName  = jsonObject.lastName;
				contacts  = jsonObject.contacts;

				//document.getElementById("id for section to show users first and last name").innerHTML = firstName + " " + lastName;
				document.getElementById("LogUser").value = "";		//resetting username
				document.getElementById("LogPassword").value = "";	//resetting password

				document.getElementById("loginResult").innerHTML = "Logged in";

				hideOrShow("loginContainer", false); //showing login section
				hideOrShow("contactPageContainer", true);
			}
			else
			{
				document.getElementById("loginResult").innerHTML = " error " + this.status;
				document.getElementById("loginButton").disabled = false;
			}
		}
	}

	document.getElementById("loginButton").disabled = true;
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
	contactFirstName = document.getElementById("inputCFirstName").value;
	contactLastName = document.getElementById("inputCLastName").value;
	contactAddress = document.getElementById("inputCAddress").value;
	contactState = document.getElementById("inputCState").value;
	contactCity = document.getElementById("inputCCity").value;
	contactZipcode = document.getElementById("inputCZipcode").value;
	contactEmail = document.getElementById("inputCEmail").value;
	contactPhoneNumber = document.getElementById("inputCPhone").value;

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

						if(userId < 1)	//checking if the username entered exists in the database
						{
							var error = jsonObject.error;
							document.getElementById("contactError").innerHTML = error;
							return;
						}

						var contactID = jsonObject.contactID;

						var jsonContact = '{'
							+ '"contactID":' 	+ contactID           + ','
							+ '"firstName":"'  + contactFirstName    + '",'
							+ '"lastName":"'   + contactLastName     + '",'
							+ '"address":"'    + contactAddress      + '",'
							+ '"city":"'       + contactCity         + '",'
							+ '"state":"'      + contactState        + '",'
							+ '"zipCode":"'    + contactZipcode      + '",'
							+ '"email":"'      + contactEmail        + '",'
							+ '"phone":"'      + contactPhoneNumber
							+ '"}';

						// WARNING Hasnt been tested
						// local storage of added contact
						contacts.push(JSON.parse(jsonContact));
						showAllContacts();
    		}
    		else
    		{
      		document.getElementById("contactError").innerHTML = this.status;
    		}
		}
	}

  xhr.send(jsonPayload);
}

// sends json with search criteria and gets json with contacts array that match
function searchContacts()
{
	document.getElementById("contactListBox").innerHTML = '';
	var searchID = document.getElementById("inputSearch").innerHTML;

	var jsonPayload = '{'
			+ '"id":'							+ userId			+ ','
			+ '"matchString":"'	+ searchID		+ '",'
			+ '"sessionID":"'			+ sessionID
			+ '"}';

	var url =  apiFolder + 'SearchContact.' + extension;
	var xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);	//true associates with asyncrous
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

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
					var error = jsonObject.error;
					document.getElementById("contactError").innerHTML = error;
					document.getElementById("btnFindContacts").disabled = false;
					return;
				}

				contacts  = jsonObject.contacts;
				showAllContacts();
			}
			else
			{
				document.getElementById("contactError").innerHTML = " error " + this.status;
				document.getElementById("btnFindContacts").disabled = false;
				return;
			}
		}
	}
	document.getElementById("btnFindContacts").disabled = true;
	xhr.send(jsonPayload);
}

// TODO: comments
function deleteContact()
{
	if(currentSelected < 0)
	{
		return;
	}

	var contactID = contacts[currentSelected].contactID;
	var jsonPayload = '{'
			+ '"id":'					+ userId    + ','
			+ '"contactID":'	+ contactID + ','
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

				if(userId < 1)	//checking if the username entered exists in the database
				{
					var error = jsonObject.error;
					console.log(error);  // temp notification
					//document.getElementById("loginResult").innerHTML = error;
					return;
				}

				contacts.splice(currentSelected, 1);
				showAllContacts();
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

function selectContact(key)
{
	if(currentSelected > -1)
	{
		document.getElementById('contactCard'+currentSelected).classList.remove("bg-info");
	}
	document.getElementById('contactCard'+key).classList.add("bg-info");
	currentSelected = key;

	document.getElementById("contactFullName").innerHTML = contacts[currentSelected].firstName + ' ' + contacts[currentSelected].lastName;
	document.getElementById("contactPhone").innerHTML = contacts[currentSelected].phone;
	document.getElementById("contactEmail").innerHTML = contacts[currentSelected].email;
	document.getElementById("contactAddress").innerHTML = contacts[currentSelected].address;
	document.getElementById("contactCity").innerHTML = contacts[currentSelected].city;
	document.getElementById("contactState").innerHTML = contacts[currentSelected].state;
	document.getElementById("contactZipCode").innerHTML = contacts[currentSelected].zipCode;
}
