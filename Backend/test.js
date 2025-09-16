


let map1 = new Map();

map1.set('uchenna', 21);
map1.set('mum', 45);
map1.set('ikechukwu', 22);
map1.set('chiemeka', 19);

const from = Array.from(map1);
// Log to console

console.log("he")

from.entries().Map(([id,value])=>({id,...value}))