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
  class="flex flex-col items-center overflow-hidden bg-white px-4 pt-14 pb-[20px] text-center leading-none max-md:mt-[-80px] sm:px-6"
>
  <section class="flex w-full max-w-full flex-col items-center sm:max-w-[1034px]">
    <div class="mt-20 flex w-full flex-col self-stretch">
      <button
        on:click={openWalletPopup}
        class="w-[80%] gap-1.5 self-center rounded-[53px] bg-lime-800 px-6 py-4 text-3xl font-semibold text-lime-100 max-md:text-xl sm:w-full sm:px-5"
      >
        Connect Wallet
      </button>

      <div class="mt-24 flex w-full max-w-full flex-col self-center sm:mt-10">
        <label
          for="amount"
          class="flex justify-start text-4xl font-semibold max-md:text-3xl sm:w-full sm:text-xl"
        >
          Enter Amount
        </label>
        <input
          type="text"
          id="amount"
          class="mt-8 h-[67px] w-full gap-1.5 self-stretch rounded-[50px] border-[3px] border-solid border-lime-800 py-3 pr-16 pl-7 text-3xl font-thin max-md:h-[50px] sm:max-w-full sm:px-5 sm:text-lg"
          placeholder="$ USDC"
        />
      </div>

      <button
        on:click={openWalletPopup}
        class="mt-6 hidden w-[20%] gap-1.5 self-center rounded-[53px] bg-lime-800 px-2 py-4 text-xl font-semibold text-white sm:hidden sm:w-full sm:max-w-full sm:px-5"
      >
        Send
      </button>
    </div>
  </section>
</main>

{#if $modalOpen}
  <div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
    <div class="rounded-lg p-4">
      <WalletPopup {projectName} {totalAmount} />
    </div>

    <button
      on:click={openWalletPopup}
      class="mt-6 hidden w-[20%] gap-1.5 self-center rounded-[53px] bg-lime-800 px-2 py-4 text-xl font-semibold text-white max-md:max-w-full max-md:px-5"
    >
      Send
    </button>
  </div>
{/if}
