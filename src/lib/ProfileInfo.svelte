<script>
  import { onMount } from 'svelte';

  let user = {};
  let error = null;
  const defaultImageUrl = 'https://i.pinimg.com/474x/76/4d/59/764d59d32f61f0f91dec8c442ab052c5.jpg';

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
      } else {
        const result = await response.json();
        error = result.error;
      }
    } catch (err) {
      error = 'Failed to fetch user data';
    }
  });
</script>

<section class="mt-10 flex w-full max-w-[505px] flex-col max-md:mt-10 max-md:max-w-full">
  <div class="flex flex-col max-md:max-w-full">
    <div class="flex w-full flex-col max-md:max-w-full">
      <div class="relative flex w-full flex-col max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/8030ec6426e85620456b5636b4a5396ca24f43b5e55a6739527e90baef3c9203?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Profile background"
          class="z-0 aspect-[3.33] h-[250px] w-full rounded-[43px] object-cover max-md:max-w-full"
        />

        {#if user && user.id}
          <img
            loading="lazy"
            src={user.image_url && user.image_url !== '' ? user.image_url : defaultImageUrl}
            alt="Profile picture"
            class="absolute bottom-[-65px] left-[30px] z-0 aspect-[1.01] h-[120px] w-[120px] max-w-full items-center gap-2.5 rounded-[106px] object-contain"
          />
        {/if}
      </div>
    </div>
  </div>
</section>

<section class="flex w-full flex-col max-md:mt-10 max-md:max-w-full">
  <div
    class="flex w-full flex-wrap items-center justify-between gap-4 text-black max-md:max-w-full"
  >
    <h1 class="my-auto mt-20 self-stretch text-3xl font-semibold leading-none max-md:text-4xl">
      {user?.display_name || ''}
    </h1>
    <div class="mt-20 flex flex-wrap items-center gap-2 self-stretch">
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed41f92bba82baae689f0c6bf194e5e860148c6bf243751d8f5bad9269b52c35?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="my-auto aspect-square w-[32px] shrink-0 self-stretch object-contain"
        />
      </a>
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7474ab52ea2bcf440a46f5fb1fad4298c0f23ee2d44508673fd6b829049e9898?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="my-auto aspect-square w-[32px] shrink-0 self-stretch object-contain"
        />
      </a>
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca4a0b2000221b9401e114cd438fa66ea601d926e01835174c44d0c7ee86b4f1?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="my-auto aspect-[0.97] w-[32px] shrink-0 self-stretch object-contain"
        />
      </a>
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7fed8ec7ff1d1bcef64eecc58e57b68fc276ad64ae9cc02199c523dd749c795?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="my-auto aspect-square w-[32px] shrink-0 self-stretch object-contain"
        />
      </a>
      <a href="/">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/59b522da565ee0cc67ef9a132ebe08bd8095a4d0b73228fb806cc3b20bf771fd?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="my-auto aspect-square w-[32px] shrink-0 self-stretch object-contain"
        />
      </a>
    </div>
  </div>
  <p class="mt-11 text-2xl font-light leading-9 text-black max-md:mt-10 max-md:max-w-full">
    {user?.bio || ''}
  </p>
  <div
    class="mt-11 flex w-full flex-wrap items-center justify-between gap-4 max-md:mt-10 max-md:max-w-full"
  >
    <div
      class="my-auto flex min-w-[240px] flex-wrap items-center gap-4 self-stretch whitespace-nowrap max-md:max-w-full"
    >
      <h2 class="my-auto self-stretch text-center text-lg leading-none text-black">Interests</h2>
      <div
        class="my-auto flex min-w-[140px] flex-wrap items-center gap-3 self-stretch text-base leading-none text-lime-800"
      >
        {#if user.interests && user.interests.length > 0}
          {#each user.interests as interest}
            <span
              class="my-auto self-stretch rounded-[72px] border-2 border-solid border-lime-800 py-3.5 pl-6 pr-6 text-base max-md:px-5"
            >
              {interest}
            </span>
          {/each}
        {:else}
          <span
            class="my-auto self-stretch rounded-[72px] border-2 border-solid border-lime-800 py-3 pl-6 pr-6 text-sm max-md:px-5"
          >
            No interests specified
          </span>
        {/if}
      </div>
    </div>
  </div>
  <div
    class="mt-11 flex w-full flex-wrap items-center justify-around gap-2 text-2xl font-medium leading-none max-md:mt-10 max-md:max-w-full"
  >
    <a href="/project/create" class="max-w-xs flex-1 md:max-w-sm">
      <button
        class="flex w-full items-center justify-center gap-2 rounded-full bg-teal-900 px-6 py-4 text-xl text-white"
      >
        Create Project
      </button>
    </a>

    <a href="/profile/edit" class="max-w-xs flex-1 md:max-w-sm">
      <button
        class="flex w-full items-center justify-center gap-2 rounded-full border-2 border-lime-800 bg-lime-200 px-6 py-4 text-xl text-lime-800"
      >
        Edit Profile
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ace0eb1d4bfd4db87a6bf2277283b6a10948092c6fe21a68b635fae72ce805b?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt=""
          class="h-6 w-6 object-contain"
        />
      </button>
    </a>
  </div>
</section>
