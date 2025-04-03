<script>
  import { goto } from '$app/navigation';
  import { countries } from 'countries-list';
  import { toast } from 'svelte-sonner';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Button } from '$lib/components/ui/button';
  import { Textarea } from '$lib/components/ui/textarea';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '$lib/components/ui/select';
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from '$lib/components/ui/command';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
  import { Check, ChevronsUpDown } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  export let id;
  let loading = false;
  let interest = '';
  let resourceType = '';
  let resourceTitle = '';
  let resourceLink = '';
  let country = '';

  const categories = [
    { value: 'design', label: 'Design' },
    { value: 'research', label: 'Research Data' },
  ];

  const countryList = Object.entries(countries)
    .map(([code, data]) => ({
      code,
      name: data.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleApplySubmit = async () => {
    try {
      loading = true;
      const response = await fetch(`/api/projects/${id}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceType,
          resourceTitle,
          resourceLink,
          country,
          interest,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Application submitted successfully!');
        goto(`/project/${id}`);
      } else {
        toast.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      loading = false;
    }
  };
</script>

<form on:submit|preventDefault={handleApplySubmit} class="mx-auto w-full max-w-6xl px-6 py-12">
  <div class="flex flex-col gap-8">
    <div class="flex w-full justify-between max-md:flex-col max-md:gap-2">
      <Label for="category" class="text-base font-semibold">Type of resource</Label>
      <div class="w-full md:w-2/3">
        <Select onValueChange={(value) => (resourceType = value)} value={resourceType}>
          <SelectTrigger
            class="w-full !rounded-[25px] border !border-black px-6 py-2 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
          >
            <SelectValue placeholder="Select resource type" />
          </SelectTrigger>
          <SelectContent>
            {#each categories as category}
              <SelectItem value={category.value} class="border-lime-800"
                >{category.label}</SelectItem
              >
            {/each}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="flex w-full justify-between max-md:flex-col max-md:gap-2">
      <Label for="resourceTitle" class="text-base font-semibold">Resource Title</Label>
      <div class="w-full md:w-2/3">
        <Input
          id="resourceTitle"
          bind:value={resourceTitle}
          type="text"
          aria-label="Enter the resource title"
        />
      </div>
    </div>

    <div class="flex w-full justify-between max-md:flex-col max-md:gap-2">
      <Label for="resourceLink" class="text-base font-semibold">Resource Link</Label>
      <div class="w-full md:w-2/3">
        <Input
          id="resourceLink"
          bind:value={resourceLink}
          type="text"
          aria-label="Enter the resource link"
        />
      </div>
    </div>
    <div class="flex w-full justify-between max-md:flex-col max-md:gap-2">
      <Label for="country" class="text-base font-semibold">Country</Label>
      <div class="w-full md:w-2/3">
        <Popover let:open>
          <PopoverTrigger class="w-full">
            <Button
              variant="outline"
              class="flex w-full justify-between !rounded-[25px] border !border-black px-6 py-2 text-lg transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
            >
              {country ? countryList.find((c) => c.code === country)?.name : 'Select your country'}
              <ChevronsUpDown class="mt-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[35%] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup class="max-h-60 overflow-auto">
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
                        <Check class="mr-2 h-4 w-4" />
                      {:else}
                        <div class="mr-2 h-4 w-4"></div>
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
    </div>

    <div class="flex w-full justify-between max-md:flex-col max-md:gap-2">
      <Label for="interest" class="text-base font-semibold">Comment</Label>
      <div class="w-full md:w-2/3">
        <Textarea
          id="interest"
          bind:value={interest}
          placeholder="Comment"
          class="min-h-[100px] !border !border-black focus:border-[#0b383c] focus:outline-none"
        ></Textarea>
      </div>
    </div>
  </div>

  <div class="mt-12 flex w-full justify-end">
    <Button
      type="submit"
      class="w-[20%] rounded-[40px] bg-teal-900 px-4 py-4 text-lg font-medium text-gray-200 transition-colors duration-300 hover:bg-teal-800 disabled:bg-gray-500"
      disabled={loading}
    >
      {loading ? 'SUBMITTING...' : 'SUBMIT'}
    </Button>
  </div>
</form>
