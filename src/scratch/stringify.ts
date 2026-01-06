class O {
    f1: string
    f2: string = 'a'
    f3?: string
    constructor(f1) { this.f1 = f1 }
    m1(){ return this.f1 }
    m2 = () => this.f2
}
const o1 = new O('n1')
const str = JSON.stringify(o1)
console.log(str)