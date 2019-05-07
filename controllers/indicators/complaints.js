var ComplaintRecord = require('../../models/complaintRecord'),
    Place           = require('../../models/place'),
    mongoose        = require('mongoose');

exports.getAllComplaints = (req, res, next) => {
  ComplaintRecord.find({ }).populate('states.state').exec((err, complaints) => {
    if (err) {
      return next(err);
    }

    if (!complaints) {
      return res.status(200).send({ message: "There are no records", success: false });
    }

    res.status(200).send(complaints);
  });
}