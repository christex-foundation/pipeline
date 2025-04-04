<script>
  import { countries } from 'countries-list';
  export let user = {};

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from '$lib/components/ui/command';
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
  import Icon from '@iconify/svelte';

  const countryList = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));

  let bannerImage = user.banner_url || null;
  let profileImage = user.image_url || null;

  function handleBannerUpload(event) {
    const file = event.target.files[0];
    if (file) {
      bannerImage = URL.createObjectURL(file);
    }
  }

  function handleProfileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      profileImage = URL.createObjectURL(file);
    }
  }
</script>

<div class="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md">
  <h2 class="mb-4 text-2xl font-semibold text-black">Profile</h2>
  <Input type="hidden" name="old_image" value={user.image_url} />
  <input type="hidden" name="old_banner" value={user.banner_url} />

  <div class="flex flex-col gap-4 bg-white p-2">
    <div class="relative mb-[100px] h-[295.61px] self-stretch">
      <label for="banner-upload" class="cursor-pointer">
        <div
          class="flex h-full w-full items-center justify-center overflow-hidden rounded-[37.69px] bg-[#d9d9d9]"
        >
          {#if bannerImage}
            <img src={bannerImage} alt="Banner" class="h-full w-full object-cover" />
          {:else}
            <div class="text-center max-lg:text-xl">Click to upload banner image</div>
          {/if}
        </div>
      </label>
      <input
        type="file"
        id="banner-upload"
        class="hidden"
        name="banner"
        accept="image/*"
        on:change={handleBannerUpload}
      />

      <label for="profile-upload" class="cursor-pointer">
        <div
          class="absolute bottom-[-92.6px] left-[46.69px] flex h-[185.19px] w-[185.19px] items-center justify-center overflow-hidden rounded-full border-8 border-white bg-[#d9d9d9] max-lg:left-[20.69px] max-md:left-[46.69px]"
        >
          {#if profileImage}
            <img src={profileImage} alt="Profile" class="h-full w-full rounded-full object-cover" />
          {:else}
            <div class="text-center text-sm">Click to upload profile picture</div>
          {/if}
        </div>
      </label>
      <input
        type="file"
        id="profile-upload"
        class="hidden"
        name="image"
        accept="image/*"
        on:change={handleProfileUpload}
      />
    </div>

    <div class="mt-4 flex w-full justify-between max-md:flex-col">
      <Label for="firstName" class="text-base font-semibold">Full Name</Label>

      <div class="w-2/3 max-md:w-full">
        <Input type="text" id="firstName" name="name" value={user.display_name} required />
      </div>
    </div>

    <div class="mt-4 flex w-full justify-between max-md:flex-col">
      <Label for="email" class="text-base font-semibold">Email</Label>
      <div class="w-2/3 max-md:w-full">
        <Input type="email" id="email" value={user.email} disabled />
      </div>
    </div>

    <div class="mt-4 flex w-full justify-between max-md:flex-col">
      <Label for="country" class="text-base font-semibold">Country</Label>
      <div class="w-2/3 max-md:w-full">
        <Popover>
          <PopoverTrigger class="w-full">
            <Button
              variant="outline"
              class="flex w-full justify-between !rounded-[25px] border !border-black px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Select project country"
            >
              {user.country || 'Select a country'}
              <Icon
                icon="lucide:chevrons-up-down"
                class="h-4 w-4 shrink-0 opacity-50"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup class="max-h-60 overflow-auto">
                {#each countryList as countryOption}
                  <CommandItem 
                    value={countryOption.name}
                    onSelect={() => {
                      user.country = countryOption.name;
                    }}
                  >
                    {#if user.country === countryOption.name}
                      <Icon icon="mdi:check" class="mr-2 h-4 w-4" />
                    {:else}
                      <div class="mr-2 h-4 w-4"></div>
                    {/if}
                    {countryOption.name}
                  </CommandItem>
                {/each}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <div class="mt-4 flex w-full justify-between max-md:flex-col">
      <Label for="bio" class="text-base font-semibold">Bio</Label>
      <div class="w-2/3 max-md:w-full">
        <Textarea id="bio" name="bio" value={user.bio} class="min-h-[100px]" />
      </div>
    </div>
  </div>
</div>
