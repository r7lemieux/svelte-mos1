<script lang="ts">
  import type { Mo as MoClass } from '../../../models/managedObjects/Mo.js'
  import { toDisplayString } from '../../../services/common/util/string.utils.js'
  import type { MoViewMode } from '../../../constants/ui.js'
  import { page } from '$app/state';
  import { extractViewMode } from '../../../services/common/util/dom.utils.js'
  import SimpleMo from '../simpleMo/SimpleMo.svelte'
  import MoDef from '../../app/mo/moDef/MoDef.svelte'
  import MoMetaMo from '../../app/mo/moMetaMo/MoMetaMo.svelte'
  import type {MoDefinitionMo} from '../../../models/managedObjects/MoDefinitionMo.js'
  
  let {mo}: {mo:MoDefinitionMo} = $props()
	let viewMode: MoViewMode = extractViewMode(page);
	let moDef = mo.moMeta.moDef;
	const title = toDisplayString(moDef.name);

</script>
<svelte:head>
	<title>{title}</title>
</svelte:head>
{#if moDef.name === 'moDef' }
	<MoDef {mo} />
{:else if moDef.name === 'moMeta' }
	<MoMetaMo {mo} />
{:else}
	<SimpleMo {mo} />
{/if}
<style>

</style>