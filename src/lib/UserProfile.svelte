<script>
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import Icon from '@iconify/svelte';

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
    class="flex items-center p-2.5 bg-lime-100 h-[43px] rounded-[51px] w-[43px] justify-between px-2"
    aria-label="User profile"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    {#if user && user.id}
      <img
        loading="lazy"
        src={user.image_url && user.image_url !== '' ? user.image_url : defaultImageUrl}
        alt="User avatar"
        class="w-[25px] aspect-square object-contain"
      />
      <span class="ml-4 text-white lg:hidden whitespace-nowrap text-ellipsis"
        >{user.display_name}</span
      >
    {/if}
  </button>

  {#if isOpen}
    <div
      bind:this={dropdownNode}
      class="absolute right-0 top-full z-[9999] mt-2 bg-teal-600 rounded-2xl shadow-lg w-[280px] max-lg:-translate-x-[60px] max-lg:left-40 max-md:left-20"
    >
      <nav class="flex flex-col py-6">
        <div class="flex items-center gap-3 ml-6 max-lg:hidden">
          <div class="flex p-3 border-2 border-white rounded-3xl bg-zinc-300">
            <img
              loading="lazy"
              src={user.image_url && user.image_url !== '' ? user.image_url : defaultImageUrl}
              class="w-[22px] object-contain aspect-square"
              alt="User avatar"
            />
          </div>
          <span class="text-white">{user.display_name}</span>
        </div>

        <hr class="w-full mt-4 border-stone-300 max-lg:hidden" />

        <ul class="flex flex-col px-6 mt-6 text-sm text-white">
          <li class="flex items-center gap-4">
            <Icon icon="et:profile-male" class="text-lg" />
            <a href="/profile">Profile</a>
          </li>
          <li class="flex items-center gap-4 mt-6">
            <Icon icon="stash:save-ribbon-light" class="text-lg" />
            <a href="/project/create">Create Project</a>
          </li>
        </ul>

        <hr class="w-full mt-7 border-stone-300" />

        <ul class="flex flex-col px-6 mt-6 text-sm text-white">
          <li class="flex items-center gap-4">
            <Icon icon="stash:cog-light" class="text-xl" />
            <a href="/profile/edit">Settings</a>
          </li>
          <li class="flex items-center gap-4 mt-4">
            <Icon icon="humbleicons:logout" class="text-lg" />
            <form action="/profile/?/logout" method="post" use:enhance>
              <button type="submit" class="text-left">Logout</button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  {/if}
</div>
