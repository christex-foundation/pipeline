<script>
  import { page } from '$app/stores';
</script>

<!-- if the status code is "404" -->
{#if $page.status === 404}
  <div class="mt-16 flex flex-col items-center justify-center">
    <img
      loading="lazy"
      src="/404.png"
      alt="404"
      class="w-full object-cover md:h-[500px] md:w-[70%]"
    />
    <a
      href="/explore"
      class="w-[100px] rounded-lg bg-[#d1ea9a] px-4 py-2 text-center text-base font-semibold hover:bg-[#e1faac]"
    >
      Home
    </a>
  </div>
{/if}
