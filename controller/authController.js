const Users = require("../model/userModel");
const { generate_access_token } = require("../utils/jwt");
const bcrypt = require("bcryptjs");

const authController = {
  Login: async (req, res) => {
    if (!req.body.email && !req.body.password)
      return res.status(400).json({ msg: "Incomplete input data!" });

    const users = await Users.findOne({
      is_active: true,
      where: {
        email: req.body.email,
      },
    });
    if (!users) return res.status(404).json({ msg: "User Not Found" });

    const mach = await bcrypt.compare(req.body.password, users.password);
    if (!mach) return res.status(400).json({ msg: "Wrong Password" });

    const id = users.id;
    const name = users.name;
    const email = users.email;

    const access_token = generate_access_token({
      id: id,
      name: name,
      email: email,
    });

    res.cookie("access_token", access_token, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      path: "/",
    });

    res.status(200).json({ name, email });
  },

  Me: async (req, res, next) => {
    if (!req.cookies.access_token)
      return res.status(401).json({ msg: "Pliss Login" });

    const id = req.user.id;

    const users = await Users.findOne({
      where: {
        id: id,
      },
    });
    if (!users) return res.status(404).json({ msg: "User Not Found" });
    res.status(200).json({ data: users });
  },

  Logout: async (req, res) => {
    if (!req.cookies.access_token)
      return res.status(403).json({ msg: "Pliss Login" });

    const clear = res.clearCookie("access_token", {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      path: "/",
    });
    if (!clear) return res.status(400).json({ msg: "Cannot Logout" });
    res.status(200).json({ msg: "Logout Success" });
  },
};

module.exports = authController;
