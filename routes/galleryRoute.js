const router = require("express").Router();
const galleryController = require("../controller/galleryController");

router.get("/gallery", galleryController.getGallery);
router.get("/gallery/:id", galleryController.getGallery);
router.post("/gallery", galleryController.createGallery);
router.put("/gallery/:id", galleryController.updateGallery);
router.delete("/gallery/:id", galleryController.deleteGallery);

module.exports = router;
