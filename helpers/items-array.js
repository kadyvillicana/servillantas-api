module.exports = () => {
  const items = [];
  for (let i = 1; i <= 11; i++) {
    items.push({ name: `Rubro ${i}` });
  }

  return items;
}