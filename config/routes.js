const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const petController = require("../controllers/petController");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/pet", petController);
};
