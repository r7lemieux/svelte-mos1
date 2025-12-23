<script lang="ts">
	import {toDisplayString} from '$lib/services/common/util/string.utils.js'
	import SimpleMo from '../simpleMo/SimpleMo.svelte'
	import MoDefMo from '../../app/mo/moDefMo/MoDefMo.svelte'
	import MoMetaMo from '../../app/mo/moMetaMo/MoMetaMo.svelte'
	import type {MoInterface} from '$lib/models/managedObjects/MoInterface.js'
	import {MoDefinitionMo} from '$lib/models/managedObjects/MoDefinitionMo.js'
	import Init from '../../common/Init.svelte'
	import {initMoTransport} from "$lib/services/mo/moTransport.implementation.js";

	initMoTransport()
  let {mo}: {mo:MoInterface} = $props()
	let moDef = mo.moMeta.moDef;
	const title = toDisplayString(moDef.name);
  const moDefMo = new MoDefinitionMo(moDef)
</script>
<Init/>
<svelte:head>
	<title>{title}</title>
</svelte:head>
{#if moDef.name === 'moDef' }
	<MoDefMo {moDefMo} />
{:else if moDef.name === 'moMeta' }
	<MoMetaMo {mo} />
{:else}
	<SimpleMo {mo} />
{/if}
<style>

</style>
