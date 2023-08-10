import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://playground-23fe2-default-rtdb.asia-southeast1.firebasedatabase.app/'
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, 'shoppingList');

const addBtn = document.getElementById('add-button');
const inputField = document.getElementById('input-field');
const shoppingList = document.getElementById('shopping-list');
const errorMessage = document.getElementById('error-message');

onValue(itemsInDB, (snapshot) => {
    
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        clearShoppingList();
        clearErrorMessage();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemId = currentItem[0];
            let currentItemValue = currentItem[1];
            appendToShoppingList(currentItem);
        }
        
    } else {
        shoppingList.innerHTML = '<p id="message">No items here...</p>';
    }
});

addBtn.addEventListener('click', () => {
    let inputValue = inputField.value;
    if (inputValue !== '') {
        push(itemsInDB, inputValue);
        clearInputField();
    } else {
        addErrorMessage();
    }
});

function clearInputField() {
    inputField.value = '';
}

function clearShoppingList() {
    shoppingList.innerHTML = '';
}

function clearErrorMessage() {
    inputField.placeholder = 'Please add item';
    inputField.classList.remove('error');
}

function addErrorMessage() {
    inputField.placeholder = 'No item has been added!';
    inputField.classList.add('error');
}

function appendToShoppingList(item) {
    let itemId = item[0];
    let itemValue = item[1];
    let newEl = document.createElement('li');
    newEl.textContent = itemValue;
    shoppingList.appendChild(newEl);
    
    newEl.addEventListener('click', () => {
        let itemInDB = ref(database, `shoppingList/${itemId}`);
        remove(itemInDB);
    })
}