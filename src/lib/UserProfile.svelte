<script>
  import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover';
  import { enhance } from '$app/forms';
  import Icon from '@iconify/svelte';
  import { afterNavigate } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';

  export let data;
  
  let user = null;
  const defaultImageUrl = 'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png';

  afterNavigate(() => {
  });

  $: if (data.isAuthenticated) {
    user = data.user;
  }
</script>

<div class="relative flex items-center">
  <Popover>
    <PopoverTrigger class="flex w-full items-center justify-between !rounded-[51px] px-2">
      {#if user?.id}
        <img
          loading="lazy"
          src={user?.image_url ? user.image_url : defaultImageUrl}
          alt="User avatar"
          class="aspect-square w-[43px] rounded-[51px] object-contain"
        />
        <span class="ml-4 text-white text-ellipsis whitespace-nowrap lg:hidden">
          {user.display_name}
        </span>
      {/if}
    </PopoverTrigger>

    <PopoverContent
      sideOffset={8}
      class="w-[280px] border-0 !rounded-2xl bg-teal-600 p-0 shadow-lg max-lg:-translate-x-[60px] max-md:left-20 z-[999999]"
      align="end"
    >
      <nav class="flex flex-col py-2">
        <div class="flex items-center gap-3 ml-6 max-lg:hidden">
          <div class="flex p-3 rounded-3xl">
            <img
              loading="lazy"
              src={user?.image_url ? user.image_url : defaultImageUrl}
              class="aspect-square w-[42px] rounded-[51px] object-contain"
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
              <Button type="submit" class="text-left">Logout</Button>
            </form>
          </li>
        </ul>
      </nav>
    </PopoverContent>
  </Popover>
</div>