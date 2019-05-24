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
    "municipal": true,
    "national": true
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
        indicatorName: 'Número de denuncias por tortura o TPCID',
        shortName: '# Denuncias',
      },
      {
        ...indicatorData,
        indicatorName: 'Número de expedientes iniciados por tortura',
        shortName: '# Expedientes por tortura',
      },
      {
        ...indicatorData,
        indicatorName: 'Número de expedientes actualmente en trámite en FEIDT',
        shortName: '# Expedientes en trámite',
      },
      {
        ...indicatorData,
        indicatorName: 'Número de expedientes consignados por FEIDT',
        shortName: '# Expedientes consignados',
      },
      {
        ...indicatorData,
        indicatorName: 'Número de expedientes en no ejercicio de acción penal, FEIDT',
        shortName: '# Expedientes en no ejercicio de acción penal',
      },
    ]
  },
  [items[1].name]: {
    indicators: [
      {
        ...indicatorData,
        indicatorName: 'Número de sentencias por tortura',
        shortName: '# Sentencias por tortura',
      },
      {
        ...indicatorData,
        indicatorName: 'Procesos penales iniciados por delito de tortura (Sistema Tradicional)',
        shortName: 'Procesos penales (Sistemas Tradicional)',
      },
      {
        ...indicatorData,
        indicatorName: 'Procesos penales iniciados por delito de tortura (Juzgados de Control)',
        shortName: 'Procesos penales (Juzgados de Control)',
      },
      {
        ...indicatorData,
        indicatorName: 'Procesos penales iniciados por delito de tortura (Sistema Penal Acusatorio)',
        shortName: 'Procesos penales (Sistema Penal Acusatorio)',
      },
      {
        ...indicatorData,
        indicatorName: 'Sentencias por delito de tortura (total de juzgados)',
        shortName: 'Sentencias por tortura',
      },
    ]
  }  
}