const router = require("express").Router();
const db = require("../../models");
const User = db.User;

router.put("/user/:id", function(req, res, next) {
    return User
      .find({
        where: {
            id: req.params.id
        }
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found'
          });
        }
        return user
          .update({
            username: req.body.user.username,
            email: req.body.user.email,
            bio: req.body.user.bio || user.bio,
            image: req.body.user.image || user.image
          })
        .then((updatedUser) => res.status(200).json({ user: updatedUser.toAuthJSON() })) 
        .catch(next);
      })
      .catch(next);
});

router.post("/users", function(req, res, next) {
    return User
      .create({
        username: req.body.user.username,
        email: req.body.user.email,
        password: req.body.user.password
      })
      .then(user => res.status(201).json({ user: user.toAuthJSON() }))
      .catch(next);
});

module.exports = router;
