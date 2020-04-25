let productList = [
  {name: "Mazda", price: 12500, count: 2, id: 'mazda', email: 'mazda@gmail.com', cities: ['Moscow', 'New York', 'Saratov']},
  {name: "BMW", price: 23800, count: 3, id: 'bmw', email: 'bmwmotors@bmw.de', cities: ['Los-Angeles', 'Vitebsk']},
  {name: "Mercedes", price: 18200, count: 5, id: 'mercedes', email: 'mercedes@mercedes.com',cities: ['Saint-Petersburg', 'Moscow']},
  {name: "Suzuki", price: 5000, count: 9, id: 'suzuki', email: 'suzuki@suzuki.com', cities: ['New York']},
  {name: "ZondaMobil", price: 30000, count: 1, id: 'zombie', email: 'zonda@zonda.com', cities: ['Saint-Petersburg']},
  {name: "Nissan", price: 16250, count: 4, id: 'nissan', email: 'nissanmotors@nissan.com',  cities: ['Moscow', 'Vitebsk']}
]


//Local Storage initialization

if (!localStorage.product) {
  let plStringified = JSON.stringify(productList);
localStorage.setItem('product', plStringified);
}

let productRaw  = localStorage.getItem('product');
let productListLocalStorage = JSON.parse(productRaw); 


class Table {
  constructor(data) {
    let promise = new Promise((resolve, reject) => {
setTimeout(() => {
  console.log('preparing data...');
  const backendData = productListLocalStorage;
  resolve(backendData);
}, 500)
    });

    promise.then((data) => {
      console.log('data received', data);
      this.renderList = data;
      this.render(data);
    })

   
    this.sortState = false;
    this.sortStateByPrice = false;
  
    //Current Id to delete
    this.currentId ='';
    this. currentIndex ='';

  }

  render(items) {
    this.el = document.createElement('table');
    this.el.classList.add('table')
    this.el.classList.add('table-bordered')
    const thead = document.createElement('thead');
    thead.classList.add('thead-dark');
    const tbody = document.createElement('tbody');
    
    thead.innerHTML = `     
            <tr class="d-flex">
                <th class="col-5 name"><a href="#" data-action="sortByName">Name</a></th>
                <th class="col-2 price"><a href="#" data-action="sortByPrice">Price</a></th>
                <th class="col-5">Actions</th>
            </tr>`;
    
    tbody.innerHTML = items.map(item => `
    <tr class="d-flex" data-id=${item.id}>
    <td class="col-5 d-flex"><a href="#" data-action="modal_edit">${item.name}</a>
    <span class="ml-auto btn btn-success">${item.count}</span>
    </td>
      <td class="col-2">${item.price.toLocaleString('en-US', {style:'currency', currency:'USD'})}</td>
      <td class="col-5">
      <div class="text-center">
      <button type="button" id="show-button" data-action="modal_edit" class="btn btn-info mr-2">Edit</<button>
      <button type="button" class="btn btn-info" data-action="modal_delete">Delete</button>
    </div
    </td>
    </tr>`).join('');
    this.el.appendChild(thead);
    this.el.appendChild(tbody);
    $('.container').append(this.el);


    this.el.addEventListener('click', event => this.onClick(event));

    //Search Input Listener
    document.querySelector('#input_search').onkeydown = () => {
      if (event.keyCode == '13') {
          
            let inputValue = $('#input_search').val().toLowerCase();
            if (!inputValue) this.render(this.renderList);    
            let newList = this.renderList.filter(product =>  product.name.toLowerCase().includes(inputValue));
            $('.table').remove();
            this.render(newList);
          
        
      }
    };

  //Search Button Listener
  document.querySelector('#button_search').onclick = () => {
    let inputValue = $('#input_search').val().toLowerCase();
    if (!inputValue) this.render(this.renderList);    
    let newList = this.renderList.filter(product =>  product.name.toLowerCase().includes(inputValue));
    $('.table').remove();
    this.render(newList);
  };

  //Add Button
document.querySelector('#add').onclick = (event) => {
  this.modal_edit(event);
  
}
  
}


  //Window Modal Delete
  modal_delete(event) {
event.preventDefault();
    const tr = event.target.closest('tr');
    this.currentId = tr.dataset.id;
    let currentName;
    this.renderList.map((product) => {
      if (product.id == this.currentId) {
        currentName = product.name;
      }

    }) 

     showPrompt(`Are you sure to delete ${currentName}?`, () => {
      this.renderList.map((item, index) => { 
        if (item.id == this.currentId) {
          this.renderList.splice(index, 1);
          
        } 
        $('table').remove();
        this.render(this.renderList);
        localStorage.setItem('product', JSON.stringify(this.renderList));
      
      });
     

    });
  }; 

