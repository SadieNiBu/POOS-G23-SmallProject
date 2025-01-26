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

// Opens the Add Contact form
function openForm() {
	document.getElementById("myForm").style.display = "block";
}

// Closes the Add Contact form
function closeForm() {
	document.getElementById("myForm").style.display = "none";
}

// Opens the Edit Contact form
function openForm() {
	document.getElementById("myEditForm").style.display = "block";
}

// Closes the Edit Contact form
function closeForm() {
	document.getElementById("myEditForm").style.display = "none";
}

// Performs a contact search by parsing provided fields to JSON then send POST request
function searchContact() {
	let searchName = document.getElementById("search").value;

	let contactList = [];

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
					let currContact = jsonObject.results[i];

					contactList.push({
						firstName: currContact.firstName,
						lastName: currContact.lastName,
						phoneNumber: currContact.phoneNumber,
						email: currContact.email
					});
				}
				
				populateTable(contactList);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// Deletes the old table body rows and replaces with the new parameters from JSON
function populateTable(contacts) {
	// table and tbody element
	const table = document.getElementById('contactTable');
	const tbody = table.getElementsByTagName('tbody')[0];

	//tbody.innerHTML = '';
	while (tbody.rows.length > 0)
	{
		tbody.deleteRow(0);
	}

	// go through each contact
	contacts.forEach((contact, index) => {
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
		deleteButton.onclick = () => {
			verifyDeleteContact(index, contact);
		}
		deleteCell.appendChild(deleteButton);
		row.appendChild(deleteCell);

		// assign row to tbody of table
		tbody.appendChild(row);
	});
}

// Checks if the given fields are valid entries, if it is then call doAddContact
function verifyAddContact() {
	let addFirstName = document.getElementById("addFirstName").value;
	let addLastName = document.getElementById("addLastName").value;
	let addPhoneNumber = document.getElementById("addPhoneNumber").value;
	let addEmail = document.getElementById("addEmail").value;

	const nameRegex = /^[a-zA-Z]+$/;
	const phoneRegex = /^\d{10}$/;
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// Check for any blank fields
	if (addFirstName.length == 0 || addLastName.length == 0 || addPhoneNumber.length == 0 || addEmail.length == 0)
	{
		document.getElementById("addContactResult").innerHTML = "Please fill all fields.";
		return;
	}

	// Clears the add result text
	document.getElementById("addContactResult").innerHTML = "";

	if (!nameRegex.test(addFirstName))
	{
		document.getElementById("addContactResult").innerHTML = "Invalid First Name";
	}
	else if (!nameRegex.test(addLastName))
	{
		document.getElementById("addContactResult").innerHTML = "Invalid Last Name";
	}
	else if (!phoneRegex.test(addPhoneNumber))
	{
		document.getElementById("addContactResult").innerHTML = "Invalid Phone Number";
	}
	else if (!emailRegex.test(addEmail))
	{
		document.getElementById("addContactResult").innerHTML = "Invalid Email Address";
	}
	else
	{
		doAddContact();
	}
}

// Parses given contact information to JSON and sends POST request
function doAddContact() {

	document.getElementById("addContactResult").innerHTML = "";

	userId = 0;

	let addFirstName = document.getElementById("addFirstName").value;
	let addLastName = document.getElementById("addLastName").value;
	let addPhoneNumber = document.getElementById("addPhoneNumber").value;
	let addEmail = document.getElementById("addEmail").value;

	// ** TO DO **
	// Confirm if this is the correct JSON format for API
	let tmp = {userID:userId,firstName:addFirstName,lastName:addLastName,phone:addPhoneNumber,email:addEmail};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;

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
				document.getElementById("addContactResult").innerHTML = "Contact Added.";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}

// Need to store index as global variable to allow scope access
let contactIndexToDelete = null;
let contactDataToDelete = null;

// Open a pop up box to ask user to confirm if they want to delete
function verifyDeleteContact(index, contact) {
	contactIndexToDelete = index;
	contactDataToDelete = contact;
	document.getElementById("deletePopup").style.display = "block";
}

// Close the delete confirmation popup
function closeDeletePopup() {
	document.getElementById("deletePopup").style.display = "none";
}

// Send the given contact data and perform a POST request. Set the deleted
// contact row to be black (indicate delete). Reset index and data at end.
function doDeleteContact() {

	let jsonPayload = JSON.stringify( contactDataToDelete );

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				const table = document.getElementById('contactTable');
				const tbody = table.getElementsByTagName('tbody')[0];

				const rowToRemove = tbody.rows[contactIndexToDelete];

				rowToRemove.style.backgroundColor = 'black';
				rowToRemove.style.color = 'black';
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

	contactIndexToDelete = null;
	contactDataToDelete = null;
}

// Perform logout
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "newindex.html";
}

/* Testing data, delete later */
const books = [
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

const books2 = [
{
	firstName: "Michael",
	lastName: "Johnson",
	phoneNumber: "321-654-9870",
	email: "michael.johnson@example.com"
},
{
	firstName: "Emily",
	lastName: "Davis",
	phoneNumber: "234-567-8901",
	email: "emily.davis@example.com"
},
{
	firstName: "Sarah",
	lastName: "Williams",
	phoneNumber: "456-789-0123",
	email: "sarah.williams@example.com"
},
{
	firstName: "David",
	lastName: "Brown",
	phoneNumber: "567-890-1234",
	email: "david.brown@example.com"
}
];

// test function
function doTable() {
	populateTable(books);
}

function doTable2() {
	populateTable(books2);
}
