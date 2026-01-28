class C1 {

    f1
    f2 = 2

    constructor(f1) {
        this.f1 = f1
    }

    m1 = () => this.f1

    static from = (c) => {
        const c1 = new c.constructor(4)
        return c1
    }
}

class C2 extends C1 {
    constructor(f1) {super(f1)}
}

const c2 = new C2(5)

const clone1 = C1.from(c2)

console.log(`==>newthis.ts:25  clone1`, clone1.constructor.name)