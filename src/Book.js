import React from 'react';
import BookShelfChanger from './BookShelfChanger';

const Book = ({book, shelf, onMove}) => (
    <li>
        <div className="book">
            <div className="book-top">
                <div
                    className="book-cover"
                    style={{
                        width: 120,
                        height: 200,
                        backgroundImage: `url(${
                            book.imageLinks
                                ? book.imageLinks.thumbnail
                                : 'icons/book-placeholder.svg'
                        })`
                    }}
                />
                <BookShelfChanger book={book} shelf={shelf} onMove={onMove}/>
            </div>
            <div className="book-title">{book.title}</div>
            <div className="book-authors">
                {book.authors ? book.authors.join(', ') : 'Author nknown '}
            </div>
        </div>
    </li>
);

export default Book;
