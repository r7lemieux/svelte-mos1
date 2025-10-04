<script lang="ts">
  import {MoListModel} from '../../../../models/managedObjects/MoList.model.js'
  import {moDefMoMeta} from '../../../../models/managedObjects/MoDefinitionMo.js'
  import Mos from '../../../generics/mos/Mos.svelte'
  
  export let mos
  let modelReady: (model: MoListModel) => boolean
  const moListModel = new MoListModel(moDefMoMeta)
  const moMeta = moDefMoMeta

</script>
<svelte:head>
  <title>Mo Definitions</title>
  <meta name="description" content="Mo Definitons"/>
</svelte:head>

<Mos {moMeta} {mos} />

