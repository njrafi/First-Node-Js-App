
const products = [];

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    prods: products,
    docTitle: "Shop",
    path: "/shop"
  });
};

exports.getAddProduct = (req, res, next) => {
  console.log("In the add product directory");
  //res.sendFile(path.join(rootDir,'views' , 'add-product.html'))
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/add-product"
  });
};

exports.postProduct = (req, res, next) => {
  console.log(req.body.title);
  products.push(req.body.title);
  console.log(products);
  res.redirect("/");
};
