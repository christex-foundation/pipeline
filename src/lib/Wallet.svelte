<script>
  import { modalOpen } from './modalStore.js';
  import WalletPopup from './WalletPopup.svelte';

  let projectName = 'Project Name';
  let totalAmount = 10;

  function openWalletPopup() {
    modalOpen.set(true);
  }
</script>

<main
  class="flex flex-col items-center overflow-hidden rounded-[100px] bg-white px-20 pb-[20px] pt-14 text-center leading-none max-md:px-5 max-md:py-24"
>
  <section class="flex w-full max-w-[1034px] flex-col items-center max-md:max-w-full">
    <div class="mt-20 flex w-full flex-col self-stretch max-md:mt-10 max-md:max-w-full">
      <button
        on:click={openWalletPopup}
        class="w-[80%] gap-1.5 self-center rounded-[53px] bg-lime-800 px-6 py-4 text-3xl font-semibold text-lime-100 max-md:max-w-full max-md:px-5"
      >
        Connect Wallet
      </button>
      <div class="mt-24 flex w-[996px] max-w-full flex-col self-center text-black max-md:mt-10">
        <label for="amount" class="flex w-[387px] max-w-full justify-start text-4xl font-semibold">
          Enter Amount
        </label>
        <input
          type="text"
          id="amount"
          class="mt-8 min-h-[67px] w-full gap-1.5 self-stretch rounded-[50px] border-[3px] border-solid border-lime-800 py-3 pl-7 pr-16 text-3xl font-thin max-md:px-5"
          placeholder="$ USDC"
        />
      </div>

      <button
        on:click={openWalletPopup}
        class="mt-6 hidden w-[20%] gap-1.5 self-center rounded-[53px] bg-lime-800 px-2 py-4 text-xl font-semibold text-white max-md:max-w-full max-md:px-5"
      >
        Send
      </button>
    </div>
  </section>
</main>

{#if $modalOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="rounded-lg p-4">
      <WalletPopup {projectName} {totalAmount} />
    </div>
  </div>
{/if}
