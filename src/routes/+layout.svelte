<script>
  import SearchModal from '$lib/SearchModal.svelte';

  import './app.css';
  import Nav from '$lib/Nav.svelte';
  import Footer from '$lib/Footer.svelte';
  import { page } from '$app/stores';
  import { setContext } from 'svelte';
  import NavigationProgress from '$lib/NavigationProgress.svelte';

  export let data;
  setContext('sharedData', data);

  
  
</script>

  <!-- Page load indicator -->
  <NavigationProgress />

<div class="w-full min-h-screen bg-white">
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
