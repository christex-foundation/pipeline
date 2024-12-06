<script>
  import Icon from '@iconify/svelte';
  import Logo from './Logo.svelte';
</script>

<footer class="py-12 mt-16 text-lime-300 bg-teal-950 sm:py-16 lg:py-20">
  <div class="container px-4 mx-auto sm:px-6 lg:px-8">
    <div class="flex flex-col items-center">
      <Logo />
      <nav class="mt-8 sm:mt-12 lg:mt-14">
        <ul
          class="flex flex-wrap justify-center gap-4 text-base sm:gap-6 lg:gap-10 sm:text-lg lg:text-xl"
        >
          <li>
            <a href="/explore" class="transition-colors duration-300 hover:text-lime-400">
              Explore projects
            </a>
          </li>
          <li>
            <a
              href="/resources/pipeline"
              class="transition-colors duration-300 hover:text-lime-400"
            >
              Learn about Pipeline
            </a>
          </li>
          <li>
            <a
              href="/resources/digital-public-good"
              class="transition-colors duration-300 hover:text-lime-400">Learn about DPGs</a
            >
          </li>
        </ul>
      </nav>

      <Icon icon="prime:twitter" class="text-4xl text-lime-300 block mt-8" />
    </div>

    <hr class="my-8 border-opacity-50 border-lime-300 sm:my-10" />

    <div
      class="flex flex-col items-center justify-between text-sm sm:flex-row sm:text-base max-md:flex-col"
    >
      <p class="mb-4 sm:mb-0">© 2024 Pipeline Copyright and rights reserved</p>
      <div class="flex items-center">
        <a href="/terms" class="transition-colors duration-300 hover:text-lime-400"
          >Terms and Conditions</a
        >
        <span class="mx-2">·</span>
        <a href="/privacy" class="transition-colors duration-300 hover:text-lime-400"
          >Privacy Policy</a
        >
      </div>
    </div>
  </div>
</footer>
