<script>
  import { page } from '$app/stores';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';

  export let data;
  const user = data.user;

  const socialLinks = [
    { key: 'github', icon: 'mdi:github', prefix: 'https://github.com/' },
    { key: 'discord', icon: 'ph:discord-logo-fill', prefix: 'https://discord.com/users/' },
    { key: 'twitter', icon: 'mdi:twitter', prefix: 'https://x.com/' },
    { key: 'website', icon: 'mdi:globe', prefix: '' },
    { key: 'email', icon: 'mdi:email', prefix: 'mailto:' },
  ];
  const defaultImageUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png?t=2024-12-06T11%3A37%3A26.554Z';
  const defaultBannerUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/banner.png?t=2024-12-06T11%3A37%3A50.969Z';

  $: pathname = $page.url.pathname;

  const tabs = [
    {
      name: 'Projects Created',
      href: '/profile',
      icon: 'mdi:folder-plus',
      count: data.projects?.length || 0,
    },
    {
      name: 'Projects Contributed',
      href: '/profile/contributed',
      icon: 'mdi:account-group',
      count: data.contributedProjects?.length || 0,
    },
    {
      name: 'Following',
      href: '/profile/following',
      icon: 'mdi:heart',
      count: data.following?.length || 0,
    },
  ];

  function getActiveTab(pathname) {
    if (pathname === '/profile') return 0;
    if (pathname.endsWith('/contributed')) return 1;
    if (pathname.endsWith('/following')) return 2;
    return 0;
  }

  $: activeTabIndex = getActiveTab(pathname);
</script>

<div class="min-h-screen bg-dashboard-black">
  <!-- Hero Section with Profile Card -->
  <div class="relative">
    <!-- Background Pattern -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-dashboard-gray-900 via-dashboard-black to-dashboard-gray-900 opacity-50"
    ></div>

    <div class="container relative mx-auto max-w-6xl px-6 pb-8 pt-12">
      <!-- Profile Card -->
      <div
        class="hover-lift rounded-3xl border border-dashboard-gray-700 bg-dashboard-gray-900/80 shadow-cardFocus backdrop-blur-sm"
      >
        <!-- Banner and Avatar Section -->
        <div class="relative">
          <img
            loading="lazy"
            src={user?.banner_url || defaultBannerUrl}
            alt="Profile background"
            class="h-48 w-full rounded-t-3xl object-cover md:h-64"
          />

          <!-- Avatar with Status Ring -->
          <div class="absolute -bottom-16 left-8">
            <div class="relative">
              <img
                loading="lazy"
                src={user.image_url || defaultImageUrl}
                alt="{user.display_name}'s avatar"
                class="h-32 w-32 rounded-full border-4 border-dashboard-gray-900 object-cover shadow-cardFocus"
              />
              <div
                class="border-3 absolute bottom-2 right-2 h-6 w-6 rounded-full border-dashboard-gray-900 bg-dashboard-success-500"
              ></div>
            </div>
          </div>
        </div>

        <!-- Profile Info Section -->
        <div class="px-8 pb-8 pt-20">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <!-- Left: User Info -->
            <div class="flex-1">
              <div class="mb-4 flex items-center gap-4">
                <h1 class="text-display-md font-bold text-white">
                  {user?.display_name || 'Anonymous User'}
                </h1>
                <div class="flex items-center gap-3">
                  {#each socialLinks as { key, icon, prefix } (key)}
                    {#if user[key]}
                      <a
                        href="{prefix}{user[key]}"
                        target="_blank"
                        rel="noreferrer"
                        class="flex h-10 w-10 items-center justify-center rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 text-gray-400 transition-all duration-200 hover:scale-105 hover:border-dashboard-purple-500 hover:text-white"
                      >
                        <Icon {icon} class="h-5 w-5" />
                      </a>
                    {/if}
                  {/each}
                </div>
              </div>

              {#if user?.bio}
                <p class="mb-6 max-w-2xl text-body-xl leading-relaxed text-gray-300">
                  {user.bio}
                </p>
              {/if}

              <!-- Stats Row -->
              <div class="mb-6 flex items-center gap-8">
                <div class="text-center">
                  <p class="text-heading-md font-semibold text-white">
                    {data.projects?.length || 0}
                  </p>
                  <p class="text-body-sm text-gray-400">Projects Created</p>
                </div>
                <div class="text-center">
                  <p class="text-heading-md font-semibold text-white">
                    {data.contributedProjects?.length || 0}
                  </p>
                  <p class="text-body-sm text-gray-400">Contributions</p>
                </div>
                <div class="text-center">
                  <p class="text-heading-md font-semibold text-white">
                    {data.following?.length || 0}
                  </p>
                  <p class="text-body-sm text-gray-400">Following</p>
                </div>
              </div>
            </div>

            <!-- Right: Action Buttons -->
            <div class="flex flex-col gap-3 sm:flex-row lg:min-w-[200px] lg:flex-col">
              <a href="/project/create" class="block">
                <button
                  class="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-dashboard-purple-500 px-6 py-3 text-label-lg font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-dashboard-purple-600"
                >
                  <Icon icon="mdi:plus" class="h-5 w-5" />
                  Create Project
                </button>
              </a>

              <a href="/profile/edit" class="block">
                <button
                  class="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-dashboard-yellow-400 px-6 py-3 text-label-lg font-medium text-dashboard-black transition-all duration-200 hover:scale-105 hover:bg-dashboard-yellow-500"
                >
                  <Icon icon="mdi:pen" class="h-5 w-5" />
                  Edit Profile
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Section -->
  <div class="container mx-auto max-w-6xl px-6 pb-12">
    <!-- Enhanced Tab Navigation -->
    <div class="mb-8">
      <div
        class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-2 backdrop-blur-sm"
      >
        <div class="scrollbar-hide flex overflow-x-auto md:overflow-x-visible">
          {#each tabs as tab, index}
            <a href={tab.href} class="group relative flex-shrink-0 md:flex-1">
              <div
                class="flex items-center justify-center gap-3 rounded-xl px-4 py-4 transition-all duration-200 md:px-6
                {activeTabIndex === index
                  ? 'bg-dashboard-yellow-400 text-dashboard-black'
                  : 'text-gray-400 hover:bg-dashboard-gray-800 hover:text-white'}"
              >
                <Icon icon={tab.icon} class="h-5 w-5" />
                <span class="whitespace-nowrap text-label-lg font-medium">{tab.name}</span>
                {#if tab.count > 0}
                  <span
                    class="rounded-full px-2 py-1 text-label-sm
                    {activeTabIndex === index
                      ? 'bg-dashboard-black/20 text-dashboard-black'
                      : 'bg-dashboard-gray-700 text-gray-300'}"
                  >
                    {tab.count}
                  </span>
                {/if}
              </div>
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="min-h-[500px]">
      <slot />
    </div>
  </div>
</div>
