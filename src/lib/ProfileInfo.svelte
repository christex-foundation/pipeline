<script>
  import { onMount } from 'svelte';

  let user = {};
  let error = null;
  const defaultImageUrl = 'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png?t=2024-12-06T11%3A37%3A26.554Z';
  const defaultBannerUrl = 'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/banner.png?t=2024-12-06T11%3A37%3A50.969Z';
  
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
        user = result.user;
        console.log(user);
      } else {
        const result = await response.json();
        error = result.error;
      }
    } catch (err) {
      error = 'Failed to fetch user data';
    }
  });
</script>

<section class="flex flex-col mt-10 w-full max-w-[505px] max-md:mt-10 max-md:max-w-full">
  <div class="flex flex-col max-md:max-w-full">
    <div class="flex flex-col w-full max-md:max-w-full">
      <div class="relative flex flex-col w-full max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8030ec6426e85620456b5636b4a5396ca24f43b5e55a6739527e90baef3c9203?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Profile background"
          class="object-cover z-0 w-full aspect-[3.33] h-[250px] rounded-[43px] max-md:max-w-full"
        />

        {#if user && user.id}
          <img
            loading="lazy"
            src={user.image_url && user.image_url !== '' ? user.image_url : defaultImageUrl}
            alt="Profile picture"
            class="object-contain absolute z-0 gap-2.5 items-center max-w-full aspect-[1.01] bottom-[-65px] left-[30px] rounded-[106px] w-[120px] h-[120px]"
          />
        {/if}
      </div>
    </div>
  </div>
</section>

<section class="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
  <div
    class="flex flex-wrap items-center justify-between w-full gap-4 text-black max-md:max-w-full"
  >
    <h1 class="self-stretch my-auto mt-20 text-3xl font-semibold leading-none max-md:text-4xl">
      {user?.display_name || ''}
    </h1>
    <div class="flex flex-wrap items-center self-stretch gap-2 mt-20">
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed41f92bba82baae689f0c6bf194e5e860148c6bf243751d8f5bad9269b52c35?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="object-contain shrink-0 self-stretch my-auto aspect-square w-[32px]"
        />
      </a>
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7474ab52ea2bcf440a46f5fb1fad4298c0f23ee2d44508673fd6b829049e9898?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="object-contain shrink-0 self-stretch my-auto aspect-square w-[32px]"
        />
      </a>
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca4a0b2000221b9401e114cd438fa66ea601d926e01835174c44d0c7ee86b4f1?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="object-contain shrink-0 self-stretch my-auto aspect-[0.97] w-[32px]"
        />
      </a>
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7fed8ec7ff1d1bcef64eecc58e57b68fc276ad64ae9cc02199c523dd749c795?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="object-contain shrink-0 self-stretch my-auto aspect-square w-[32px]"
        />
      </a>
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/59b522da565ee0cc67ef9a132ebe08bd8095a4d0b73228fb806cc3b20bf771fd?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="object-contain shrink-0 self-stretch my-auto aspect-square w-[32px]"
        />
      </a>
    </div>
  </div>
  <p class="text-2xl font-light leading-9 text-black mt-11 max-md:mt-10 max-md:max-w-full">
    {user?.bio || ''}
  </p>
  <div
    class="flex flex-wrap items-center justify-between w-full gap-4 mt-11 max-md:mt-10 max-md:max-w-full"
  >
    <div
      class="flex flex-wrap gap-4 items-center self-stretch my-auto whitespace-nowrap min-w-[240px] max-md:max-w-full"
    >
      <h2 class="self-stretch my-auto text-lg leading-none text-center text-black">Interests</h2>
      <div
        class="flex flex-wrap gap-3 items-center self-stretch my-auto text-base leading-none text-lime-800 min-w-[140px]"
      >
        {#if user.interests && user.interests.length > 0}
          {#each user.interests as interest}
            <span
              class="self-stretch py-3.5 pr-6 pl-6 my-auto border-2 border-lime-800 border-solid rounded-[72px] max-md:px-5 text-base"
            >
              {interest}
            </span>
          {/each}
        {:else}
          <span
            class="self-stretch py-3 pr-6 pl-6 my-auto border-2 border-lime-800 border-solid rounded-[72px] max-md:px-5 text-sm"
          >
            No interests specified
          </span>
        {/if}
      </div>
    </div>
  </div>
  <div
    class="flex flex-wrap items-center justify-around w-full gap-2 text-2xl font-medium leading-none mt-11 max-md:mt-10 max-md:max-w-full"
  >
    <a href="/project/create" class="flex-1 max-w-xs md:max-w-sm">
      <button
        class="flex items-center justify-center w-full gap-2 px-6 py-4 text-xl text-white bg-teal-900 rounded-full"
      >
        Create Project
      </button>
    </a>

    <a href="/profile/edit" class="flex-1 max-w-xs md:max-w-sm">
      <button
        class="flex items-center justify-center w-full gap-2 px-6 py-4 text-xl border-2 rounded-full text-lime-800 bg-lime-200 border-lime-800"
      >
        Edit Profile
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ace0eb1d4bfd4db87a6bf2277283b6a10948092c6fe21a68b635fae72ce805b?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt=""
          class="object-contain w-6 h-6"
        />
      </button>
    </a>
  </div>
</section>
