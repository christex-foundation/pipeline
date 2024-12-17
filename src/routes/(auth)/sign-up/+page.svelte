<script>
  import { applyAction, enhance } from '$app/forms';
  import Logo from '$lib/Logo.svelte';
  import { toast } from 'svelte-sonner';
  import Icon  from '@iconify/svelte';
  
  let loading = false;
  export let form;
  let passwordVisible = false;

  $: if (form?.error) {
    toast.error(form.error);
  }

  function goBack() {
    history.back();
  }

  function togglePasswordVisibility() {
    passwordVisible = !passwordVisible;
  }

</script>

<section
  class="flex flex-col items-center justify-center w-full max-w-[1235px] max-md:px-5 max-md:mt-10 mt-20"
>
<div class="absolute top-4 left-4">
  <button
    on:click={goBack}
    class="p-2 flex items-center justify-center text-teal-900 hover:text-white hover:bg-teal-800 border-2 border-gray-200 transition-colors w-[150px] sm:w-auto py-4 sm:py-2 rounded-full"
  >
    <Icon icon="material-symbols:arrow-back-ios-new-rounded" class="w-4 h-4 text-gray-200 mr-1" />
    <span class="hidden md:inline text-gray-200">Back</span>
  </button>
</div>

  <form
    method="POST"
    class="flex flex-col w-[60%] max-md:w-[90%] mx-auto"
    use:enhance={() => {
      loading = true;

      return async ({ result }) => {
        if (result.type === 'redirect') {
          toast.success('Sign up successful');
        }

        await applyAction(result);
        loading = false;
      };
    }}
  >
    <div class="hidden mb-10 max-md:block">
      <Logo />
    </div>
    <h2 class="mb-2 text-4xl font-semibold">Register</h2>
    <p class="mb-4 opacity-50">Enter your Info to signup for Pipeline</p>
    <div class="flex flex-col gap-2 font-medium">
      <label for="name" class="block">Name</label>
      <input
        type="text"
        id="name"
        name="name"
        class="w-full px-4 py-2 border border-black rounded-full"
        required
      />
    </div>

    <div class="flex flex-col gap-2 mt-4 font-medium">
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
      <div class="relative">
        <input
          type={passwordVisible ? 'text' : 'password'}
          id="password"
          name="password"
          class="w-full px-4 py-2 border border-black rounded-full"
          required
        />
        <button
          type="button"
          on:click={togglePasswordVisibility}
          class="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {#if passwordVisible}
            <Icon icon="majesticons:eye-off" class="w-6 h-6" />
          {:else}
            <Icon icon="ooui:eye" class="w-6 h-6" />
          {/if}
      </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between w-full gap-6 mt-6 text-sm leading-none">
      Already have an account?
      <a href="/sign-in" class="font-semibold text-neutral-400 hover:text-[#0b383c]">Sign In</a>
    </div>

    <button
      type="submit"
      class="w-full py-3 mt-8 font-light text-white bg-teal-900 rounded-full disabled:bg-gray-500"
      disabled={loading}
    >
      {loading ? 'Signing up...' : 'Sign Up'}
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
