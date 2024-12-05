<script>
  export let email = '';
  export let password = '';
  export let loading = false;
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch('signIn', { email, password });
    } else {
      console.log('Form fields are missing data');
    }
  };

  let rememberMe = false;
</script>

<form on:submit={handleSubmit} class="flex flex-col text-lg">
  <h2 class="mb-2 text-4xl font-semibold leading-none text-black">Sign in</h2>
  <p class="mb-8 opacity-50">Enter your Info to sign up</p>
  <div class="flex w-full flex-col whitespace-nowrap font-medium text-black">
    <label for="email" class="max-md:max-w-full">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      class="mt-3 flex h-[45px] w-full rounded-full border border-solid border-black px-4"
      required
    />
  </div>

  <div class="mt-6 flex w-full flex-col whitespace-nowrap font-medium text-black">
    <label for="password" class="max-md:max-w-full">Password</label>
    <input
      type="password"
      id="password"
      bind:value={password}
      class="mt-3 flex h-[45px] w-full rounded-full border border-solid border-black px-4"
      required
    />
  </div>

  <button
    type="submit"
    class="mt-8 h-[52px] w-full self-stretch rounded-full bg-teal-900 px-10 py-4 text-center text-base font-light text-white"
    disabled={loading}
  >
    {loading ? 'Signing in...' : 'Sign in'}
  </button>

  <div class="mt-6 flex w-full flex-wrap items-center justify-between gap-6 text-sm leading-none">
    <label class="flex items-center gap-2 font-medium text-black">
      <input
        type="checkbox"
        bind:checked={rememberMe}
        class="h-[18px] w-[18px] rounded-full border-2 border-black"
      />
      Remember me
    </label>
    <a href="#forgot-password" class="font-semibold text-neutral-400">Forgot Password?</a>
  </div>
</form>
