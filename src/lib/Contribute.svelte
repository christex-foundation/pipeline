<!-- <script>
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
      <h2 class="justify-start mb-8 text-2xl font-semibold text-gray-800">Payment Method</h2>
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
            <label class="block mb-1 text-sm text-gray-600">Card number</label>
            <input
              type="text"
              class="h-[47px] w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={cardNumber}
              placeholder="XXXX XXXX XXXX XXXX"
            />
          </div>

          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label class="block mb-1 text-sm text-gray-600">Expiry</label>
              <input
                type="text"
                class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
                bind:value={expiry}
                placeholder="MM / YY"
              />
            </div>
            <div>
              <label class="block mb-1 text-sm text-gray-600">CVC</label>
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
              <label class="block mb-1 text-sm text-gray-600">Country</label>
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
              <label class="block mb-1 text-sm text-gray-600">ZIP</label>
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
            <label class="block mb-1 text-sm text-gray-600">Name</label>
            <input
              type="text"
              class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={name}
              placeholder="Enter account holder's name"
            />
          </div>
          <div>
            <label class="block mb-1 text-sm text-gray-600">Routing Number</label>
            <input
              type="text"
              class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={routingNumber}
              placeholder="Enter routing number"
            />
          </div>
          <div>
            <label class="block mb-1 text-sm text-gray-600">Checking Account Number</label>
            <input
              type="text"
              class="w-full rounded-full border-2 border-[#0b383c] p-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
              bind:value={checkingAccount}
              placeholder="Enter checking account number"
            />
          </div>
          <div>
            <label class="block mb-1 text-sm text-gray-600">ID Number</label>
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

      <div class="flex justify-end mt-4">
        <button
          class="w-[20%] rounded-full bg-[#0b383c] px-4 py-3 text-base text-white max-md:w-[40%]"
          >Save</button
        >
      </div>
    </div>
  </div>
</div>  -->



<script>
  
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "$lib/components/ui/command";
  import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
  import Icon from '@iconify/svelte';
  import Wallet from './Wallet.svelte';
  import { countries } from 'countries-list';

  const countryList = Object.entries(countries)
  .map(([code, data]) => ({
    code,
    name: data.name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
  
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

</script>

<div class="mx-auto flex w-full items-center justify-center p-4 font-['Inter']">
  <div class="mx-auto w-full p-6 sm:w-[996px]">
    <Card class="border-0 shadow-none">
      <CardHeader class="px-0">
        <CardTitle class="text-2xl font-semibold text-gray-800">Payment Method</CardTitle>
      </CardHeader>
      <CardContent class="px-0">
        <Tabs value={selectedTab} onValueChange={(value) => selectedTab = value} class="w-full">
          <TabsList class="grid w-full grid-cols-3 gap-2 p-0 bg-transparent">
            <TabsTrigger 
              value="Card" 
              class="flex items-center justify-center space-x-2 !rounded-full border border-gray-200 p-2 data-[state=active]:border-2 data-[state=active]:border-[#0b383c] data-[state=active]:bg-transparent"
            >
            <Icon icon="ph:credit-card" class="text-2xl" />
              <span>Card</span>
            </TabsTrigger>
            <TabsTrigger 
              value="Crypto"
              class="flex items-center justify-center space-x-2 !rounded-full border border-gray-200 p-2 data-[state=active]:border-2 data-[state=active]:border-[#0b383c] data-[state=active]:bg-transparent"
            >
            <Icon icon="lucide:bitcoin" class="text-2xl" />
              <span>Crypto</span>
            </TabsTrigger>
            <TabsTrigger 
              value="Bank"
              class="flex items-center justify-center space-x-2 !rounded-full border border-gray-200 p-2 data-[state=active]:border-2 data-[state=active]:border-[#0b383c] data-[state=active]:bg-transparent"
            >
            <Icon icon="mdi:bank" class="text-2xl" />
              <span>Bank</span>
            </TabsTrigger>
          </TabsList>
          
          <div class="mt-6">
            <TabsContent value="Card" class="mt-0 space-y-4">
              <div class="space-y-1 ">
                <Label for="card-number" class="items-center w-1/3 text-sm text-gray-600">Card number</Label>
                <Input
                  id="card-number"
                  type="text"
                  bind:value={cardNumber}
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>

              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div class="space-y-1">
                  <Label for="expiry" class="text-sm text-gray-600">Expiry</Label>
                  <Input
                    id="expiry"
                    type="text"
                    bind:value={expiry}
                    placeholder="MM / YY"
                  />
                </div>
                <div class="space-y-1">
                  <Label for="cvc" class="text-sm text-gray-600">CVC</Label>
                  <Input
                    id="cvc"
                    type="text"
                    bind:value={cvc}
                    placeholder="CVC"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div class="space-y-1">
                    <Label for="country" class="text-sm text-gray-600">Country</Label>
                    <Popover let:open>
                      <PopoverTrigger class="w-full">
                        <Button variant="outline" class="w-full flex !rounded-[25px] border !border-black px-6 py-2 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none justify-between">
                          {country ? countryList.find(c => c.code === country)?.name : "Select your country"}
                          <Icon icon="lucide:chevrons-up-down" class="w-4 h-4 mt-2 opacity-50 shrink-0" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent class="p-0 w-[30%]">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup class="overflow-auto max-h-60">
                            {#each countryList as countryItem}
                              <button 
                                class="cursor-pointer"
                                on:click={() => {
                                  country = countryItem.code;
                                  document.body.click();
                                }}
                              >
                              <CommandItem>
                                {#if country === countryItem.code}
                                <Icon icon="mdi:check" class="w-4 h-4 mr-2" />
                                {:else}
                                  <div class="w-4 h-4 mr-2"></div>
                                {/if}
                                {countryItem.name}
                              </CommandItem>
                              </button>
                            {/each}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                <div class="space-y-1">
                  <Label for="zip" class="text-sm text-gray-600">ZIP</Label>
                  <Input
                    id="zip"
                    type="number"
                    bind:value={zip}
                    placeholder="ZIP"
                  />
                </div>
              </div>

              

            </TabsContent>
            
            <TabsContent value="Crypto" class="mt-0">
              <Wallet />
            </TabsContent>
            
            <TabsContent value="Bank" class="mt-0 space-y-4">
              <div class="space-y-1">
                <Label for="name" class="text-sm text-gray-600">Name</Label>
                <Input
                  id="name"
                  type="text"
                  bind:value={name}
                  placeholder="Enter account holder's name"
                />
              </div>
              <div class="space-y-1">
                <Label for="routing" class="text-sm text-gray-600">Routing Number</Label>
                <Input
                  id="routing"
                  type="text"
                  bind:value={routingNumber}
                  placeholder="Enter routing number" 
                />
              </div>
              <div class="space-y-1">
                <Label for="account" class="text-sm text-gray-600">Checking Account Number</Label>
                <Input
                  id="account"
                  type="text"
                  bind:value={checkingAccount}
                  placeholder="Enter checking account number"
                />
              </div>
              <div class="space-y-1">
                <Label for="id" class="text-sm text-gray-600">ID Number</Label>
                <Input
                  id="id"
                  type="text"
                  bind:value={idNumber}
                  placeholder="Enter ID number"
                />
              </div>
              
              <p class="mb-6 text-sm text-gray-500">For banks in the US only.</p>
            </TabsContent>
          </div>
          
          <div class="flex justify-end mt-4">
            <Button class="w-[20%] rounded-full bg-[#0b383c] px-4 py-3 text-base text-white max-md:w-[40%]">
              Save
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</div>