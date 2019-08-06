exports.get404Page = (req, res, next) => {
  // 404 error page
  console.log("In the 404 Error Page");
  res.status(404).render("404", { docTitle: "Are You Lost?", path: "" });
  //res.status(404).sendFile(path.join(__dirname,  'views' , '404.html'))
};
