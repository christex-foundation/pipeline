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
  class="flex flex-col justify-center items-center px-10 py-5 mb-5 rounded-[37px] max-md:px-5 max-md:mt-10"
>

  <section
  class="flex items-center justify-between gap-5 w-full max-w-[1080px] mt-12 mb-10 px-5 max-lg:mt-4 max-lg:gap-2 max-md:mt-[-15px]"
>


  <h1 class="text-4xl font-semibold text-black max-md:text-2xl">
    Username
  </h1>
  <a
    href="/profile"
    class="flex items-center gap-2 px-4 py-2 text-lg border-2 rounded-full text-lime-800 bg-lime-200 border-lime-800 max-md:text-sm max-md:py-1 max-md:px-3"
  >
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/64135a94b56ce48af9a1c4223db4ad995409393478b6a070980d63978b32c01e"
      alt=""
      class="w-6 h-6 shrink-0 max-md:w-4 max-md:h-4"
    />
    <span>View Profile</span>
  </a>
</section>


  <section class="w-full mb-12 max-lg:mb-2">
    <div
      class="flex justify-center items-center px-10 py-5 mt-5 bg-white rounded-[37px] gap-6 space-x-28 max-w-[1080px] mx-auto 
      max-md:w-[90%] max-md:space-x-0 max-md:space-y-4"
    >
      {#each navItems as navItem}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="flex items-center self-center justify-center mx-2 transition-all duration-300 ease-in-out border-b-4 cursor-pointer pb-02"
          class:selected={activeNavItem === navItem.id}
          class:border-b-4={activeNavItem === navItem.id}
          on:click={() => (activeNavItem = navItem.id)}
          style="min-width: 134px; border-color: #d1ea9a"
        >

          <Icon icon={navItem.icon} class="text-2xl" />
          <span class="text-2xl text-center max-md:text-base">{navItem.label}</span>
        </div>
      {/each}
    </div>
  </section>
  
  <section
  class="flex overflow-hidden flex-col items-center mt-5 max-w-full w-[82%] max-md:mt-10 max-lg:w-full"
>
  {#if activeNavItem === "Profile"}
    <div class="flex flex-row w-full gap-5 max-lg:flex-col">
      <ProfileForm />
      <ProfileLinks />
    </div>
    <button
      type="submit"
      class="self-end mt-[47px] px-[29.89px] py-6 bg-[#516027] rounded-[127.56px] text-[#ebebeb] text-xl font-medium font-['Inter'] leading-[32.91px] max-lg:self-end max-lg:w-[30%] max-lg:text-sm max-md:w-[50%]"
    >
      save & continue
    </button>
  {:else if activeNavItem === "Settings"}
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
