
<script>
 import { onMount } from 'svelte';

 let user = {}; // To store user information
 let error = null; 
 const defaultImageUrl = "https://i.pinimg.com/474x/76/4d/59/764d59d32f61f0f91dec8c442ab052c5.jpg";

 onMount(async () => {
    try {
          const response = await fetch('/api/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            user = result.user; // Store user data
            
          } else {
            const result = await response.json();
            error = result.error; // Store error message
          }
        } catch (err) {
          error = 'Failed to fetch user data'; 
      }
 })


</script>


<section class="flex flex-col mt-24 w-full max-w-[1155px] max-md:mt-10 max-md:max-w-full">
    <div class="flex flex-col max-md:max-w-full">
      <div class="flex flex-col w-full max-md:max-w-full">
        <div class="flex relative flex-col w-full max-md:max-w-full">
          <img 
            loading="lazy" 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8030ec6426e85620456b5636b4a5396ca24f43b5e55a6739527e90baef3c9203?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" 
            alt="Profile background" 
            class="object-cover z-0 w-full aspect-[3.33] min-h-[347px] rounded-[43px] max-md:max-w-full" 
          />
          <!-- svelte-ignore a11y-img-redundant-alt -->
          {#if user && user.id}
          <img loading="lazy" src={(user.image_url && user.image_url !== "") ? user.image_url : defaultImageUrl} alt="Profile picture" class="object-contain absolute z-0 gap-2.5 items-center max-w-full aspect-[1.01] bottom-[-105px] h-[211px] left-[123px] min-h-[211px] rounded-[106px] w-[211px]" />
          {/if}
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-12 max-md:mt-10">
      <a href="/profile/edit" class="inline-block">
        <button class="flex gap-2.5 justify-center items-center px-6 py-3.5 text-2xl leading-none text-lime-800 bg-lime-200 border-2 border-lime-800 border-solid rounded-[50px] max-md:px-5">
          Edit Profile
          <img 
            loading="lazy" 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ace0eb1d4bfd4db87a6bf2277283b6a10948092c6fe21a68b635fae72ce805b?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" 
            alt="" 
            class="object-contain self-stretch my-auto w-6 shrink-0 aspect-square" 
          />
        </button>
      </a>
    </div>
  </section>
  
  <section class="flex flex-col mt-16 w-full max-w-[1155px] max-md:mt-10 max-md:max-w-full">
    <div class="flex flex-wrap gap-4 justify-between items-center w-full text-black max-md:max-w-full">
      <h1 class="self-stretch my-auto text-5xl font-semibold leading-none max-md:text-4xl">
        {user?.display_name || ''}
      </h1>
      <div class="flex flex-wrap gap-3.5 justify-center items-center self-stretch my-auto min-w-[240px]">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/666cc6c084510091bc36590aca32111e2626269012592e3d661478bdf0f2aa32?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" alt="Contribution points icon" class="object-contain shrink-0 self-stretch my-auto aspect-square w-[82px]" />
        <div class="self-stretch my-auto text-2xl leading-10">
          Contribution points:
        </div>
        <div class="self-stretch my-auto text-3xl font-semibold leading-loose">
          {user?.points || 0}
        </div>
      </div>
    </div>
    <p class="mt-11 text-2xl font-light leading-9 text-black max-md:mt-10 max-md:max-w-full">
      {user?.bio || ''}
    </p>
    <div class="flex flex-wrap gap-4 justify-between items-center mt-11 w-full max-md:mt-10 max-md:max-w-full">
      <div class="flex flex-wrap gap-4 items-center self-stretch my-auto whitespace-nowrap min-w-[240px] max-md:max-w-full">
        <h2 class="self-stretch my-auto text-4xl leading-none text-center text-black">
          Interests 
        </h2>
        <div class="flex flex-wrap gap-3 items-center self-stretch my-auto text-base leading-none text-lime-800 min-w-[240px]">
          {#if user.interests && user.interests.length > 0}
            {#each user.interests as interest}
              <span class="self-stretch py-3.5 pr-6 pl-6 my-auto border-2 border-lime-800 border-solid rounded-[72px] max-md:px-5">
                {interest}
              </span>
            {/each}
          {:else}
            <span class="self-stretch py-3.5 pr-6 pl-6 my-auto border-2 border-lime-800 border-solid rounded-[72px] max-md:px-5">
              No interests specified
            </span>
          {/if}
        </div>
      </div>
      <div class="flex flex-wrap gap-2 items-center self-stretch my-auto">
        <a href="/">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed41f92bba82baae689f0c6bf194e5e860148c6bf243751d8f5bad9269b52c35?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" alt="Social media icon" class="object-contain shrink-0 self-stretch my-auto aspect-square w-[38px]" />   
    </a>
     <a href="/">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/7474ab52ea2bcf440a46f5fb1fad4298c0f23ee2d44508673fd6b829049e9898?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" alt="Social media icon" class="object-contain shrink-0 self-stretch my-auto aspect-square w-[38px]" />
    </a>
        <a href="/">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca4a0b2000221b9401e114cd438fa66ea601d926e01835174c44d0c7ee86b4f1?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" alt="Social media icon" class="object-contain shrink-0 self-stretch my-auto aspect-[0.97] w-[37px]" />
    </a>
        <a href="/">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7fed8ec7ff1d1bcef64eecc58e57b68fc276ad64ae9cc02199c523dd749c795?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" alt="Social media icon" class="object-contain shrink-0 self-stretch my-auto aspect-square w-[38px]" />
    </a>
        <a href="/">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/59b522da565ee0cc67ef9a132ebe08bd8095a4d0b73228fb806cc3b20bf771fd?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" alt="Social media icon" class="object-contain shrink-0 self-stretch my-auto aspect-square w-[38px]" />
    </a>
    </div>
    </div>
    <div class="flex flex-wrap gap-10 justify-between items-center mt-11 w-full text-2xl font-medium leading-none max-md:mt-10 max-md:max-w-full">
      <a href="/createProject">
        <button class="gap-2.5 self-stretch px-16 py-7 my-auto text-white bg-teal-900 min-w-[240px] rounded-[49px] w-[710px] max-md:px-5 max-md:max-w-full">
        Create Project
      </button>
    </a>
    <a href="/explore">
      <button class="gap-2.5 self-stretch px-16 py-7 my-auto bg-lime-200 border-2 border-lime-800 border-solid min-w-[240px] rounded-[49px] text-teal-950 w-[372px] max-md:px-5">
        Explore Projects
      </button>
    </a>
    </div>
  </section>