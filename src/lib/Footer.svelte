<script>
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
            <a href="/explore" class="transition-colors duration-300 hover:text-lime-400"
              >Explore projects</a
            >
          </li>
          <li>
            <a href="/resources/pipeline" class="transition-colors duration-300 hover:text-lime-400"
              >Learn about Pipeline</a
            >
          </li>
          <li>
            <a
              href="/resources/digital-public-good"
              class="transition-colors duration-300 hover:text-lime-400">Learn about DPGs</a
            >
          </li>
        </ul>
      </nav>
      <div class="mt-8">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8a9d626a26558aa008162b345030cccdf46fe165b4a4523e719564b8edace1f?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
          alt="Social media icon"
          class="w-8 h-8 sm:w-10 sm:h-10"
        />
      </div>
    </div>

    <hr class="my-8 border-opacity-50 border-lime-300 sm:my-10" />

    <div class="flex flex-col items-center justify-between text-sm sm:flex-row sm:text-base">
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
