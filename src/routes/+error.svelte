<script>
  import { page } from '$app/stores';
</script>

<!-- if the status code is "404" -->
{#if $page.status === 404}
<div class="flex flex-col items-center justify-center mt-16">
  <img loading="lazy" src="/404.png" alt="404" class="object-cover w-full md:w-[70%] md:h-[500px]"/>
  <a
    href="/explore"
    class="bg-[#d1ea9a] hover:bg-[#e1faac] text-base font-semibold py-2 px-4 rounded-lg w-[100px] text-center">
    Home
  </a>
</div>
{/if}
