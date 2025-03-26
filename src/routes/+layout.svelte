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

<div class="min-h-screen w-full bg-white">
  <SearchModal />
  <!-- temporary fix for the Nav & Footer component showing in the sign-in and sign-up pages -->
  {#if $page.url.pathname !== '/sign-in' && $page.url.pathname !== '/sign-up'}
    <Nav {data} />
  {/if}

  <slot />

  {#if $page.url.pathname !== '/sign-in' && $page.url.pathname !== '/sign-up'}
    <Footer />
  {/if}
</div>
