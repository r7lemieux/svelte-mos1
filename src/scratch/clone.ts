console.log('typeof array is: ', typeof [1, 2])

const fieldnames = [1, 2, 3, 4].map(n => 'field' + n)

class Class1 {
    field1 = 'a'
    field2 = 'b'
    field3 = [1, 2, 3, 4, 5]
    field4 = {a: 1, b: 2}

    constructor() {}

    clone = () => {
        const newObj = new Class1()
        for (const fieldname of fieldnames) {
            const fv = this[fieldname]
            console.log(typeof this.clone)
            if (typeof fv !== 'function') {
                newObj[fieldname] = structuredClone(fv)
            }
        }
        return newObj
    }
}

const obj1 = new Class1()
const obj2 = obj1.clone()
console.log(obj1)
console.log(obj2)