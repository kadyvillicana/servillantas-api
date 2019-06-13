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
    item.content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus turpis augue, dictum at ligula in, tristique placerat sem. Phasellus non porta tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus efficitur eu est sed tempor. Nunc venenatis ante ac velit feugiat, vitae gravida sem feugiat. Proin sed velit sed urna malesuada condimentum. Duis ut augue commodo, malesuada nulla vitae, dictum risus. Vivamus vestibulum ullamcorper dui vel rutrum. Ut et nisl velit. Aliquam maximus, nisi sit amet lacinia cursus, sapien ipsum bibendum turpis, sed porttitor magna ante et elit.

    Nam vulputate aliquam nibh consectetur suscipit. Vestibulum erat nibh, eleifend eget iaculis sit amet, tincidunt ac orci. Nulla facilisi. Nunc sit amet orci at sem bibendum viverra. Aliquam porttitor odio et nunc tempor, eu finibus enim pretium. Vivamus sit amet condimentum nibh. Integer sodales nisi sed tempus dictum. Nunc ante augue, porta sed egestas ut, aliquet vel elit. Etiam dignissim ante ut mollis iaculis. Suspendisse eu sem lacus. Vestibulum auctor in neque et fringilla. Vestibulum maximus tellus vel egestas dapibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

    Donec quis vulputate ipsum. Phasellus luctus scelerisque libero et sagittis. Nullam euismod est in sodales vestibulum. Suspendisse sit amet neque nec ligula aliquam imperdiet vitae pretium nunc. Proin elementum condimentum sem sit amet gravida. Quisque fringilla velit vitae nisi euismod, ac fringilla justo efficitur. Nam magna augue, ultrices nec lorem eu, finibus maximus metus. Ut euismod, nulla nec placerat sodales, nisl erat malesuada nibh, sit amet consectetur quam massa et sapien. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed tincidunt lectus eget lacus placerat tempus. Aenean elementum tortor sit amet metus sodales tempor. Nullam nec nisi ac neque iaculis convallis.

    Morbi scelerisque, sem at facilisis volutpat, lacus arcu finibus elit, ut gravida massa velit sed lorem. Ut maximus dui vel varius venenatis. Nunc eu euismod quam. Fusce facilisis odio rhoncus accumsan egestas. Ut sagittis placerat auctor. Curabitur faucibus urna sit amet bibendum scelerisque. Quisque neque velit, dignissim at malesuada ut, ornare a urna. Ut finibus est eget dui placerat, at gravida diam accumsan. Aenean ornare nulla ac mauris placerat scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis eu posuere orci. Aliquam erat volutpat. Aliquam ut ligula eu quam molestie sodales. Curabitur suscipit augue quis odio bibendum, at euismod leo consequat. Maecenas vulputate ipsum nibh, vitae cursus nisi vestibulum ut. Proin placerat elementum sagittis.

    Aenean at ornare tortor. Fusce vitae ipsum arcu. Nam commodo, ligula quis euismod auctor, metus turpis auctor ex, et porttitor tellus leo nec nibh. Duis a ullamcorper ante, nec tincidunt tellus. Vivamus nunc nunc, feugiat a elit nec, accumsan condimentum velit. In convallis nulla nec lectus semper vehicula. Curabitur mollis in tortor vel placerat. Etiam lacinia est justo. Vivamus orci nisi, malesuada sed bibendum eu, tristique id nibh. Pellentesque eu nunc ipsum. Aliquam faucibus mauris vel eros commodo mattis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum maximus sem ut quam varius, at tincidunt ligula molestie. Nam turpis mi, ultricies nec tortor vel, scelerisque porttitor orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin luctus, sem rutrum pretium rutrum, turpis sem placerat nulla, vel iaculis turpis erat eget turpis.`
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