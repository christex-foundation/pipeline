<script>
  import Icon from '@iconify/svelte';
  import Wallet from './Wallet.svelte';

  let selectedTab = 'Card';
  let cardNumber = '1264 1234 1234 1234';
  let expiry = '';
  let cvc = '';
  let zip = '';
  let cryptoAddress = '';
  let bankAccount = '';
  let isBillingSame = true;
  let name = '';
  let routingNumber = '';
  let checkingAccount = '';
  let idNumber = '';

  function selectTab(tab) {
    selectedTab = tab;
  }
</script>

<div class="flex items-center justify-center p-4 w-[996px] mx-auto">
  <div class="w-[996px] mx-auto p-6">
    <div class="mb-6">
      <h2 class="justify-start mb-8 text-2xl font-semibold text-gray-800">Payment Method</h2>
      <div class="grid grid-cols-3 gap-2">
        <button
          class={`flex items-center justify-center p-2 space-x-2 border rounded-full hover:bg-gray-50 ${
            selectedTab === 'Card' ? 'border-[#0b383c] border-2' : 'border-gray-200'
          }`}
          on:click={() => selectTab('Card')}
        >
          <Icon icon="ph:credit-card" class="text-2xl" />
          <span>Card</span>
        </button>

        <button
          class={`flex items-center justify-center p-2 space-x-2 border rounded-full hover:bg-gray-50 ${
            selectedTab === 'Crypto' ? 'border-[#0b383c] border-2' : 'border-gray-200'
          }`}
          on:click={() => selectTab('Crypto')}
        >
          <Icon icon="lucide:bitcoin" class="text-2xl" />
          <span>Crypto</span>
        </button>

        <button
          class={`flex items-center justify-center p-2 space-x-2 border rounded-full hover:bg-gray-50 ${
            selectedTab === 'Bank' ? 'border-[#0b383c] border-2' : 'border-gray-200'
          }`}
          on:click={() => selectTab('Bank')}
        >
          <Icon icon="mdi:bank" class="text-2xl" />
          <span>Bank</span>
        </button>
      </div>
    </div>

    {#if selectedTab === 'Card'}
      <div class="mb-4">
        <label class="block mb-1 text-sm text-gray-600">Card number</label>
        <input
          type="text"
          class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
          bind:value={cardNumber}
          placeholder="XXXX XXXX XXXX XXXX"
        />
      </div>
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label class="block mb-1 text-sm text-gray-600">Expiry</label>
          <input
            type="text"
            class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
            bind:value={expiry}
            placeholder="MM / YY"
          />
        </div>
        <div>
          <label class="block mb-1 text-sm text-gray-600">CVC</label>
          <input
            type="text"
            class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
            bind:value={cvc}
            placeholder="CVC"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label class="block mb-1 text-sm text-gray-600">Country</label>
          <input
            type="text"
            class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
            bind:value={expiry}
            placeholder="MM / YY"
          />
        </div>
        <div>
          <label class="block mb-1 text-sm text-gray-600">ZIP</label>
          <input
            type="number"
            class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
            bind:value={zip}
            placeholder="ZIP"
          />
        </div>
      </div>
    {:else if selectedTab === 'Crypto'}
      <Wallet />
    {:else if selectedTab === 'Bank'}
      <div class="mb-4">
        <label class="block mb-1 text-sm text-gray-600">Name</label>
        <input
          type="text"
          class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
          bind:value={name}
          placeholder="Enter account holder's name"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-sm text-gray-600">Routing Number</label>
        <input
          type="text"
          class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
          bind:value={routingNumber}
          placeholder="Enter routing number"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-sm text-gray-600">Checking Account Number</label>
        <input
          type="text"
          class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
          bind:value={checkingAccount}
          placeholder="Enter checking account number"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-sm text-gray-600">ID Number</label>
        <input
          type="text"
          class="w-full p-2 bg-gray-100 border-2 border-[#0b383c] rounded-full focus:outline-none focus:border-[#0b383c] transition-colors duration-200"
          bind:value={idNumber}
          placeholder="Enter ID number"
        />
      </div>

      <!-- Disclaimer -->
      <p class="mb-6 text-sm text-gray-500">For banks in the US only.</p>
    {/if}

    <!-- Buttons -->
    <div class="flex justify-end">
      <button class="px-4 py-3 text-white text-base bg-[#0b383c] rounded-full w-[20%]">Save</button>
    </div>
  </div>
</div>
