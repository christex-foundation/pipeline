<script>
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
          <span
            ><svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M28 6H4C3.46957 6 2.96086 6.21071 2.58579 6.58579C2.21071 6.96086 2 7.46957 2 8V24C2 24.5304 2.21071 25.0391 2.58579 25.4142C2.96086 25.7893 3.46957 26 4 26H28C28.5304 26 29.0391 25.7893 29.4142 25.4142C29.7893 25.0391 30 24.5304 30 24V8C30 7.46957 29.7893 6.96086 29.4142 6.58579C29.0391 6.21071 28.5304 6 28 6ZM28 8V11H4V8H28ZM28 24H4V13H28V24ZM26 21C26 21.2652 25.8946 21.5196 25.7071 21.7071C25.5196 21.8946 25.2652 22 25 22H21C20.7348 22 20.4804 21.8946 20.2929 21.7071C20.1054 21.5196 20 21.2652 20 21C20 20.7348 20.1054 20.4804 20.2929 20.2929C20.4804 20.1054 20.7348 20 21 20H25C25.2652 20 25.5196 20.1054 25.7071 20.2929C25.8946 20.4804 26 20.7348 26 21ZM18 21C18 21.2652 17.8946 21.5196 17.7071 21.7071C17.5196 21.8946 17.2652 22 17 22H15C14.7348 22 14.4804 21.8946 14.2929 21.7071C14.1054 21.5196 14 21.2652 14 21C14 20.7348 14.1054 20.4804 14.2929 20.2929C14.4804 20.1054 14.7348 20 15 20H17C17.2652 20 17.5196 20.1054 17.7071 20.2929C17.8946 20.4804 18 20.7348 18 21Z"
                fill="#020809"
              />
            </svg></span
          >
          <span>Card</span>
        </button>

        <button
          class={`flex items-center justify-center p-2 space-x-2 border rounded-full hover:bg-gray-50 ${
            selectedTab === 'Crypto' ? 'border-[#0b383c] border-2' : 'border-gray-200'
          }`}
          on:click={() => selectTab('Crypto')}
        >
          <span
            ><svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.31 14.4625C22.069 13.7317 22.6021 12.7983 22.8459 11.7732C23.0897 10.7482 23.034 9.67472 22.6853 8.68045C22.3366 7.68619 21.7097 6.813 20.8791 6.16474C20.0485 5.51649 19.0492 5.12046 18 5.02375V3C18 2.73478 17.8946 2.48043 17.7071 2.29289C17.5196 2.10536 17.2652 2 17 2C16.7348 2 16.4804 2.10536 16.2929 2.29289C16.1054 2.48043 16 2.73478 16 3V5H14V3C14 2.73478 13.8946 2.48043 13.7071 2.29289C13.5196 2.10536 13.2652 2 13 2C12.7348 2 12.4804 2.10536 12.2929 2.29289C12.1054 2.48043 12 2.73478 12 3V5H8C7.73478 5 7.48043 5.10536 7.29289 5.29289C7.10536 5.48043 7 5.73478 7 6C7 6.26522 7.10536 6.51957 7.29289 6.70711C7.48043 6.89464 7.73478 7 8 7H9V24H8C7.73478 24 7.48043 24.1054 7.29289 24.2929C7.10536 24.4804 7 24.7348 7 25C7 25.2652 7.10536 25.5196 7.29289 25.7071C7.48043 25.8946 7.73478 26 8 26H12V28C12 28.2652 12.1054 28.5196 12.2929 28.7071C12.4804 28.8946 12.7348 29 13 29C13.2652 29 13.5196 28.8946 13.7071 28.7071C13.8946 28.5196 14 28.2652 14 28V26H16V28C16 28.2652 16.1054 28.5196 16.2929 28.7071C16.4804 28.8946 16.7348 29 17 29C17.2652 29 17.5196 28.8946 17.7071 28.7071C17.8946 28.5196 18 28.2652 18 28V26H19C20.3868 26 21.7309 25.5196 22.8035 24.6404C23.876 23.7613 24.611 22.5378 24.8832 21.1779C25.1555 19.8181 24.9483 18.4059 24.2968 17.1816C23.6454 15.9573 22.5899 14.9964 21.31 14.4625ZM21 10.5C21 11.4283 20.6313 12.3185 19.9749 12.9749C19.3185 13.6313 18.4283 14 17.5 14H11V7H17.5C18.4283 7 19.3185 7.36875 19.9749 8.02513C20.6313 8.6815 21 9.57174 21 10.5ZM19 24H11V16H19C20.0609 16 21.0783 16.4214 21.8284 17.1716C22.5786 17.9217 23 18.9391 23 20C23 21.0609 22.5786 22.0783 21.8284 22.8284C21.0783 23.5786 20.0609 24 19 24Z"
                fill="#020809"
              />
            </svg></span
          >
          <span>Crypto</span>
        </button>

        <button
          class={`flex items-center justify-center p-2 space-x-2 border rounded-full hover:bg-gray-50 ${
            selectedTab === 'Bank' ? 'border-[#0b383c] border-2' : 'border-gray-200'
          }`}
          on:click={() => selectTab('Bank')}
        >
          <span
            ><svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 13H6V21H4C3.73478 21 3.48043 21.1053 3.29289 21.2929C3.10536 21.4804 3 21.7348 3 22C3 22.2652 3.10536 22.5196 3.29289 22.7071C3.48043 22.8946 3.73478 23 4 23H28C28.2652 23 28.5196 22.8946 28.7071 22.7071C28.8946 22.5196 29 22.2652 29 22C29 21.7348 28.8946 21.4804 28.7071 21.2929C28.5196 21.1053 28.2652 21 28 21H26V13H29C29.2176 12.9998 29.4292 12.9286 29.6026 12.7973C29.7761 12.6659 29.902 12.4816 29.9612 12.2722C30.0205 12.0629 30.0098 11.8399 29.9308 11.6371C29.8519 11.4344 29.709 11.2629 29.5238 11.1487L16.5238 3.14874C16.3662 3.05189 16.1849 3.00061 16 3.00061C15.8151 3.00061 15.6338 3.05189 15.4762 3.14874L2.47625 11.1487C2.29103 11.2629 2.14811 11.4344 2.06916 11.6371C1.99021 11.8399 1.97955 12.0629 2.03878 12.2722C2.09801 12.4816 2.22391 12.6659 2.39738 12.7973C2.57085 12.9286 2.78242 12.9998 3 13ZM8 13H12V21H8V13ZM18 13V21H14V13H18ZM24 21H20V13H24V21ZM16 5.17374L25.4675 11H6.5325L16 5.17374ZM31 26C31 26.2652 30.8946 26.5196 30.7071 26.7071C30.5196 26.8946 30.2652 27 30 27H2C1.73478 27 1.48043 26.8946 1.29289 26.7071C1.10536 26.5196 1 26.2652 1 26C1 25.7348 1.10536 25.4804 1.29289 25.2929C1.48043 25.1053 1.73478 25 2 25H30C30.2652 25 30.5196 25.1053 30.7071 25.2929C30.8946 25.4804 31 25.7348 31 26Z"
                fill="#020809"
              />
            </svg></span
          >
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
