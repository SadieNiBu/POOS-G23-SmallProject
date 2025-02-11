const urlBase = 'http://contact23.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// Open the Login tab when the page is opened
document.addEventListener('DOMContentLoaded', function() {
	const pathname = window.location.pathname;
    if (pathname === '/' || pathname.endsWith('index.html')) {
		let loginTabButton = document.getElementById('loginTab');
		loginTabButton.click();
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
				
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}    
}

// Performs login immediately for immediate after acccount creation
function doSignin()
{
	
	let login = document.getElementById("signupName").value;
	let password = document.getElementById("signupPassword").value;

    // Clears the Signup result text
    document.getElementById("signupResult").innerHTML = "";
	
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
					document.getElementById("signupResult").innerHTML = "Error In Signing Into Account";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
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

				document.getElementById("signupResult").innerHTML = "Account Created. Redirecting...";

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				// Force 1 second delay before redirecting (to see signup result)
				setTimeout(function() {
					doSignin();
				}, 1500);
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
		document.getElementById("mainHeader").textContent = "Welcome, " + firstName + " " + lastName + "!";
	}
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

	if (tabName === "Login")
	{
		addEnterKeyListener();
	}
	else
	{
		removeEnterKeyListener();
	}

	 
	if (tabName === "Signup")
	{
		// Continuously check for input on fields
		document.getElementById("signupPassword").addEventListener("input", activePasswordChecker);
	}
}

