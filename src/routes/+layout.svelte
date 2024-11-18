<script>
  import './app.css';
  import Nav from '$lib/Nav.svelte';
  import Footer from '$lib/Footer.svelte';
  import { page } from '$app/stores'; // access the current page route

  export let data;
</script>

<div class="w-full min-h-screen bg-white">
  {#if $page.url.pathname !== '/sign-in'}
    <Nav {data} />
  {/if}

  <slot />

  {#if $page.url.pathname !== '/sign-in'}
    <Footer />
  {/if}
</div>
