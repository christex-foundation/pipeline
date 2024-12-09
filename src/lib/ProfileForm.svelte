  <script>
    let bannerImage = null;
    let profileImage = null;
    import { countries } from 'countries-list';
  
    const countryList = Object.values(countries).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
    
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
  
  <form class="flex flex-col w-[80%] text-[30.91px] font-normal font-['Inter'] leading-[34px] max-lg:w-full p-4 border shadow-md bg-neutral-50 border-neutral-200 rounded-xl ">
    <span class="mb-10 font-semibold">Profile</span>
    <div class="p-6 bg-white">
    <div class="self-stretch h-[295.61px] relative mb-[100px]">
      <label for="banner-upload" class="cursor-pointer">
        <div class="w-full h-full bg-[#d9d9d9] rounded-[37.69px] flex justify-center items-center overflow-hidden">
          {#if bannerImage}
            <img src={bannerImage} alt="Banner" class="object-cover w-full h-full" />
          {:else}
            <div class="text-center max-lg:text-xl">Click to upload banner image</div>
          {/if}
        </div>
      </label>
      <input type="file" id="banner-upload" class="hidden" accept="image/*" on:change={handleBannerUpload} />
      
      <label for="profile-upload" class="cursor-pointer">
        <div class="absolute bottom-[-92.6px] left-[46.69px] w-[185.19px] max-lg:left-[20.69px] max-md:left-[46.69px] h-[185.19px] bg-[#d9d9d9] rounded-full border-8 border-white flex justify-center items-center overflow-hidden">
          {#if profileImage}
            <img src={profileImage} alt="Profile" class="object-cover w-full h-full rounded-full" />
          {:else}
            <div class="text-sm text-center">Click to upload profile picture</div>
          {/if}
        </div>
      </label>
      <input type="file" id="profile-upload" class="hidden" accept="image/*" on:change={handleProfileUpload} />
    </div>
  
    <div class="flex flex-col justify-center w-full gap-6 mt-10 max-md:mt-10 max-md:max-w-full">
      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="firstName" class="text-xl font-semibold text-black">First Name</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="firstName"

            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:w-full max-lg:min-h-[55px]"
            aria-required="true"
          />
        </div>
      </div>

      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="lastName" class="text-xl font-semibold text-black">Last Name</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="lastName"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px]"
            aria-required="true"
          />
        </div>
      </div>

      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="username" class="text-xl font-semibold text-black">Username</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="username"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px]"
            aria-required="true"
          />
        </div>
      </div>

      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="email" class="text-xl font-semibold text-black">Email</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="email"
            id="email"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px]"
            aria-required="true"
          />
        </div>
      </div>

      <div class="flex flex-row items-start justify-between w-full mt-9 max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="projectCountry" class="text-xl font-semibold text-black">Country</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <div class="flex items-center py-6 pr-22 pl-4 border-2 border-lime-800 min-h-[70px] rounded-[75px] relative px-6 max-lg:h-[10px] max-lg:py-2">
            <select
              id="country"
              class="w-full pl-4 pr-10 text-xl bg-transparent border-none outline-none"
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
      
      

      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="bio" class="text-xl font-semibold text-black">Bio</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <textarea
            id="bio"

            class="w-full border-2 border-lime-800 rounded-[31px] mt-2.5 p-4 h-[100px]"
            aria-required="true"
          ></textarea>
        </div>
      </div>

      </div>
    </div>
    
  </form>

  