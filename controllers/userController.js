const { User, Thought } = require('../models');

const userController = {
    //GET users
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: "thoughts",
                select: "-__v",
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then((userData) => res.json(userData))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            }
        );
    },

    //GET a user by id
    getSingleUser(req, res) {
        User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v", 
        })
        .select("-__v") 
        .then((userData) => {
          if (!userData) {
            res.status(404).json({ message: "No User found with this id!" });
            return;
          }
          res.json(userData);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json(err);
        });
    },
    //POST- create user
    createUser({ body }, res) {
        User.create(body)
            .then((userData) => res.json(userData))
            .catch((err) => res.json(err)
        );
    },

    // PUT- update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { new: true }
          )
            .then((userData) =>
              !user
                ? res.status(404).json({ message: 'No user with this id!' })
                : res.json(userData)
            )
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            }
        );
    },

    //DELETE a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((userData) => {
                if (!userData) {
                    res.status(404).json({ message: "No User found with this id!" });
                    return;
                }
                res.json(userData);
            })
            .catch((err) => res.status(400).json(err)
        );
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true }
        )
        .then((userData) => {
            if (!userData) {
                res.status(404).json({ message: "No user with this id" });
                return;
            }
            res.json(userData);
        })
        .catch((err) => res.json(err)
        );
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          { new: true }
        )
    
        .then (() =>
        User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $pull: { friends: req.params.userId } },
          { new: true }
        )
        )
          .then((userData) =>
            !userData
              ? res
                  .status(404)
                  .json({ message: 'No user found with that ID :(' })
              : res.json(userData)
          )
          .catch((err) => res.status(500).json(err));
      },
};

module.exports = userController;