 //Sort by Name*******************************************************************
  sortByName() {
  $('.table').remove();

if (this.sortState == false || this.sortState == 'z-a') {
//A-Z
let sortedList = this.renderList.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1); 
this.render(sortedList);
$('.name').append('<span class="a-z">&#9650;</span>');
this.sortState = "a-z";
}

else if (this.sortState == 'a-z') {
 //Z-A
   let sortedList = this.renderList.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1: -1); 
   this.render(sortedList);
   $('.name').append('<span class="z-a">&#9660;</span>');
   this.sortState = "z-a";
   
}
}
//*******************************************************************************

//Sort By Price
sortByPrice() {
  $('.table').remove();
  
  //Ascending Sorting
  if (this.sortStateByPrice == false || this.sortStateByPrice == 'descending') {
    let sortedList = this.renderList.sort((a, b) => a.price > b.price ? 1: -1); 
    this.render(sortedList);
    $('.price').append('<span class="price">&#9650;</span>');
    this.sortStateByPrice = "ascending";
    }
    
  //Descending Soring
    else if (this.sortStateByPrice == 'ascending') {
       let sortedList = this.renderList.sort((a, b) => a.price < b.price ? 1: -1); 
       this.render(sortedList);
       $('.price').append('<span class="price">&#9660;</span>');
       this.sortStateByPrice = "descending";
       
    }

}
//*******************************************************************************

//Modal Edit
modal_edit(event) {
const evt_target = ''.concat(event.target.id);

showCover();
let container = document.querySelector('#edit-form-container');
container.style.display = 'block';
let currentName, currentPrice, currentEmail, currentCount;


if (event.target.id !== 'add') {
const tr = event.target.closest('tr');
this.currentId = tr.dataset.id;

this.renderList.map((product, index) => {

if (product.id === this.currentId) {
currentName = product.name;
currentPrice = product.price;
currentEmail = product.email;
currentCount = product.count;
this.currentIndex = index;

//Fields setting for existing item

document.querySelector('#product_heading').innerText = currentName;
document.querySelector('#price').value =  currentPrice.toLocaleString('en-US', {style:'currency', currency:'USD'});
document.querySelector('#name').value = currentName;
document.querySelector('#email').value = currentEmail;
document.querySelector('#count').value = currentCount;
document.querySelector('#save').innerText = "Save changes";
//checkbox initialization - reset 
document.querySelector('#country').selectedIndex = 0;
document.querySelector('#belarus').style.display = 'none'; 
document.querySelector('#usa').style.display = 'none';
document.querySelector('#russia').style.display = 'block';
document.querySelectorAll('input[type=checkbox]').forEach(item => {
item.checked = false
  });
// checkboxes setting;
this.renderList[this.currentIndex].cities.forEach(item => { if (item !== 'checkAll') {document.getElementById(item).checked = true}});
}
});
} else {

  //Fields setting for new intem
    document.querySelector('#product_heading').innerText = 'Add New Product';
    document.querySelector('#price').value = '';
    document.querySelector('#name').value = '';
    document.querySelector('#email').value = '';
    document.querySelector('#count').value = '';
    document.querySelector('#save').innerText = "Add new item"
    //checkbox initialization - reset 
    document.querySelectorAll('input[type=checkbox]').forEach(item => {
      item.checked = false
        });
}


/*------------------------------------------------------------------------------*/



//Price to dollars out of focus

document.querySelector('#price').onblur = () => {
console.log('blur')
if ($('#price').val() !== '') {
  let price_value_locale = parseFloat($('#price').val()).toLocaleString('en-US', {style:'currency', currency:'USD'});
  document.querySelector('#price').value = price_value_locale; 
}  

};

document.querySelector('#price').onfocus = () => {
  console.log('focus');
  if ($('#price').val() !== '') {
    document.querySelector('#price').value = parseFloat($('#price').val().split('$').join('').split(',').join(''));
  }
  
};

//Cancel changes
  document.querySelector('#cancel').onclick = (event) => {
    event.preventDefault();
    hideCover();
    container.style.display = 'none';
  };
  
  document.onkeydown = function(e) {
    if (e.key == 'Escape') {
      container.style.display = 'none';
      document.onkeydown = null;
      hideCover();  
      container.style.display = 'none';
    }
  };


//Save Button

document.querySelector('#save').onclick = (event) => {
event.preventDefault();
  

//Validation
let name = $('#name').val();
let stateName;

(name.length > 4 && name.length < 16) && (name.trim().length > 0) ? stateName = true : stateName = false;
let email = $('#email').val();

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

let stateEmail = validateEmail(email);
let stateCount = $('#count').val();
let statePrice = $('#price').val();

if (stateCount == '') {
  stateCount = false;
} else {
  stateCount = true;
}


if (statePrice == '' || statePrice.split('.').join('').length == 0) {
  statePrice = false;
} else {
  statePrice = true;
}


let allAnswers = [
  {status: stateName, name: 'name'},
  {status: stateEmail, name: 'email'},
  {status: stateCount, name: 'count'},
  {status: statePrice, name: 'price'} 
]

let wrongAnswers = allAnswers.filter(item => item.status == false);
let rightAnswers = allAnswers.filter(item => item.status == true);

rightAnswers.map((item, index) => {
  $(`#validate_${item.name}`).css({'visibility' : 'hidden'});
 
   $(`#${item.name}`).css({'color' : 'black', 'border' : 'solid 1px green'});
 })

wrongAnswers.map((item, index) => {
(index == 0) ? $(`#${item.name}`).focus() : null;
  $(`#validate_${item.name}`).css({'visibility' : ''});
 $(`#${item.name}`).css({'color' : 'red', 'border' : 'solid 1px red'});
})

//Submit changes

 if (wrongAnswers.length == 0) {

   if (evt_target == 'add') {


let dataSending = new Promise((resolve, reject) => {
  setTimeout(() => {
    let citiesArr = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(item => citiesArr.push(item.value));

//Adding new item to product array
     this.renderList.push({
     name: $('#name').val(), 
     price: parseFloat($('#price').val().split('$').join('').split(',').join('')),
     email: $('#email').val(), 
     count: $('#count').val(),
     id: Math.random()+$('#name').val(),
     cities: citiesArr
   });
   localStorage.setItem('product', JSON.stringify(this.renderList));
    
resolve();    
  }, 1000)
});

dataSending.then(() => {
console.log('Data sent');
hideCover();
$('table').remove();
document.querySelector('#edit-form-container').style.display = 'none';
this.render(this.renderList);
})

  
      } else {
     

let dataSending = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('Data sending...');
    this.renderList[this.currentIndex].name = $('#name').val();
    this.renderList[this.currentIndex].price = parseFloat($('#price').val().split('$').join('').split(',').join(''));
    this.renderList[this.currentIndex].email = $('#email').val();
    this.renderList[this.currentIndex].count = $('#count').val();
    let citiesArr = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(item => citiesArr.push(item.value));
    this.renderList[this.currentIndex].cities = citiesArr;
    localStorage.setItem('product', JSON.stringify(this.renderList));
    
resolve();    
  }, 1000)
});

