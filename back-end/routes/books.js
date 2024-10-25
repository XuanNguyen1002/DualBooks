var express = require('express');
var router = express.Router();
const bookController = require('../controller/BookController');
const uploadBooks = require('../middlewares/uploadBooks');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const authenticateAdmin = require('../middlewares/auth');
// Routers for API
// Get books listing
// http://localhost:3000/books
router.get('/', async function(req, res, next) {
    console.log('GET /books endpoint hit');
    try {
        const result = await bookController.getAll();

       
        if (result) {
            console.log('Books fetched successfully:', result);
            res.status(200).json( result );
        } else {
            console.log('No Books found');
            res.status(404).json({ error: 'No Books found' });
        }
    } catch (error) {
        console.error('Error fetching Books:', error.message);
        res.status(500).json({ error: error.message });
    }
});
// Tìm kiếm sách theo từ khóa
router.get('/search', async (req, res, next) => {
  const query = req.query.query;

  try {
      const result = await bookController.searchBooks(query);

      if (result.length > 0) {
          res.status(200).json(result);
      } else {
          res.status(404).json({ message: 'No books found' });
      }
  } catch (error) {
      console.error('Error searching books:', error.message);
      res.status(500).json({ error: error.message });
  }
});
// Endpoint lọc sách theo thể loại
router.get('/category/:categoryID', async function(req, res, next) {
  console.log('GET /books/category/:categoryID endpoint hit');
  const categoryID = req.params.categoryID;
  try {
      const result = await bookController.getByCategory(categoryID);

      if (result.length > 0) {
          console.log(`Books fetched successfully for category ${categoryID}:`, result);
          res.status(200).json(result);
      } else {
          console.log(`No Books found for category ${categoryID}`);
          res.status(404).json({ error: `No Books found for category ${categoryID}` });
      }
  } catch (error) {
      console.error(`Error fetching Books for category ${categoryID}:`, error.message);
      res.status(500).json({ error: error.message });
  }
});
// Endpoint lọc sách theo tác giả
router.get('/author/:author', async function(req, res, next) {
  console.log('GET /books/author/:author endpoint hit');
  const author = req.params.author;
  try {
      // Gọi hàm từ controller để lấy sách theo tác giả
      const result = await bookController.getByAuthor(author);

      if (result.length > 0) {
          console.log(`Books fetched successfully for author ${author}:`, result);
          res.status(200).json(result);
      } else {
          console.log(`No Books found for author ${author}`);
          res.status(404).json({ error: `No Books found for author ${author}` });
      }
  } catch (error) {
      console.error(`Error fetching Books for author ${author}:`, error.message);
      res.status(500).json({ error: error.message });
  }
});
// Endpoint lấy danh sách sản phẩm hot
// GET /books/hot
router.get('/hot', async (req, res) => {
    try {
      // Gọi controller để xử lý yêu cầu
      await bookController.getHotProducts(req, res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Endpoint lấy danh sách sản phẩm nổi bật
// GET /books/featured
router.get('/featured', async (req, res) => {
    try {
      // Gọi controller để xử lý yêu cầu
      await bookController.getFeaturedProducts(req, res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// Endpoint lấy danh sách sách và sắp xếp theo giá
router.get('/sortedByPrice', async function(req, res, next) {
  console.log('GET /books/sortedByPrice endpoint hit');
  // Lấy tham số truy vấn 'sortOrder', mặc định là 'asc'
  const sortOrder = req.query.sortOrder || 'asc';
  try {
      // Gọi hàm từ controller để lấy sách và sắp xếp theo giá
      const result = await bookController.getAllSortedByPrice(sortOrder);

      if (result.length > 0) {
          console.log('Books fetched and sorted by price:', result);
          res.status(200).json(result);
      } else {
          console.log('No Books found');
          res.status(404).json({ error: 'No Books found' });
      }
  } catch (error) {
      console.error('Error fetching Books sorted by price:', error.message);
      res.status(500).json({ error: error.message });
  }
});
// Endpoint lấy danh sách sách mới nhất
// GET /books/latest
router.get('/new', async (req, res) => {
    try {
      // Gọi controller để xử lý yêu cầu
      await bookController.getLatestBooks(req, res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// Endpoint xem chi tiết sách theo ID
router.get('/:id', async function(req, res, next) {
  console.log('GET /books/:id endpoint hit');
  // Lấy tham số ID từ URL
  const bookId = req.params.id;
  try {
      // Gọi hàm từ controller để lấy chi tiết sách
      const result = await bookController.getBookById(bookId);

      if (result) {
          console.log('Book fetched successfully:', result);
          res.status(200).json(result);
      } else {
          console.log('Book not found');
          res.status(404).json({ error: 'Book not found' });
      }
  } catch (error) {
      console.error('Error fetching Book by ID:', error.message);
      res.status(500).json({ error: error.message });
  }
});

// Endpoint tạo sách mới với hình ảnh
// POST /api/books
router.post('/', uploadBooks.single('cover_image'), async (req, res, next) => {
    console.log('POST /books endpoint hit');
    try {
        // Lấy dữ liệu sách từ body của request
        const bookData = req.body;

        // Kiểm tra xem có tệp tin hình ảnh được tải lên không
        if (req.file) {
            // Lưu tên file hình ảnh vào trường cover_image
            bookData.cover_image = req.file.filename;
        } else {
            // Nếu không có hình ảnh, có thể thiết lập một giá trị mặc định hoặc bỏ qua
            bookData.cover_image = 'default.jpg'; // Ví dụ: sử dụng hình ảnh mặc định
        }

        const newBook = await bookController.createBook(bookData);

        console.log('Book created successfully:', newBook);
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint cập nhật thông tin một cuốn sách
// PUT /api/books/:id
router.put(
    '/:id',
    uploadBooks.single('cover_image'), // Sử dụng Multer để xử lý tải lên hình ảnh (nếu có)
    [
        // body('title').optional().notEmpty().withMessage('Title không được để trống'),
        // body('author').optional().notEmpty().withMessage('Author không được để trống'),
        // body('category').optional().notEmpty().withMessage('Category không được để trống'),
        // body('description').optional().notEmpty().withMessage('Description không được để trống'),
        // body('price').optional().isFloat({ gt: 0 }).withMessage('Price phải là số dương'),
        // body('stock').optional().isInt({ gt: -1 }).withMessage('Stock phải là số nguyên không âm'),
        body('categoryID').optional().isMongoId().withMessage('categoryID phải là ObjectId hợp lệ'),
        body('cover_image').optional().isString().withMessage('cover_image phải là chuỗi')
    ],
    async (req, res, next) => {
        const bookId = req.params.id;
        let updatedData = req.body;

        // Kiểm tra kết quả của validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Nếu có lỗi validation, trả về lỗi cho client
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../uploads/books', req.file.filename));
            }
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Tìm sách hiện tại để lấy tên file hình ảnh cũ
            const currentBook = await bookController.getBookById(bookId);
            if (!currentBook) {
                // Nếu không tìm thấy sách, xóa file ảnh mới tải lên (nếu có) và trả về lỗi
                if (req.file) {
                    fs.unlinkSync(path.join(__dirname, '../uploads/books', req.file.filename));
                }
                return res.status(404).json({ error: 'Book not found' });
            }

            // Nếu có tệp tin hình ảnh được tải lên, cập nhật trường cover_image
            if (req.file) {
                updatedData.cover_image = req.file.filename;

                // Nếu có ảnh cũ và ảnh cũ không phải là 'default.jpg', xóa ảnh cũ
                if (currentBook.cover_image && currentBook.cover_image !== 'default.jpg') {
                    const oldImagePath = path.join(__dirname, '../uploads/books', currentBook.cover_image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }

            // Gọi controller để cập nhật sách
            const updatedBook = await bookController.updateBook(bookId, updatedData);

            res.status(200).json(updatedBook);
        } catch (error) {
            console.error('Error updating book:', error.message);
            // Nếu có lỗi, xóa file ảnh vừa tải lên (nếu có)
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../uploads/books', req.file.filename));
            }
            res.status(500).json({ error: error.message });
        }
    }
);
// Xóa một cuốn sách
router.delete('/:id', async (req, res, next) => {
  const bookId = req.params.id;

  try {
      const deletedBook = await bookController.deleteBook(bookId);

      if (deletedBook) {
          res.status(200).json({ message: 'Book deleted successfully' });
      } else {
          res.status(404).json({ error: 'Book not found' });
      }
  } catch (error) {
      console.error('Error deleting book:', error.message);
      res.status(500).json({ error: error.message });
  }
});

  
module.exports = router;
