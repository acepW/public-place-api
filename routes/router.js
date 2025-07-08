const router = require("express").Router();

router.use("/", require("./authRoute"));
router.use("/", require("./galleryRoute"));
router.use("/", require("./userRoute"));
router.use("/", require("./uploadRoute"));

module.exports = router;
