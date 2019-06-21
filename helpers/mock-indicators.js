const items = require('./items-array')();

const indicatorData = Object.freeze({
  "version": "1",
  "definition": "Total de denuncias por el delito de tortura y/o tratos crueles, inhumanos o degradantes. El dato de denuncias de extorsión se obtiene a partir de junio 2017 con la publicación de la Ley General sobre la Tortura y Otros Maltratos. El delito es clasificado como fuero federal, la Ciudad de México como fuero común según Artículo 1° de Ley General.",
  "calculationMethod": {
    "formula": "TDDT = Tt1 + Tt2 + Tt3...",
    "numerator": "Tt = Número de denuncias registradas en el periodo (t) para el área geográfica especificada.",
    "denominator": "TDDT = Total de denuncias por el delito de tortura"
  },
  "measurementFrequency": {
    "annual": true,
    "quarterly": true,
    "monthly": true
  },
  "geographicBreakdown": {
    "federal": true,
    "state": true,
    "municipal": true
  },
  "source": ["www.senado.gob.mx","https://www.hchr.org.mx/"],
  "specialTreatment": "El dato de denuncias de extorsión se obtiene a partir de junio 2017 con la publicación de la Ley General sobre la Tortura y Otros Maltratos. El delito es clasificado como fuero federal, la Ciudad de México como fuero común según Artículo 1° de Ley General.",
  "indicatorWeaknesses": "El número real de delitos de tortura es mayor a aquellos denunciados"
});

module.exports = {
  [items[0].name]: {
    indicators: [
      {
        ...indicatorData,
        name: 'Número de denuncias por tortura o TPCID',
        shortName: 'No. Denuncias',
      },
      {
        ...indicatorData,
        name: 'Número de expedientes iniciados por tortura',
        shortName: 'No. Expedientes por tortura',
      },
      {
        ...indicatorData,
        name: 'Número de expedientes actualmente en trámite en FEIDT',
        shortName: 'No. Expedientes en trámite',
      },
      {
        ...indicatorData,
        name: 'Número de expedientes consignados por FEIDT',
        shortName: 'No. Expedientes consignados',
      },
      {
        ...indicatorData,
        name: 'Número de expedientes en no ejercicio de acción penal, FEIDT',
        shortName: 'No. Expedientes en no ejercicio de acción penal',
      },
    ]
  },
  [items[1].name]: {
    indicators: [
      {
        ...indicatorData,
        name: 'Número de sentencias por tortura',
        shortName: 'No. Sentencias por tortura',
      },
      {
        ...indicatorData,
        name: 'Procesos penales iniciados por delito de tortura (Sistema Tradicional)',
        shortName: 'Procesos penales (Sistemas Tradicional)',
      },
      {
        ...indicatorData,
        name: 'Procesos penales iniciados por delito de tortura (Juzgados de Control)',
        shortName: 'Procesos penales (Juzgados de Control)',
      },
      {
        ...indicatorData,
        name: 'Procesos penales iniciados por delito de tortura (Sistema Penal Acusatorio)',
        shortName: 'Procesos penales (Sistema Penal Acusatorio)',
      },
      {
        ...indicatorData,
        name: 'Sentencias por delito de tortura (total de juzgados)',
        shortName: 'Sentencias por tortura',
      },
    ]
  }  
}