const router = require('express').Router();

const { getAllUsers, getUser, postUser, loginUser,  updateUser, deleteUser } = require('../controller/userController.js');

// ADMIN ROUTES
// ------------------------------ Retrieve/ GET All Users
router.get("/", getAllUsers);
// ------------------------------ Retrieve/ GET Single User
router.get("/:id", getUser);
// ------------------------------ Create/ POST Single User (Registration)
router.post('/', postUser);
// ------------------------------ Login User
// router.post('/', loginUser);
// ------------------------------ Update/ PATCH Single User
// pwede pod i PUT
router.patch("/:id", updateUser);
// ------------------------------ Delete Single User
router.delete("/:id", deleteUser);

module.exports = router;