<script>
  let bannerImage = null;
  let profileImage = null;
  import { countries } from 'countries-list';

  const countryList = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));

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

<form class="flex w-[80%] flex-col font-['Inter'] text-[30.91px] font-normal leading-[34px]">
  <div class="relative mb-[141px] h-[295.61px] self-stretch">
    <label for="banner-upload" class="cursor-pointer">
      <div
        class="flex h-full w-full items-center justify-center overflow-hidden rounded-[37.69px] bg-[#d9d9d9]"
      >
        {#if bannerImage}
          <img src={bannerImage} alt="Banner" class="h-full w-full object-cover" />
        {:else}
          <div class="text-center">Click to upload banner image</div>
        {/if}
      </div>
    </label>
    <input
      type="file"
      id="banner-upload"
      class="hidden"
      accept="image/*"
      on:change={handleBannerUpload}
    />

    <label for="profile-upload" class="cursor-pointer">
      <div
        class="absolute bottom-[-92.6px] left-[46.69px] flex h-[185.19px] w-[185.19px] items-center justify-center overflow-hidden rounded-full border-8 border-white bg-[#d9d9d9]"
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
      accept="image/*"
      on:change={handleProfileUpload}
    />
  </div>

  <div class="mt-44 flex w-full flex-col justify-center gap-6 max-md:mt-10 max-md:max-w-full">
    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="firstName" class="text-xl font-semibold text-black">First Name</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="firstName"
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4"
          aria-required="true"
        />
      </div>
    </div>

    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="lastName" class="text-xl font-semibold text-black">Last Name</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="lastName"
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4"
          aria-required="true"
        />
      </div>
    </div>

    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="username" class="text-xl font-semibold text-black">Username</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="username"
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4"
          aria-required="true"
        />
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
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4"
          aria-required="true"
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
          class="pr-22 relative flex min-h-[70px] items-center rounded-[75px] border-2 border-lime-800 px-6 py-6 pl-4"
        >
          <select
            id="country"
            class="w-full border-none bg-transparent pl-4 pr-10 text-xl outline-none"
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
          class="mt-2.5 h-[100px] w-full rounded-[31px] border-2 border-lime-800 p-4"
          aria-required="true"
        ></textarea>
      </div>
    </div>
  </div>

  <button
    type="submit"
    class="mt-[47px] self-end rounded-[127.56px] bg-[#516027] px-[29.89px] py-6 font-['Inter'] text-xl font-medium leading-[32.91px] text-[#ebebeb]"
  >
    save & continue
  </button>
</form>
