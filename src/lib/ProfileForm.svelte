<!-- <form class="flex flex-col w-full text-3xl mt-14 max-md:mt-10 max-md:max-w-full">
    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c7979cefe1fbf01e884bffe7d230ed9a363e6898b0332cfd026ba99e64dd7c1?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" alt="Profile banner" class="object-contain w-full aspect-[3.64] max-md:max-w-full" />
    <div class="flex flex-col w-full mt-36 max-md:mt-10 max-md:max-w-full">
      <div class="flex flex-wrap items-center justify-between w-full gap-10 mt-12 whitespace-nowrap max-md:mt-10 max-md:max-w-full">
        <label for="firstName" class="self-stretch my-auto">First Name</label>
        <input type="text" id="firstName" class="flex shrink-0 self-stretch my-auto border-2 border-lime-800 border-solid h-[73px] min-w-[240px] rounded-[61px] w-[839px] px-4" />
      </div>
      <div class="flex flex-wrap items-center justify-between w-full gap-10 mt-12 max-md:mt-10 max-md:max-w-full">
        <label for="lastName" class="self-stretch my-auto">Last Name</label>
        <input type="text" id="lastName" class="flex shrink-0 self-stretch my-auto border-2 border-lime-800 border-solid h-[73px] min-w-[240px] rounded-[61px] w-[839px] px-4" />
      </div>
      <div class="flex flex-wrap items-center justify-between w-full gap-10 mt-12 whitespace-nowrap max-md:mt-10 max-md:max-w-full">
        <label for="username" class="self-stretch my-auto">Username</label>
        <input type="text" id="username" class="flex shrink-0 self-stretch my-auto border-2 border-lime-800 border-solid h-[73px] min-w-[240px] rounded-[61px] w-[839px] px-4" />
      </div>
      <div class="flex flex-wrap items-center justify-between w-full gap-10 mt-12 whitespace-nowrap max-md:mt-10 max-md:max-w-full">
        <label for="email" class="self-stretch my-auto">Email</label>
        <input type="email" id="email" class="flex shrink-0 self-stretch my-auto border-2 border-lime-800 border-solid h-[73px] min-w-[240px] rounded-[61px] w-[839px] px-4" />
      </div>
      <div class="flex flex-wrap items-center justify-between w-full gap-10 mt-12 whitespace-nowrap max-md:mt-10 max-md:max-w-full">
        <label for="country" class="self-stretch my-auto">Country</label>
        <input type="text" id="country" class="flex shrink-0 self-stretch my-auto border-2 border-lime-800 border-solid h-[73px] min-w-[240px] rounded-[61px] w-[839px] px-4" />
      </div>
      <div class="flex flex-wrap items-start justify-between w-full gap-10 mt-12 whitespace-nowrap max-md:mt-10 max-md:max-w-full">
        <label for="bio" class="self-stretch">Bio</label>
        <textarea id="bio" class="flex shrink-0 border-2 border-lime-800 border-solid h-[368px] min-w-[240px] rounded-[37px] w-[839px] p-4"></textarea>
      </div>
      <button type="submit" class="self-end px-16 py-8 mt-12 text-3xl font-medium text-gray-200 bg-lime-800 rounded-[128px] max-md:px-5 max-md:mt-10">
        save & continue
      </button>
    </div>
  </form> -->

  <script>
    let bannerImage = null;
    let profileImage = null;
  
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
  
  <form class="flex flex-col w-[80%] text-[30.91px] font-normal font-['PP Mori'] leading-[34px]">
    <div class="self-stretch h-[295.61px] relative mb-[141px]">
      <label for="banner-upload" class="cursor-pointer">
        <div class="w-full h-full bg-[#d9d9d9] rounded-[37.69px] flex justify-center items-center overflow-hidden">
          {#if bannerImage}
            <img src={bannerImage} alt="Banner" class="object-cover w-full h-full" />
          {:else}
            <div class="text-center">Click to upload banner image</div>
          {/if}
        </div>
      </label>
      <input type="file" id="banner-upload" class="hidden" accept="image/*" on:change={handleBannerUpload} />
      
      <label for="profile-upload" class="cursor-pointer">
        <div class="absolute bottom-[-92.6px] left-[46.69px] w-[185.19px] h-[185.19px] bg-[#d9d9d9] rounded-full border-8 border-white flex justify-center items-center overflow-hidden">
          {#if profileImage}
            <img src={profileImage} alt="Profile" class="object-cover w-full h-full rounded-full" />
          {:else}
            <div class="text-sm text-center">Click to upload profile picture</div>
          {/if}
        </div>
      </label>
      <input type="file" id="profile-upload" class="hidden" accept="image/*" on:change={handleProfileUpload} />
    </div>
  
    <div class="flex flex-col gap-[47px]">
      <div class="flex items-center justify-between">
        <label for="firstName">First Name</label>
        <input type="text" id="firstName" class="w-[838.93px] h-[73.02px] rounded-[60.59px] border-2 border-[#516027] px-4" />
      </div>
      <div class="flex items-center justify-between">
        <label for="lastName">Last Name</label>
        <input type="text" id="lastName" class="w-[838.93px] h-[73.02px] rounded-[60.59px] border-2 border-[#516027] px-4" />
      </div>
      <div class="flex items-center justify-between">
        <label for="username">Username</label>
        <input type="text" id="username" class="w-[838.93px] h-[73.02px] rounded-[60.59px] border-2 border-[#516027] px-4" />
      </div>
      <div class="flex items-center justify-between">
        <label for="email">Email</label>
        <input type="email" id="email" class="w-[838.93px] h-[73.02px] rounded-[60.59px] border-2 border-[#516027] px-4" />
      </div>
      <div class="flex items-center justify-between">
        <label for="country">Country</label>
        <input type="text" id="country" class="w-[838.93px] h-[73.02px] rounded-[60.59px] border-2 border-[#516027] px-4" />
      </div>
      <div class="flex items-start justify-between">
        <label for="bio">Bio</label>
        <textarea id="bio" class="w-[838.93px] h-[368.20px] rounded-[37.29px] border-2 border-[#516027] p-4"></textarea>
      </div>
    </div>
  
    <button type="submit" class="self-end mt-[47px] px-[59.89px] py-8 bg-[#516027] rounded-[127.56px] text-[#ebebeb] text-3xl font-medium font-['Inter'] leading-[32.91px]">
      save & continue
    </button>
  </form>