// Получение элементов при помощи DOM API
const table = document.querySelector(".table");
const form = document.querySelector("form");
const paginationContainer = document.querySelector(".pagination__container");

// Вспомогательные переменные
let users;
// Переменнная редактирование данных пользователя
let editableUser;
// Переменные для выбора порядка сортировки
const ASC = 'ASC'
const DESC = 'DESC'
let sortOrder = DESC;
//Переменная часть данных, которые отображены на странице
let displayedUsers;
//Переменная, показывающая количество юзеров на странице
const USER_PER_PAGE = 10;
//Переменная заголовков
const TABLE_HEADERS = ["firstName", "lastName", "about", "Eye color"];

// Функция инициализации данных
async function init() {
  users = await loadAllUsers();

  const paginationButtons = createPaginationButton(users);
  paginationContainer.append(...paginationButtons);

  const [firstPage] = paginationButtons;
  setActivePage(firstPage);

  displayedUsers = sliceUsersBasedOnPage(+firstPage.innerHTML);
  createRows(displayedUsers);
}
init();

// Функция получения данных с сервера
async function loadAllUsers() {
  return fetch('/.netlify/functions/db').then(r => r.json());
}

// Функция создания элементов таблицы
function createRows(data) {
  //Очистка таблицы
  table.innerHTML = "";
  // Создание первой строки - шапки таблицы
  const tBody = document.createElement("tbody");

  // Создание строки заголовков
  const tableHeaders = TABLE_HEADERS.map((header) => {
    const tHead = document.createElement("th");
    tHead.textContent = header;
    return tHead;
  });
  // Создание заголовков таблицы
  const headerRow = document.createElement("tr");
  headerRow.append(...tableHeaders);

  // Создание тела таблицы
  const rows = data.map(({ id, name, about, eyeColor }) => {
    const row = document.createElement("tr");
    row.dataset.type = id;
    row.innerHTML = `
            <td>${name.firstName}</td>
            <td>${name.lastName}</td>
            <td>
                <div class="table__text-wrapper">${about}</div>
            </td>
            <td><div class="table__color-wrapper" style="background-color: ${eyeColor};"></div></td>
        `;
    return row;
  });

  tBody.append(headerRow, ...rows);
  table.append(tBody);
}

// Функция сортировки
const sortData = (title, arr) => {
  // Выбор направления сортировки
  const comparator = (fn) => {
    return (a,b) => {
      if(sortOrder === ASC){
        return fn(a) < fn(b) && -1;

      } else {
        return fn(a) > fn(b) && -1;
      }
    }
  }
  // Выбор алгоритма сортировки
  switch (title) {
    case "firstName":
      return arr.sort(comparator(it => it.name.firstName));

    case "lastName":
      return arr.sort(comparator(it => it.name.lastName));

    case "about":
      return arr.sort(comparator(it => it.about));

    case "Eye color":
      return arr.sort(comparator(it => it.eyeColor));

  }
};

// Функция создания кнопок пагинации
const createPaginationButton = (data) => {
  // Вычисление количества кнопок
  const numberOfPaginationButtons = Math.ceil(data.length / USER_PER_PAGE);
  // Создание кнопок
  const createPaginationButton = (content) => {
    const btn = document.createElement("li");
    btn.classList.add("pagin__btn");
    btn.textContent = content;

    return btn;
  }

  const paginationButtons = [];

  for (let i = 0; i < numberOfPaginationButtons; i++) {
    paginationButtons.push(createPaginationButton(i + 1));
  }

  return paginationButtons;
};

// Обрезка массива по количеству строк на странице
const sliceUsersBasedOnPage = (pageNumber) => {
  let start = (pageNumber - 1) * USER_PER_PAGE;
  let end = start + USER_PER_PAGE;
  return users.slice(start, end);
}

// Функция выделения активной страницы
const setActivePage = (element) => {
  Array.from(
      paginationContainer.querySelectorAll('.pagin__btn')
  ).forEach(it => it.classList.remove('active'));

  // Добавление стилей выбранной кнопки
  element.classList.add("active");
}

// Событие переключения страниц
paginationContainer.addEventListener("click", ({ target }) => {
  // Проверка выбранного элемента
  if (target.nodeName !== "LI") return;

  setActivePage(target);
  // Номер выбранной страницы
  const pageNumber = +target.innerHTML;
  // Отображаемые пользователи
  displayedUsers = sliceUsersBasedOnPage(pageNumber);
  // Перерисовка данных
  createRows(displayedUsers);
});

// Событие клика для сортировки
table.addEventListener("click", ({ target }) => {
  if (target.nodeName !== "TH") return;
  sortOrder = sortOrder === ASC ? DESC : ASC;
  // Сортировка данных
  sortData(target.innerText, displayedUsers);
  // Перерисовка данных
  createRows(displayedUsers);
});

// Событие клика редактирования
table.addEventListener("click", ({ target }) => {
  // Проверка выбранных элементов 
  if (target.nodeName !== "TD" && target.nodeName !== "DIV") return;

  const selectRow = target.nodeName === "DIV" ? target.parentElement.parentElement : target.parentElement;
  // Получение всех строк
  const allRows = document.querySelectorAll("tr");
  // Поиск пользователя
  const foundUser = displayedUsers.find(
    (el) => el.id === selectRow.getAttribute("data-type")
  );
  // Привязка найденного пользователя для последующего редактирования
  editableUser = foundUser;

  const form = document.forms.userForm;
  // Добавление значений найденного объекта в элементы формы
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

//Событие редактирования пользователя
form.addEventListener("submit", (e) => {
  e.preventDefault();
  // Редактирование пользователя
  editableUser.name.firstName = form.firstName.value;
  editableUser.name.lastName = form.lastName.value;
  editableUser.about = form.about.value;
  editableUser.eyeColor = form.eyeColor.value;
  // Перерисовка данных
  createRows(displayedUsers);
  // Очистка формы
  form.reset();
  // Скрытие формы
  form.classList.add("hide");
});

//Событие закрытия формы клавишей Escape
document.addEventListener('keydown', (e) => {
  if (e.code === "Escape") {
    form.classList.add("hide");
    table.querySelector(`[data-type='${editableUser.id}']`).classList.remove('active');
  }
});

