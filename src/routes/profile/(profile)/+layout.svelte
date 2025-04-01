<script>
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';

  export let data;
  const user = data.user;

  const socialLinks = [
    { key: 'github', icon: 'mdi:github', prefix: '' },
    { key: 'discord', icon: 'ph:discord-logo-fill', prefix: '' },
    { key: 'twitter', icon: 'mdi:twitter', prefix: '' },
    { key: 'website', icon: 'mdi:globe', prefix: '' },
    { key: 'email', icon: 'mdi:email', prefix: 'mailto:' },
  ];
  const defaultImageUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png?t=2024-12-06T11%3A37%3A26.554Z';
  const defaultBannerUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/banner.png?t=2024-12-06T11%3A37%3A50.969Z';

  $: pathname = $page.url.pathname;
</script>

<div class="flex w-full items-start justify-center">
  <div
    class="mx-auto grid w-[90%] justify-center space-y-4 md:flex md:flex-row md:space-x-4 md:space-y-0"
  >
    <div class="h-max px-5 md:sticky md:w-1/3 md:px-0">
      <section class="mt-10 flex w-full max-w-[505px] flex-col max-md:mt-10 max-md:max-w-full">
        <div class="flex flex-col max-md:max-w-full">
          <div class="flex w-full flex-col max-md:max-w-full">
            <div class="relative flex w-full flex-col max-md:max-w-full">
              <img
                loading="lazy"
                src={user?.banner_url || defaultBannerUrl}
                alt="Profile background"
                class="z-0 aspect-[3.33] h-[250px] w-full rounded-[43px] object-cover max-md:max-w-full"
              />

              <img
                loading="lazy"
                src={user.image_url || defaultImageUrl}
                alt="{user.display_name}'s avatar"
                class="absolute bottom-[-65px] left-[30px] z-0 aspect-[1.01] h-[120px] w-[120px] max-w-full items-center gap-2.5 rounded-[106px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="flex w-full flex-col max-md:mt-10 max-md:max-w-full">
        <div
          class="flex w-full flex-wrap items-center justify-between gap-4 text-black max-md:max-w-full"
        >
          <h2
            class="my-auto mt-20 self-stretch text-3xl font-semibold leading-none max-md:text-4xl"
          >
            {user?.display_name || ''}
          </h2>
          <div class="mt-20 flex flex-wrap items-center gap-2 self-stretch">
            {#each socialLinks as { key, icon, prefix } (key)}
              {#if user[key]}
                <a href="{prefix}{user[key]}" target="_blank" rel="noreferrer">
                  <Icon {icon} class="text-2xl" />
                </a>
              {/if}
            {/each}
          </div>
        </div>

        <p class="mt-11 text-2xl font-light leading-9 text-black max-md:mt-10 max-md:max-w-full">
          {user?.bio || ''}
        </p>
        <div
          class="mt-11 flex w-full flex-wrap items-center justify-between gap-4 max-md:mt-10 max-md:max-w-full"
        ></div>
        <div
          class="mt-11 flex w-full flex-wrap items-center justify-around gap-2 text-2xl font-medium leading-none max-md:mt-10 max-md:max-w-full"
        >
          <a href="/project/create" class="max-w-xs flex-1 md:max-w-sm">
            <Button
              class="flex w-full items-center justify-center gap-2 rounded-full bg-teal-900 px-6 py-4 text-xl text-white"
            >
              Create Project
            </Button>
          </a>

          <a href="/profile/edit" class="max-w-xs flex-1 md:max-w-sm">
            <Button
              class="flex w-full items-center justify-center gap-2 rounded-full border-2 border-lime-800 bg-lime-200 px-6 py-4 text-xl text-lime-800"
            >
              Edit Profile
              <Icon icon="mdi:pen" class="text-2xl" />
            </Button>
          </a>
        </div>
      </section>
    </div>

    <div class="md:w-2/3">
      <div class="w-full max-w-[1156px]">
        <nav class="my-4 flex gap-6">
          <a
            href="/profile"
            class=" {pathname.endsWith('/profile')
              ? 'border-b-[#bde25b] opacity-100'
              : 'opacity-50'} border-b-4 px-4 py-3 text-base font-semibold transition-all duration-200"
          >
            Projects Created
          </a>
          <a
            href="/profile/contributed"
            class="{pathname.endsWith('/contributed')
              ? 'border-b-[#bde25b] opacity-100'
              : 'opacity-50'} border-b-4 px-4 py-3 text-base font-semibold transition-all duration-200"
          >
            Projects Contributed
          </a>
          <a
            href="/profile/following"
            class="{pathname.endsWith('/following')
              ? 'border-b-[#bde25b] opacity-100'
              : 'opacity-50'} border-b-4 px-4 py-3 text-base font-semibold transition-all duration-200"
          >
            Following
          </a>
        </nav>
      </div>

      <section class="p-7 max-md:mt-10 max-md:px-5">
        <slot />
      </section>
    </div>
  </div>
</div>
