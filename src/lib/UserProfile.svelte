<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import { browser } from '$app/environment';

  let isOpen = false;
  let dropdownNode;
  let user = null;
  let error = null;
  export let data;

  const defaultImageUrl = 'https://i.pinimg.com/474x/76/4d/59/764d59d32f61f0f91dec8c442ab052c5.jpg';

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

  async function handleLogout() {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          if (browser) {
            localStorage.clear();
            sessionStorage.clear();
          }

          await invalidateAll();

          goto('/sign-in');
        } else {
          console.error('Logout was not successful');
        }
      } else {
        console.error('Logout request failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
</script>

<div class="relative flex items-center">
  <button
    on:click={toggleDropdown}
    class="flex items-center justify-center p-2.5 bg-lime-100 h-[43px] rounded-[51px] w-[43px]"
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
    {/if}
  </button>

  {#if isOpen}
    <div
      bind:this={dropdownNode}
      class="absolute right-0 top-full z-50 mt-2 bg-teal-600 rounded-2xl shadow-lg w-[280px]"
    >
      <nav class="flex flex-col py-6">
        <div class="flex items-center gap-3 ml-6">
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

        <hr class="w-full mt-4 border-stone-300" />

        <ul class="flex flex-col px-6 mt-6 text-sm text-white">
          <li class="flex items-center gap-4">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b980984f37b77a34bf192f73bc2b8864dfe052a2488e8d5b5aa5b9d9bb6dcfae?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              class="w-[17px] aspect-square object-contain"
              alt=""
            />
            <a href="/profile">Profile</a>
          </li>
          <li class="flex items-center gap-4 mt-6">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/36ac60f5b7c31186fbac22d462a0e906fbc7bd63ae9a9caa9b8e5265e025d2d7?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              class="w-[17px] aspect-square object-contain"
              alt=""
            />
            <a href="/project/create">Create Project</a>
          </li>
        </ul>

        <hr class="w-full mt-7 border-stone-300" />

        <ul class="flex flex-col px-6 mt-6 text-sm text-white">
          <li class="flex items-center gap-4">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/134e2d421c52a6152b3b292772dd18c712e3b18e2360f2645b515c9ce5caf201?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              class="w-[18px] aspect-[1.06] object-contain"
              alt=""
            />
            <a href="/profile/edit">Settings</a>
          </li>
          <li class="flex items-center gap-4 mt-4">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a013c299c4e7d625b1100bfc8771c9e388f0dbf7c706bec63957c90cf739fe2b?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              class="w-[18px] aspect-square object-contain"
              alt=""
            />
            <button on:click={handleLogout} class="text-left">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  {/if}
</div>
