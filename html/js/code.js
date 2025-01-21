// ** TO DO **
// Confirm our domain and extension
const urlBase = 'http://contact23.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// Open the Login tab when the page is opened
document.addEventListener('DOMContentLoaded', function() {
	if (window.location.pathname.endsWith('newindex.html'))
	{
		openEvent(event, 'Login');
	}
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

	// Check if username or password was empty, return if empty
	if (login.length == 0 || password.length == 0)
	{
		document.getElementById("loginResult").innerHTML = "Username or Password is empty."
		return;
	}
	
	// ** TO DO **
	// Confirm if this is the correct JSON format for API
    let tmp = {login:login,password:password};
    let jsonPayload = JSON.stringify( tmp );

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
				window.location.href = "index.html";
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

	// Clears the signup result text
	document.getElementById("signupResult").innerHTML = "";

	userId = 0;

	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("signupName").value;
	let password = document.getElementById("signupPassword").value;

	// ** TO DO **
	// Confirm if this is the correct JSON format for API
	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			// Accepted
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				document.getElementById("signupResult").innerHTML = "Account Created. Please go back to Login.";

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
			}
			// Conflict (work with API later on this one)
			else if (this.readyState == 4 && this.status == 409)
			{
				document.getElementById("signupResult").innerHTML = "Username is taken.";
				return;
			}
			// Other states and status, just return
			else
			{
				return;
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
function openEvent(evt, tabName) {

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
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
} 

  // --------------- Start of logged in page functions -------------------

function openForm() {
	document.getElementById("myForm").style.display = "block";
}

function closeForm() {
	document.getElementById("myForm").style.display = "none";
}

function searchContact() {
	let searchName = document.getElementById("search").value;

	let tmp = {search:searchName,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;

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
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

/* Testing data, delete later */
const contacts = [
{
	firstName: "Adam",
	lastName: "Wrangler",
	phoneNumber: "123-456-7890",
	email: "adam.wrangler@example.com"
},
{
	firstName: "Steven",
	lastName: "Crossing",
	phoneNumber: "123-456-7890",
	email: "steven.crossing@example.com"
},
{
	firstName: "John",
	lastName: "Doe",
	phoneNumber: "123-456-7890",
	email: "john.doe@example.com"
},
{
	firstName: "Jane",
	lastName: "Smith",
	phoneNumber: "987-654-3210",
	email: "jane.smith@example.com"
}
];

function populateTable() {
	// table and tbody element
	const table = document.getElementById('contactTable');
	const tbody = table.getElementsByTagName('tbody')[0];

	//tbody.innerHTML = '';
	while (tbody.rows.length > 0)
	{
		tbody.deleteRow(0);
	}

	// go through each contact
	contacts.forEach(contact => {
		// create a row
		const row = document.createElement('tr');

		// make and assign cells to the row for each type of info
		Object.values(contact).forEach(value => {
			const cell = document.createElement('td');
			cell.textContent = value;
			row.appendChild(cell);
		});

		// make the edit button
		const editCell = document.createElement('td');
		const editButton = document.createElement('button');
		editButton.classList.add('contactActions');
		editButton.innerHTML = '<i class="fa fa-pencil"></i>';
		editCell.appendChild(editButton);
		row.appendChild(editCell);

		// make the delete button
		const deleteCell = document.createElement('td');
		const deleteButton = document.createElement('button');
		deleteButton.classList.add('contactActions');
		deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
		deleteCell.appendChild(deleteButton);
		row.appendChild(deleteCell);

		// assign row to tbody of table
		tbody.appendChild(row);
	});
}

window.onload = populateTable;