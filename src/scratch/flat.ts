const o1 = { a: 1, b: 2, c: 3 }
const o2 = { a: 11, b: 12, c: 13 }
const o3 = { a: 21, b: 22, c: 23 }
const o4 = { a: 31, b: 32, c: 33 }

const RelationDefs = { moname1: { fieldname1: o1}, moname2: { fieldname2: o2 , fieldname3: o3}, moname3: { fieldname3: o4, fieldname4: o1 } }

const flat = Object.values(RelationDefs).map(o => Object.values(o)).flat()

console.log(flat)
