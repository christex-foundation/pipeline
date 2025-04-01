<script>
  import { onMount } from 'svelte';
  import { modalOpen } from './modalStore.js';
  import SuccessPopup from './SuccessPopup.svelte';
  import { Dialog, DialogContent } from '$lib/components/ui/dialog';

  export let projectName = 'Project Name';
  export let totalAmount = 10;

  let showSuccessPopup = false;
  let isProcessing = false;

  onMount(() => {});

  function handleConfirmPayment() {
    showSuccessPopup = true;
  }

  function closeModal() {
    modalOpen.set(false);
    showSuccessPopup = false;
  }

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<div class="relative">
  {#if !showSuccessPopup}
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent
        class="w-full max-w-[758px] !rounded-[59px] bg-white p-16 text-center shadow-sm max-md:px-5 max-md:py-24"
      >
        <header class="mx-auto flex w-[266px] max-w-full flex-col font-semibold">
          <h1 class="w-[228px] max-w-full text-xl">You are contributing to</h1>
          <h2 class="w-full mt-4 text-4xl">{projectName}</h2>
        </header>

        <section class="flex flex-col w-full mt-20 max-md:mt-10 max-md:max-w-full">
          <div
            class="flex min-h-[49px] w-full items-center gap-1 border-b border-black py-3.5 pl-4 pr-5 max-md:max-w-full max-md:pr-5"
          >
            <div
              class="my-auto flex w-[551px] min-w-[240px] flex-wrap items-center justify-between gap-10 self-stretch"
            >
              <p class="self-stretch my-auto text-base font-thin">Total</p>
              <p class="self-stretch my-auto text-2xl font-semibold">$ {totalAmount}</p>
            </div>
          </div>
        </section>

        <button
          on:click={() => {
            isProcessing = true;
            handleConfirmPayment();
          }}
          class="mt-12 w-full gap-1 self-stretch rounded-[32px] bg-cyan-950 px-5 py-5 text-base font-semibold text-lime-100 hover:bg-cyan-900 max-md:mt-10"
          aria-label="Confirm Payment"
          disabled={isProcessing}
        >
          {#if isProcessing}
            <span class="flex items-center justify-center gap-2"> Processing... </span>
          {:else}
            Confirm Payment
          {/if}
        </button>
      </DialogContent>
    </Dialog>
  {:else}
    <SuccessPopup />
  {/if}
</div>
