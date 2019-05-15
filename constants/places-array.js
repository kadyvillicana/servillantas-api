const Place        = require('../models/place'),
      placesCons   = require('../constants/places');

module.exports = [
  new Place({
    type: "country",
    name: "Mexico",
    code: placesCons.MEXICO_COUNTRY
  }),
  new Place({
    type: "state",
    name: "Aguascalientes",
    code: placesCons.AGUASCALIENTES
  }),
  new Place({
    type: "state",
    name: "Baja California",
    code: placesCons.BAJA_CALIFORNIA
  }),
  new Place({
    type: "state",
    name: "Baja California Sur",
    code: placesCons.BAJA_CALIFORNIA_S
  }),
  new Place({
    type: "state",
    name: "Campeche",
    code: placesCons.CAMPECHE
  }),
  new Place({
    type: "state",
    name: "Coahuila de Zaragoza",
    code: placesCons.COAHUILA
  }),
  new Place({
    type: "state",
    name: "Colima",
    code: placesCons.COLIMA
  }),
  new Place({
    type: "state",
    name: "Chiapas",
    code: placesCons.CHIAPAS
  }),
  new Place({
    type: "state",
    name: "Chihuahua",
    code: placesCons.CHIHUAHUA
  }),
  new Place({
    type: "state",
    name: "Ciudad de México",
    code: placesCons.CIUDAD_DE_MEXICO
  }),
  new Place({
    type: "state",
    name: "Durango",
    code: placesCons.DURANGO
  }),
  new Place({
    type: "state",
    name: "Guanajuato",
    code: placesCons.GUANAJUATO
  }),
  new Place({
    type: "state",
    name: "Guerrero",
    code: placesCons.GUERRERO
  }),
  new Place({
    type: "state",
    name: "Hidalgo",
    code: placesCons.HIDALGO
  }),
  new Place({
    type: "state",
    name: "Jalisco",
    code: placesCons.JALISCO
  }),
  new Place({
    type: "state",
    name: "Estado de México",
    code: placesCons.ESTADO_DE_MEXICO
  }),
  new Place({
    type: "state",
    name: "Michoacán de Ocampo",
    code: placesCons.MICHOACAN
  }),
  new Place({
    type: "state",
    name: "Morelos",
    code: placesCons.MORELOS
  }),
  new Place({
    type: "state",
    name: "Nayarit",
    code: placesCons.NAYARIT
  }),
  new Place({
    type: "state",
    name: "Nuevo León",
    code: placesCons.NUEVO_LEON
  }),
  new Place({
    type: "state",
    name: "Oaxaca",
    code: placesCons.OAXACA
  }),
  new Place({
    type: "state",
    name: "Puebla",
    code: placesCons.PUEBLA
  }),
  new Place({
    type: "state",
    name: "Querétaro",
    code: placesCons.QUERETARO
  }),
  new Place({
    type: "state",
    name: "Quintana Roo",
    code: placesCons.QUINTANA_ROO
  }),
  new Place({
    type: "state",
    name: "San Luis Potosí",
    code: placesCons.SAN_LUIS_POTOSI
  }),
  new Place({
    type: "state",
    name: "Sinaloa",
    code: placesCons.SINALOA
  }),
  new Place({
    type: "state",
    name: "Sonora",
    code: placesCons.SONORA
  }),
  new Place({
    type: "state",
    name: "Tabasco",
    code: placesCons.TABASCO
  }),
  new Place({
    type: "state",
    name: "Tamaulipas",
    code: placesCons.TAMAULIPAS
  }),
  new Place({
    type: "state",
    name: "Tlaxcala",
    code: placesCons.TLAXCALA
  }),
  new Place({
    type: "state",
    name: "Veracruz",
    code: placesCons.VERACRUZ
  }),
  new Place({
    type: "state",
    name: "Yucatán",
    code: placesCons.YUCATAN
  }),
  new Place({
    type: "state",
    name: "Zacatecas",
    code: placesCons.ZACATECAS
  })
];