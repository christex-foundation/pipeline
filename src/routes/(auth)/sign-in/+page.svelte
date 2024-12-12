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

<section class="flex basis-full items-center justify-center">
  <form
    method="POST"
    class="w-[60%] max-md:w-[80%]"
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
    <h2 class="mb-2 text-4xl font-semibold">Sign in</h2>
    <p class="mb-8 opacity-50">Enter your info to sign in</p>
    <div class="flex flex-col gap-2 font-medium">
      <label for="email" class="block">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        class="w-full rounded-full border border-black px-4 py-2"
        required
      />
    </div>

    <div class="mt-6 flex flex-col gap-2 font-medium">
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
      Don't have an account?
      <a href="/sign-up" class="font-semibold text-neutral-400 hover:text-[#0b383c]">Sign Up</a>
    </div>

    <button
      type="submit"
      class="mt-8 w-full rounded-full bg-teal-900 py-3 font-light text-white disabled:bg-gray-500"
      disabled={loading}
    >
      {loading ? 'Signing in...' : 'Sign in'}
    </button>

    <div class="mt-6 flex w-full flex-wrap items-center justify-between gap-6 text-sm leading-none">
      <label class="flex items-center gap-2 font-medium text-black">
        <input type="checkbox" name="rememberMe" />
        Remember me
      </label>
      <a href="#forgot-password" class="font-semibold text-neutral-400">Forgot Password?</a>
    </div>
  </form>
</section>
