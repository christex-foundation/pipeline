<script>
  import ProfileForm from '../../../lib/ProfileForm.svelte';
  import ProfileLinks from '../../../lib/ProfileLinks.svelte';
  import Settings from '../../../lib/Settings.svelte';
  import Interests from '../../../lib/Interests.svelte';
  import { Icon } from '@iconify/svelte';

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
      id: 'Links',
      label: 'Links',
      width: '184px',
      icon: 'ci:link',
    },
    {
      id: 'Interests',
      label: 'Interests',
      width: '184px',
      icon: 'uit:bag',
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
  class="flex flex-col justify-center items-center px-10 py-5 mb-5 bg-white rounded-[37px] max-md:px-5 max-md:mt-10"
>
  <section
    class="flex flex-wrap gap-5 justify-between self-center mt-20 w-full max-w-[1080px] max-md:mt-10 max-md:max-w-full mb-10"
  >
    <h1 class="font-semibold leading-none text-black text-4xl ml-[11%] max-md:text-4xl">
      Username
    </h1>
    <a
      href="/profile"
      class="flex gap-2.5 justify-center items-center self-start px-6 py-3.5 text-xl leading-none text-lime-800 bg-lime-200 border-2 border-lime-800 border-solid rounded-[50px] max-md:px-5 mr-10"
    >
      <Icon icon="mdi:person-outline" class="text-2xl" />
      <span class="self-stretch my-auto">View Profile</span>
    </a>
  </section>

  <section class="w-full mb-12">
    <div
      class="flex justify-center items-center px-10 py-5 mt-5 bg-white rounded-[37px] max-md:px-5 max-md:mt-10 space-x-24"
    >
      {#each navItems as navItem}
        <button
          type="button"
          class="flex items-center self-center justify-center mx-2 transition-all duration-300 ease-in-out cursor-pointer pb-02"
          class:selected={activeNavItem === navItem.id}
          class:border-b-4={activeNavItem === navItem.id}
          on:click={() => (activeNavItem = navItem.id)}
          style="min-width: 134px; border-color: #d1ea9a"
        >
          <Icon icon={navItem.icon} class="text-2xl" />
          <span class="text-2xl text-center">
            {navItem.label}
          </span>
        </button>
      {/each}
    </div>
  </section>

  <section class="flex overflow-hidden flex-col items-center mt-5 max-w-full w-[82%] max-md:mt-10">
    {#if activeNavItem === 'Profile'}
      <ProfileForm />
    {:else if activeNavItem === 'Links'}
      <ProfileLinks />
    {:else if activeNavItem === 'Interests'}
      <div class="w-[80%]">
        <h2 class="mb-4 text-xl text-black">Select 3 or more to continue</h2>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1">
          <div class="interests-section">
            <Interests
              title="Tech & Innovation"
              interests={techInterests}
              bind:selectedInterests={selectedTechInterests}
            />
          </div>

          <div class="interests-section">
            <Interests
              title="Creative Works"
              interests={creativeInterests}
              bind:selectedInterests={selectedCreativeInterests}
            />
          </div>

          <div class="interests-section">
            <Interests
              title="Community Projects"
              interests={communityProjects}
              bind:selectedInterests={selectedCommunityProjects}
              layout="grid"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        class="self-end mt-8 px-[29.89px] py-6 bg-[#516027] rounded-[127.56px] text-[#ebebeb] text-xl font-medium font-['Inter'] leading-[32.91px] ml-[10%]"
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
