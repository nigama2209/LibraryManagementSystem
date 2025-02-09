import "./App.css";
import { useState } from "react";
function Hello() {
  const [BookTitle, setBookTitle] = useState();
  const [BookAuthor, setBookAuthor] = useState();
  const [BookCode, setBookCode] = useState();
  const [searchBook, setSearchBook] = useState();
  const [Books, setBooks] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [lastAdded, setLastAdded] = useState({});
  const [foundBooks, setFoundBooks] = useState([]);
  const FirstCap = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const addBook = () => {
    if (!BookTitle || !BookAuthor || !BookCode) {
      alert("Please fill all the fields");
      return;
    } else {
      setIsAdd(true);
      const newBook = {
        title: FirstCap(BookTitle.trim()),
        author: FirstCap(BookAuthor.trim()),
        code: FirstCap(BookCode.trim()),
      };
      if (
        Books.some(
          (book) => book.title.toLowerCase() === newBook.title.toLowerCase()
        )
      ) {
        alert("Book already present, please enter another values");
        return;
      } else if (
        Books.some(
          (book) => book.code.toLowerCase() === newBook.code.toLowerCase()
        )
      ) {
        alert("Book already present, please enter another values");
        return;
      } else {
        setBooks([...Books, newBook]);
        setLastAdded(newBook);
        alert("Book added successfully");
      }
    }
  };
  const bookSearched = () => {
    if (!searchBook) {
      alert("Please enter a search term");
      return;
    } else {
      const sbook = searchBook.toLowerCase();
      const filteredBooks = Books.filter(
        (book) =>
          book.title.toLowerCase().includes(sbook) ||
          book.author.toLowerCase().includes(sbook) ||
          book.code.toLowerCase().includes(sbook)
      );
      if (filteredBooks.length === 0) {
        alert("Book not found");
        setFoundBooks([]);
      } else {
        alert("Book(s) found");
        setFoundBooks(filteredBooks);
      }
      setShowBooks(false);
      setIsAdd(false);
      setSearchBook("");
    }
  };
  return (
    <div className="App">
      <div className="body">
        <h1 style={{ color: "whitesmoke", textAlign: "center" }}>
          Library Management System
        </h1>
        <div className="inputContainer">
          <input
            className="inputField"
            value={Books.BookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            type="text"
            placeholder="Book Title"
          ></input>
          <input
            className="inputField"
            value={Books.BookAuthor}
            type="text"
            onChange={(e) => setBookAuthor(e.target.value)}
            placeholder="Book Author"
          ></input>
          <input
            className="inputField"
            value={Books.BookCode}
            type="text"
            onChange={(e) => setBookCode(e.target.value)}
            placeholder="Book Code"
          ></input>{" "}
        </div>
        <div className="btnContainer">
          <button className="btn" onClick={addBook}>
            Add Book
          </button>
          <button className="btn" onClick={() => setShowBooks(!showBooks)}>
            Display all Books
          </button>{" "}
        </div>
        <div className="searchContainer">
          <input
            className="searchField"
            value={searchBook}
            type="search"
            placeholder="Search a Book with title, author or code"
            onChange={(e) => setSearchBook(e.target.value)}
          ></input>
          <button className="searchBtn" onClick={bookSearched}>
            Search
          </button>
        </div>
        {isAdd && (
          <div className="tableContent">
            <table
              style={{
                display: showBooks ? "none" : "block",
                margin: "auto",
                textAlign: "center",
              }}
            >
              <thead>
                <tr className="tableRow">
                  <th className="tableDataHead">Title</th>
                  <th className="tableDataHead">Author</th>
                  <th className="tableDataHead">Code</th>
                </tr>
              </thead>
              <tbody>
                <tr className="tableRow">
                  <td className="tableData">{lastAdded.title}</td>
                  <td className="tableData">{lastAdded.author}</td>
                  <td className="tableData">{lastAdded.code}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {showBooks && (
          <div className="tableContent">
            <table style={{ margin: "auto" }}>
              <thead>
                <tr className="tableRow">
                  <th className="tableDataHead">Title</th>
                  <th className="tableDataHead">Author</th>
                  <th className="tableDataHead">Code</th>
                </tr>
              </thead>
              <tbody>
                {Books.map((book, index) => (
                  <tr key={index} className="tableRow">
                    <td className="tableData">{book.title}</td>
                    <td className="tableData">{book.author}</td>
                    <td className="tableData">{book.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {foundBooks && (
          <div className="tableContent">
            <table>
              <thead>
                <tr className="tableRow">
                  <th className="tableDataHead">Title</th>
                  <th className="tableDataHead">Author</th>
                  <th className="tableDataHead">Code</th>
                </tr>
              </thead>
              <tbody>
                <tr className="tableRow">
                  <td className="tableData">{foundBooks.title}</td>
                  <td className="tableData">{foundBooks.author}</td>
                  <td className="tableData">{foundBooks.code}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Hello;
