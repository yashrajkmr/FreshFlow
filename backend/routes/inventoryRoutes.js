// FreshFlow Inventory REST Routes
import express from 'express';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  approveMarkdown
} from '../controllers/inventoryController.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(createItem);

router.route('/:id')
  .get(getItem)
  .put(updateItem)
  .delete(deleteItem);

router.post('/:id/approve', approveMarkdown);

export default router;
