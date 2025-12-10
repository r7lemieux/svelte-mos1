import {initMoTransport} from '../../mo/moTransport.implementation.js'

// import type { HandleClientError } from '@sveltejs/kit';

export async function initSvelveMosLibrary() {
  console.log(`==> svelte-mos : initSvelveMosLibrary : init initializing `)
  if (typeof window !== 'undefined') { // Ensure this only runs in the browser
    initMoTransport()
    console.log(`==> svelte-mos :initSvelveMosLibrary : init initialized `)
  }
}
