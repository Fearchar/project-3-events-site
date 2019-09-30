const Happening = require('../models/Happening')

function indexRoute(req, res, next) {
  Happening.find(req.query)
    .populate({ path: 'attendees', model: 'User', select: 'name photo'})
    .then(happening => res.json(happening))
    .catch(next)
}

function createRoute(req, res, next) {
  req.body.user = req.currentUser._id
  req.body.attendees = [ req.currentUser._id ]
  const happening = new Happening(req.body)

  happening.save()
    .then(happening => Happening.populate(happening, { path: 'user', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'comments.user', modal: 'User', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'attendees', model: 'User', select: 'name photo'}))
    .then(happening => res.status(201).json(happening))
    .catch(next)
}

function showRoute(req, res, next) {
  Happening.findById(req.params.id)
    .then(happening => Happening.populate(happening, { path: 'user', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'comments.user', modal: 'User', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'attendees', model: 'User', select: 'name photo'}))
    .then(happening => {
      return res.json(happening)
    })
    .catch(next)
}

function updateRoute(req, res, next) {
  Happening.findById(req.params.id)
    .then(happening => {
      if (!happening) return res.sendStatus(404)
      return happening.set(req.body)
    })
    .then(happening => happening.save())
    .then(happening => Happening.populate(happening, { path: 'user', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'comments.user', modal: 'User', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'attendees', model: 'User', select: 'name photo'}))
    .then(happening => res.json(happening))
    .catch(next)
}

function deleteRoute(req, res, next) {
  Happening.findById(req.params.id)
    .then(happening => {
      if (!happening) return res.sendStatus(404)
      return happening.remove()
        .then(() => res.sendStatus(204))
        .catch(next)
    })
}

function commentCreateRoute(req, res, next) {
  req.body.user = req.currentUser._id

  Happening.findById(req.params.id)
    .then(happening => {
      if(!happening) return res.sendStatus(404)
      happening.comments.unshift(req.body)
      return happening.save()
    })
    .then(happening => Happening.populate(happening, { path: 'user', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'comments.user', modal: 'User', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'attendees', model: 'User', select: 'name photo'}))
    .then(happening => res.json(happening))
    .catch(next)
}

function commentDeleteRoute(req, res, next) {
  Happening.findById(req.params.id)
    .then(happening => {
      if(!happening) return res.sendStatus(404)
      const comment = happening.comments.id(req.params.commentId)
      if(!comment) return res.sendStatus(404)
      comment.remove()
      return happening.save()
    })
    .then(happening => Happening.populate(happening, { path: 'user', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'comments.user', modal: 'User', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'attendees', model: 'User', select: 'name photo'}))
    .then(happening => res.json(happening))
    .catch(next)
}

function attendRoute(req, res, next) {
  req.currentUser.happenings.addToSet(req.params.id)
  req.currentUser.save()
  Happening.findById(req.params.id)
    .then(happening => {
      happening.attendees.addToSet(req.currentUser)
      return happening.save()
    })
    .then(happening => Happening.populate(happening, { path: 'user', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'comments.user', modal: 'User', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'attendees', model: 'User', select: 'name photo'}))
    .then(happening => res.json(happening))
    .catch(next)
}

function unattendRoute (req, res, next) {
  req.currentUser.happenings.pull(req.params.id)
  req.currentUser.save()
  Happening.findById(req.params.id)
    .then(happening => {
      happening.attendees.pull(req.currentUser)
      return happening.save()
    })
    .then(happening => Happening.populate(happening, { path: 'user', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'comments.user', modal: 'User', select: 'name' }))
    .then(happening => Happening.populate(happening, { path: 'attendees', model: 'User', select: 'name photo'}))
    .then(happening => res.json(happening))
    .catch(next)
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  update: updateRoute,
  delete: deleteRoute,
  commentCreate: commentCreateRoute,
  commentDelete: commentDeleteRoute,
  attend: attendRoute,
  unattend: unattendRoute
}
