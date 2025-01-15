// ** TO DO **
// Confirm our domain and extension
const urlBase = 'contact23.xyz';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// Open the Login tab when the page is opened
document.addEventListener('DOMContentLoaded', function() {
	openEvent(event, 'Login');
});

// Performs login by parsing provided credentials to JSON then send POST request
function doLogin()
{
    userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

    // Clears the login result text
    document.getElementById("loginResult").innerHTML = "";

	// ** TO DO **
	// Confirm if this is the correct JSON format for API
    let tmp = {login:login,password:password};
    let jsonPayload = JSON.stringify( tmp );

	// ** TO DO **
	// Modify this to the correct format for directory
    let url = urlBase + '/Login.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "Incorrect Username or Password";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				
				// ** TO DO **
                // To be modified with our logged in page
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}    
}

// Checks if the password meets the conditions
function verifyPasswordConditions()
{
	// Clears the signup result text
    document.getElementById("signupResult").innerHTML = "";

	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("signupName").value;
	let password = document.getElementById("signupPassword").value;

	// Get the field lengths
	const firstNameLength = firstName.length;
	const lastNameLength = lastName.length;
	const loginLength = login.length;
	const passwordLength = password.length;

	// Check if any field is empty, if empty stop
	if (firstNameLength == 0 || lastNameLength == 0 || loginLength == 0 || passwordLength == 0)
	{
		document.getElementById("signupResult").innerHTML = "Please fill all fields.";
		return;
	}

	// Conditions to check for on password
	const validCharacters = /^[A-Za-z0-9@#$&%!]+$/;
    const lengthCheck = passwordLength >= 8;
	const alphabetCheck = /[A-Za-z]/.test(password);
    const digitCheck = /[0-9]/.test(password);
    const symbolCheck = /[@#$&%!]/.test(password);

	// If password is not of at least length 8
	if (!lengthCheck)
	{
		document.getElementById("signupResult").innerHTML = "Password is too short.";
	}
	// If password does not have a unlisted character
	else if (!validCharacters.test(password))
	{
		document.getElementById("signupResult").innerHTML = "Password contains invalid character.";
	}
	// If password not have a alphabet, number, and a listed symbol
	else if (!alphabetCheck || !digitCheck || !symbolCheck)
	{
		document.getElementById("signupResult").innerHTML = "Password does not meet criteria.";
	}
	// Otherwise, all fields are filled and meet criteria so perform signup
	else
	{
		doSignup();
	}
}

// Performs signup by parsing given fields to JSON then send POST request
function doSignup()
{
	userId = 0;

	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("signupName").value;
	let password = document.getElementById("signupPassword").value;

	// ** TO DO **
	// Confirm if this is the correct JSON format for API
	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	// ** TO DO **
	// Modify this to the correct format for directory
	let url = urlBase + '/AddColor.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// ** TO DO ** 
				// Confirm if this is the output if the user/color already exists
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
	}
	
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

    // Modify this later to be our landing page
	window.location.href = "index.html";
}

// This was taken from w3schools example on tab buttons
function openEvent(evt, cityName) {

    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  } 