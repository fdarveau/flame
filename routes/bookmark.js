const express = require('express');
const router = express.Router();

const {
  createBookmark,
  getBookmarks,
  getBookmark,
  updateBookmark,
  deleteBookmark,
  reorderBookmarks
} = require('../controllers/bookmark');

router
  .route('/')
  .post(createBookmark)
  .get(getBookmarks);

router
  .route('/:id')
  .get(getBookmark)
  .put(updateBookmark)
  .delete(deleteBookmark);

  router
    .route('/0/reorder')
    .put(reorderBookmarks);

module.exports = router;