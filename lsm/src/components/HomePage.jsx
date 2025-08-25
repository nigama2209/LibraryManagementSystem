import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { colors, BaseUrl, ConfirmDialog } from "../constants/constants";
import { FaPlus, FaBookReader, FaEdit, FaTrash } from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", author: "", code: "" });
  const [searchBook, setSearchBook] = useState("");
  const [books, setBooks] = useState([]);
  const [lastAdded, setLastAdded] = useState(null);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [showBooks, setShowBooks] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).trim() : "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addBook = async () => {
    const { title, author, code } = formData;

    if (!title || !author || !code) {
      return toast.error("Please fill all fields", {
        autoClose: 500,
        position: "top-center",
      });
    }
    const codeRegex = /^[A-Za-z0-9]{3,10}$/; // Alphanumeric, 3-10 chars
    if (!codeRegex.test(code)) {
      return toast.error(
        "Book code must be alphanumeric and 3-10 characters long",
        {
          autoClose: 1000,
          position: "top-center",
        },
      );
    }

    const bookData = {
      title: capitalize(title),
      author: capitalize(author),
      code: capitalize(code),
    };

    try {
      if (editMode) {
        const response = await axios.put(
          `${BaseUrl}/books/edit/${editId}`,
          bookData,
        );
        if (response.status === 200) {
          toast.success("Book updated successfully", {
            autoClose: 500,
            position: "top-center",
          });
          setBooks((prev) =>
            prev.map((b) => (b._id === editId ? response.data.data : b)),
          );
          resetForm();
        }
      } else {
        const response = await axios.post(`${BaseUrl}/books/add`, bookData);
        if (response.status === 201) {
          const Book = response.data.data;
          setLastAdded(Book);
          toast.success("Book added successfully", {
            autoClose: 500,
            position: "top-center",
          });
          setFormData({ title: "", author: "", code: "" });
          setShowBooks(false);
        }
      }
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", author: "", code: "" });
    setEditMode(false);
    setEditId(null);
  };

  const showAllBooks = async () => {
    if (showBooks) {
      setShowBooks(false);
      return;
    }

    try {
      const response = await axios.get(`${BaseUrl}/books/all`);
      if (response.status === 200) {
        const allBooks = response.data.data;
        setBooks(allBooks);
        setShowBooks(true);
        setSearchedBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const search = () => {
    if (!searchBook)
      return toast.error("Enter a value to search", {
        autoClose: 500,
        position: "top-center",
      });

    const q = searchBook.toLowerCase();
    const results = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q),
    );

    if (results.length === 0) {
      toast.error("No book found", {
        autoClose: 500,
        position: "top-center",
      });
      setSearchedBooks([]);
    } else {
      setSearchedBooks(results);
      setShowBooks(false);
    }

    setSearchBook("");
  };

  const editBook = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      code: book.code,
    });
    setEditId(book._id);
    setEditMode(true);
  };

  const confirmDelete = (id) => {
    setDialog({
      open: true,
      title: "Delete Book",
      content: "Are you sure you want to delete this book?",
      onConfirm: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BaseUrl}/books/delete/${id}`);
      if (response.status === 200) {
        toast.success("Book deleted successfully", {
          autoClose: 500,
          position: "top-center",
        });
        setBooks((prev) => prev.filter((b) => b._id !== id));
        setSearchedBooks((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setDialog({ ...dialog, open: false });
    }
  };

  const confirmLogout = () => {
    setDialog({
      open: true,
      title: "Logout",
      content: "Are you sure you want to logout?",
      onConfirm: () => handleLogout(),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully", {
      autoClose: 500,
      position: "top-center",
      onClose: () => {
        navigate("/");
      },
    });
    setDialog({ ...dialog, open: false });
  };

  const BookTable = ({ data, title, variant }) => (
    <div className="table-responsive">
      <h4 className={`text-${variant} text-center mb-2`}>{title}</h4>
      <table className="table table-bordered table-hover text-center">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Code</th>
            <th>Added On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.code}</td>
              <td>{new Date(book.createdAt).toLocaleDateString()}</td>
              <td>
                <FaEdit
                  className="me-3 text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => editBook(book)}
                />
                <FaTrash
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => confirmDelete(book._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container py-4">
      <div
        className="text-light p-4 rounded shadow"
        style={{ backgroundColor: colors.themeColor }}>
        {/* Header + Logout */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h1 className="mb-3 mb-md-0 text-center text-md-start">
            <MdLibraryBooks size={40} className="pb-1" /> Library Management
            System
          </h1>
          <Button variant="contained" color="error" onClick={confirmLogout}>
            Logout
          </Button>
        </div>

        {/* Input Fields */}
        <div className="row g-3 mb-3">
          {["title", "author", "code"].map((field, i) => (
            <div className="col-12 col-md-4" key={i}>
              <input
                type="text"
                name={field}
                className="form-control"
                placeholder={`Book ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
          <button
            className="btn text-light"
            onClick={addBook}
            style={{ backgroundColor: colors.buttonColor2 }}>
            <FaPlus size={20} className="pb-1" />{" "}
            {editMode ? "Update Book" : "Add Book"}
          </button>
          {editMode && (
            <button className="btn btn-secondary" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
          <button
            className="btn text-white"
            style={{ backgroundColor: colors.buttonColor1 }}
            onClick={showAllBooks}>
            <FaBookReader size={20} className="pb-1" />{" "}
            {showBooks ? "Hide" : "Display All Books"}
          </button>
        </div>

        {/* Search */}
        <div className="input-group mb-4">
          <input
            type="search"
            className="form-control"
            placeholder="🔍 Search by title, author or code"
            value={searchBook}
            onChange={(e) => setSearchBook(e.target.value)}
          />
          <button
            className="btn text-light fw-bold"
            onClick={search}
            style={{ backgroundColor: colors.buttonColor3 }}>
            Search
          </button>
        </div>

        {/* Render Tables */}
        {lastAdded && !showBooks && searchedBooks.length === 0 && !editMode && (
          <BookTable data={[lastAdded]} title="Last Added Book" />
        )}

        {showBooks && searchedBooks.length === 0 && (
          <BookTable data={books} title="All Books" />
        )}

        {searchedBooks.length > 0 && (
          <BookTable data={searchedBooks} title="Search Results" />
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        content={dialog.content}
        onClose={() => setDialog({ ...dialog, open: false })}
        onConfirm={dialog.onConfirm}
      />

      <ToastContainer />
    </div>
  );
}

export default HomePage;
