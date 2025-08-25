const Book = require("../models/Books");

const addBook = async (req, res) => {
  try {
    const { title, author, code, createdAt } = req.body;
    const newBook = new Book({ title, author, code, createdAt: new Date() });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", data: newBook });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ data: books });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book", error: error.message });
  }
};

// updateBook controller
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};

module.exports = { addBook, getBooks, updateBook, deleteBook };
