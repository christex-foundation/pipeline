<script>
  import ProfileForm from '../../../lib/ProfileForm.svelte';
  import ProfileLinks from '../../../lib/ProfileLinks.svelte';
  import Settings from '../../../lib/Settings.svelte';
  import Interests from '../../../lib/Interests.svelte';
  import Icon from '@iconify/svelte';

  let selectedTechInterests = [];
  let selectedCreativeInterests = [];
  let selectedCommunityProjects = [];

  let activeNavItem = 'Profile';
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

<main
  class="mb-5 flex flex-col items-center justify-center rounded-[37px] px-10 py-5 max-md:mt-10 max-md:px-5"
>
  <section
    class="mb-10 mt-12 flex w-full max-w-[1080px] items-center justify-between gap-5 px-5 max-lg:mt-4 max-lg:gap-2 max-md:mt-[-15px]"
  >
    <h1 class="text-4xl font-semibold text-black max-md:text-2xl">Username</h1>
    <a
      href="/profile"
      class="flex items-center gap-2 rounded-full border-2 border-lime-800 bg-lime-200 px-4 py-2 text-lg text-lime-800 max-md:px-3 max-md:py-1 max-md:text-sm"
    >
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/64135a94b56ce48af9a1c4223db4ad995409393478b6a070980d63978b32c01e"
        alt=""
        class="h-6 w-6 shrink-0 max-md:h-4 max-md:w-4"
      />
      <span>View Profile</span>
    </a>
  </section>

  <section class="mb-12 w-full max-lg:mb-2">
    <div
      class="mx-auto mt-5 flex max-w-[1080px] items-center justify-center gap-6 space-x-28 rounded-[37px] bg-white px-10 py-5
      max-md:w-[90%] max-md:space-x-0 max-md:space-y-4"
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

  <section
    class="mt-5 flex w-[82%] max-w-full flex-col items-center overflow-hidden max-lg:w-full max-md:mt-10"
  >
    {#if activeNavItem === 'Profile'}
      <div class="flex w-full flex-row gap-5 max-lg:flex-col">
        <ProfileForm />
        <ProfileLinks />
      </div>
      <button
        type="submit"
        class="mt-[47px] self-end rounded-[127.56px] bg-[#516027] px-[29.89px] py-6 font-['Inter'] text-xl font-medium leading-[32.91px] text-[#ebebeb] max-lg:w-[30%] max-lg:self-end max-lg:text-sm max-md:w-[50%]"
      >
        save & continue
      </button>
    {:else if activeNavItem === 'Settings'}
      <Settings />
    {/if}
  </section>
</main>

<style>
  button.selected {
    transform: scale(1.1);
    font-weight: bold;
  }
</style>
