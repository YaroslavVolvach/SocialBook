const { Thought, User } = require("../models");

function hendlerThought(thought, response){
  if (!thought) {
    response.status(404).json({ message: 'Thought does not exist' });
  }else{
    response.json(thought)
  }
}

function getThoughts(request, response) {
    const query = Thought.find({})
    query.populate({path: "reactions", select: "-__v",})
    query.select("-__v")
    query.sort({ _id: -1 })
    query.then(thought => response.json(thought))
      .catch(error => response.sendStatus(400));
  }

function getThought({ params }, response) {
    const query = Thought.findOne({ _id: params.id })
    query.populate({path: "reactions", select: "-__v"})
    query.select("-__v")
    query.then(thought => hendlerThought(thought, response))
      .catch(error => {response.sendStatus(400)})
  }

function createThought({ params, body }, response) {
    const query = Thought.create(body)
    query.then(({ _id }) => {
      User.findOneAndUpdate({ username: body.username }, { $push: { thoughts: _id } }, { new: true })
      .then(user => {
        if(!user){
          response.status(200).json({ message: "Thought is created without user" });
        }else{
          response.status(200).json({ message:  "Thought is successfully created"});
        }
      })
      .catch((error) => response.json(error))
  })}



function updateThought({ params, body }, response) {
    const query = Thought.findOneAndUpdate({ _id: params.id }, body, {new: true, runValidators: true})
    query.then(thought => hendlerThought(thought, response))
      .catch((error) => response.json(error));
  }

  
function deleteThought({ params }, response) {
   const query = Thought.findOneAndDelete({ _id: params.id })
   query.then(thought => {
      if(!thought){
        response.status(404).json({ message: 'Thought does not exist' });
      }else{
      User.findOneAndUpdate({ thoughts: params.id }, { $pull: { thoughts: params.id } }, { new: true })
      .then(user =>{
        if(!user){
          response.status(200).json({massage: "Thought is deleted, but user does not exist"})
        }else{
          response.status(200).json({massage: "Thought is successfully deleted"})
        }
      })
      .catch(error => response.json(error));
      }
  })
}


function addReaction({ params, body }, response) {
    const querty = Thought.findOneAndUpdate({ _id: params.thoughtId }, { $addToSet: { reactions: body } }, { new: true, runValidators: true })
    querty.then(thought => hendlerThought(thought, response))
      .catch(error => response.json(error))
  }

function removeReaction({ params }, response) {
    const querty = Thought.findOneAndUpdate( { _id: params.thoughtId },{ $pull: { reactions: { reactionId: params.reactionId } } }, { new: true })
    querty.then(thought => response.json(thought))
      .catch(error => response.json(error))
  }


module.exports = {getThoughts, getThought, createThought, updateThought, deleteThought, addReaction, removeReaction};