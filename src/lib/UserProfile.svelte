<script>
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { enhance } from '$app/forms';
  import Icon from '@iconify/svelte';
  import { afterNavigate } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';

  export let data;

  let user = null;
  const defaultImageUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png';

  afterNavigate(() => {});

  $: if (data.isAuthenticated) {
    user = data.user;
  }
</script>

<div class="relative flex items-center">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class="dashboard-trigger-btn group flex w-full items-center justify-between px-2"
    >
      {#if user?.id}
        <img
          loading="lazy"
          src={user?.image_url ? user.image_url : defaultImageUrl}
          alt="User avatar"
          class="aspect-square w-[35px] rounded-full object-cover ring-2 ring-dashboard-gray-600 transition-all duration-300 group-hover:scale-105 group-hover:ring-dashboard-purple-500 lg:w-[43px]"
        />
      {/if}
    </DropdownMenu.Trigger>

    <DropdownMenu.Content
      sideOffset={4}
      class="dashboard-dropdown z-[999999] w-[280px] overflow-hidden !border-0 !bg-transparent p-0 max-lg:-translate-x-[60px] max-md:left-20"
      align="end"
    >
      <nav class="flex flex-col">
        <!-- User Info Header - No Avatar, Just Name with Visual Connection -->
        <div class="dashboard-header px-6 pb-6 pt-8">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-heading-lg font-semibold text-white">{user.display_name}</span>
              <p class="mt-1 text-body-sm text-gray-400">Welcome back</p>
            </div>
            <!-- Visual connection indicator - subtle dot that aligns with avatar -->
            <div class="dashboard-connection-dot"></div>
          </div>
        </div>

        <!-- Main Navigation Group -->
        <DropdownMenu.Group class="flex flex-col space-y-1 px-6">
          <DropdownMenu.Item
            class="dashboard-menu-item group flex cursor-pointer items-center gap-4 p-3"
          >
            <Icon
              icon="et:profile-male"
              class="text-xl text-gray-400 transition-colors duration-200 group-hover:text-dashboard-purple-500"
            />
            <a
              href="/profile"
              class="text-body-lg font-medium text-gray-300 transition-colors duration-200 group-hover:text-white"
              >Profile</a
            >
          </DropdownMenu.Item>

          <DropdownMenu.Item
            class="dashboard-menu-item group flex cursor-pointer items-center gap-4 p-3"
          >
            <Icon
              icon="humbleicons:logout"
              class="text-xl text-gray-400 transition-colors duration-200 group-hover:text-dashboard-error-500"
            />
            <form action="/logout" method="post" use:enhance class="flex-1">
              <Button
                type="submit"
                class="h-auto w-full justify-start bg-transparent p-0 text-left text-body-lg font-medium text-gray-300 transition-colors duration-200 hover:bg-transparent group-hover:text-dashboard-error-500"
              >
                Logout
              </Button>
            </form>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </nav>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>

<style>
  .dashboard-trigger-btn {
    /* Glassmorphism trigger button */
    background: rgba(0, 0, 0, 0.6); /* Black translucent */
    border: 1px solid rgba(64, 64, 64, 0.4); /* dashboard-gray-700 with transparency */
    border-radius: 51px;
    padding: 8px 12px;

    /* Glass effect */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);

    /* Subtle shadow */
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);

    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dashboard-trigger-btn:hover {
    background: rgba(0, 0, 0, 0.8); /* Darker on hover */
    border-color: rgba(139, 92, 246, 0.6); /* dashboard-purple-500 with transparency */
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 4px 16px rgba(139, 92, 246, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }

  /* Force override any default dropdown menu styles */
  :global(.dashboard-dropdown) {
    /* Black translucent glassy card - using !important to override defaults */
    background: rgba(0, 0, 0, 0.85) !important; /* Pure black with transparency */
    border: 1px solid rgba(255, 255, 255, 0.1) !important; /* Subtle white border */
    border-radius: 20px !important; /* Larger radius for premium feel */

    /* Enhanced glass effect for black theme */
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;

    /* Premium shadow for black glass */
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.6),
      0 12px 25px rgba(0, 0, 0, 0.4),
      0 6px 12px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(255, 255, 255, 0.05) !important;

    /* Smooth animation */
    animation: dropdownAppear 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

  /* Also target any nested elements that might have white backgrounds */
  :global(.dashboard-dropdown *) {
    background-color: transparent !important;
  }

  @keyframes dropdownAppear {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .dashboard-header {
    /* Header section with subtle gradient */
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.02) 100%
    );
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: relative;
  }

  .dashboard-connection-dot {
    /* Visual connection to the avatar */
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(139, 92, 246, 0.4));
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  .dashboard-menu-item {
    /* Menu item styling */
    border-radius: 12px; /* rounded-xl */
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .dashboard-menu-item:hover {
    background: rgba(255, 255, 255, 0.08); /* Subtle white overlay on black */
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transform: translateX(4px);
  }

  .dashboard-menu-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.8), transparent);
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  .dashboard-menu-item:hover::before {
    transform: scaleY(1);
  }

  /* Glass texture effects for dropdown */
  :global(.dashboard-dropdown::before) {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    border-radius: 20px 20px 0 0;
    z-index: 1;
  }

  :global(.dashboard-dropdown::after) {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    bottom: 0;
    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    border-radius: 20px 0 0 20px;
    z-index: 1;
  }

  /* Enhanced glass reflection effects for trigger */
  .dashboard-trigger-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    border-radius: 51px 51px 0 0;
    z-index: 1;
  }

  /* Smooth transition for avatar scale */
  .dashboard-trigger-btn img {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
