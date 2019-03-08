// Storage Controller


// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  // Data Structure / State
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
   
    logData: function(){
      return {
        data
      };
    },
    //return lists
    getItems:function(){
      return data.items;
    },
    addInputList: function(meal,calorie){
      let ID,newItem;
      //to get unique id
      if(data.items.length > 0){
        ID = data.items[data.items.length-1].id + 1;
      }else{
        ID = 0;
      }
      //to convert string to int 
      calorie = parseInt(calorie);
      //create instance 
      newItem = new Item(ID,meal,calorie);
      data.items.push(newItem);
      return newItem;

    },
    addTotalCal:function(){
      let total = 0;
      data.items.map(function(item){
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    //EDIT -----match id of click item 
    getItemId: function(id){
      let found;
      data.items.map(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },

    //edit --- update btn
    updateInputs:function(name,calories){
      let found;
      calories = parseInt(calories);
      data.items.map(function(item){
        item.id ===data.currentItem.id;
        item.name  = name;
        item.calories = calories;
        found = item;
      })
      return found;
    },
    //EDIT-----assign to curent state
    editCurrentState:function(item){
      data.currentItem = item;
    },
    //edit--
    getDetails: function(){
      return  data.currentItem;
    }
  }
})();

// UI Controller
const UICtrl = (function(){

//all ui selector
  const UISelectors ={
    itemList: '#item-list',
    listItemsLi:'#item-list li',
    mealItem:'#item-name',
    calorieItem: '#item-calories',
    totalCalories:'.total-calories',
    updateBtn:'.update-btn',
    deleteBtn:'.delete-btn',
    backBtn:'.back-btn',
    addBtn:'.add-btn'
  }
  // Public methods
  return {
    showLists: function(items) {
      let html = '';
      items.forEach(element => {
        html += `
        <li class="collection-item" id="item-${element.id}">
        <strong>${element.name} </strong> <em>${element.calories} </em>
        <a href="#" class="secondary-content">
          <i class="fa fa-pencil"></i>
        </a>
      </li>
        `
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    //get the input data like meal n calories from fields
    getInputs: function(){
      return {
      meal: document.querySelector(UISelectors.mealItem).value,
      calorie: document.querySelector(UISelectors.calorieItem).value
    }
    },
    //add item to ui 
    addToUI:function(item){
      let li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `
      <strong>${item.name} </strong> <em>${item.calories} </em>
      <a href="#" class="secondary-content">
        <i class="fa fa-pencil"></i>
      </a>
      ` 
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
    },

    //total calories ui
    totalCalories: function(total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },

    //EDIT----Add to form list
    addToFormList:function() {
      document.querySelector(UISelectors.mealItem).value = ItemCtrl.getDetails().name;
      document.querySelector(UISelectors.calorieItem).value = ItemCtrl.getDetails().calories;
    },
    //update the edit ui
    updateEditUI: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItemsLi);
      listItems = Array.from(listItems);
      listItems.forEach(function(itemli){
        const itemId = itemli.getAttribute('id');
        if(itemId === `item-${item.id}`){
          document.querySelector(`#${itemId}`).innerHTML = ` <strong>${item.name} </strong> <em>${item.calories} </em>
          <a href="#" class="secondary-content">
            <i class="fa fa-pencil"></i>
          </a>`
        }
      });
      
    },

    //clear input fields
    clearInputs:function(){
      //clear values
    document.querySelector(UISelectors.mealItem).value = ''
    document.querySelector(UISelectors.calorieItem).value = ''
    },

    //clearedit button
    clearEditbutton: function(){
      this.clearInputs();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    //show buttons edit,update
    showButtons:function(){
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    //ui selectors public
    getUISelectors: function(){
      return UISelectors;
    }
  }

})();



// App Controller
const App = (function(ItemCtrl, UICtrl){

  //ui selector
  const UISelectorsApp = UICtrl.getUISelectors();
//load event listner
  function loadEventListener(){
    document.querySelector('.add-btn').addEventListener('click',addMeal);
    // to disable enter
    document.body.addEventListener('keypress',disableEnter);

    //update edit button
    document.querySelector(UISelectorsApp.updateBtn).addEventListener('click',updateMeal)
    //to click on edit
    document.querySelector(UISelectorsApp.itemList).addEventListener('click',editState);

    //back button
    document.querySelector(UISelectorsApp.backBtn).addEventListener('click',backBtnClick);

  }

  //back button click
  function backBtnClick(e){
    
    e.preventDefault()
  }
  //callback function
  function addMeal(e){
    //call to ui cntrl
    const input = UICtrl.getInputs();
    if(input.meal !== '' && input.calorie!== '') {
      const newItem = ItemCtrl.addInputList(input.meal,input.calorie);
      //add item to ui
      UICtrl.addToUI(newItem);
      //clear input
      UICtrl.clearInputs();
      //add total calories
      const totalCal = ItemCtrl.addTotalCal();
      //show total calories to ui
      UICtrl.totalCalories(totalCal);
    }
    
    
    e.preventDefault();
  }
  //to disable enter key
  function disableEnter(e){
    if(e.keyCode === 13){
      e.preventDefault();
      return false;
    }
    
  }
  function updateMeal(e){
   let inputs =  UICtrl.getInputs();
   //edit---item control
    let updateitem = ItemCtrl.updateInputs(inputs.meal,inputs.calorie);
    //edit--ui control
    UICtrl.updateEditUI(updateitem);

    //add total cal to item cntrl
    const totalCal = ItemCtrl.addTotalCal();
    //show total calories to ui
    UICtrl.totalCalories(totalCal);

    //call clear edit button ..hide the buttons
    UICtrl.clearEditbutton(); 

   e.preventDefault();
  }

  //edit state
  function editState(e){
    if(e.target.classList.contains('fa-pencil')){
      let id,itemData;
      let itemId  = e.target.parentElement.parentElement.id;
        itemId = itemId.split('-');
        id = parseInt(itemId[1]);
        //match the click id
       itemData =  ItemCtrl.getItemId(id);
      //assign to current data
      ItemCtrl.editCurrentState(itemData);
      //edit to form UI
      UICtrl.addToFormList();
      //show buttons
      UICtrl.showButtons();
    }
    e.preventDefault();
  }
  // Public methods
  return {
    init: function(){
      //call clear edit button ..hide the buttons
      UICtrl.clearEditbutton(); 
     const items =  ItemCtrl.getItems();
     UICtrl.showLists(items);
      console.log('Initializing App...');

      //call load event
      loadEventListener();
    }
  }
  
})(ItemCtrl, UICtrl);

// Initialize App
App.init();