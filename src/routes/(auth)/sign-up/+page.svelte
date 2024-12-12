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
  class="mt-20 flex w-full max-w-[1235px] flex-col items-center justify-center max-md:mt-10 max-md:px-5"
>
  <form
    method="POST"
    class="mx-auto flex w-[60%] flex-col max-md:w-[90%]"
    use:enhance={() => {
      loading = true;

      return async ({ result }) => {
        if (result.type === 'redirect') {
          toast.success('login successful');
        }

        await applyAction(result);
        loading = false;
      };
    }}
  >
    <div class="mb-10 hidden max-md:block">
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
        class="w-full rounded-full border border-black px-4 py-2"
        required
      />
    </div>

    <div class="mt-4 flex flex-col gap-2 font-medium">
      <label for="email" class="block">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        class="w-full rounded-full border border-black px-4 py-2"
        required
      />
    </div>

    <div class="mt-4 flex flex-col gap-2 font-medium">
      <label for="password" class="block">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        class="w-full rounded-full border border-black px-4 py-2"
        required
      />
    </div>

    <div class="mt-6 flex w-full flex-wrap items-center justify-between gap-6 text-sm leading-none">
      Already have an account?
      <a href="/sign-in" class="font-semibold text-neutral-400 hover:text-[#0b383c]">Sign In</a>
    </div>

    <button
      type="submit"
      class="mt-8 w-full rounded-full bg-teal-900 py-4 font-light text-white"
      disabled={loading}
    >
      {loading ? 'Signing up...' : 'Sign up'}
    </button>

    <label class="align-start mx-auto mt-6 flex w-full gap-2 text-sm font-light max-md:mt-2">
      <input type="checkbox" name="rememberMe" />
      Remember me
    </label>
  </form>
</section>
