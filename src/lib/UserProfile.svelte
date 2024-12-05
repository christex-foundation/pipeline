<script>
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';

  let isOpen = false;
  let dropdownNode;
  let user = null;
  let error = null;
  export let data;

  const defaultImageUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png';

  function toggleDropdown(event) {
    event.stopPropagation();
    isOpen = !isOpen;
  }

  function handleClickOutside(event) {
    if (!event.target.closest('button')) {
      isOpen = false;
    }
  }

  onMount(async () => {
    const handleGlobalClick = (event) => {
      if (isOpen && dropdownNode && !dropdownNode.contains(event.target)) {
        handleClickOutside(event);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    if (data.isAuthenticated) {
      user = data.user;
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  });
</script>

<div class="relative flex items-center">
  <button
    on:click={toggleDropdown}
    class="flex h-[43px] w-[43px] items-center justify-between rounded-[51px] bg-lime-100 p-2.5 px-2"
    aria-label="User profile"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    {#if user && user.id}
      <img
        loading="lazy"
        src={user.image_url && user.image_url !== '' ? user.image_url : defaultImageUrl}
        alt="User avatar"
        class="aspect-square w-[25px] object-contain"
      />
      <span class="ml-4 text-ellipsis whitespace-nowrap text-white md:hidden"
        >{user.display_name}</span
      >
    {/if}
  </button>

  {#if isOpen}
    <div
      bind:this={dropdownNode}
      class="absolute right-0 top-full z-[9999] mt-2 w-[280px] rounded-2xl bg-teal-600 shadow-lg max-md:-translate-x-[60px]"
    >
      <nav class="flex flex-col py-6">
        <div class="ml-6 flex items-center gap-3 max-md:hidden">
          <div class="flex rounded-3xl border-2 border-white bg-zinc-300 p-3">
            <img
              loading="lazy"
              src={user.image_url && user.image_url !== '' ? user.image_url : defaultImageUrl}
              class="aspect-square w-[22px] object-contain"
              alt="User avatar"
            />
          </div>
          <span class="text-white">{user.display_name}</span>
        </div>

        <hr class="mt-4 w-full border-stone-300 max-md:hidden" />

        <ul class="mt-6 flex flex-col px-6 text-sm text-white">
          <li class="flex items-center gap-4">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b980984f37b77a34bf192f73bc2b8864dfe052a2488e8d5b5aa5b9d9bb6dcfae?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              class="aspect-square w-[17px] object-contain"
              alt=""
            />
            <a href="/profile">Profile</a>
          </li>
          <li class="mt-6 flex items-center gap-4">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/36ac60f5b7c31186fbac22d462a0e906fbc7bd63ae9a9caa9b8e5265e025d2d7?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              class="aspect-square w-[17px] object-contain"
              alt=""
            />
            <a href="/project/create">Create Project</a>
          </li>
        </ul>

        <hr class="mt-7 w-full border-stone-300" />

        <ul class="mt-6 flex flex-col px-6 text-sm text-white">
          <li class="flex items-center gap-4">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/134e2d421c52a6152b3b292772dd18c712e3b18e2360f2645b515c9ce5caf201?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              class="aspect-[1.06] w-[18px] object-contain"
              alt=""
            />
            <a href="/profile/edit">Settings</a>
          </li>
          <li class="mt-4 flex items-center gap-4">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a013c299c4e7d625b1100bfc8771c9e388f0dbf7c706bec63957c90cf739fe2b?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              class="aspect-square w-[18px] object-contain"
              alt=""
            />
            <form action="/profile/?/logout" method="post" use:enhance>
              <button type="submit" class="text-left">Logout</button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  {/if}
</div>
