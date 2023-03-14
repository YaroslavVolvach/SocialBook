const router = require("express").Router();
const {getThoughts, getThought, createThought, updateThought, deleteThought, addReaction, removeReaction} = require("../../controllers/thought-controller");

router.route("/")
    .get(getThoughts)
    .post(createThought);

router.route("/:id")
  .get(getThought)
  .put(updateThought)
  .delete(deleteThought);

router.post("/:thoughtId/reactions", addReaction);

router.delete("/:thoughtId/reactions/:reactionId", removeReaction);

module.exports = router;