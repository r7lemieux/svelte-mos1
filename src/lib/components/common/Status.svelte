<script lang="ts">
	import { page } from '$app/state';
  import {RezultStatus, type RezultStatusEnum} from '../../services/common/message/RezultStatus.js'
	import {OK, Rezult} from '../../services/common/message/rezult.js'

  let {error}: {error?:any} = $props()
  console.log(`==>Status.svelte:13`)
  let status: string = $state((error instanceof Rezult)? error.status : RezultStatus.error)
  let serr  =  $state(error)
	let derr = $derived(serr)
  let smessage = $state(error?.message)
  let message = $derived(smessage)
  let code = $state(page.status)
  // const err = $derived(serr)
  const httpCodeToStatusText = (code: number) => {
    if (status === RezultStatus.error) {
      if (code >= 400 && code < 500) {
        return 'client error'
      } else if (code >= 500 && code < 600) {
        return 'server error'
      }
    }
    return ''
  }

  let statusText = $derived(httpCodeToStatusText(page.status))
  let statusLine = $state('')
  $effect(() => {
	  // statusLine = derr?.status + ' : ' + derr?.name + ' : ' + derr?.message
	  // statusText = error?.status + ' : ' + error?.name + ' : ' + error?.message
	  statusLine = error?.status + ' : ' + error?.name + ' : ' + error?.message
	  // statusText = httpCodeToStatusText(page.status)
	  console.log(`==>Status.svelte:$effect `, statusLine)
  })
</script>

<svelte:head>
	<title>Status</title>
	<meta name="description" content="metas" />
</svelte:head>

<div class="message {status}">
	<span class="status {error?.status}">{statusText} - </span> {code} {message}
	<div class="status">{statusLine}</div>
	<div class="status">{error?.code} {error?.name} {error?.message} - {error?.toString()}</div>
</div>

<style>
.message {
  margin: 0 2rem;
  padding: 0.5rem;
  border-radius: 0.2rem;
  @media (max-width: 800px) {
    margin: 0 0.4rem;
  }
    &.ok {
    /*visibility: hidden;*/
    background-color: var(--ok-background-color);
    border: var(--ok-color);
    .status {
      /*color: var(--ok-color);*/
    }
  }
  &.warning {
    visibility: visible;
    background-color: var(--warning-background-color);
    border: var(--warning-color);
    .status {
      /*color: var(--warning-color);*/
    }
  }
  &.error {
    visibility: visible;
    background-color: var(--error-background-color);
    border: var(--error-color);
    .status {
      /*color: var(--error-color);*/
    }
  }
}
</style>