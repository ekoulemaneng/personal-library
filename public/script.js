let action = '/api/books/';

let inputIdForComment = document.querySelector('#inputIdForComment');
let inputIdForGetBook = document.querySelector('#inputIdForGetBook');
let inputIdForDeleteBook = document.querySelector('#inputIdForDeleteBook');

inputIdForComment.addEventListener('input', () => {
    let addComment = document.querySelector('#addComment');
    addComment.action = action + inputIdForComment.value;
});

inputIdForGetBook.addEventListener('input', () => {
    let getBook = document.querySelector('#getBook');
    getBook.action = action + inputIdForGetBook.value;
});

inputIdForDeleteBook.addEventListener('input', () => {
    let deleteBook = document.querySelector('#deleteBook');
    deleteBook.action = action + inputIdForDeleteBook.value;
});



