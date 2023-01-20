const { User, Thought } = require("../models");

const thoughtController = {
    //GET all
  getAllThought(req, res) {
    Thought.find({})
      .populate({
        path: "reactions", 
        select: "-__v", 
      })
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

 //GET one by Id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No Thought found with this id!" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

 //POST-  create a thought
 createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
        res.json({ message: "Thought successfully created!" });
      })
      .catch((err) => res.json(err));
  },

  // PUT- update a thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
    })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No Thought found with this id!" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },

  //DELETE- delete a thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No Thought found with this id!" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.status(400).json(err));
  },
  //CREATE reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
      )
      .then((thoughtData) => res.json(thoughtData))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // DELETE a reaction
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: ObjectId(req.body.reactionId) } } },
      { new: true }
    )
    .then((thoughtData) => {
      res.json(thoughtData);
    })
    .catch((err) => res.json(err));
  }, 
};

module.exports = thoughtController;