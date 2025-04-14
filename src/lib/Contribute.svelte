<!-- <script>
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from '$lib/components/ui/command';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
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
        <Tabs value={selectedTab} onValueChange={(value) => (selectedTab = value)} class="w-full">
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
              <div class="space-y-1">
                <Label for="card-number" class="items-center w-1/3 text-sm text-gray-600"
                  >Card number</Label
                >
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
                  <Input id="expiry" type="text" bind:value={expiry} placeholder="MM / YY" />
                </div>
                <div class="space-y-1">
                  <Label for="cvc" class="text-sm text-gray-600">CVC</Label>
                  <Input id="cvc" type="text" bind:value={cvc} placeholder="CVC" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div class="space-y-1">
                  <Label for="country" class="text-sm text-gray-600">Country</Label>
                  <Popover let:open>
                    <PopoverTrigger class="w-full">
                      <Button
                        variant="outline"
                        class="flex w-full justify-between !rounded-[25px] border !border-black px-6 py-2 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
                      >
                        {country
                          ? countryList.find((c) => c.code === country)?.name
                          : 'Select your country'}
                        <Icon
                          icon="lucide:chevrons-up-down"
                          class="w-4 h-4 mt-2 opacity-50 shrink-0"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-[30%] p-0">
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
                  <Input id="zip" type="number" bind:value={zip} placeholder="ZIP" />
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
                <Input id="id" type="text" bind:value={idNumber} placeholder="Enter ID number" />
              </div>

              <p class="mb-6 text-sm text-gray-500">For banks in the US only.</p>
            </TabsContent>
          </div>

          <div class="flex justify-end mt-4">
            <Button
              class="w-[20%] rounded-full bg-[#0b383c] px-4 py-3 text-base text-white max-md:w-[40%]"
            >
              Save
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</div> -->



<script>
   import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { Input } from '$lib/components/ui/input';
  import { Button } from "$lib/components/ui/button";
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "$lib/components/ui/dialog";
  
  export let data;
  let project = data.project;
  let user = data.isAuthenticated ? data.user : null;
  
  let amount = 10;
  let isLoading = false;
  let error = null;
  let payLink = '';
  let showDialog = false;
  let contributionId = ''; 

//   async function handleContribute() {
//   isLoading = true;
//   error = null;

//   try {
//     const response = await fetch('/api/payments/create-paylink', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         projectId: project.id,
//         projectTitle: project.title,
//         projectBio: project.bio,
//         amount: Number(amount)
//       })
//     });

//     const result = await response.json();
//     if (!response.ok) throw new Error(result.error || "Payment failed");

//     payLink = result.payLink;
//     contributionId = result.contributionId;
//     showDialog = true;


//     const pollInterval = setInterval(async () => {
//       const statusResponse = await fetch('/api/payments/check-status', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ contributionId })
//       });

//       const statusResult = await statusResponse.json();
      
//       if (statusResult.status === 'paid') {
//         clearInterval(pollInterval);


//         window.location.reload();
//       } else if (statusResult.status === 'failed') {
//         clearInterval(pollInterval);
//         error = 'Payment failed. Please try again.';
//       }

//     }, 5000); 

  
//     onDestroy(() => clearInterval(pollInterval));

//   } catch (err) {
//     error = err.message;
//   } finally {
//     isLoading = false;
//   }
// }

  async function handleContribute() {
    isLoading = true;
    error = null;
    payLink = '';

    try {
      const response = await fetch('/api/payments/create-paylink', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          projectId: project.id,
          projectTitle: project.title,
          projectBio: project.bio,
          amount: Number(amount)
        })
      });

      const result = await response.json();
      console.log('API response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Payment processing failed");
      }

      if (!result.payLink || !result.contributionId) {
        throw new Error("Invalid response from server");
      }

      payLink = result.payLink;
      showDialog = true;

    } catch (err) {
      error = err.message || "Payment failed";
      console.error('Payment error:', err);
    } finally {
      isLoading = false;
    }
  }

</script>

<div class="w-full p-8 mx-auto mt-10 space-y-8 bg-white border shadow-lg max-w-ful rounded-3xl border-lime-200">
  <div class="w-full space-y-4">
    <div class="space-y-2">
      <label for="amount" class="block text-sm font-medium text-gray-700">Amount ($)</label>
      <Input 
        type="number" 
        id="amount" 
        bind:value={amount} 
        min="1" 
        step="1" 
        disabled={isLoading}
      />
    </div>
  
    <Button 
      on:click={handleContribute} 
      disabled={isLoading || !amount}
      variant="default"
    >
      {isLoading ? 'Processing...' : 'Make a Contribution'}
    </Button>
  </div>

  <p class="text-center text-neutral-400">By clicking “Make a Contribution”, you will be securely redirected to Helio, our trusted payment partner, to complete your contribution.</p>
</div>



<Dialog open={showDialog} onOpenChange={(open) => showDialog = open}>
  <DialogContent class="max-w-md bg-white border border-lime-300 fixed-dialog">
    <DialogHeader>
      <DialogTitle class="text-lime-800">Your Payment Link</DialogTitle>
    </DialogHeader>
    <div class="p-4 space-y-4">
      <p class="text-gray-700">Your secure payment link is ready. Click below to complete your contribution.</p>
      
      
      <Button 
        variant="outline" 
        asChild
        class="w-full py-2 bg-teal-800 border-2 rounded-full boorder text-lime-300 hover:"
      >
        <a href={payLink} target="_blank" rel="noopener noreferrer">
          Open Payment Page
        </a>
      </Button>
      
      <div class="pt-2 text-xs text-gray-500 break-all">
        <span class="font-medium">Link:</span> {payLink}
      </div>
    </div>
  </DialogContent>
</Dialog>

 <style>
  :global(.fixed-dialog) {
    transform: translate(-50%, -50%) !important;
    top: 50% !important;
    left: 50% !important;
    animation: none !important;
    transition: opacity 150ms ease-in-out !important;
  }
  

  :global([data-radix-popper-content-wrapper]) {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
  }
</style>
