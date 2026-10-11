const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');
const tripsList = async (req, res) => {
  try {
    const trips = await Model.find({}).exec();
    return res.status(200).json(trips);
  } catch (error) {
    return res.status(500).json(error);
  }
};
// PUT: /trips/:tripCode - Adds a new Trip 
// Regardless of outcome, response must include HTML status 
//code 
// and JSON message to the requesting client 
const tripsUpdateTrip = async (req, res) => {
  try {
    const trip = await Model.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true, runValidators: true }
    ).exec();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error('Trip update failed:', error);
    return res.status(500).json({ message: 'Trip update failed' });
  }
};
                
        // Uncomment the following line to show results of operation 
        // on the console 
        // console.log(q); 



const tripsAddTrip = async (req, res) => {
  const newTrip = new Trip({
    code: req.body.code,
    name: req.body.name,
    length: req.body.length,
    start: req.body.start,
    resort: req.body.resort,
    perPerson: req.body.perPerson,
    image: req.body.image,
    description: req.body.description
  });

  try {
    const trip = await newTrip.save();
    return res.status(201).json(trip);
  } catch (error) {
    return res.status(400).json(error);
  }
};

// GET: /trips/:tripCode - lists a single trip
const tripsFindByCode = async(req, res) => {
    const q = await Model
        .find({'code': req.params.tripCode}) // Return single record
        .exec();

    if (!q) {
        return res
            .status(404)
            .json({});
    } else {
        return res
            .status(200)
            .json(q);
    }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};