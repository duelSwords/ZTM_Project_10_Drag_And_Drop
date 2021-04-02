
//These are all arrays when using querySelectorAll
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');



// Items
let updatedOnLoad = false

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = []

// Drag Functionality
let draggedItem 
let dragging = false
let currentColumn 


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

//Get the saved info getSavedColumns() and Display the info updateSavedColumns()
// getSavedColumns()
// updateSavedColumns()

// Set localStorage Arrays
// function updateSavedColumns() {
//   localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
//   localStorage.setItem('progressItems', JSON.stringify(progressListArray));
//   localStorage.setItem('completeItems', JSON.stringify(completeListArray));
//   localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
// }

//Refactored
function updateSavedColumns() {
  listArray = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArray[index]))
  })
}

// Filter Arrays to remove empty items
function filterArray(array){
  const filterArray = array.filter(item => item !== null)
  return filterArray
}


// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item
  listEl.draggable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.contentEditable = true //the node state is in fluctuation since context can be changed
  listEl.id = index
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
  //Append
  columnEl.appendChild(listEl)

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad) {
    getSavedColumns()
  }

  // Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index)
  })
 backlogListArray = filterArray(backlogListArray)

  // Progress Column
  progressList.textContent = ''
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index)
  })
  progressListArray = filterArray(progressListArray)

  // Complete Column
  completeList.textContent = ''
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index)
  })
  completeListArray = filterArray(completeListArray)

  // On Hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index)
  })
  onHoldListArray = filterArray(onHoldListArray)

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true
  updateSavedColumns()
}



// Update Item - Delete if necessary or update Array value
function updateItem(id, column){
  const selectedArray = listArray[column]
  const selectedColumnEl = listColumns[column].children
  if(!dragging){
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id]
    } else{
      selectedArray[id] = selectedColumnEl[id].textContent
    }
    updateDOM()
  }
}


//Add to Column List, Rest Textbox
function addToColumn(column){
  const itemText = addItems[column].textContent
  const selectedArray = listArray[column]
  selectedArray.push(itemText)
  addItems[column].textContent = ''
  updateDOM()
  
}


//Show Add Item Input Box
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}

// Hide Item Input Box
function hideInputBox(column){
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}






//Allows arrays to reflect Drag and Drop items
// function rebuildArrays(){
//   backlogListArray = []
//   for(let i=0; i<backlogList.children.length; i++){
//     backlogListArray.push(backlogList.children[i].textContent)
//   }
//   progressListArray = []
//   for(let i=0; i<progressList.children.length; i++){
//     progressListArray.push(progressList.children[i].textContent)
//   }
//   completeListArray = []
//   for(let i=0; i<completeList.children.length; i++){
//     completeListArray.push(completeList.children[i].textContent)
//   }
//   onHoldListArray = []
//   for(let i=0; i<onHoldList.children.length; i++){
//     onHoldListArray.push(onHoldList.children[i].textContent)
//   }
//   updateDOM()
// }

function rebuildArrays(){
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent)
  progressListArray = Array.from(progressList.children).map(i => i.textContent)
  completeListArray = Array.from(completeList.children).map(i => i.textContent)
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent)
  updateDOM()
}



// When Item starts Dragging, ondragstart 
function drag(e) {
  draggedItem = e.target
  dragging = true
  // console.log('draggedItem', draggedItem)
}

// Column Allows for Item to Drop, ondragover
function allowDrop(e){
  e.preventDefault()
} 

// When Item Enters Column Area, ondragenter
function dragEnter(column){
  listColumns[column].classList.add('over')
  currentColumn = column
}


//Dropping Item in Column, ondrop
function drop(e){
  e.preventDefault()
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over')
  })

  // Add Item to Column
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)

  //Dragging Complete
  dragging = false

  rebuildArrays()
}

//On Load
updateDOM()
