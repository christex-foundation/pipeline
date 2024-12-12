<script>
    import { modalOpen } from './modalStore.js';
    import WalletPopup from './WalletPopup.svelte';
  
    let projectName = "Project Name";
    let totalAmount = 10;
  
    function openWalletPopup() {
      modalOpen.set(true);
    }
  </script>

  <main class="flex overflow-hidden flex-col items-center px-4 sm:px-6 pt-14 leading-none text-center bg-white pb-[20px] max-md:mt-[-80px]">
    <section class="flex flex-col items-center w-full max-w-full sm:max-w-[1034px]">
      <div class="flex flex-col self-stretch w-full mt-20 ">
        <button
          on:click={openWalletPopup}
          class="gap-1.5 self-center px-6 py-4 w-[80%] text-3xl font-semibold text-lime-100 bg-lime-800 rounded-[53px] sm:px-5 sm:w-full max-md:text-xl "
        >
          Connect Wallet
        </button>
  
        <div class="flex flex-col self-center w-full max-w-full mt-24 sm:mt-10">
          <label for="amount" class="flex justify-start text-4xl font-semibold sm:text-xl sm:w-full max-md:text-3xl">
            Enter Amount
          </label>
          <input
            type="text"
            id="amount"
            class="gap-1.5 self-stretch py-3 pr-16 pl-7 mt-8 w-full text-3xl font-thin border-lime-800 border-solid border-[3px] h-[67px] rounded-[50px] sm:px-5 sm:text-lg sm:max-w-full max-md:h-[50px]"
            placeholder="$ USDC"
          />
        </div>
  
        <button
          on:click={openWalletPopup}
          class="hidden gap-1.5 self-center px-2 py-4 w-[20%] text-xl font-semibold mt-6 text-white bg-lime-800 rounded-[53px] sm:px-5 sm:w-full sm:max-w-full sm:hidden"
        >
          Send
        </button>
      </div>
    </section>
  </main>
  
  {#if $modalOpen}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="p-4 rounded-lg">
        <WalletPopup {projectName} {totalAmount} />
      </div>
    </div>
  {/if}
  