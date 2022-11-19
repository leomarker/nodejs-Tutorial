const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId, "details");
  // Product.findAll({ where: { id: prodId } }).then((products) => {
  //   res.render("shop/product-detail", {
  //     product: products,
  //     pageTitle: products.title,
  //     path: "/products",
  //     isAuthenticated: req.session.isLoggedin,
  //   });
  // });
  //   .catch((err) => console.log(err));
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  CartItem.findAll()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  CartItem.findOne({ where: { productId: prodId } })
    .then((cartitem) => {
      console.log(cartitem);
      if (cartitem) {
        console.log(cartitem.quantity);
        cartitem.quantity = cartitem.quantity + 1;
        console.log(cartitem.quantity);
        cartitem.save();
        return res.redirect("/cart");
      } else {
        Cart.create({
          userId: req.session.user.id,
        }).then((cart) => {
          CartItem.create({
            quantity: 1,
            cartid: cart.cartid,
            productId: prodId,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  CartItem.findOne({ where: { productId: prodId } }).then((cart) => {
    if (cart) {
      Cart.findAll({ where: { id: cart.id } }).then((cart) => {
        cart.destroy();
      });
      cart.destroy();
    }

    return res.redirect("/cart");
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedin,
      });
    })
    .catch((err) => console.log(err));
};
