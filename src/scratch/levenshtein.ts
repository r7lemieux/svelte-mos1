import {getClosestName} from '../lib/services/common/util/fieldMatcher.js'


const names = ['a','ab', 'abc', 'hope', 'fully', 'hopeless', 'thefunniestnotwronghopefully']
const name = 'obc'

const match = getClosestName(name, names)

console.log(`==>levenshtein.ts:9 match`, match)