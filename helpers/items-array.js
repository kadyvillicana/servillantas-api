module.exports = () => {
  const items = [];
  for (let i = 1; i <= 11; i++) {
    items.push({
      name: `Rubro ${i}`,
      shortName: `Rubro ${i}`,
      hasIndicators: i !== 6 && i !== 9
    });
  }

  return items;
}