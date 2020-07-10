// SELECTORS

const form = document.getElementById('form')
const showAll = document.getElementById('show-all')
const addNew = document.getElementById('add-new')
const errorMessage = document.getElementById('error')
const contactTable = document.getElementById('contact-table')
const contactList = document.getElementById('contact-list')
const name = document.getElementById('fname')
const surname = document.getElementById('lname')
const birthday = document.getElementById('year')
const phone = document.getElementById('telNo')
const email = document.getElementById('email')
const address = document.getElementById('address')
const zip = document.getElementById('zip')
const submitBtn = document.getElementById('form-btn')

// GLOBAL VARIABLES

let contactInfo
const messages = []
let editIsActive = false

// Functions

const generateId = () => {
	return (
		'_' +
		Math.random()
			.toString()
			.substr(2, 9)
	)
}

const getValues = () => {
	let data = {}
	// loop trough form elements and get name value pairs
	Object.keys(form.elements).forEach(key => {
		let element = form.elements[key]

		if (element.type !== 'submit') {
			data[element.name] = element.value
		}
	})
	data.id = generateId()

	return data
}

const getDataFromLocalStore = () => {
	let data = JSON.parse(localStorage.getItem('ContactsDB'))
	return data
}

const printContactsToScreen = () => {
	let contactInfo = getDataFromLocalStore()
	contactList.innerHTML = ''
	contactInfo.forEach(item => renderContact(item))
}

const manageValueStoring = data => {
	// Check LS if there is any values
	if (localStorage.getItem('ContactsDB')) {
		contactInfo = getDataFromLocalStore()
		if (contactInfo.some(contact => contact.phone === data.phone)) {
			messages.push('This phone number already exist')
		} else if (contactInfo.some(contact => contact.email === data.email)) {
			messages.push('This e-mail already exist')
		} else {
			contactInfo.push(data)
			commitContactToLS(contactInfo)
			form.reset()
			messages.length = 0
		}
	} else {
		contactInfo = []
		contactInfo.push(data)
		commitContactToLS(contactInfo)
		form.reset()
		messages.length = 0
	}
}

const commitContactToLS = contact => {
	localStorage.setItem('ContactsDB', JSON.stringify(contact))
}

const deleteContactFromList = value => {
	let newData = getDataFromLocalStore().filter(
		contact => contact.id !== value.id
	)
	commitContactToLS(newData)
	printContactsToScreen()

	if (getDataFromLocalStore().length === 0) {
		console.log('No contacts to show')
		contactTable.style.display = 'none'
	}
	form.reset()
}

const editContact = item => {
	editIsActive = !editIsActive
	submitBtn.style.display = 'none'

	let dataFormLs = getDataFromLocalStore().filter(
		contact => contact.id === item.id
	)

	let data = dataFormLs[0]
	form.style.display = 'block'

	name.value = data.name
	surname.value = data.surname
	birthday.value = data.birthday
	phone.value = data.phone
	email.value = data.email
	address.value = data.address
	zip.value = data.zip

	contactList.innerHTML = ''
	renderContact(data)
}

const saveEditedValues = item => {
	editIsActive = !editIsActive
	deleteContactFromList(item)

	manageValueStoring(getValues())
	form.style.display = 'none'

	let contactInfo = getDataFromLocalStore()
	contactList.innerHTML = ''
	contactInfo.forEach(item => renderContact(item))
	submitBtn.style.display = 'block'
}

const renderContact = item => {
	const markup = `
	<tr id=${item.id}>
		<td contenteditable="false">${item.name}</td>
		<td contenteditable="false">${item.surname}</td>
		<td contenteditable="false">${item.birthday}</td>
		<td contenteditable="false">${item.phone}</td>
		<td contenteditable="false">${item.email}</td>
		<td contenteditable="false">${item.address}</td>
		<td contenteditable="false">${item.zip}</td>
		<td><button class="btn" onclick="deleteContactFromList(${
			item.id
		})" >Delete</button></td>
		<td><button class="btn btn-edit" ${
			editIsActive ? 'disabled' : ''
		}  onclick="editContact(${item.id})">Edit</button></td>
		<td><button class="btn btn-save" ${
			editIsActive ? '' : 'disabled'
		} onclick="saveEditedValues(${item.id})">Save</button></td>
	</tr>
	`
	contactList.insertAdjacentHTML('beforeend', markup)
}

// Event listeners

showAll.addEventListener('click', () => {
	form.style.display = 'none'

	if (getDataFromLocalStore().length > 0) {
		let contactInfo = getDataFromLocalStore()

		contactList.innerHTML = ''
		contactInfo.forEach(item => renderContact(item))
		contactTable.style.display = 'block'
	} else {
		contactTable.style.display = 'none'

		if (messages.length === 0) {
			messages.push('No existing contacts found')
			errorMessage.innerText = messages
		} else {
			errorMessage.innerText = messages
		}
	}
})

addNew.addEventListener('click', () => {
	messages.length = 0
	errorMessage.innerText = messages
	form.style.display = 'block'
	contactTable.style.display = 'none'
})

form.addEventListener('submit', e => {
	e.preventDefault()
	manageValueStoring(getValues())
	if (messages.length > 0) {
		errorMessage.innerText = messages.join(', ')
		messages.length = 0
	}
})
