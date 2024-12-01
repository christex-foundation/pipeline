<script>
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import Logo from '$lib/Logo.svelte';
  import { ArrowLeft } from 'lucide-svelte';

  let loading = false;
  function goBack() {
    history.back();
  }

</script>

<section
  class="flex flex-col items-center justify-center w-full max-w-[1235px] max-md:px-5 max-md:mt-10 mt-20"
>
  <div class="w-[60%] max-md:w-[90%] mx-auto mb-6">
    <a
    href="#"
    on:click|preventDefault={goBack}
    class="flex items-center justify-center text-teal-900 hover:text-white hover:bg-teal-800 border-2 border-teal-800 transition-colors w-[150px] py-4 rounded-full"
  >
    <ArrowLeft class="w-5 h-5 mr-2" />
    <span class="font-medium">Back</span>
  </a>
  </div>

  <form method="POST" use:enhance class="w-[60%] max-md:w-[80%]">
    <div class="hidden mb-10 max-md:block">
      <Logo />
    </div>
    <h2 class="mb-2 text-4xl font-semibold">Sign in</h2>
    <p class="mb-8 opacity-50">Enter your info to sign in</p>
    <div class="flex flex-col gap-2 font-medium">
      <label for="email" class="block">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        class="w-full px-4 py-2 border border-black rounded-full"
        required
      />
    </div>

    <div class="flex flex-col gap-2 mt-6 font-medium">
      <label for="password" class="block">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        class="w-full px-4 py-2 border border-black rounded-full"
        required
      />
    </div>

    <div class="flex flex-wrap items-center justify-between w-full gap-6 mt-6 text-sm leading-none">
      Don't have an account?
      <a href="/sign-up" class="font-semibold text-neutral-400 hover:text-[#0b383c]">Sign Up</a>
    </div>

    <button
      type="submit"
      class="w-full py-3 mt-8 font-light text-white bg-teal-900 rounded-full"
      disabled={loading}
    >
      {loading ? 'Signing in...' : 'Sign in'}
    </button>

    <div class="flex flex-wrap items-center justify-between w-full gap-6 mt-6 text-sm leading-none">
      <label class="flex items-center gap-2 font-medium text-black">
        <input type="checkbox" name="rememberMe" />
        Remember me
      </label>
      <a href="#forgot-password" class="font-semibold text-neutral-400">Forgot Password?</a>
    </div>
  </form>
</section>
