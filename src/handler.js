const { nanoid } = require('nanoid');
const books = require('./books');

const saveBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount == readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt };
    
    if (name == null) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
};

const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let find = books;
    if(name !== undefined){
        find = books.filter((a) => a.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (reading !== undefined){
        find = books.filter((a) => a.reading === (reading === '1'));
    }

    if(finished !== undefined) {
        find = books.filter((a) => a.finished === (finished === '1'));
    }
    
    const response = h.response({
        status: 'success',
        data: {
            books: find.map((a) =>(
                {
                    id: a.id,
                    name: a.name,
                    publisher: a.publisher,
                }
            )),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((a) => a.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book
            },
        });
        response.code(200);
        return response;
    } 
    
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if(pageCount == readPage){
        const finished = true;
    }

    const Book = books.filter((book) => book.id === bookId)[0];

    if (name == null) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    } else if (index !== -1) {
        books[index] = {
          ...books[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
        }; 

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    } else if (Book == undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    const Book = books.filter((book) => book.id === bookId)[0];

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
      } else if (Book == undefined){
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }
};

module.exports = { saveBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };