const API_URL = 'https://api.freeapi.app/api/v1/public/books';
let currentPage = 1;
let totalPages = 1;
let books = [];

const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const listViewBtn = document.getElementById('listViewBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const currentPageSpan = document.getElementById('currentPage');

async function fetchBooks(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=10`);
        const data = await response.json();
        
        if (data.success) {
            books = data.data.data;
            totalPages = data.data.totalPages;
            currentPage = data.data.page;
            
            renderBooks(books);
            updatePaginationControls();
        }
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function renderBooks(booksToRender) {
    booksContainer.innerHTML = '';
    
    booksToRender.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        
        const thumbnailUrl = book.volumeInfo.imageLinks?.thumbnail || 
            'https://via.placeholder.com/250x350?text=No+Image';
        
        bookCard.innerHTML = `
            <img src="${thumbnailUrl}" alt="${book.volumeInfo.title}">
            <div class="book-details">
                <h2>${book.volumeInfo.title}</h2>
                <p>Author: ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
                <p>Publisher: ${book.volumeInfo.publisher || 'Unknown'}</p>
                <p>Published: ${book.volumeInfo.publishedDate || 'Unknown'}</p>
                <a href="${book.volumeInfo.infoLink}" target="_blank">More Details</a>
            </div>
        `;
        
        booksContainer.appendChild(bookCard);
    });
}

function updatePaginationControls() {
    currentPageSpan.textContent = `Page ${currentPage}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.volumeInfo.title.toLowerCase().includes(searchTerm) ||
        book.volumeInfo.authors?.some(author => 
            author.toLowerCase().includes(searchTerm)
        )
    );
    renderBooks(filteredBooks);
}

function sortBooks() {
    const sortValue = sortSelect.value;
    let sortedBooks = [...books];
    
    switch(sortValue) {
        case 'title-asc':
            sortedBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
            break;
        case 'title-desc':
            sortedBooks.sort((a, b) => b.volumeInfo.title.localeCompare(a.volumeInfo.title));
            break;
        case 'date-asc':
            sortedBooks.sort((a, b) => 
                new Date(a.volumeInfo.publishedDate || 0) - 
                new Date(b.volumeInfo.publishedDate || 0)
            );
            break;
        case 'date-desc':
            sortedBooks.sort((a, b) => 
                new Date(b.volumeInfo.publishedDate || 0) - 
                new Date(a.volumeInfo.publishedDate || 0)
            );
            break;
    }
    
    renderBooks(sortedBooks);
}

function toggleView(view) {
    if (view === 'list') {
        booksContainer.classList.remove('books-grid');
        booksContainer.classList.add('books-list');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    } else {
        booksContainer.classList.remove('books-list');
        booksContainer.classList.add('books-grid');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    }
}

searchInput.addEventListener('input', filterBooks);
sortSelect.addEventListener('change', sortBooks);
listViewBtn.addEventListener('click', () => toggleView('list'));
gridViewBtn.addEventListener('click', () => toggleView('grid'));

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchBooks(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        fetchBooks(currentPage + 1);
    }
});


fetchBooks();
gridViewBtn.classList.add('active');