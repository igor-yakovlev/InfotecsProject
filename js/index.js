// Получение элементов при помощи DOM API
const table = document.querySelector("table");
const btnForm = document.querySelector(".form__button");
const form = document.querySelector("form");
const paginContainer = document.querySelector('.pagin');

// Вспомогательные переменные
let users;
let editableUser;

// Функция для обрезки текста
const sliceText = (text, size) => {
  if (text.length > size) return text.slice(0, size) + ' ...'}

// Функция создания элементов таблицы
function createRows(data) {
  const forDelete = document.querySelector("tbody");

  if (forDelete) forDelete.remove();

  const tbody = document.createElement("tbody");
  const thead = document.createElement("tr");
  thead.innerHTML = `
		<th>firstName</th>
		<th>lastName</th>
		<th>about</th>
		<th>Eye color</th>
    `;
  tbody.prepend(thead);
  
  // data = data.slice(10, 20);

  data.forEach(({id, name, about, eyeColor }) => {
    const elem = document.createElement("tr");
    elem.dataset.type = id;
    elem.innerHTML = `
            <td>${name.firstName}</td>
            <td>${name.lastName}</td>
            <td class="about">
                ${sliceText(about, 55)}
            </td>
            <td>${eyeColor}</td>
        `;
    tbody.append(elem);
  });
  table.append(tbody);
}

const getPagin = (data) => {
  const tdOnPage = 10;
  const buttonClicked = data.length / tdOnPage;
  const startFrom = 0;
for (let i = 1; i <= buttonClicked; i++) {
  const paginBtn = document.createElement('button');
  paginBtn.classList.add('pagin__btn');
  let text = document.createTextNode(`${i}`);
  paginBtn.appendChild(text);
  paginContainer.appendChild(paginBtn);

// const dataPag = allRepos.slice(startFrom , startFrom + tdOnPage)
console.log(startFrom);

}
}









// Переменнная для выбора порядка сортировки
let getOrder = true;

// Функция сортировки
const sortData = (title, arr) => {

  switch (title) {
    case "firstName":
      return arr.sort((a, b) => { 
        if (getOrder) {
          if (a.name.firstName < b.name.firstName) return -1;
        } else {
          if (a.name.firstName > b.name.firstName) return -1;
        }
       });
      

    case "lastName":
      return arr.sort((a, b) => {
        if (getOrder) {
          if (a.name.lastName < b.name.lastName) return -1;
        } else {
          if (a.name.lastName > b.name.lastName) return -1;
        }
      });
      

    case "about":
      return arr.sort((a, b) => {
        if (getOrder) {
          if (a.about < b.about) return -1;
        } else {
          if (a.about > b.about) return -1;
        }
      });
      

    case "Eye color":
      return arr.sort((a, b) => {
        if (getOrder) {
          if (a.eyeColor < b.eyeColor) return -1;
        } else {
          if (a.eyeColor > b.eyeColor) return -1;
        }
      });
      
  }
};


// Получение данных
fetch("http://localhost:3000/users")
  .then((data) => data.json())
  .then((res) => {
    
    users = res;
    createRows(users);
    
  });




// Событие клика для сортировки
table.addEventListener("click", ({target}) => {
  if (target.nodeName !== "TH") return;
  getOrder = !getOrder;

  

  sortData(target.innerText, users);

  createRows(users);
});

// Событие клика редактирования
table.addEventListener("click", ({target}) => {

  if (target.nodeName !== "TD") return;

  const selectRow = target.parentElement;
  const allRows = document.querySelectorAll('tr');

  const foundUser = users.find(el => el.id === selectRow.getAttribute('data-type'));
  
  editableUser = foundUser;

  const form = document.forms.userForm;
  
  const {name: {firstName, lastName}, about, eyeColor} = foundUser;
    form.firstName.value = firstName;
    form.lastName.value = lastName;
    form.about.value = about;
    form.eyeColor.value = eyeColor;
  
  //Выделение строки на которой произошел клик и добавление формы для ее редактирования
  if (selectRow && selectRow.classList.contains('active')) {
    selectRow.classList.remove('active');
    form.classList.add('hide');
    
  } else {
    allRows.forEach(tr => {
      tr.classList.remove('active');
    })
    selectRow.classList.add('active');
    form.classList.remove('hide');
    
  }
  

});


//Событие клика пагинации
paginContainer.addEventListener('click', ({target}) => {
  console.log(target.innerHTML);
  let currentPage = target.innerHTML * 10;
  console.log(currentPage);
  
  users = users.slice(currentPage, currentPage + 10);
  console.log(users);
  
  createRows(users);
});




// Редактирование выбранной строки
function editData(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  editableUser.name.firstName = form.firstName.value;
  editableUser.name.lastName = form.lastName.value;
  editableUser.about = form.about.value;
  editableUser.eyeColor = form.eyeColor.value;


  const editableRow = document.querySelector(`[data-type="${editableUser.id}"]`);

  console.log(editableUser);
  
  console.log(editableRow);
  createRows(users);
  form.reset();
  form.classList.add('hide');
})

};

editData(form);
