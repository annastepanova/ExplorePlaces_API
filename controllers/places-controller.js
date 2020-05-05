const { v4: uuid } = require('uuid')
const HttpError = require('../models/http-error')

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Boston Common',
    description: 'Central public park in downtown Boston, Massachusetts',
    address: '139 Tremont St, Boston, MA 02111',
    location: {
      lat: 42.355437,
      lng: -71.0662329
    },
    creator: 'u1'
  }
] 

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId
  })

  if (!place) {
    throw new HttpError("Can't find place for the provided id", 404)
  }

  res.json({ place })

}

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid
  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId
  })

  if (!place) {
    return next(
      new HttpError("Can't find place for the provided user id", 404)
    )
  }

  res.json({ place })
}

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }

  DUMMY_PLACES.push(createdPlace)

  res.status(201).json({place: createdPlace})

}

exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace
