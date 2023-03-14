const router = require("express").Router();
const { User, Thought } = require("../../models");

const {getUsers, getUser, createUser, updateUser, deleteUser, addFriend, removeFriend} = require("../../controllers/user-controller");


router.route("/")
    .get(getUsers)
    .post(createUser);

router.route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

router.route("/:userId/friends/:friendId")
    .post(addFriend)
    .delete(removeFriend);

module.exports = router;