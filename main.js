const bookList = [];
const RENDER_BOOKLIST = "render-booklist";

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("bookForm");
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_BOOKLIST, function () {
  const uncompletedBookList = document.getElementById("incompleteBookList");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookList");
  completedBookList.innerHTML = "";

  for (const book of bookList) {
    const bookElement = makeBook(book);
    if (!book.isCompleted) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const title = document.createElement("h3");
  title.setAttribute("data-testid", "bookItemTitle");
  title.innerText = bookObject.title;

  const author = document.createElement("p");
  author.setAttribute("data-testid", "bookItemAuthor");
  author.innerText = bookObject.author;

  const year = document.createElement("p");
  year.setAttribute("data-testid", "bookItemYear");
  year.innerText = bookObject.year;

  const bookIsCompleteButton = document.createElement("button");
  bookIsCompleteButton.classList.add("completeButton");
  bookIsCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButton");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.innerText = "Hapus buku";

  const editButton = document.createElement("button");
  editButton.classList.add("editButton");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.innerText = "Edit buku";

  const buttonContainer = document.createElement("div");

  const bookItemContainer = document.createElement("div");
  bookItemContainer.classList.add("bookItem");
  bookItemContainer.setAttribute("data-bookid", bookObject.id);
  bookItemContainer.setAttribute("data-testid", "bookItem");

  if (bookObject.isCompleted) {
    bookIsCompleteButton.innerText = "Belum selesai dibaca";
    buttonContainer.append(bookIsCompleteButton, deleteButton, editButton);

    bookIsCompleteButton.addEventListener("click", function () {
      console.log(bookObject);
      removeBookFromCompleted(bookObject.id);
    });

    deleteButton.addEventListener("click", function () {
      removeBookFromStorage(bookObject.id);
    });

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    bookItemContainer.append(title, author, year, buttonContainer);
  } else {
    bookIsCompleteButton.innerText = "Selesai dibaca";
    buttonContainer.append(bookIsCompleteButton, deleteButton, editButton);

    bookIsCompleteButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    deleteButton.addEventListener("click", function () {
      removeBookFromStorage(bookObject.id);
    });

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    bookItemContainer.append(title, author, year, buttonContainer);
  }

  return bookItemContainer;
}

function addBook() {
  const id = generateID();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isCompleted = document.getElementById("bookFormIsComplete").checked;

  const bookObject = generateBookObject(id, title, author, year, isCompleted);
  bookList.push(bookObject);

  document.dispatchEvent(new Event(RENDER_BOOKLIST));
  saveData();
}

function searchBook() {
  const titleToBeSearch = document.getElementById("searchBookTitle").value;
  const allTitles = document.querySelectorAll("h3");

  for (const title of allTitles) {
    if (titleToBeSearch != "") {
      if (title.innerText.toLowerCase() != titleToBeSearch.toLowerCase()) {
        title.parentElement.style.display = "none";
      } else {
        title.parentElement.style.display = "flex";
      }
    } else {
      title.parentElement.style.display = "flex";
    }
  }
}

function addBookToCompleted(bookId) {
  const target = findBook(bookId);

  if (target == null) return;

  target.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_BOOKLIST));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const target = findBook(bookId);

  if (target == null) return;

  target.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_BOOKLIST));
  saveData();
}

function removeBookFromStorage(bookId) {
  const target = findBookIndex(bookId);

  if (target === -1) return;

  bookList.splice(target, 1);
  document.dispatchEvent(new Event(RENDER_BOOKLIST));
  saveData();
}

function editBook(bookId) {
  const target = findBook(bookId);
  updatedTitle = prompt("Masukkan judul baru: ");
  updatedAuthor = prompt("Masukkan penulis baru: ");
  updatedYear = Number(prompt("Masukkan tahun baru: "));

  target.title = updatedTitle;
  target.author = updatedAuthor;
  target.year = updatedYear;

  document.dispatchEvent(new Event(RENDER_BOOKLIST));
  saveData();
}

function generateID() {
  return new Date().getTime();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const book of bookList) {
    if (book.id === bookId) {
      return book;
    }
  }

  return null;
}

function findBookIndex(bookId) {
  for (const index in bookList) {
    if (bookList[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

const STORAGE_KEY = "BOOK_LIST";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung local storage");
    return false;
  }

  return true;
}

function loadDataFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  let serializedData = JSON.parse(data);

  if (serializedData !== null) {
    for (const book of serializedData) {
      bookList.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOKLIST));
}

function saveData() {
  if (isStorageExist()) {
    const parsedData = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, parsedData);
  }
}