dataSending.then(() => {
console.log('Data sent');
hideCover();
$('table').remove();
document.querySelector('#edit-form-container').style.display = 'none';
this.render(this.renderList);

})
    }

   
  
  }
/* End of submit changes */

}
}


//Event Handler Delegation
  onClick(event) {
    let target = event.target;
    event.preventDefault();
    let action = event.target.dataset.action;
    if (action) {
      this[action](event)
    }
    }
  }
//*******************************************************************************

//Modal Form
    function showCover() {
      let coverDiv = document.createElement('div');
      coverDiv.id = 'cover-div';

      document.body.style.overflowY = 'hidden';
      document.body.append(coverDiv);
      $('.table').css({'filter': 'blur(1px)'});
      $('.search').css({'filter': 'blur(1px)'});
      

    }

    function hideCover() {
      let coverDiv = document.getElementById('cover-div');
      if (coverDiv !== null) {
        coverDiv.remove();
      }
      document.body.style.overflowY = '';
      $('.table').css({'filter': 'blur(0px)'});
      $('.search').css({'filter': 'blur(0px)'});

    }

    showPrompt = (text, callback) => {
      showCover();
      let form = document.getElementById('delete-form');
      let container = document.getElementById('delete-form-container');
      document.getElementById('delete-message').innerHTML = text;

      function complete(value) {
        
        container.style.display = 'none';
        document.onkeydown = null;
        callback(value);
        hideCover();
       
      };


//Confirm Delete

      document.getElementById('yes').addEventListener('click', function() {
        event.preventDefault();
        complete(this.currentId);
              });

//Cancel delete and escape buttons
   
      document.getElementById('no').onclick = function() {
        container.style.display = 'none';
        document.onkeydown = null;
        hideCover();      
      };

      document.onkeydown = function(e) {
        if (e.key == 'Escape') {
          container.style.display = 'none';
          document.onkeydown = null;
          hideCover();  
          container.style.display = 'none';
        }
      };



            container.style.display = 'block';
    
     }

     let table = new Table();






















