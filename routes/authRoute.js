const router = require("express").Router();
const authController = require("../controller/authController");
const { auth } = require("../middlewares/authMiddlewares");

router.get("/me", auth, authController.Me);
router.post("/login", authController.Login);
router.delete("/logout", authController.Logout);

module.exports = router;