// Actively check if the password meets the criteria, display image
function activePasswordChecker(event) {
	let password = event.target.value;

	// Conditions to check for on password
	const validCharacters = /^[A-Za-z0-9@#$&%!]+$/.test(password);
	const lengthCheck = password.length >= 8;
	const alphabetCheck = /[A-Za-z]/.test(password);
	const digitCheck = /[0-9]/.test(password);
	const symbolCheck = /[@#$&%!]/.test(password);

	const isValidPassword = validCharacters && lengthCheck && alphabetCheck && digitCheck && symbolCheck;

	let passwordField = document.getElementById("signupPassword");

	if (isValidPassword) {
		passwordField.style.backgroundImage = "url('/images/valid.png')";
	}
	else {
		passwordField.style.backgroundImage = "url('/images/invalid.png')";
	}
}

// Add a Enter key listener specifically for Login
function addEnterKeyListener() {
	if (document.getElementById("Login").style.display === "block") {
		document.getElementById("loginName").addEventListener("keypress", function(event) {
			if (event.key === "Enter") {
				doLogin();
			}
		});

		document.getElementById("loginPassword").addEventListener("keypress", function(event) {
			if (event.key === "Enter") {
				doLogin();
			}
		});
	}
}

// Remove the Enter key listener when on signup tab
function removeEnterKeyListener() {
    document.getElementById("loginName").removeEventListener("keypress", doLogin);
    document.getElementById("loginPassword").removeEventListener("keypress", doLogin);
}

// --------------- Start of logged in page functions -------------------

// Need to store index and data as global variables to allow global scope access
var contactIndexToDelete = null;
var contactDataToDelete = null;
var contactIndexToEdit = null;
var contactDataToEdit = null;

// Keep global scope of contact list
var contacts = [];

// Opens the Add Contact form
function openForm() {
	document.getElementById("myForm").style.display = "block";

	document.getElementById("addFirstName").value = "";
	document.getElementById("addLastName").value = "";
	document.getElementById("addPhone").value = "";
	document.getElementById("addEmail").value = "";
}

// Closes the Add Contact form
function closeForm() {
	document.getElementById("myForm").style.display = "none";
}

// Start out on number 2
let backgroundImageIndex = 2;

// Changes the background theme of the contact page
function changeBackground() {
	const backgroundImages = [
		"/images/dayBreak.png",
		"/images/starryNight.png",
		"/images/autumnBackground.png"
	]

	const cardImages = [
		"/images/sunset-card.png",
		"/images/firefly-card.png",
		"/images/autumn-card.png"
	]

	const textColor = [
		"white",
		"white",
		"black"
	]

	const buttonColor = [
		"#782c01",
		"#000b62",
		"#8c1306"
	]

	let carouselCard = document.getElementsByClassName('card');
	let editCards = document.getElementsByClassName('edit-card');
	let deleteCards = document.getElementsByClassName('delete-card');

	document.body.style.backgroundImage = `url('${backgroundImages[backgroundImageIndex]}')`;
	
	for (let card of carouselCard) {
		card.style.backgroundImage = `url('${cardImages[backgroundImageIndex]}')`;
		card.style.color = textColor[backgroundImageIndex];
	}

	for (let editCard of editCards) {
		editCard.style.backgroundColor = buttonColor[backgroundImageIndex];
	}

	for (let deleteCard of deleteCards) {
		deleteCard.style.backgroundColor = buttonColor[backgroundImageIndex];
	}
	
	let totalImages = backgroundImages.length;
	backgroundImageIndex = (backgroundImageIndex + 1) % totalImages;
}

// Synchronize theme on each search contact
function synchronizeTheme() {
	function changeBackground() {
		const backgroundImages = [
			"/images/dayBreak.png",
			"/images/starryNight.png",
			"/images/autumnBackground.png"
		]
	
		const cardImages = [
			"/images/sunset-card.png",
			"/images/firefly-card.png",
			"/images/autumn-card.png"
		]
	
		const textColor = [
			"white",
			"white",
			"black"
		]
	
		const buttonColor = [
			"#782c01",
			"#000b62",
			"#8c1306"
		]
	
		let carouselCard = document.getElementsByClassName('card');
		let editCards = document.getElementsByClassName('edit-card');
		let deleteCards = document.getElementsByClassName('delete-card');
	
		document.body.style.backgroundImage = `url('${backgroundImages[backgroundImageIndex]}')`;
		
		for (let card of carouselCard) {
			card.style.backgroundImage = `url('${cardImages[backgroundImageIndex]}')`;
			card.style.color = textColor[backgroundImageIndex];
		}
	
		for (let editCard of editCards) {
			editCard.style.backgroundColor = buttonColor[backgroundImageIndex];
		}
	
		for (let deleteCard of deleteCards) {
			deleteCard.style.backgroundColor = buttonColor[backgroundImageIndex];
		}
	}
}

// Performs a contact search by parsing provided fields to JSON then send POST request
function searchContact() {
	let searchName = document.getElementById("search").value;

	let contactList = [];

	let tmp = {search:searchName,userID:userId};
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

				let paginationCountContainer = document.getElementById('paginationCountContainer');
				let paginationButtonContainer = document.getElementById('paginationButtonContainer');

				// If no results, clear the table
				if (jsonObject.error)
				{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
					clearTable();

					paginationCountContainer.style.display = "none";
					paginationButtonContainer.style.display = "none";
				}
				else {
					paginationCountContainer.style.display = "flex";
					paginationButtonContainer.style.display = "flex";
				}
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					let currContact = jsonObject.results[i];

					// ASK ABOUT THIS PART
					contactList.push({
						userID: currContact.userID,
						firstName: currContact.FirstName,
						lastName: currContact.LastName,
						phone: currContact.Phone,
						email: currContact.Email,
						ID: currContact.ID
					});
				}
				
				contacts = contactList;
				
				// Create the table version of contacts
				paginateTable();

				// Create carousel version of contacts
				createCarousel();

				// Make sure themes are synchronized
				synchronizeTheme();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// Clears the rows in the table
function clearTable() {
	// table and tbody element
	const table = document.getElementById('contactTable');
	const tbody = table.getElementsByTagName('tbody')[0];

	//tbody.innerHTML = '';
	while (tbody.rows.length > 0)
	{
		tbody.deleteRow(0);
	}
}

// Deletes the old table body rows and replaces with the new parameters from JSON
function populateTable(contactsToPrint) {
	// table and tbody element
	const table = document.getElementById('contactTable');
	const tbody = table.getElementsByTagName('tbody')[0];

	//tbody.innerHTML = '';
	while (tbody.rows.length > 0)
	{
		tbody.deleteRow(0);
	}

	// go through each contact
	contactsToPrint.forEach((contact, index) => {
		// create a row
		const row = document.createElement('tr');

		// make and assign cells to the row for each type of info
		const firstNameCell = document.createElement('td');
		firstNameCell.textContent = contact.firstName;
		row.appendChild(firstNameCell);

		const lastNameCell = document.createElement('td');
		lastNameCell.textContent = contact.lastName;
		row.appendChild(lastNameCell);

		const phoneCell = document.createElement('td');
		phoneCell.textContent = contact.phone;
		row.appendChild(phoneCell);

		const emailCell = document.createElement('td');
		emailCell.textContent = contact.email;
		row.appendChild(emailCell);

		// make the edit button
		const editCell = document.createElement('td');
		const editButton = document.createElement('button');
		editButton.classList.add('contactActions');
		editButton.innerHTML = '<i class="fa fa-pencil"></i>';
		editButton.onclick = () => {
			openEditForm(index, contact);
		}
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
	let addPhone = document.getElementById("addPhone").value;
	let addEmail = document.getElementById("addEmail").value;

	const nameRegex = /^[a-zA-Z]+$/;
	const phoneRegex = /^\d{10}$/;
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// Check for any blank fields
	if (addFirstName.length == 0 || addLastName.length == 0 || addPhone.length == 0 || addEmail.length == 0)
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
	else if (!phoneRegex.test(addPhone))
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

	let addFirstName = document.getElementById("addFirstName").value;
	let addLastName = document.getElementById("addLastName").value;
	let addPhone = document.getElementById("addPhone").value;
	let addEmail = document.getElementById("addEmail").value;

	let tmp = {userID:userId,firstName:addFirstName,lastName:addLastName,phone:addPhone,email:addEmail};
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
				document.getElementById("contactSearchResult").innerHTML = "Contact Added.";
				closeForm();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addContactResult").innerHTML = err.message;
	}
}

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
				darkenDeleteRow();
				emptyCarouselCard();
				
				document.getElementById("contactSearchResult").innerHTML = "Contact Deleted."
				contactIndexToDelete = null;
				contactDataToDelete = null;
				closeDeletePopup();
				closeDeletePopup();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

// Perform logout
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Opens the Edit Contact form and fills the fields with contact data
function openEditForm(index, contact) {
	document.getElementById("myEditForm").style.display = "block";
	document.getElementById("editContactResult").innerHTML = "";

	contactIndexToEdit = index;
	contactDataToEdit = contact;

	document.getElementById("editFirstName").value = contact.firstName;
    document.getElementById("editLastName").value = contact.lastName;
    document.getElementById("editPhone").value = contact.phone;
    document.getElementById("editEmail").value = contact.email;

}

// Closes the Edit Contact form
function closeEditForm() {
	document.getElementById("myEditForm").style.display = "none";
}

// Checks if the given fields are valid entries, if it is then call doEditContact
function verifyEditContact() {
	let editFirstName = document.getElementById("editFirstName").value;
	let editLastName = document.getElementById("editLastName").value;
	let editPhone = document.getElementById("editPhone").value;
	let editEmail = document.getElementById("editEmail").value;

	const nameRegex = /^[a-zA-Z]+$/;
	const phoneRegex = /^\d{10}$/;
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// Check for any blank fields
	if (editFirstName.length == 0 || editLastName.length == 0 || editPhone.length == 0 || editEmail.length == 0)
	{
		document.getElementById("editContactResult").innerHTML = "Please fill all fields.";
		return;
	}

	// Clears the edit result text
	document.getElementById("editContactResult").innerHTML = "";

	if (!nameRegex.test(editFirstName))
	{
		document.getElementById("editContactResult").innerHTML = "Invalid First Name";
	}
	else if (!nameRegex.test(editLastName))
	{
		document.getElementById("editContactResult").innerHTML = "Invalid Last Name";
	}
	else if (!phoneRegex.test(editPhone))
	{
		document.getElementById("editContactResult").innerHTML = "Invalid Phone Number";
	}
	else if (!emailRegex.test(editEmail))
	{
		document.getElementById("editContactResult").innerHTML = "Invalid Email Address";
	}
	else
	{
		doEditContact(editFirstName, editLastName, editPhone, editEmail);
	}
}

// Update the JSON object with the new edited values and send a POST request
function doEditContact(editFirstName, editLastName, editPhone, editEmail) {
	
	// userID should still be unchanged from the database as the object should still have it
	contactDataToEdit.firstName = editFirstName;
	contactDataToEdit.lastName = editLastName;
  	contactDataToEdit.phone = editPhone;
  	contactDataToEdit.email = editEmail;

	let jsonPayload = JSON.stringify( contactDataToEdit );

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact Updated.";
				closeEditForm();

				editUpdateRow();
				editUpdateCard();

				contactIndexToEdit = null;
				contactDataToEdit = null;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// Update the table row with the new edited data
function editUpdateRow() {
	const table = document.getElementById('contactTable');
  	const row = table.getElementsByTagName('tbody')[0].rows[contactIndexToEdit];

	  row.cells[0].textContent = contactDataToEdit.firstName;
	  row.cells[1].textContent = contactDataToEdit.lastName;
	  row.cells[2].textContent = contactDataToEdit.phone;
	  row.cells[3].textContent = contactDataToEdit.email;
}

// Darken the row that is indicated to be deleted and remove content
function darkenDeleteRow() {
	const table = document.getElementById('contactTable');
  	const row = table.getElementsByTagName('tbody')[0].rows[contactIndexToDelete];

	row.style.backgroundColor = 'black';
	row.style.color = 'black';
	row.cells[0].textContent = "N/A";
	row.cells[1].textContent = "N/A";
	row.cells[2].textContent = "N/A";
	row.cells[3].textContent = "N/A";
	row.cells[4].textContent = "N/A";
	row.cells[5].textContent = "N/A";
}

// Global variables to hold table size information
var currentPage = 1;
var contactsPerPage = 10;


// Paginate table based on parameters
function paginateTable() {

	let contactCount = contacts.length;
	let pageCount = Math.ceil(contactCount / contactsPerPage);

	let startIndex = (currentPage - 1) * contactsPerPage;
	let endIndex = startIndex + contactsPerPage;
	let contactsForCurrentPage = contacts.slice(startIndex, endIndex);

	populateTable(contactsForCurrentPage);

	document.getElementById('previousButton').disabled = currentPage === 1;

	document.getElementById('nextButton').disabled = currentPage === pageCount;

	let imageTrack = document.getElementById('image-track');

	if (imageTrack.style.display === 'flex') {
		contactTable.style.display = 'none';
		paginationCountContainer.style.display = 'none';
		paginationButtonContainer.style.display = 'none';
	}
}

function goNextPage() {
	let contactCount = contacts.length;
	let pageCount = Math.ceil(contactCount / contactsPerPage);

	if (currentPage < pageCount) {
		currentPage++;
		paginateTable();
	}
}

function goPreviousPage() {
	if (currentPage > 1) {
		currentPage--;
		paginateTable();
	}
}

function changeContactsPerPage(count) {

	const buttons = document.querySelectorAll('.pagination-count-btn');
	buttons.forEach(button => button.disabled = false);

	event.target.disabled = true;
  
	contactsPerPage = count;
	currentPage = 1;
	paginateTable();
}

function testingFunction() {
	contacts = testContacts;
	paginateTable();
	createCarousel();
}

function testDeleteFunction() {
	darkenDeleteRow();

	document.getElementById("contactSearchResult").innerHTML = "Contact Deleted."
	contactIndexToDelete = null;
	contactDataToDelete = null;
	closeDeletePopup();
}

let testContacts = [
	{
	  "userID": "1",
	  "firstName": "John",
	  "lastName": "Doe",
	  "phone": "123-456-7890",
	  "email": "johndoe@example.com",
	  "ID": "1001"
	},
	{
	  "userID": "2",
	  "firstName": "Jane",
	  "lastName": "Smith",
	  "phone": "234-567-8901",
	  "email": "janesmith@example.com",
	  "ID": "1002"
	},
	{
	  "userID": "3",
	  "firstName": "Michael",
	  "lastName": "Johnson",
	  "phone": "345-678-9012",
	  "email": "michaeljohnson@example.com",
	  "ID": "1003"
	},
	{
	  "userID": "4",
	  "firstName": "Emily",
	  "lastName": "Davis",
	  "phone": "456-789-0123",
	  "email": "emilydavis@example.com",
	  "ID": "1004"
	},
	{
	  "userID": "5",
	  "firstName": "Chris",
	  "lastName": "Martinez",
	  "phone": "567-890-1234",
	  "email": "chrismartinez@example.com",
	  "ID": "1005"
	},
	{
	  "userID": "6",
	  "firstName": "Sara",
	  "lastName": "Hernandez",
	  "phone": "678-901-2345",
	  "email": "sarahernandez@example.com",
	  "ID": "1006"
	},
	{
	  "userID": "7",
	  "firstName": "David",
	  "lastName": "Wilson",
	  "phone": "789-012-3456",
	  "email": "davidwilson@example.com",
	  "ID": "1007"
	},
	{
	  "userID": "8",
	  "firstName": "Laura",
	  "lastName": "Moore",
	  "phone": "890-123-4567",
	  "email": "lauramoore@example.com",
	  "ID": "1008"
	},
	{
	  "userID": "9",
	  "firstName": "James",
	  "lastName": "Taylor",
	  "phone": "901-234-5678",
	  "email": "jamestaylor@example.com",
	  "ID": "1009"
	},
	{
	  "userID": "10",
	  "firstName": "Olivia",
	  "lastName": "Anderson",
	  "phone": "012-345-6789",
	  "email": "oliviaanderson@example.com",
	  "ID": "1010"
	}
  ]

function changeContactDisplayType() {
	let contactTable = document.getElementById('contactTable');
	let paginationCountContainer = document.getElementById('paginationCountContainer');
	let paginationButtonContainer = document.getElementById('paginationButtonContainer');
	let imageTrack = document.getElementById('image-track');

	if (contactTable.style.display === '') {
		contactTable.style.display = 'none';
		paginationCountContainer.style.display = 'none';
		paginationButtonContainer.style.display = 'none';

		imageTrack.style.display = 'flex';
	} else {
		contactTable.style.display = '';
		paginationCountContainer.style.display = 'flex';
		paginationButtonContainer.style.display = 'flex';

		imageTrack.style.display = 'none';
	}
}

function createCarousel() {
	// Call the function to create the cards
	createCards();

	const track = document.getElementById('image-track');

	// Event mouse down
	track.onmousedown = (e) => {
		track.dataset.mouseDownAt = e.clientX;
	};

	// Event mouse up
	track.onmouseup = () => {
		track.dataset.mouseDownAt = "0";
		track.dataset.prevPercentage = track.dataset.percentage;
	};

	// Event mouse move
	track.onmousemove = e => {
		if (track.dataset.mouseDownAt == "0") {
			return;
		}

		const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
		const maxDelta = window.innerWidth / 2;

		const percentage = (mouseDelta / maxDelta) * -100;
		const nextPerUniconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
		const nextPercentage = Math.max(Math.min(nextPerUniconstrained, 0), -90);

		track.dataset.percentage = nextPercentage;

		track.animate({
			transform: `translate(${nextPercentage}%, -50%)`
		}, { duration: 1200, fill: "forwards" });

		const listCards = track.getElementsByClassName("card");
		for (const card of listCards) {
			card.animate({
				transform: `translateX(${nextPercentage}%)`
			}, { duration: 1200, fill: "forwards" });
		}
	};
}

function createCards() {
	const track = document.getElementById('image-track');

	track.innerHTML = '';

	contacts.forEach((contact, index) => {
		const card = document.createElement('div');
		card.classList.add('card');
		card.dataset.index = index;
		
		const name = document.createElement('h2');
		name.textContent = `${contact.firstName} ${contact.lastName}`;
		
		const phone = document.createElement('p');
		phone.textContent = `Phone: ${contact.phone}`;

		// Check this part
		const formattedPhone = contact.phone.replace(/\D/g, '');
    	const formattedPhoneNumber = formattedPhone.length === 10 ? 
      	`(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(3, 6)}-${formattedPhone.slice(6)}` : 
      	contact.phone;
    
    	phone.textContent = `Phone: ${formattedPhoneNumber}`;

		const email = document.createElement('p');
		email.textContent = `Email: ${contact.email}`;

		const editButton = document.createElement('button');
		editButton.innerHTML = '<i class="fa fa-pencil"></i>';
		editButton.classList.add('edit-card');
		editButton.onclick = () => {
			openEditForm(index, contact);
		}

		const deleteButton = document.createElement('button');
		deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
		deleteButton.classList.add('delete-card');
		deleteButton.onclick = () => {
			verifyDeleteContact(index, contact);
		}

		card.appendChild(name);
		card.appendChild(phone);
		card.appendChild(email);
		card.appendChild(editButton);
		card.appendChild(deleteButton);
		
		track.appendChild(card);
	});
}

// Update the table row with the new edited data
function editUpdateCard() {
	const track = document.getElementById('image-track');
	const cards = track.getElementsByClassName('card');

	const cardToUpdate = cards[contactIndexToEdit];

	cardToUpdate.querySelector('h2').textContent = `${contactDataToEdit.firstName} ${contactDataToEdit.lastName}`;
    cardToUpdate.querySelector('p:nth-child(2)').textContent = `Phone: ${contactDataToEdit.phone}`;
    cardToUpdate.querySelector('p:nth-child(3)').textContent = `Email: ${contactDataToEdit.email}`;
}

function emptyCarouselCard() {
	const track = document.getElementById('image-track');
	const cards = track.getElementsByClassName('card');

	const cardToEmpty = cards[contactIndexToDelete];

	cardToEmpty.querySelector('h2').textContent = '';
    cardToEmpty.querySelector('p:nth-child(2)').textContent = '';
    cardToEmpty.querySelector('p:nth-child(3)').textContent = '';
    cardToEmpty.querySelector('editButton').innerHTML = '';
	cardToEmpty.querySelector('deleteButton').innerHTML = '';
}