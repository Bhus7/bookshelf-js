const formresponse = document.querySelector("#bookform");
const booklist = document.querySelector("#booklist");

let books = [];
let editindex = -1;

formresponse.addEventListener("submit", function(event){
    event.preventDefault();


    const booktitle = document.querySelector("#title").value.trim();
    const authorname = document.querySelector("#author").value.trim();
    const read = document.querySelector("#read").checked;
    const coverURL = document.querySelector("#cover").value.trim();

    let book = {
        title: booktitle,
        author: authorname,
        cover: coverURL,
        read: read
    };

    console.log(book);
 
   
    if (editindex !== -1) {
    books[editindex] = book;
     editindex = -1;
     formresponse.querySelector("button[type='submit']").textContent = "Add Book";
    } else {
        books.push(book);
    }

    saveBooks();
    formresponse.reset();

    renderbook();
});

function renderbook(bookArray = books){

    booklist.innerHTML = "";

    bookArray.forEach((book,index) => {
        const bookDiv = document.createElement("div");
        bookDiv.className = "book-card";


         bookDiv.innerHTML = `
            <img src = "${book.cover}" alt = "Cover image" class = "book-cover"/><br>
             <strong>${book.title}</strong><br>
             <em>${book.author}</em><br>
            <span class="status ${book.read ? "" : "not-read"}">
                 Status: ${book.read ? "Read" : "Not Read"}
            </span><br>
            <button class="btn-delete" data-index="${index}">Delete</button><br>
            <button class="btn-edit" data-index="${index}" style="margin-top: 8px;">Edit</button>`;
    
         booklist.appendChild(bookDiv); 
    });

    const deletebuttons = document.querySelectorAll(".btn-delete");
    deletebuttons.forEach ((btn) => {
        btn.addEventListener("click", function(){
            const index = this.getAttribute("data-index");
            books.splice(index, 1);
            saveBooks();
            console.log("Updated books array:", books);
            renderbook();
        });
    });

    const editbuttons = document.querySelectorAll(".btn-edit");
    editbuttons.forEach((btn) => {
        btn.addEventListener("click", function(){
            editindex = this.getAttribute("data-index");

            const bookToEdit = books[editindex];

            document.querySelector("#title").value = bookToEdit.title;
            document.querySelector("#author").value = bookToEdit.author;
            document.querySelector("#cover").value = bookToEdit.cover;
            document.querySelector("#read").checked = bookToEdit.read;

            formresponse.querySelector("button[type='submit']").textContent = "Update Book";

        })
    });

}

function saveBooks() {
  localStorage.setItem("bookshelfBooks", JSON.stringify(books));
}

function loadBooks() {
  const savedBooks = localStorage.getItem("bookshelfBooks");
  if (savedBooks) {
    books = JSON.parse(savedBooks);
    renderbook();
  }

  const searchInput = document.querySelector("#searchInput");
  searchInput.addEventListener("input",function(){
    const keyword = searchInput.value.toLowerCase().trim();

    const filteredBooks = books.filter(book => {
        return(
            book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword)
        );
    });
    renderbook(filteredBooks);
  }); 
}
loadBooks();

const sortSelect = document.querySelector("#sort-select");

sortSelect.addEventListener("change", function(){
    const sortBy = sortSelect.value;

    if (!sortBy) return;

    books.sort((a,b) =>{
        let fieldA = a[sortBy].toLowerCase();
        let fieldB = b[sortBy].toLowerCase();

        if (fieldA <fieldB) return -1;
        if (fieldA > fieldB) return 1;
        return 0;
    });
    renderbook();
});