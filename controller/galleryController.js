const { where } = require("sequelize");
const Gallery = require("../model/galleryModel");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const GalleryController = {
  getGallery: async (req, res) => {
    const _id = req.params.id;
    const { page, limit, character, place } = req.query;

    try {
      let obj = { is_active: true };
      const offset = (parseInt(page) - 1) * parseInt(limit);
      if (character) obj.character = character;
      if (place) obj.place = place;

      if (page && limit) {
        const length = await Gallery.count({ where: obj });
        const response = await Gallery.findAll({
          where: obj,
          order: [["createdAt", "DESC"]],
          limit: parseInt(limit),
          offset,
        });
        res.status(200).json({
          data: response,
          total_page: Math.ceil(length / parseInt(limit)),
        });
      } else if (_id) {
        const response = await Gallery.findByPk(_id);
        res.status(200).json({ data: response });
      } else {
        const response = await Gallery.findAll({
          where: obj,
          order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ data: response });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  createGallery: async (req, res) => {
    const { character, place, image_url, caption, maps_url } = req.body;
    const t = await db.transaction();

    try {
      if (!character)
        return res.status(400).json({ msg: "character required!!" });
      if (!place) return res.status(400).json({ msg: "place required!!" });
      if (!image_url)
        return res.status(400).json({ msg: "image url required!!" });
      if (!caption) return res.status(400).json({ msg: "caption required!!" });
      if (!maps_url)
        return res.status(400).json({ msg: "maps url required!!" });
      await Gallery.create(
        {
          character,
          place,
          image_url,
          caption,
          maps_url,
        },
        { transaction: t }
      ),
        await t.commit();
      res.status(201).json({ msg: "upload success" });
    } catch (error) {
      await t.rollback();
      res.status(400).json({ msg: error.message });
    }
  },

  updateGallery: async (req, res) => {
    const _id = req.params.id;
    const { character, place, image_url, caption, maps_url } = req.body;

    try {
      let obj = {};
      const dataGallery = await Gallery.findByPk(_id);
      if (!dataGallery) return res.status(404).json({ msg: "data not found" });
      if (character) obj.character = character;
      if (place) obj.place = place;
      if (image_url) obj.image_url = image_url;
      if (caption) obj.caption = caption;
      if (maps_url) obj.maps_url = maps_url;
      await Gallery.update(obj, {
        where: {
          id: _id,
        },
      }),
        res.status(200).json({ msg: "update success" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  deleteGallery: async (req, res) => {
    const _id = req.params.id;
    try {
      const dataGallery = await Gallery.findByPk(_id);
      if (!dataGallery) return res.status(404).json({ msg: "data not found" });
      await Gallery.update(
        { is_active: false },
        {
          where: {
            id: _id,
          },
        }
      ),
        res.status(200).json({ msg: "Delete success" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = GalleryController;
