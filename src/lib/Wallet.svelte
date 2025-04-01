<script>
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { modalOpen } from './modalStore.js';
  import WalletPopup from './WalletPopup.svelte';

  let projectName = 'Project Name';
  let totalAmount = 10;

  function toggleWalletPopup() {
    modalOpen.update((value) => !value);
  }

  function openWalletPopup() {
    modalOpen.set(true);
  }
</script>

<main
  class="flex flex-col items-center overflow-hidden bg-white px-4 pb-[20px] pt-14 text-center leading-none max-md:mt-[-80px] sm:px-6"
>
  <section class="flex w-full max-w-full flex-col items-center sm:max-w-[1034px]">
    <div class="flex flex-col self-stretch w-full mt-20">
      <button
        on:click={toggleWalletPopup}
        variant="custom"
        class=" h-auto gap-1.5 self-center rounded-[53px] bg-lime-800 px-4 py-4 text-2xl font-semibold text-lime-100 max-md:text-xl sm:w-full sm:px-5"
      >
        Connect Wallet
      </button>

      <div class="flex flex-col self-center w-full max-w-full mt-24 sm:mt-10">
        <Label
          for="amount"
          class="flex justify-start text-4xl font-semibold max-md:text-3xl sm:w-full sm:text-xl"
        >
          Enter Amount
        </Label>
        <Input
          type="text"
          id="amount"
          class="mt-8 w-full gap-1.5 self-stretch rounded-full border-2 border-black py-4 pl-7 pr-16 text-3xl font-thin focus-visible:ring-0 focus-visible:ring-offset-0 max-md:h-[50px] sm:max-w-full sm:px-5 sm:text-lg"
          placeholder="$ USDC"
        />
      </div>

      <Button
        on:click={toggleWalletPopup}
        variant="custom"
        class="mt-6 hidden h-auto w-[20%] gap-1.5 self-center rounded-[53px] bg-lime-800 px-2 py-4 text-xl font-semibold text-white sm:hidden sm:w-full sm:max-w-full sm:px-5"
      >
        Send
      </Button>
    </div>
  </section>
</main>

{#if $modalOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="p-4 rounded-lg">
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
