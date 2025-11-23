<script lang="ts">
  import type { Mo as MoClass } from '../../../models/managedObjects/Mo.js'
  import { toDisplayString } from '../../../services/common/util/string.utils.js'
  import type { MoViewMode, MoViewModeEnum } from '../../../constants/ui.js'
  import { page } from '$app/state';
  import { extractViewMode } from '../../../services/common/util/dom.utils.js'
  import SimpleMo from '../simpleMo/SimpleMo.svelte'
  import MoDefMo from '../../app/mo/moDefMo/MoDefMo.svelte'
  import MoMetaMo from '../../app/mo/moMetaMo/MoMetaMo.svelte'
  import type {MoInterface} from '../../../models/managedObjects/MoInterface.js'
  import {MoDefinitionMo} from '../../../models/managedObjects/MoDefinitionMo.js'
  
  let {mo}: {mo:MoInterface} = $props()
	let viewMode: MoViewModeEnum = extractViewMode()
	let moDef = mo.moMeta.moDef;
	const title = toDisplayString(moDef.name);
  const moDefMo = new MoDefinitionMo(moDef)
</script>
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
