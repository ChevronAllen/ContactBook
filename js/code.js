// TODO: Global variables

function doLogin()
{
	// TODO:
}

function doLogout()
{
	// TODO:
}

function doRegister()
{
	// TODO:
}

function addContact()
{
	// TODO:
}

function searchContact()
{
	// TODO:
}

function deleteContact()
{
	// TODO:
}

function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

// Changes visibility to Sign In view
function switchToSignIn(){
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
function switchToSignUp(){
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
