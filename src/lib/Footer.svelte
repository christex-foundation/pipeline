<script>
  import Icon from '@iconify/svelte';
  import Logo from './Logo.svelte';
  const currentYear = new Date().getFullYear();

  // Partner logos data - you can replace these with actual partner information
  const partners = [
    {
      name: 'UNICEF',
      logo: '/unicef.png', // Replace with actual logo path
      url: 'https://www.unicef.org',
      alt: 'UNICEF Logo',
    },
    {
      name: 'Government of Sierra Leone | MoCTI',
      logo: '/mocti.png', // Replace with actual logo path
      url: 'https://www.gov.sl',
      alt: 'Government of Sierra Leone Logo',
    },
    // Add more partners as needed
  ];
</script>

<footer
  class="mt-16 border-t border-dashboard-gray-700 bg-dashboard-gray-900 py-12 text-gray-300 sm:py-16 lg:py-20"
>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center">
      <Logo />
      <nav class="mt-8 sm:mt-12 lg:mt-14">
        <ul
          class="flex flex-wrap justify-center gap-4 text-base sm:gap-6 sm:text-lg lg:gap-10 lg:text-xl"
        >
          <li>
            <a
              href="/explore"
              class="transition-colors duration-300 hover:text-dashboard-yellow-400"
            >
              Explore projects
            </a>
          </li>
          <li>
            <a
              href="/resources/pipeline"
              class="transition-colors duration-300 hover:text-dashboard-yellow-400"
            >
              Learn about Pipeline
            </a>
          </li>
          <li>
            <a
              href="https://www.digitalpublicgoods.net/standard"
              target="_blank"
              class="transition-colors duration-300 hover:text-dashboard-yellow-400"
              >Learn about DPGs</a
            >
          </li>
        </ul>
      </nav>

      <!-- Partners Section -->
      <div class="mt-8 sm:mt-10">
        <h3 class="mb-4 text-center text-sm font-medium text-gray-400 sm:text-base">
          Our Partners
        </h3>
        <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {#each partners as partner}
            <img
              src={partner.logo}
              alt={partner.alt}
              title={partner.name}
              class="h-10 w-auto object-contain opacity-60 transition-all duration-300 hover:opacity-100 sm:h-12"
              loading="lazy"
            />
          {/each}
        </div>
      </div>
    </div>

    <hr class="my-8 border-dashboard-gray-700 sm:my-10" />

    <div
      class="flex flex-col items-center justify-between text-sm max-md:flex-col sm:flex-row sm:text-base"
    >
      <p class="mb-4 text-gray-400 sm:mb-0">
        &copy; {currentYear} Pipeline Copyright and rights reserved
      </p>
      <div class="flex items-center">
        <a
          href="https://github.com/christex-foundation/pipeline"
          target="_blank"
          rel="noreferrer"
          class="flex items-center gap-2 text-gray-400 transition-colors duration-300 hover:text-dashboard-yellow-400"
        >
          <Icon icon="mdi:github" class="h-4 w-4" />
          View on GitHub
        </a>
        <a href="https://github.com/christex-foundation/pipeline">join</a>

      </div>
    </div>
  </div>
</footer>
