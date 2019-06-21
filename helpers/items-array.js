const createItemObject = (index) => {
  const item = {
    name: `Rubro ${index}`,
    shortName: `Rubro ${index}`,
    description: `Descripción del rubro ${index}`,
    hasIndicators: index !== 6 && index !== 9,
    position: index * 10,
  }

  // If the item is one of those that have no indicators, set the required data
  if (!item.hasIndicators) {
    item.title = index === 6
      ? 'Exclusión de pruebas obtenidas por tortura o TPCID'
      : 'Programa Nacional para Prevenir y Sancionar la Tortura';
    item.content = `<p class="ql-align-justify"><strong class="ql-size-small">Lorem </strong>ipsum dolor sit amet, consectetur adipiscing elit. In bibendum pretium consequat. Curabitur commodo quis purus et euismod. Nunc eleifend ipsum a egestas vestibulum. Phasellus at mauris eget diam rutrum mattis. Sed non ex sodales, sagittis lorem vitae, tincidunt nulla. Maecenas aliquam convallis dui. Phasellus at lacus tempus, finibus mauris quis, faucibus metus. Donec maximus nulla eu mattis maximus. Vivamus interdum blandit venenatis.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify"><em>Suspendisse </em>gravida tellus felis, vel posuere lacus rhoncus ac. Aliquam placerat erat ac dolor tempor, eu pretium urna tincidunt. Vivamus mauris erat, congue id tempus et, ultrices ac augue. Proin rhoncus semper nulla, in luctus dui dapibus quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum diam eros, iaculis eu ipsum eget, aliquet bibendum ligula. Praesent suscipit interdum efficitur. Mauris massa ante, rhoncus a magna nec, pellentesque vehicula nisl.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify"><span class="ql-size-large">Lorem </span>ipsum dolor sit amet, consectetur adipiscing elit. Nunc pulvinar erat sit amet dolor feugiat blandit. Ut porttitor vestibulum risus, at iaculis ante pellentesque id. Vivamus et posuere quam. Vestibulum eget orci purus. Integer enim risus, mollis quis tristique ut, tempor a justo. Donec urna ante, maximus eget velit quis, blandit mollis est. Nullam efficitur porttitor nulla, id convallis ante viverra nec. Pellentesque nunc lacus, faucibus vel leo vitae, vehicula posuere justo. Suspendisse diam tortor, semper eu enim non, iaculis luctus mi.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify"><span class="ql-size-huge">Nulla </span>vel mollis lacus, id tempor justo. Quisque quis turpis nec leo rutrum malesuada vitae ut augue. Mauris ultricies a ex in volutpat. Curabitur viverra ligula sit amet metus pulvinar facilisis. Cras tempus justo volutpat dui rhoncus iaculis. Nunc ornare vel augue ut tristique. Nam vel turpis tellus. Fusce condimentum nibh sit amet massa finibus, sed venenatis est pellentesque. Mauris et purus cursus, semper libero non, egestas dolor. Proin sed eleifend nisl. Nam efficitur sagittis turpis, sed vehicula eros lobortis quis. Donec accumsan ipsum et facilisis semper. Nam non tortor porta, mollis lorem ut, ultricies justo. Etiam ac nunc nisl. Maecenas ultrices lacus est, at venenatis ipsum faucibus id.</p><p class="ql-align-justify"><br></p><ul><li class="ql-align-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li><li class="ql-align-justify">Praesent quis massa nec massa vulputate facilisis.</li></ul><p class="ql-align-justify"><br></p><p class="ql-align-justify">Generated at: <a href="https://es.lipsum.com/feed/html" target="_blank">https://es.lipsum.com/feed/html</a></p><p class="ql-align-justify"><br></p>`
  }

  return item;
}

module.exports = () => {
  const items = [];
  for (let i = 1; i <= 11; i++) {
    items.push(createItemObject(i));
  }

  return items;
}