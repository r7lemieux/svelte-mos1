<script lang="ts">
	import { page } from '$app/state';
  import {RezultStatus, type RezultStatusEnum} from '../../services/common/message/RezultStatus.js'
  import {Rezult} from '../../services/common/message/rezult.js'

  let {error}: {error?:any} = $props()
  console.log(`==>Status.svelte:7 error`, error)
  let status: string  =  $state(RezultStatus.ok)
  let message = $state('error. no data')
  let code = $state(page.status)
  const err = $state(error || page.error)
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
  
  if (err instanceof Rezult) {
    status = err.status
    message = err.message
  } else if (err?.message) {
    status = RezultStatus.error
    message = err.message
  // } else {
  //   status = RezultStatus.error
  //   message = 'error: ' + typeof page.error
  }
  const statusText = $derived(httpCodeToStatusText(page.status))

</script>

<svelte:head>
	<title>Status</title>
	<meta name="description" content="metas" />
</svelte:head>

<div class="message {status}">
  <span class="status">{statusText}</span> {code} {message}
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
      color: var(--ok-color);
    }
  }
  &.warning {
    visibility: visible;
    background-color: var(--warning-background-color);
    border: var(--warning-color);
    .status {
      color: var(--warning-color);
    }
  }
  &.error {
    visibility: visible;
    background-color: var(--error-background-color);
    border: var(--error-color);
    .status {
      color: var(--error-color);
    }
  }
}
</style>