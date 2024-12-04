<script>
  import { applyAction, enhance } from '$app/forms';
  import Logo from '$lib/Logo.svelte';
  import { toast } from 'svelte-sonner';

  let loading = false;
  export let form;

  $: if (form?.error) {
    toast.error(form.error);
  }
</script>

<section
  class="flex flex-col items-center justify-center w-full max-w-[1235px] max-md:px-5 max-md:mt-10 mt-20"
>
  <form
    method="POST"
    class="flex flex-col w-[60%] max-md:w-[90%] mx-auto"
    use:enhance={() => {
      loading = true;

      return async ({ result }) => {
        await applyAction(result);

        if (result.type === 'redirect') {
          toast.success('login successful');
        }
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

    <div class="flex flex-col gap-2 mt-4 font-medium">
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
      Already have an account?
      <a href="/sign-in" class="font-semibold text-neutral-400 hover:text-[#0b383c]">Sign In</a>
    </div>

    <button
      type="submit"
      class="w-full py-4 mt-8 font-light text-white bg-teal-900 rounded-full"
      disabled={loading}
    >
      {loading ? 'Signing up...' : 'Sign up'}
    </button>

    <label class="flex w-full gap-2 mx-auto mt-6 text-sm font-light align-start max-md:mt-2">
      <input type="checkbox" name="rememberMe" />
      Remember me
    </label>
  </form>
</section>
