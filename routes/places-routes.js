const express = require('express')

const router = express.Router()

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

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId
  })
  res.json({place})

})

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid
  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId
  })
  res.json({place})
})

module.exports = router
