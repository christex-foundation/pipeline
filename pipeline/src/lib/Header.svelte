<script>
  import UserProfile from "./UserProfile.svelte";
  export let data;
  
</script>

<div class="flex flex-col justify-center px-16 py-9 w-full text-xl tracking-tighter leading-none text-center text-lime-800 bg-cyan-950 max-md:px-5 max-md:max-w-full">
    <div class="flex flex-wrap gap-10 justify-between items-center max-md:max-w-full">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/c451c6adca6c2c7efc61903dcaae30f4daa8cc0e8fa202f26ee84d0bf868243b?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8" alt="Company logo" class="object-contain shrink-0 self-stretch my-auto aspect-[5.95] w-[184px]" />
      <nav class="flex flex-col self-stretch my-auto w-[168px]">
        {#if data.isAuthenticated}
        <a href="/signIn" class="px-4 py-4 bg-lime-300 rounded-3xl max-md:px-5">Sign up / Log in</a>
        <UserProfile />
        {:else}
        <a href="/signIn" class="px-4 py-4 bg-lime-300 rounded-3xl max-md:px-5">Sign up / Log in</a>
        {/if}
        
      </nav>
    </div>
</div>