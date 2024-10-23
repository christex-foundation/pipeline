<script>
    import Nav from '../../../lib/Nav.svelte';   
    import Footer from '../../../lib/Footer.svelte';
    import ProfileForm from '../../../lib/ProfileForm.svelte';
    import ProfileLinks from '../../../lib/ProfileLinks.svelte';
    import Settings from '../../../lib/Settings.svelte';
    import { onMount } from 'svelte';
    import UserNav from '../../../lib/UserNav.svelte';
    import Interests from '../../../lib/Interests.svelte';
    
    
    let loading = true;
    let error = null;
    let userProjects = [];
    let selectedTechInterests = [];
    let selectedCreativeInterests = [];
    let selectedCommunityProjects = [];
  
    let activeNavItem = 'Profile';
    const navItems = [
      { id: 'Profile', label: 'Profile', width: '184px', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/00eacd2e9203d40d579eb83c6c31b8c06134308627c218c88c9580bed4d5d7ef' },
      { id: 'Links', label: 'Links', width: '184px', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ff10f4c0c448ee5208fc4e0b90f38cc53d69a7eda9bd7dc84eb1e7c779e81c4b' },
      { id: 'Interests', label: 'Interests', width: '184px', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/09ba2f33466a78bf2d1e32dc9330bb0cc72747f64701080ac91f542e8459d18f' },
      { id: 'Settings', label: 'Settings', width: '184px', icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/2ecfa6fbb29ac713eea63adc3b16821ea9f1a98b868badda74b6497e863f76db' }
    ];
  

    let techInterests = [
    "Education",
    "Food & Beverages",
    "Energy / Green tech",
    "Health / Fitness",
    "Tech Startups",
    "Artificial Intelligence & Machine Learning",
    "Robotics",
    "Blockchain & Cryptocurrencies",
    "Cybersecurity",
    "Augmented Reality (AR) & Virtual Reality (VR)"
  ];

  let creativeInterests = [
    "Graphic Design",
    "Photography",
    "Video Production",
    "Music Production",
    "Writing & Storytelling",
    "Digital Art",
    "Fashion Design",
    "Creative Coding",
    "Animation",
    "User Experience (UX) Design"
  ];

  let communityProjects = [
    "Social Impact Initiatives",
    "Environmental Sustainability",
    "Education",
    "Local Development",
    "Health and Wellness",
    "Public Art Projects",
    "Crisis Response",
    "Civic Engagement",
    "Cultural Events"
  ];


  
    function handleNavChange(event) {
      activeNavItem = event.detail;
    }
  
    
  
  </script>
  
  <div class="w-full min-h-screen bg-white">
    <Nav />
    <main class="flex flex-col justify-center items-center px-10 py-5 mb-5 bg-white rounded-[37px] max-md:px-5 max-md:mt-10">
      <section class="flex flex-wrap gap-5 justify-between self-center mt-20 w-full max-w-[1080px] max-md:mt-10 max-md:max-w-full mb-10">
        <h1 class="text-6xl font-semibold leading-none text-black max-md:text-4xl">Username</h1>
        <a href="/profile" class="flex gap-2.5 justify-center items-center self-start px-6 py-3.5 text-2xl leading-none text-lime-800 bg-lime-200 border-2 border-lime-800 border-solid rounded-[50px] max-md:px-5">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/64135a94b56ce48af9a1c4223db4ad995409393478b6a070980d63978b32c01e" alt="" class="self-stretch object-contain w-6 my-auto shrink-0 aspect-square" />
          <span class="self-stretch my-auto">View Profile</span>
        </a>
      </section>

      <section class="w-full mb-12">
        <div class="flex justify-center mx-auto space-x-28">
          {#each navItems as navItem}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div 
              class="flex items-center self-center pb-2 mx-2 space-x-2 transition-all duration-300 ease-in-out cursor-pointer" 
              class:selected={activeNavItem === navItem.id}
              class:border-b-4={activeNavItem === navItem.id}
              on:click={() => activeNavItem = navItem.id}
              style="min-width: 184px; border-color: #516027"
            >
              <img 
                src={navItem.icon} 
                alt={navItem.label} 
                class="w-12 h-12" 
              />
              <span class="text-2xl text-center">
                {navItem.label}
              </span>
            </div>
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
            
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-1 ">
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
          <button type="submit" class="self-start mt-8 px-[59.89px] py-8 bg-[#516027] rounded-[127.56px] text-[#ebebeb] text-3xl font-medium font-['Inter'] leading-[32.91px] ml-[10%]">
            save & continue
          </button>
          {:else if activeNavItem === 'Settings'}
          <Settings />
          {/if}
     
      </section>
    </main>
  
    <Footer />
  </div>



  <style>
    div.selected {
      transform: scale(1.2); /* Enlarge the selected item */
      font-weight: bold; /* Optional: make text bold for the selected item */
    }
  </style>
  