<script>
  import SearchModal from '$lib/SearchModal.svelte';

  import './app.css';
  import Nav from '$lib/Nav.svelte';
  import Footer from '$lib/Footer.svelte';
  import { Toaster } from 'svelte-sonner';

  export let data;

  $: pathname = data?.pathname ?? '';
  $: showChrome = pathname !== '/sign-in' && pathname !== '/sign-up';
</script>

<Toaster richColors position="top-right" closeButton />

<div class="min-h-screen w-full bg-dashboard-black">
  <SearchModal />
  {#if showChrome}
    <Nav {data} />
  {/if}

  <slot />

  {#if showChrome}
    <Footer />
  {/if}
</div>
