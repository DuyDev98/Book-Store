// router/tacgia.router.js
import express from 'express';
import * as tacgiaController from '../controller/tacgia.controller.js';

const router = express.Router();

// Lấy tất cả tác giả
router.get('/', tacgiaController.getAllAuthors);

// Lấy tác giả theo ID
router.get('/:id', tacgiaController.getAuthorById);

// Thêm tác giả mới
router.post('/', tacgiaController.addAuthor);

// Cập nhật tác giả theo ID
router.put('/:id', tacgiaController.updateAuthor);

// Xóa tác giả theo ID
router.delete('/:id', tacgiaController.deleteAuthor);

export default router;
