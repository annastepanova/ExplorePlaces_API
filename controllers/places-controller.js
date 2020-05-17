const { v4: uuid } = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')

let DUMMY_PLACES = [
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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  }
  catch (err) {
    const error = new HttpError('Could not find a place', 500)
    return next(error)
  }
  

  if (!place) {
    const error = new HttpError("Can't find place for the provided id", 404)
    return next(error)
  }

  res.json({ place: place.toObject({getters: true}) })

}

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid
  const places = DUMMY_PLACES.filter(p => {
    return p.creator === userId
  })

  if (!places || places.length === 0) {
    return next(
      new HttpError("Can't find places for the provided user id", 404)
    )
  }

  res.json({ places })
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data', 422))
  }

  const { title, description, address, creator } = req.body

  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  }
  catch(error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://cdn.traveltripper.io/site-assets/192_866_18602/media/2018-08-29-113233/small_boston-common-guide.jpg',
    creator
  })

  try {
    await createdPlace.save()
  }
  catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500)
    return next(error)
  }

  res.status(201).json({place: createdPlace})

}

const updatePlace = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data', 422)
  }

  const { title, description } = req.body
  const placeId = req.params.pid

  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({place: updatedPlace})

}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError('Could not find place for that id', 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
  res.status(200).json({message: 'Deleted place'})

}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace
