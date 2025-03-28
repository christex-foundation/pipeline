<script>
  import { countries } from 'countries-list';
  export let user = {};

  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Textarea } from "$lib/components/ui/textarea";

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

<div class="p-4 border shadow-md rounded-xl border-neutral-200 bg-neutral-50">
  <h2 class="mb-4 text-2xl font-semibold text-black">Profile</h2>
  <Input
    type="hidden"
    name="old_image"
    value={user.image_url}
  />
  <input
    type="hidden"
    name="old_banner"
    value={user.banner_url}
  />

  <div class="flex flex-col gap-4 p-2 bg-white">
    <div class="relative mb-[100px] h-[295.61px] self-stretch">
      <label for="banner-upload" class="cursor-pointer">
        <div
          class="flex h-full w-full items-center justify-center overflow-hidden rounded-[37.69px] bg-[#d9d9d9]"
        >
          {#if bannerImage}
            <img src={bannerImage} alt="Banner" class="object-cover w-full h-full" />
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
            <img src={profileImage} alt="Profile" class="object-cover w-full h-full rounded-full" />
          {:else}
            <div class="text-sm text-center">Click to upload profile picture</div>
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

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label
        for="firstName"
        class="text-base font-semibold"
      >
        Full Name
      </Label>

      <div class="w-2/3 max-md:w-full">
        <Input
          type="text"
          id="firstName"
          name="name"
          value={user.display_name}
          required
        />
      </div>
    </div>

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label
        for="email"
        class="text-base font-semibold"
      >
        Email
      </Label>
      <div class="w-2/3 max-md:w-full">
        <Input
          type="email"
          id="email"
          value={user.email}
          disabled
        />
      </div>
    </div>

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label
        for="country"
        class="text-base font-semibold"
      >
        Country
      </Label>
      <div class="w-2/3 max-md:w-full">
        <div class="relative">
          <select
            id="country"
            name="country"
            bind:value={user.country}
            class="w-full px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Select project country"
          >
            <option value="" class="w-full">Select a country</option>
            {#each countryList as countryOption}
              <option value={countryOption.name}>{countryOption.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label
        for="bio"
        class="text-base font-semibold"
      >
        Bio
      </Label>
      <div class="w-2/3 max-md:w-full">
        <Textarea
          id="bio"
          name="bio"
          value={user.bio}
          class="min-h-[100px]"
        />
      </div>
    </div>
  </div>
</div>
