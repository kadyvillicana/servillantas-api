const places = require('../constants/places');

/**
 * The purpose of this object is to search for a given key in the names array
 * so the object key can be retrieved to later get the reference on Place schema
 * (if isPlace = true).
 */
module.exports = {
  "year": {
    key: "year",
    names: ["ano", "año", "anio", "year"],
    isPlace: false
  },
  "month": {
    names: ["mes", "month"],
    isPlace: false
  },
  [places.MEXICO_COUNTRY]: {
    names: ["nacional"],
    isPlace: true
  },
  [places.AGUASCALIENTES]: {
    names: ["aguascalientes"],
    isPlace: true
  },
  [places.BAJA_CALIFORNIA]: {
    names: ["baja california"],
    isPlace: true
  },
  [places.BAJA_CALIFORNIA_S]: {
    names: ["baja california sur"],
    isPlace: true
  },
  [places.CAMPECHE]: {
    names: ["campeche"],
    isPlace: true
  },
  [places.CHIAPAS]: {
    names: ["chiapas"],
    isPlace: true
  },
  [places.CHIHUAHUA]: {
    names: ["chihuahua"],
    isPlace: true
  },
  [places.CIUDAD_DE_MEXICO]: {
    names: ["ciudad de mexico, cdmx, distrito federal", "ciudad de méxico"],
    isPlace: true
  },
  [places.COAHUILA]: {
    names: ["coahuila", "coahuila de zaragoza"],
    isPlace: true
  },
  [places.COLIMA]: {
    names: ["colima"],
    isPlace: true
  },
  [places.DURANGO]: {
    names: ["durango"],
    isPlace: true
  },
  [places.ESTADO_DE_MEXICO]: {
    names: ["estado de mexico", "méxico", "mexico"],
    isPlace: true
  },
  [places.GUANAJUATO]: {
    names: ["guanajuato"],
    isPlace: true
  },
  [places.GUERRERO]: {
    names: ["guerrero"],
    isPlace: true
  },
  [places.HIDALGO]: {
    names: ["hidalgo"],
    isPlace: true
  },
  [places.JALISCO]: {
    names: ["jalisco"],
    isPlace: true
  },
  [places.MICHOACAN]: {
    names: ["michoacan", "michoacan de ocampo", "michoacán de ocampo"],
    isPlace: true
  },
  [places.MORELOS]: {
    names: ["morelos"],
    isPlace: true
  },
  [places.NAYARIT]: {
    names: ["nayarit"],
    isPlace: true
  },
  [places.NUEVO_LEON]: {
    names: ["nuevo leon", "nuevo león"],
    isPlace: true
  },
  [places.OAXACA]: {
    names: ["oaxaca"],
    isPlace: true
  },
  [places.PUEBLA]: {
    names: ["puebla"],
    isPlace: true
  },
  [places.QUERETARO]: {
    names: ["queretaro", "querétaro"],
    isPlace: true
  },
  [places.QUINTANA_ROO]: {
    names: ["quintana roo", "quintana-roo"],
    isPlace: true
  },
  [places.SAN_LUIS_POTOSI]: {
    names: ["san luis potosi", "san luis", "san luis potosí"],
    isPlace: true
  },
  [places.SINALOA]: {
    names: ["sinaloa"],
    isPlace: true
  },
  [places.SONORA]: {
    names: ["sonora"],
    isPlace: true
  },
  [places.TABASCO]: {
    names: ["tabasco"],
    isPlace: true
  },
  [places.TAMAULIPAS]: {
    names: ["tamaulipas"],
    isPlace: true
  },
  [places.TLAXCALA]: {
    names: ["tlaxcala"],
    isPlace: true
  },
  [places.VERACRUZ]: {
    names: ["veracruz", "veracruz de ignacio de la llave"],
    isPlace: true
  },
  [places.YUCATAN]: {
    names: ["yucatan", "yucatán"],
    isPlace: true
  },
  [places.ZACATECAS]: {
    names: ["zacatecas"],
    isPlace: true
  },
};