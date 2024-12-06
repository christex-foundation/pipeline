<script>
  import ProjectBasics from '../ProjectBasics.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';

  let loading = false;
</script>

<div class="w-full bg-[#d1ea9a]/90 py-16 mb-10">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-[#08292c] text-[45.43px] font-semibold font-['Inter'] leading-[54.51px]">
      Create a Project
    </h1>
  </div>
</div>

<form
  action=""
  method="post"
  enctype="multipart/form-data"
  use:enhance={() => {
    return async ({ result }) => {
      loading = true;

      if (result.type === 'failure') {
        toast.warn(result?.data?.error || 'could not create project');
      } else if (result.type === 'error') {
        toast.error('could not create a project');
      }

      toast.success('project has been created successfully');
      loading = false;
      await applyAction(result);
    };
  }}
>
  <div
    class="flex flex-row justify-center items-start gap-10 px-10 py-5 rounded-[37px] max-md:flex-col max-md:gap-5 max-md:px-5 max-md:mt-10 flex-wrap"
  >
    <!-- Left Section: Project Basics -->
    <section class="flex flex-col flex-1 w-full max-w-[600px]">
      <div class="p-4 border shadow-md bg-neutral-50 border-neutral-100 rounded-xl">
        <h2 class="mb-4 text-2xl font-semibold text-black">Project Basics</h2>
        <ProjectBasics />
      </div>
    </section>

    <!-- Right Section: Links and Funding -->
    <section class="flex flex-col flex-1 w-full max-w-[600px] gap-10">
      <!-- Links Section -->
      <div class="p-4 border shadow-md bg-neutral-50 border-neutral-200 rounded-xl">
        <h2 class="mb-4 text-2xl font-semibold text-black">Links</h2>
        <div class="flex flex-col gap-4 p-2 bg-white">
          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="email"
              class="w-1/3 text-base font-semibold max-md:w-full max-md:items-left"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="github"
              class="w-1/3 text-base font-semibold max-md:w-full max-md:items-left"
            >
              Github
            </label>

            <input
              type="url"
              id="github"
              name="github"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="linkedin"
              class="w-1/3 text-base font-semibold max-md:w-full max-md:items-left"
            >
              LinkedIn
            </label>

            <input
              type="url"
              id="linkedin"
              name="linkedin"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="twitter"
              class="w-1/3 text-base font-semibold max-md:w-full max-md:items-left"
            >
              X
            </label>

            <input
              type="url"
              id="twitter"
              name="twitter"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="website"
              class="w-1/3 text-base font-semibold max-md:w-full max-md:items-left"
            >
              Website
            </label>

            <input
              type="url"
              id="website"
              name="website"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="other"
              class="w-1/3 text-base font-semibold max-md:w-full max-md:items-left"
            >
              Other
            </label>

            <input
              type="url"
              id="other"
              name="other"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
            />
          </div>
        </div>
      </div>

      <!-- Funding Section -->
      <div class="p-4 border shadow-md bg-neutral-50 border-neutral-200 rounded-xl">
        <h2 class="mb-4 text-2xl font-semibold text-black">Funding</h2>
        <div class="flex flex-col gap-6 p-2 bg-white">
          <div class="flex items-center w-full max-md:flex-col">
            <label
              for="fundingGoal"
              class="w-1/3 text-base font-semibold max-md:w-full max-md:items-left max-md:py-2"
            >
              Funding Goal
            </label>
            <input
              id="fundingGoal"
              type="number"
              name="funding_goal"
              min="0"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
            />
          </div>

          <hr class="my-4 border-neutral-300" />

          <div class="flex items-center max-md:flex-col">
            <label
              for="bankAccount"
              class="w-1/3 text-lg font-medium max-md:w-full max-md:items-left max-md:py-2"
            >
              Bank Account
            </label>
            <input
              id="bankAccount"
              name="bank_acct"
              type="number"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-center text-neutral-400">
            <hr class="flex-grow border-t-2 border-neutral-300" />
            <span class="px-4 text-lg font-medium">or</span>
            <hr class="flex-grow border-t-2 border-neutral-300" />
          </div>

          <div class="flex items-center max-md:flex-col">
            <label
              for="walletAddress"
              class="w-1/3 text-lg font-medium max-md:w-full max-md:items-left max-md:py-2"
            >
              Wallet Address
            </label>
            <input
              id="walletAddress"
              name="wallet_address"
              type="text"
              class="border border-lime-800 border-solid rounded-full px-6 py-2 w-2/3 max-w-lg min-h-[48px] focus:outline-none focus:border-[#0b383c] transition-colors duration-200 max-md:w-[100%]"
              aria-label="Wallet Address"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="flex justify-end mt-10 w-[83%] max-md:justify-center max-md:ml-8">
      <button
        type="submit"
        class="px-12 py-4 text-lg font-medium !bg-lime-800 text-white rounded-full max-md:px-8 max-md:py-3"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Project'}
      </button>
    </div>
  </div>
</form>
