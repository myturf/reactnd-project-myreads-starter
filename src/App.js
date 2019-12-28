import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'

import {Route} from 'react-router-dom';
import {debounce} from 'throttle-debounce';

import ListBooks from './ListBooks';
import Search from './Search';

const bookshelves = [
    {key: 'currentlyReading', name: 'Currently Reading'},
    {key: 'wantToRead', name: 'Want to Read'},
    {key: 'read', name: 'Read'}
];

class BooksApp extends React.Component {
    state = {
        /**
         * TODO: Instead of using this state variable to keep track of which page
         * we're on, use the URL in the browser's address bar. This will ensure that
         * users can use the browser's back and forward buttons to navigate between
         * pages, as well as provide a good URL they can bookmark and share.
         */
        myBooks: [],
        search: [],
        error: false
    }

    componentDidMount = () => {
        BooksAPI.getAll()
            .then(books => {
                this.setState({myBooks: books});
            })
            .catch(err => {
                console.log(err);
                this.setState({error: true});
            });
    };
    move = (book, shelf) => {
        BooksAPI.update(book, shelf).catch(err => {
            console.log(err);
            this.setState({error: true});
        });
        if (shelf === 'none') {
            this.setState(prevState => ({
                myBooks: prevState.myBooks.filter(b => b.id !== book.id)
            }));
        } else {
            book.shelf = shelf;
            this.setState(prevState => ({
                myBooks: prevState.myBooks.filter(b => b.id !== book.id).concat(book)
            }));
        }
    };

    // found debounce, a great library
    performSearch = debounce(300, false, query => {
        if (query.length > 0) {
            BooksAPI.search(query).then(books => {
                if (books.error) {
                    this.setState({search: []});
                } else {
                    this.setState({search: books});
                }
            });
        } else {
            this.setState({search: []});
        }
    });
    reset = () => {
        this.setState({search: []});
    };

    render() {
        const {myBooks, search, error} = this.state;
        if (error) {
            return <div>Error Occured.</div>;
        }

        return (
            <div className="app">
                <Route
                    exact
                    path="/"
                    render={() => (
                        <ListBooks
                            bookshelves={bookshelves}
                            books={myBooks}
                            onMove={this.move}
                        />
                    )}
                />
                <Route
                    path="/search"
                    render={() => (
                        <Search
                            searchBooks={search}
                            myBooks={myBooks}
                            onSearch={this.performSearch}
                            onMove={this.move}
                            onResetSearch={this.reset}
                        />
                    )}
                />
            </div>
        )
    }
}

export default BooksApp
