<script>
  import Icon from '@iconify/svelte';
  import Wallet from './Wallet.svelte';
  import { countries } from 'countries-list';

  const countryList = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));

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
  let country = '';

  function selectTab(tab) {
    selectedTab = tab;
  }
</script>

<div class="mx-auto flex w-full items-center justify-center p-4 font-['Inter']">
  <div class="mx-auto w-full p-6 sm:w-[996px]">
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

    <div class="w-full">
      {#if selectedTab === 'Card'}
        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-sm text-gray-600">Card number</label>
            <input
              type="text"
              class="h-[47px] w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={cardNumber}
              placeholder="XXXX XXXX XXXX XXXX"
            />
          </div>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm text-gray-600">Expiry</label>
              <input
                type="text"
                class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
                bind:value={expiry}
                placeholder="MM / YY"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm text-gray-600">CVC</label>
              <input
                type="text"
                class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
                bind:value={cvc}
                placeholder="CVC"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm text-gray-600">Country</label>
              <select
                id="country"
                name="country"
                bind:value={country}
                class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
                aria-label="Select project country"
              >
                <option value="" class="w-full">Select a country</option>
                {#each countryList as countryOption}
                  <option value={countryOption.name}>{countryOption.name}</option>
                {/each}
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm text-gray-600">ZIP</label>
              <input
                type="number"
                class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
                bind:value={zip}
                placeholder="ZIP"
              />
            </div>
          </div>
        </div>
      {:else if selectedTab === 'Crypto'}
        <div class="w-full">
          <Wallet />
        </div>
      {:else if selectedTab === 'Bank'}
        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-sm text-gray-600">Name</label>
            <input
              type="text"
              class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={name}
              placeholder="Enter account holder's name"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm text-gray-600">Routing Number</label>
            <input
              type="text"
              class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={routingNumber}
              placeholder="Enter routing number"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm text-gray-600">Checking Account Number</label>
            <input
              type="text"
              class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={checkingAccount}
              placeholder="Enter checking account number"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm text-gray-600">ID Number</label>
            <input
              type="text"
              class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={idNumber}
              placeholder="Enter ID number"
            />
          </div>

          <p class="mb-6 text-sm text-gray-500">For banks in the US only.</p>
        </div>
      {/if}

      <div class="mt-4 flex justify-end">
        <button
          class="w-[20%] rounded-full bg-[#0b383c] px-4 py-3 text-base text-white max-md:w-[40%]"
          >Save</button
        >
      </div>
    </div>
  </div>
</div>
