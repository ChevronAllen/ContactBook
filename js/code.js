var apiFolder = 'API/'
var extension = 'php';

var userId = 0;	// userId is an int that must match with the database id for contact manipulation
var firstName = ''; // user first name
var lastName = '';	// user last name
var sessionID = 0;	// generated sessionID that is created and sent on login/registration
var contacts = [];	// array of contacts for user
var currentSelected = -1;

// if you find in the string given that matches the regex return true
function regexCheck(str, reg)
{
	return reg.test(str);
}

function resetForm()
{
	document.getElementById("LogUser").value = '';
	document.getElementById("LogPassword").value = '';
	document.getElementById("RegFirst").value = '';
	document.getElementById("RegLast").value = '';
	document.getElementById("RePassword").value = '';
	document.getElementById("inputSearch").value = '';
	document.getElementById("inputCFirstName").value = '';
	document.getElementById("inputCLastName").value = '';
	document.getElementById("inputCAddress").value = '';
	document.getElementById("inputCCity").value = '';
	document.getElementById("inputCState").value = '';
	document.getElementById("inputCZipcode").value = '';
	document.getElementById("inputCEmail").value = '';
	document.getElementById("inputCPhone").value = '';
}

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

	if(username.length == 0 || password.length == 0)
	{
		document.getElementById("loginResult").innerHTML = "One or more fields are empty";
		return;
	}

	if(regexCheck(username, /\W/))
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
					resetForm();
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
				resetForm();
				document.getElementById("loginButton").disabled = false;
				document.getElementById("userFullName").innerHTML = firstName + ' ' + lastName;
			}
			else
			{
				resetForm();
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
		+ '"id":"'   + userId  + '", '
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
				//resetting these variables to empty
				userId    = 0;
				firstName = "";
				lastName  = "";
				contacts = [];
				sessionID = 0;
				resetForm();
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

	if(username.length == 0 || lastName.length == 0  || firstName.length == 0 || password.length == 0 || rePassword.length == 0)
	{
		document.getElementById("loginResult").innerHTML = "One or more fields are empty";
		return;
	}

	if(regexCheck(username, /\W/) || regexCheck(firstName, /[^a-zA-Z]/) || regexCheck(lastName, /[^a-zA-Z]/))
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
				if(userId < 1)	//checking if the username entered exists in the database
				{
					var error  = jsonObject.error;
					resetForm();
					document.getElementById("loginResult").innerHTML = error;
					document.getElementById("loginButton").disabled = false;
					return;
				}

				firstName = jsonObject.firstName;
				lastName  = jsonObject.lastName;

				//document.getElementById("id for section to show users first and last name").innerHTML = firstName + " " + lastName;
				document.getElementById("LogUser").value = "";		//resetting username
				document.getElementById("LogPassword").value = "";	//resetting password

				document.getElementById("loginResult").innerHTML = "Logged in";

				hideOrShow("loginContainer", false); //showing login section
				hideOrShow("contactPageContainer", true);
				resetForm();
				document.getElementById("userFullName").innerHTML = firstName + ' ' + lastName;
				document.getElementById("loginButton").disabled = false;
			}
			else
			{
				resetForm();
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
	document.getElementById("contactError").innerHTML = '';
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

	var invalidData = 0;
	// first name check
	if(regexCheck(contactFirstName, /[^a-zA-Z]/) || contactFirstName.length == 0)
	{
		invalidData = 1;
		document.getElementById("contactError").innerHTML += "First Name can only be alphabetical<br />";
	}
	// last name check
	if(regexCheck(contactLastName, /[^a-zA-Z]/) || contactLastName.length == 0)
	{
		invalidData = 1;
		document.getElementById("contactError").innerHTML += "Last Name can only be alphabetical<br />";
	}
	// address check
	if(regexCheck(contactAddress, /[^\d\sa-zA-Z(.)]/) && contactAddress.length != 0)
	{
		invalidData = 1;
		document.getElementById("contactError").innerHTML += "Addresses can only containt whitespace a period and alphanumeric characters<br />";
	}
	// state check
	if(regexCheck(contactState, /[^a-zA-Z]/) && contactState.length != 0)
	{
		invalidData = 1;
		document.getElementById("contactError").innerHTML += "State can only be alphabetical<br />";
	}
	// city check
	if(regexCheck(contactCity, /[^\sa-zA-Z]/) && contactCity.length != 0)
	{
		invalidData = 1;
		document.getElementById("contactError").innerHTML += "City can only be alphabetical <br />";
	}
	// zipcode check
	if(!regexCheck(contactZipcode, /^[\d]{5}$/) && contactZipcode.length != 0)
	{
		invalidData = 1;
		document.getElementById("contactError").innerHTML += "zipcode can only be numerical <br />";
	}
	// email chack
	if(!regexCheck(contactEmail, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g) && contactEmail.length != 0)
	{
		invalidData = 1;
		document.getElementById("contactError").innerHTML += "invalid email <br />";
	}
	// phone number check
	if(!regexCheck(contactPhoneNumber, /^[\d]{10}$/) && contactPhoneNumber.length != 0)
	{
		invalidData = 1;
		document.getElementById("contactError").innerHTML += "Phone Number can only be numerical <br />";
	}
	// stops the function if incorrect data is filled
	if(invalidData == 1)
	{
		return;
	}

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
							document.getElementById("btnFindContacts").disabled = false;
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

						// local storage of added contact
						contacts.push(JSON.parse(jsonContact));
						showAllContacts();
						document.getElementById("btnFindContacts").disabled = false;
    		}
    		else
    		{
					document.getElementById("btnFindContacts").disabled = false;
      		document.getElementById("contactError").innerHTML = this.status;
    		}
		}
	}
	resetForm();
	document.getElementById("btnFindContacts").disabled = true;
  xhr.send(jsonPayload);
}

// sends json with search criteria and gets json with contacts array that match
function searchContacts()
{
	document.getElementById("contactListBox").innerHTML = '';
	var searchID = document.getElementById("inputSearch").value;

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
				document.getElementById("btnFindContacts").disabled = false;
				var jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.id;

				if(userId < 1)	//checking if the username entered exists in the database
				{
					var error = jsonObject.error;
					document.getElementById("contactError").innerHTML = error;
					return;
				}

				contacts  = jsonObject.contacts;
				showAllContacts();
				resetForm();
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
					document.getElementById("contactError").innerHTML = error;
					document.getElementById("btnDeleteContact").disabled = false;
					return;
				}

				contacts.splice(currentSelected, 1);
				currentSelected = -1;
				showAllContacts();
				document.getElementById("contactFullName").innerHTML = '';
				document.getElementById("contactPhone").innerHTML = '';
				document.getElementById("contactEmail").innerHTML = '';
				document.getElementById("contactAddress").innerHTML = '';
				document.getElementById("contactCity").innerHTML = '';
				document.getElementById("contactState").innerHTML = '';
				document.getElementById("contactZipCode").innerHTML = '';
				document.getElementById("btnDeleteContact").disabled = false;
	  	}
	  	else
	  	{
				document.getElementById("btnDeleteContact").disabled = false;
	    	document.getElementById("contactError").innerHTML = this.status + 'error';
	  	}
		}
	}
	document.getElementById("btnDeleteContact").disabled = true;
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
