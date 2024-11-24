<script>
  import { enhance } from '$app/forms';

  let loading = false;
</script>

<section class="basis-full flex items-center justify-center">
  <form method="POST" use:enhance>
    <h2 class="mb-2 text-4xl font-semibold">Sign in</h2>
    <p class="mb-8 opacity-50">Enter your info to sign in</p>
    <div class="flex flex-col gap-2 font-medium">
      <label for="email" class="block">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        class="w-full border border-black rounded-full px-4 py-2"
        required
      />
    </div>

    <div class="flex flex-col mt-6 gap-2 font-medium">
      <label for="password" class="block">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        class="w-full border border-black rounded-full px-4 py-2"
        required
      />
    </div>

    <button
      type="submit"
      class="py-3 mt-8 w-full font-light text-white bg-teal-900 rounded-full"
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

    <div class="flex items-center justify-center w-full gap-3 mt-6 text-md leading-none">
      <span class="font-medium text-black">
        Don't have an account?
      </span>
      <a href="/sign-up" class="text-teal-900 font-semibold"> Sign up </a>
    </div>
  </form>
</section>
