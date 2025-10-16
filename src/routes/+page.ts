// import {ErrorName} from '../lib/services/common/message/errorName.js'
// import {getMoMeta} from '../lib/services/mo/moManagement.js'
// import {Rezult} from '../lib/services/common/message/rezult.js'
// import {error} from '@sveltejs/kit'
// import {registerMos} from '../example/services/moManagement.js'
//
// export const csr = true;
// export const prerender = true;
// export const ssr = true;
//
// export async function load({ params }: any) {
//   registerMos()
//   const moname = params.moname
//   const moMeta = getMoMeta(moname)
//   const id = params.moid
//   const mo = moMeta?.dataSource.getMo(id)
//
//   if (!mo) {
//     const rezult = new Rezult(ErrorName.db_notFound, {moname: params.moname, id: params.moid})
//     const message = rezult.toDetailString()
//     const err = error(404, message)
//     throw err
//   }
//   return {mo, moname}
// }
