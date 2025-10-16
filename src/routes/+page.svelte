<script lang="ts">
  // import MO from '../lib/components/generics/mo/MO.svelte'
  // import {type MoInterface} from '../lib/models/managedObjects/MoInterface.js'
  
  import type {PageProps} from './$types.js'
  // import {Contact} from '../example/models/Contact.js'
  // import {contactData} from '../example/models/contact.data.js'
  
  let {data}: PageProps = $props()
  // const moProm: MoInterface = data?.mo as unknown as MoInterface
  // const contact = new Contact()
  // contact.hydrate(contactData[0])
</script>

<svelte:head>
  <title>MoDefs</title>
  <meta name="contact" content="contact"/>
</svelte:head>

<div>
  <!--{#await moProm then mo}-->
<!--    <MO {mo}/>-->
<!--  {/await}-->
</div>
<style>
</style>