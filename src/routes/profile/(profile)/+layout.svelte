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

<div class="flex items-start justify-center w-full">
  <div
    class="mx-auto grid w-[90%] justify-center space-y-4 md:flex md:flex-row md:space-x-4 md:space-y-0"
  >
    <div class="px-5 h-max md:sticky md:w-1/3 md:px-0">
      <section class="mt-10 flex w-full max-w-[505px] flex-col max-md:mt-10 max-md:max-w-full">
        <div class="flex flex-col max-md:max-w-full">
          <div class="flex flex-col w-full max-md:max-w-full">
            <div class="relative flex flex-col w-full max-md:max-w-full">
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

      <section class="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
        <div
          class="flex flex-wrap items-center justify-between w-full gap-4 text-black max-md:max-w-full"
        >
          <h2
            class="self-stretch my-auto mt-20 text-3xl font-semibold leading-none max-md:text-4xl"
          >
            {user?.display_name || ''}
          </h2>
          <div class="flex flex-wrap items-center self-stretch gap-2 mt-20">
            {#each socialLinks as { key, icon, prefix } (key)}
              {#if user[key]}
                <a href="{prefix}{user[key]}" target="_blank" rel="noreferrer">
                  <Icon {icon} class="text-2xl" />
                </a>
              {/if}
            {/each}
          </div>
        </div>
        <p class="text-2xl font-light leading-9 text-black mt-11 max-md:mt-10 max-md:max-w-full">
          {user?.bio || ''}
        </p>
        <div
          class="flex flex-wrap items-center justify-between w-full gap-4 mt-11 max-md:mt-10 max-md:max-w-full"
        ></div>
        <div
          class="flex flex-wrap items-center justify-around w-full gap-2 text-2xl font-medium leading-none mt-11 max-md:mt-10 max-md:max-w-full"
        >
          <a href="/project/create" class="flex-1 max-w-xs md:max-w-sm">
            <Button
              class="flex items-center justify-center w-full gap-2 px-6 py-4 text-xl text-white bg-teal-900 rounded-full"
           
              >
              Create Project
          </Button>
          </a>

          <a href="/profile/edit" class="flex-1 max-w-xs md:max-w-sm">
            <Button
              class="flex items-center justify-center w-full gap-2 px-6 py-4 text-xl border-2 rounded-full border-lime-800 bg-lime-200 text-lime-800"
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
        <nav class="flex gap-6 my-4">
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
