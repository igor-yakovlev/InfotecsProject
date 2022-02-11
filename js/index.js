// Получение элементов при помощи DOM API
const table = document.querySelector("table");
const btnForm = document.querySelector(".form__button")
const form = document.querySelector("#formDat")

let getOrder = true;

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
  data.forEach(({id, name, about, eyeColor }) => {
    const elem = document.createElement("tr");
    elem.innerHTML = `
            <td data-type=${id}>${name.firstName}</td>
            <td data-type=${id}>${name.lastName}</td>
            <td data-type=${id}>
            <p class="about">
                ${about}
            </p>
            </td>
            <td data-type=${id}>${eyeColor}</td>
        `;
    tbody.append(elem);
  });
  table.append(tbody);
}

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
      break;

    case "lastName":
      return arr.sort((a, b) => {
        if (getOrder) {
          if (a.name.lastName < b.name.lastName) return -1;
        } else {
          if (a.name.lastName > b.name.lastName) return -1;
        }
      });
      break;

    case "about":
      return arr.sort((a, b) => {
        if (getOrder) {
          if (a.about < b.about) return -1;
        } else {
          if (a.about > b.about) return -1;
        }
      });
      break;

    case "Eye color":
      return arr.sort((a, b) => {
        if (getOrder) {
          if (a.eyeColor < b.eyeColor) return -1;
        } else {
          if (a.eyeColor > b.eyeColor) return -1;
        }
      });
      break;
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
table.addEventListener("click", (e) => {
  const target = e.target;
  if (target.nodeName !== "TH") return;
  getOrder = !getOrder;
  console.log(target.innerText);

  sortData(target.innerText, users);

  createRows(users);
});

table.addEventListener("click", (e) => {
  const target = e.target;
  if (target.nodeName !== "TD") return;
  console.log(target.getAttribute('data-type'));
  fetch("http://localhost:3000/users")
  .then((data) => data.json())
  .then((res) => {
    users = res;
    const findedUser = users.find(el => el.id === target.getAttribute('data-type'))
    console.log(findedUser)
    const inpFirstName = document.querySelector('#firstName');
    const inpLastName = document.querySelector('#lastName');
    const inpAbout = document.querySelector('#about');
    inpFirstName.value = `${findedUser.name.firstName}`;
    inpLastName.value = `${findedUser.name.lastName}`;
    inpAbout.value = `${findedUser.about}`;

  });
})


btnForm.addEventListener('click', (e) => {
  e.preventDefault()
  const data = new FormData(formDat);

  console.log(data);
})