require('dotenv').config();
const axios             = require('axios');
const Cars              = require('../models/car');
const { asyncForEach }  = require('../helpers/async');
const mongoose = require('mongoose');

/**
 * Function to get all the items available.
 * 
 * @returns {Array} Model Item
 */
exports.getCars = (req, res, next) => {
  Cars.find({ status: 'active' }, (err, items) => {
    if (err) {
      return next(err);
    }

    if (!items.length) {
      return res.status(200).send({ message: "There are no cars", success: false });
    }

    return res.status(200).send({ data: items, success: true });
  });
}

exports.getCar = (req, res, next) => {
  const { id } = req.params; 
  Cars.findOne({_id: new mongoose.Types.ObjectId(id) }, (err, car) => {
    if(err || !car) {
      return res.status(404).send({ message: 'not found'});
    }

    return res.status(200).send({data: car, success: true});
  })
}

exports.getFromMercadoLibre = async () => {
  const {results} = await getItems();
  if(!results || results.length === 0) {
    return;
  }

  await asyncForEach(results, async(r) => {
    const item = await getItem(r);
    if(item) {
      const description = await getDescription(item.id);
      item.description = description.plain_text;
      await insertMercadoLibreCar(item);
    }
  });
}

const getItems = async() => {
  const {status, data} = await axios.get(`${process.env.MLURL}/users/${process.env.CUSTOMERID}/items/search?access_token=${process.env.ACCESSTOKEN}`);
  if(!status || status !== 200  || !data) {
    return;
  }
  return data;
}

const getItem = async(itemId) => {
  const {status, data} = await axios.get(`${process.env.MLURL}/items/${itemId}`);
  if(!status || status !== 200  || !data) {
    return;
  }
  return data;
}

const getDescription = async(itemId) => {
  let data = {};
  try {
    const response = await axios.get(`${process.env.MLURL}/items/${itemId}/description`);
    if(!response.status || response.status !== 200  || !response.data) {
      return data;
    }
    data = response.data;
  } catch(e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
  return data;
}

const insertMercadoLibreCar = async(item) => {
  return new Promise((resolve, reject) => {
    Cars.updateOne( { mercadolibreId : item.id }, { ...item }, { upsert : true }, (err, data) => {
      err ? reject(err) : resolve(data)
    });
  })
}