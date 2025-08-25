const express = require("express");
const { addBook, getBooks,updateBook,deleteBook } = require("../controllers/bookController");
const router = express.Router();
router.post("/add", addBook);
router.get("/all", getBooks);
router.put("/edit/:id", updateBook);
router.delete("/delete/:id", deleteBook);
module.exports = router;
