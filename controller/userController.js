const Users = require("../model/userModel");
const bcrypt = require("bcryptjs");

const userController = {
  getUsers: async (req, res) => {
    const _id = req.params.id;

    try {
      if (_id) {
        const response = await Users.findByPk(_id);
        res.status(200).json({ data: response });
      } else {
        const response = await Users.findAll(
          {
            order: [["id", "DESC"]],
          },
          {
            attributes: ["id", "name", "email", "status"],
          }
        );
        res.status(200).json({ data: response });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  createUsers: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "incomplite data" });

    const users = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (users) return res.status(404).json({ msg: "Email Alredy To Use" });
    const hasPassword = await bcrypt.hash(password, 10);

    try {
      await Users.create({
        name: name,
        email: email,
        password: hasPassword,
      }),
        res.status(201).json({ msg: "Register Successfuly" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  updateUsers: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const users = await Users.findOne({
        where: {
          uuid: req.params.id,
        },
      });
      if (!users) return res.status(404).json({ msg: "User Not Found" });

      let hashPassword;
      //console.log(password);
      if (password === "" || password === null) {
        hashPassword = users.password;
      } else {
        hashPassword = await bcrypt.hash(password, 10);
      }
      await Users.update(
        {
          name: name,
          email: email,
        },
        {
          where: {
            id: users.id,
          },
        }
      ),
        res.status(200).json({ msg: "User Update Successfuly" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  deleteUsers: async (req, res) => {
    try {
      const users = await Users.findOne({
        where: {
          uuid: req.params.id,
        },
      });
      if (!users) return res.status(404).json({ msg: "User Not Found" });
      await Users.update(
        { is_active: false },
        {
          where: {
            id: users.id,
          },
        }
      ),
        res.status(200).json({ msg: "User Delete Successfuly" });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = userController;
