// Получение элементов при помощи DOM API
const table = document.querySelector("table");
const btnForm = document.querySelector(".form__button");
const form = document.querySelector("form");
const paginContainer = document.querySelector(".pagin");

// Вспомогательные переменные
let users;
// Переменнная редактирование данных пользователя
let editableUser;
// Переменнная для выбора порядка сортировки
let getOrder = true;
// Массив для кнопок пагинации
const pagBtns = [];
//Часть данных, которые отображены на странице
let currentData; 

// Функция получения данных
async function loadAll() {
  const response = await fetch("http://localhost:3000/users");
  users = await response.json();
  setButtons();
  showPage(pagBtns[0]);
  createRows(currentData);
}

loadAll();

// Функция для обрезки текста
const sliceText = (text, size) => {
  if (text.length > size) return text.slice(0, size) + " ...";
};

// Функция создания элементов таблицы
function createRows(data) {
  //Очистка таблицы
  table.innerHTML = "";
  // Создание шапки таблицы
  const tBody = document.createElement("tbody");
  const tRow = document.createElement("tr");
  // Заголовки шапки таблицы
  const headers = ["firstName", "lastName", "about", "Eye color"];
  table.append(tBody);
  tBody.append(tRow);
  headers.forEach((header) => {
    const tHead = document.createElement("th");
    tHead.textContent = header;
    tRow.append(tHead);
  });
  // Создание тела таблицы
  data.forEach(({ id, name, about, eyeColor }) => {
    const elem = document.createElement("tr");
    elem.dataset.type = id;
    elem.innerHTML = `
            <td>${name.firstName}</td>
            <td>${name.lastName}</td>
            <td>
                <div class="text__wrapper">${about}</div>
            </td>
            <td><div class="table__color" style="background-color: ${eyeColor};"></div></td>
        `;
    tBody.append(elem);
  });
  table.append(tBody);
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

// Функция создания кнопок пагинации
const setButtons = () => {
  const countOfUsers = users.length;
  const countUsersOnPage = 10;
  const btnForPagination = Math.ceil(countOfUsers / countUsersOnPage);
  for (let i = 1; i <= btnForPagination; i++) {
    const btn = document.createElement("li");
    btn.classList.add("pagin__btn");
    btn.textContent = i;
    paginContainer.append(btn);
    pagBtns.push(btn);
  }
};



// Функция пагинации
const showPage = (item) => {
  let page = +item.innerHTML;
  if (item.nodeName !== "LI") return;

  let rowsOnPage = 10;
  let start = (page - 1) * rowsOnPage;
  let end = start + rowsOnPage;
  let countOfRows = users.slice(start, end);
  currentData = countOfRows;
  pagBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
  item.classList.add("active");
  createRows(countOfRows);
};

// Событие переключения страниц
paginContainer.addEventListener("click", ({ target }) => {
  showPage(target);
});

// Событие клика для сортировки
table.addEventListener("click", ({ target }) => {
  if (target.nodeName !== "TH") return;
  getOrder = !getOrder;

  sortData(target.innerText, currentData);

  createRows(currentData);
});

// Событие клика редактирования
table.addEventListener("click", ({ target }) => {
  if (target.nodeName !== "TD" && target.nodeName !== "DIV") return;
  if (target.nodeName === "DIV") target = target.parentElement;
  console.log(target.parentElement)
  const selectRow = target.parentElement;
  const allRows = document.querySelectorAll("tr");
  const foundUser = currentData.find(
    (el) => el.id === selectRow.getAttribute("data-type")
  );
  editableUser = foundUser;

  const form = document.forms.userForm;
  
  const { name: { firstName, lastName }, about, eyeColor } = foundUser;
  form.firstName.value = firstName;
  form.lastName.value = lastName;
  form.about.value = about;
  form.eyeColor.value = eyeColor;
  //Выделение строки на которой произошел клик и добавление формы для ее редактирования
  if (selectRow && selectRow.classList.contains("active")) {
    selectRow.classList.remove("active");
    form.classList.add("hide");
  } else {
    allRows.forEach((tr) => {
      tr.classList.remove("active");
    });
    selectRow.classList.add("active");
    form.classList.remove("hide");
  }
});

//Событие редактирование выбранной строки
form.addEventListener("submit", (e) => {
  e.preventDefault();
  editableUser.name.firstName = form.firstName.value;
  editableUser.name.lastName = form.lastName.value;
  editableUser.about = form.about.value;
  editableUser.eyeColor = form.eyeColor.value;

  // const editableRow = document.querySelector(
  //   `[data-type="${editableUser.id}"]`
  // );
  createRows(currentData);
  form.reset();
  form.classList.add("hide");
});

