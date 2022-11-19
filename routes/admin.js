const express = require("express");

const adminController = require("../controllers/admin");
const isauth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isauth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isauth, adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", isauth, adminController.postAddProduct);

router.get("/edit-product/:productId", isauth, adminController.getEditProduct);

router.post("/edit-product", isauth, adminController.postEditProduct);

router.post("/delete-product", isauth, adminController.postDeleteProduct);

module.exports = router;
