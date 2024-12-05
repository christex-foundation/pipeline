<script>
  import { onMount } from 'svelte';
  import { modalOpen } from './modalStore.js';
  import SuccessPopup from './SuccessPopup.svelte';

  export let projectName = 'Project Name';
  export let totalAmount = 10;

  let showSuccessPopup = false;

  onMount(() => {});

  function handleConfirmPayment() {
    showSuccessPopup = true;
  }

  function closeModal() {
    modalOpen.set(false);
    showSuccessPopup = false;
  }
</script>

{#if !showSuccessPopup}
  <main
    class="relative flex max-w-[758px] flex-col overflow-hidden rounded-[59px] bg-white px-16 py-28 text-center leading-none text-black shadow-sm max-md:px-5 max-md:pt-24"
  >
    <button on:click={closeModal} class="absolute right-4 top-4 text-2xl">&times;</button>

    <header class="flex w-[266px] max-w-full flex-col font-semibold">
      <h1 class="w-[228px] max-w-full text-xl">You are contributing to</h1>
      <h2 class="mt-4 w-full text-4xl">{projectName}</h2>
    </header>

    <section class="mt-20 flex w-full flex-col max-md:mt-10 max-md:max-w-full">
      <div
        class="flex min-h-[49px] w-full items-center gap-1 border-b border-black py-3.5 pl-4 pr-5 max-md:max-w-full max-md:pr-5"
      >
        <div
          class="my-auto flex w-[551px] min-w-[240px] flex-wrap items-center justify-between gap-10 self-stretch"
        >
          <p class="my-auto self-stretch text-base font-thin">Total</p>
          <p class="my-auto self-stretch text-2xl font-semibold">$ {totalAmount}</p>
        </div>
      </div>
    </section>

    <button
      on:click={handleConfirmPayment}
      class="mt-12 gap-1 self-stretch rounded-[32px] bg-cyan-950 px-5 py-5 text-base font-semibold text-lime-100 hover:bg-cyan-900 max-md:mt-10"
      aria-label="Confirm Payment"
    >
      Confirm Payment
    </button>
  </main>
{:else}
  <SuccessPopup />
{/if}
