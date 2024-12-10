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

<div class="mx-auto flex w-[996px] items-center justify-center p-4">
  <div class="mx-auto w-[996px] p-6">
    <div class="mb-6">
      <h2 class="mb-8 justify-start text-2xl font-semibold text-gray-800">Payment Method</h2>
      <div class="grid grid-cols-3 gap-2">
        <button
          class={`flex items-center justify-center space-x-2 rounded-full border p-2 hover:bg-gray-50 ${
            selectedTab === 'Card' ? 'border-2 border-[#0b383c]' : 'border-gray-200'
          }`}
          on:click={() => selectTab('Card')}
        >
          <Icon icon="ph:credit-card" class="text-2xl" />
          <span>Card</span>
        </button>

        <button
          class={`flex items-center justify-center space-x-2 rounded-full border p-2 hover:bg-gray-50 ${
            selectedTab === 'Crypto' ? 'border-2 border-[#0b383c]' : 'border-gray-200'
          }`}
          on:click={() => selectTab('Crypto')}
        >
          <Icon icon="lucide:bitcoin" class="text-2xl" />
          <span>Crypto</span>
        </button>

        <button
          class={`flex items-center justify-center space-x-2 rounded-full border p-2 hover:bg-gray-50 ${
            selectedTab === 'Bank' ? 'border-2 border-[#0b383c]' : 'border-gray-200'
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
        <label class="mb-1 block text-sm text-gray-600">Card number</label>
        <input
          type="text"
          class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
          bind:value={cardNumber}
          placeholder="XXXX XXXX XXXX XXXX"
        />
      </div>
      <div class="mb-4 grid grid-cols-2 gap-2">
        <div>
          <label class="mb-1 block text-sm text-gray-600">Expiry</label>
          <input
            type="text"
            class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
            bind:value={expiry}
            placeholder="MM / YY"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm text-gray-600">CVC</label>
          <input
            type="text"
            class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
            bind:value={cvc}
            placeholder="CVC"
          />
        </div>
      </div>

      <div class="mb-4 grid grid-cols-2 gap-2">
        <div>
          <label class="mb-1 block text-sm text-gray-600">Country</label>
          <input
            type="text"
            class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
            bind:value={expiry}
            placeholder="MM / YY"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm text-gray-600">ZIP</label>
          <input
            type="number"
            class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
            bind:value={zip}
            placeholder="ZIP"
          />
        </div>
      </div>
    {:else if selectedTab === 'Crypto'}
      <Wallet />
    {:else if selectedTab === 'Bank'}
      <div class="mb-4">
        <label class="mb-1 block text-sm text-gray-600">Name</label>
        <input
          type="text"
          class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
          bind:value={name}
          placeholder="Enter account holder's name"
        />
      </div>
      <div class="mb-4">
        <label class="mb-1 block text-sm text-gray-600">Routing Number</label>
        <input
          type="text"
          class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
          bind:value={routingNumber}
          placeholder="Enter routing number"
        />
      </div>
      <div class="mb-4">
        <label class="mb-1 block text-sm text-gray-600">Checking Account Number</label>
        <input
          type="text"
          class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
          bind:value={checkingAccount}
          placeholder="Enter checking account number"
        />
      </div>
      <div class="mb-4">
        <label class="mb-1 block text-sm text-gray-600">ID Number</label>
        <input
          type="text"
          class="w-full rounded-full border-2 border-[#0b383c] bg-gray-100 p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
          bind:value={idNumber}
          placeholder="Enter ID number"
        />
      </div>

      <!-- Disclaimer -->
      <p class="mb-6 text-sm text-gray-500">For banks in the US only.</p>
    {/if}

    <!-- Buttons -->
    <div class="flex justify-end">
      <button class="w-[20%] rounded-full bg-[#0b383c] px-4 py-3 text-base text-white">Save</button>
    </div>
  </div>
</div>
