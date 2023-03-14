const { User, Thought } = require("../models");

function hendlerUser(user, response){
  if (!user) {
    response.status(404).json({ message: "User does not exists" });
  }else{
    response.json(user);
  }
}

function getUsers(request, response) {
  const query = User.find({})
  query.populate({path: "friends", select: "-__v"})
  query.select("-__v")
  query.sort({ _id: -1 })
  query.then(users => response.json(users))
 
 }

function getUser({ params }, response) {
  const query = User.findOne({ _id: params.id })
  query.populate({path: "thoughts", select: "-__v"})
  query.populate({path: "friends", select: "-__v"})
  query.select("-__v")
  query.then(user => hendlerUser(user, response))
    .catch(error => response.sendStatus(400));
}

function createUser({ body }, response) {
  const query = User.create(body)
  query.then(user => response.json(user))
  query.catch(error => response.json(error))
}

function updateUser({ params, body }, response) {
  const query = User.findOneAndUpdate({ _id: params.id }, body, {new: true, runValidators: true})
  query.then(user => hendlerUser(user, response))
    .catch(error => response.json(error));
}

function deleteUser({ params }, response) {
  const query = User.findOneAndDelete({ _id: params.id })
  query.then(user => {
      if (!user) {
        response.status(404).json({ message: "User does not exist" });
      }else{
        Thought.deleteMany({ _id: { $in: user.thoughts } });
      }
    })
     .then(user => {
      response.json({ message: "User and associated thoughts deleted!" });
    })
    .catch(error => response.json(error));
}

function addFriend({ params }, response) {
  const query = User.findOneAndUpdate({ _id: params.userId },{ $addToSet: { friends: params.friendId } },{ new: true, runValidators: true })
  query.then(user => hendlerUser(user, response))
    .catch(error => response.json(error));
}

function removeFriend({ params }, response) {
  const query = User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
  query.then(user => hendlerUser(user, response))
    .catch(error => response.json(error));
}
module.exports = {getUsers, getUser, createUser, updateUser, deleteUser, addFriend, removeFriend};