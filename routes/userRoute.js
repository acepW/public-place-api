const router = require("express").Router();
const userController = require("../controller/userController");

router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUsers);
router.post("/users", userController.createUsers);
router.put("/users/:id", userController.updateUsers);
router.delete("/users/:id", userController.deleteUsers);

module.exports = router;
