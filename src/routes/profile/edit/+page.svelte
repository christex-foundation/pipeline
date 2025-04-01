<script>
  import ProfileForm from '$lib/ProfileForm.svelte';
  import ProfileLinks from '$lib/ProfileLinks.svelte';
  import Settings from '$lib/Settings.svelte';
  import Interests from '$lib/Interests.svelte';
  import Icon from '@iconify/svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Textarea } from '$lib/components/ui/textarea';

  let selectedTechInterests = [];
  let selectedCreativeInterests = [];
  let selectedCommunityProjects = [];

  let activeNavItem = 'Profile';
  let loading = false;
  export let data;
  let user = data.user;
  const navItems = [
    {
      id: 'Profile',
      label: 'Profile',
      width: '184px',
      icon: 'proicons:person-2',
    },
    {
      id: 'Settings',
      label: 'Settings',
      width: '184px',
      icon: 'mdi:cog-outline',
    },
  ];

  let techInterests = [
    'Education',
    'Food & Beverages',
    'Energy / Green tech',
    'Health / Fitness',
    'Tech Startups',
    'Artificial Intelligence & Machine Learning',
    'Robotics',
    'Blockchain & Cryptocurrencies',
    'Cybersecurity',
    'Augmented Reality (AR) & Virtual Reality (VR)',
  ];

  let creativeInterests = [
    'Graphic Design',
    'Photography',
    'Video Production',
    'Music Production',
    'Writing & Storytelling',
    'Digital Art',
    'Fashion Design',
    'Creative Coding',
    'Animation',
    'User Experience (UX) Design',
  ];

  let communityProjects = [
    'Social Impact Initiatives',
    'Environmental Sustainability',
    'Education',
    'Local Development',
    'Health and Wellness',
    'Public Art Projects',
    'Crisis Response',
    'Civic Engagement',
    'Cultural Events',
  ];

  function handleNavChange(event) {
    activeNavItem = event.detail;
  }
</script>

<main class="flex w-full flex-col items-center justify-center">
  <section class="mx-auto mb-12 w-4/5 max-w-6xl max-lg:mb-2">
    <div
      class="mx-auto mt-5 flex items-center justify-center gap-6 space-x-28 rounded-[37px] bg-white px-10 py-5
      max-md:w-full max-md:space-x-0 max-md:space-y-4"
    >
      {#each navItems as navItem}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="pb-02 mx-2 flex cursor-pointer items-center justify-center self-center border-b-4 transition-all duration-300 ease-in-out"
          class:selected={activeNavItem === navItem.id}
          class:border-b-4={activeNavItem === navItem.id}
          on:click={() => (activeNavItem = navItem.id)}
          style="min-width: 134px; border-color: #d1ea9a"
        >
          <Icon icon={navItem.icon} class="text-2xl" />
          <span class="text-center text-2xl max-md:text-base">{navItem.label}</span>
        </div>
      {/each}
    </div>
  </section>

  <section class="mx-auto w-4/5 max-w-6xl max-lg:w-[90%] max-md:mt-10">
    {#if activeNavItem === 'Profile'}
      <form
        action="?/updateProfile"
        method="POST"
        class="flex w-full flex-col items-center"
        enctype="multipart/form-data"
        use:enhance={() => {
          return async ({ result }) => {
            loading = true;
            if (result.type === 'failure') {
              toast.warn(result?.data?.error || 'failed to edit profile');
            } else if (result.type === 'error') {
              toast.error('could not update profile');
            }
            toast.success('Profile updated successfully');
            loading = false;
            await applyAction(result);
          };
        }}
      >
        <div class="flex w-full flex-row gap-5 max-lg:flex-col">
          <div class="w-full flex-1 max-lg:w-full">
            <ProfileForm {user} />
          </div>
          <div class="w-full flex-1 max-lg:w-full">
            <ProfileLinks {user} />
          </div>
        </div>

        <div class="mt-10 flex w-full justify-between">
          <section class="flex items-center">
            <a
              href="/profile"
              class="flex h-[50px] items-center justify-center gap-2 rounded-3xl border-2 border-lime-800 bg-lime-200 px-4 py-2 text-lg text-lime-800 max-md:px-3 max-md:py-1 max-md:text-sm"
            >
              <Icon icon="mdi-light:chevron-left" class="text-2xl" />
              <span>Back</span>
            </a>
          </section>

          <Button
            type="submit"
            class="rounded-full !bg-lime-800 px-12 py-4 text-lg font-medium text-white disabled:bg-gray-500 max-md:px-8 max-md:py-3"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    {:else if activeNavItem === 'Settings'}
      <Settings />
    {/if}
  </section>
</main>

<style>
  .selected {
    transform: scale(1.1);
    font-weight: bold;
  }
</style>
