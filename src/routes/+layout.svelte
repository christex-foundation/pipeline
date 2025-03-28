<script>
  import SearchModal from '$lib/SearchModal.svelte';

  import './app.css';
  import Nav from '$lib/Nav.svelte';
  import Footer from '$lib/Footer.svelte';
  import { page } from '$app/stores';
  import { Toaster } from 'svelte-sonner';
  

  export let data;
</script>

<Toaster richColors position="top-right" closeButton />

<div class="w-full min-h-screen bg-white">
  <SearchModal />
  {#if $page.url.pathname !== '/sign-in' && $page.url.pathname !== '/sign-up'}
    <Nav {data} />
  {/if}

  <slot />

  {#if $page.url.pathname !== '/sign-in' && $page.url.pathname !== '/sign-up'}
    <Footer />
  {/if}
</div>
