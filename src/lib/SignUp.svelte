<script>
  export let name = '';
  export let email = '';
  export let password = '';
  export let loading = false;
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      dispatch('signUp', { name, email, password });
    } else {
      console.log('Form fields are missing data');
    }
  };

  let rememberMe = false;
</script>

<form on:submit={handleSubmit} class="flex w-full flex-col text-base">
  <h2 class="text-4xl font-semibold leading-none text-black">Register</h2>
  <p class="mb-4 opacity-50">Enter your Info to signup for Pipeline</p>
  <div class="flex w-full flex-col whitespace-nowrap font-medium text-black">
    <label for="name" class="max-md:max-w-full">Name</label>
    <input
      type="text"
      id="name"
      bind:value={name}
      class="mt-3 flex h-[40px] w-full rounded-full border border-solid border-black px-4"
      required
    />
  </div>

  <div class="mt-4 flex w-full flex-col whitespace-nowrap font-medium text-black">
    <label for="email" class="max-md:max-w-full">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      class="mt-3 flex h-[40px] w-full rounded-full border border-solid border-black px-4"
      required
    />
  </div>

  <div class="mt-4 flex w-full flex-col whitespace-nowrap font-medium text-black">
    <label for="password" class="max-md:max-w-full">Password</label>
    <input
      type="password"
      id="password"
      bind:value={password}
      class="mt-3 flex h-[40px] w-full rounded-full border border-solid border-black px-4"
      required
    />
  </div>

  <button
    type="submit"
    class="mt-8 h-[52px] w-full self-stretch rounded-full bg-teal-900 px-10 py-4 text-base font-light text-white"
    disabled={loading}
  >
    {loading ? 'Signing up...' : 'Sign up'}
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
  </div>
</form>

<div class="mt-10 flex w-full flex-col items-center gap-6">
  <p class="text-sm text-neutral-400">or continue with</p>

  <div class="mb-6 flex gap-4">
    <button class="rounded-full bg-teal-900 p-3">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/879dd3080c7bd34490beea474587e94f0faf9dc63499622616e98b3997258731?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
        alt="Social Icon"
        class="h-6 w-6"
      />
    </button>
    <button class="rounded-full bg-teal-900 p-3">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/1eef60ce512ca366df9b9bbaf2534ef3d07f36cd1005177c9fcb115bc7726767?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
        alt="Social Icon"
        class="h-6 w-6"
      />
    </button>
    <button class="rounded-full bg-teal-900 p-3">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/879dd3080c7bd34490beea474587e94f0faf9dc63499622616e98b3997258731?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
        alt="Social Icon"
        class="h-6 w-6"
      />
    </button>
    <button class="mt-2 w-auto rounded-full bg-lime-400 px-4 py-2 text-teal-900">
      Connect wallet
    </button>
  </div>
</div>
