//Teste p/ provar q operações com numeros é mt mais rápido q com strings
console.time('Numeric operations');
for (let i = 0; i < 1000000; i++) {
  const num = i + 1;
}
console.timeEnd('Numeric operations');

console.time('String operations');
for (let i = 0; i < 1000000; i++) {
  const str = (i + '/1').split('/').map(Number);
}
console.timeEnd('String operations');