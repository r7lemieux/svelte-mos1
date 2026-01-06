<script lang="ts">
    import {RezultStatus} from '../../services/common/message/RezultStatus.js'
    import {Rezult} from '../../services/common/message/rezult.js'
    import {AiOutlineCloseCircle} from 'svelte-icons-pack/ai'
    import {Icon} from 'svelte-icons-pack'

    let {error}: { error?: any } = $props()
    let status: string = $derived((error instanceof Rezult) ? error.status : RezultStatus.error)
    // let d_err = $derived(error)
    // let d_message = $derived(error?.message)
    // let code = $state(page.status)
    // const httpCodeToStatusText = (code: number) => {
    //     if (status === RezultStatus.error) {
    //         if (code >= 400 && code < 500) {
    //             return 'client error'
    //         } else if (code >= 500 && code < 600) {
    //             return 'server error'
    //         }
    //     }
    //     return ''
    // }
    const onClose = () => {
        status = error.ok
    }
    // let statusText = $derived(httpCodeToStatusText(page.status))
    let statusLine = $state('')
    $effect(() => {
        // statusLine = derr?.status + ' : ' + derr?.name + ' : ' + derr?.message
        // statusText = error?.status + ' : ' + error?.name + ' : ' + error?.message
        statusLine = error.toString()
        // statusText = httpCodeToStatusText(page.status)
        status = error.status
    })
</script>

<svelte:head>
    <title>Status</title>
    <meta name="description" content="metas"/>
</svelte:head>

<div class="statusBox {status}">
    <span class="status {status}">{statusLine}</span>
    <button class="close" onclick={onClose}>
                <Icon src={AiOutlineCloseCircle}></Icon>
<!--    <svg width="1.5em" height="1.5em" viewBox="0 0 1024 1024" style="color: currentColor;" stroke-width="0"-->
<!--         fill="currentColor" fill-rule="evenodd" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">&lt;!&ndash;16g1j94&ndash;&gt;<path-->
<!--            d="M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64Zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372Zm128.013 198.826c.023.007.042.018.083.059l45.02 45.019c.04.04.05.06.058.083a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082L557.254 512l127.861 127.862a.268.268 0 0 1 .05.06l.009.023a.118.118 0 0 1 0 .07c-.007.022-.018.041-.059.082l-45.019 45.02c-.04.04-.06.05-.083.058a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059L512 557.254 384.14 685.115c-.042.041-.06.052-.084.059a.118.118 0 0 1-.07 0c-.022-.007-.041-.018-.082-.059l-45.02-45.019c-.04-.04-.05-.06-.058-.083a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082L466.745 512l-127.86-127.86a.268.268 0 0 1-.05-.061l-.009-.023a.118.118 0 0 1 0-.07c.007-.022.018-.041.059-.082l45.019-45.02c.04-.04.06-.05.083-.058a.118.118 0 0 1 .07 0c.022.007.041.018.082.059L512 466.745l127.862-127.86c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"></path>-->
<!--        </svg>-->
    </button>
</div>

<style>
    .statusBox {
        display: flex;
        justify-content: space-between;
        margin: -0.4rem 2rem 0 2rem;
        padding: 0.5rem;
        border-radius: 0.2rem;
        @media (max-width: 800px) {
            margin: 0 0.4rem;
        }
       
        &.ok {
            visibility: hidden;
            background-color: var(--ok-background-color);
            border: var(--ok-color);
            /*.status {*/
            /*color: var(--ok-color);*/
            /*}*/
        }

        &.warning {
            visibility: visible;
            background-color: var(--warning-background-color);
            border: var(--warning-color);
            /*.status {*/
            /*color: var(--warning-color);*/
            /*}*/
        }

        &.error {
            visibility: visible;
            background-color: var(--error-background-color);
            border: var(--error-color);
            .status {
            color: var(--error-color);
            }
        }
        .status {
          align-content: center;
        }
        .close {
            position: relative;
            right: 0;
            background: transparent;
            border: none;
            top: 2px;
        }
    }
</style>