<script>
  import { countries } from 'countries-list';
  export let user = {};

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

<div
  class="flex w-[80%] flex-col rounded-xl border border-neutral-200 bg-neutral-50 p-4 font-['Inter'] text-[30.91px] leading-[34px] font-normal shadow-md max-lg:w-full"
>
  <span class="mb-10 font-semibold">Profile</span>
  <input
    type="hidden"
    name="old_image"
    value={user.image_url}
    class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
  />
  <input
    type="hidden"
    name="old_banner"
    value={user.banner_url}
    class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
  />

  <div class="bg-white p-6">
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

    <div class="mt-10 flex w-full flex-col justify-center gap-6 max-md:mt-10 max-md:max-w-full">
      <div
        class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
      >
        <div class="mt-8 flex flex-col">
          <label for="firstName" class="text-xl font-semibold text-black">Full Name</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="firstName"
            name="name"
            value={user.display_name}
            class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 text-base max-lg:min-h-[55px] max-lg:w-full"
            aria-required="true"
          />
        </div>
      </div>
    </div>

    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="email" class="text-xl font-semibold text-black">Email</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="email"
          id="email"
          value={user.email}
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 text-base max-lg:min-h-[55px]"
          aria-required="true"
          disabled
        />
      </div>
    </div>

    <div
      class="mt-9 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="projectCountry" class="text-xl font-semibold text-black">Country</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <div
          class="relative flex min-h-[70px] items-center rounded-[75px] border-2 border-lime-800 px-6 py-6 pr-22 pl-4 max-lg:h-[10px] max-lg:py-2"
        >
          <select
            id="country"
            name="country"
            bind:value={user.country}
            class="w-full border-none bg-transparent pr-10 pl-4 text-base outline-none"
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

    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="bio" class="text-xl font-semibold text-black">Bio</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <textarea
          id="bio"
          name="bio"
          value={user.bio}
          class="mt-2.5 h-[100px] w-full rounded-[31px] border-2 border-lime-800 p-4 text-base"
          aria-required="true"
        ></textarea>
      </div>
    </div>
  </div>
</div>
