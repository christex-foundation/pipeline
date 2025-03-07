<script>
  import ProjectBasics from '../ProjectBasics.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';

  let loading = false;
</script>

<div class="mb-10 w-full bg-[#d1ea9a]/90 py-16">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="font-['Inter'] text-[45.43px] font-semibold leading-[54.51px] text-[#08292c]">
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
    class="flex flex-row flex-wrap items-start justify-center gap-10 rounded-[37px] px-10 py-5 max-md:mt-10 max-md:flex-col max-md:gap-5 max-md:px-5"
  >
 
    <section class="flex w-full max-w-[600px] flex-1 flex-col">
      <div class="p-4 border shadow-md rounded-xl border-neutral-100 bg-neutral-50">
        <h2 class="mb-4 text-2xl font-semibold text-black">Project Basics</h2>
        <ProjectBasics />
      </div>
    </section>

   
    <section class="flex w-full max-w-[600px] flex-1 flex-col gap-10">

      <div class="p-4 border shadow-md rounded-xl border-neutral-200 bg-neutral-50">
        <h2 class="mb-4 text-2xl font-semibold text-black">Links</h2>
        <div class="flex flex-col gap-4 p-2 bg-white">
          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="email"
              class="w-1/3 text-base font-semibold max-md:items-left max-md:w-full"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>
          

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="github"
              class="w-1/3 text-base font-semibold max-md:items-left max-md:w-full"
            >
              Github
            </label>
          
            <div class="flex flex-col w-2/3 ">
            <input
              type="url"
              id="github"
              name="github"
              class="min-h-[48px]  w-full max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
            <p class="text-sm text-gray-600 mt-1 max-md:w-[100%] ml-5">
              Follow <a href="https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks" target="_blank" class="underline text-lime-800">this guide</a> to add the 
              <a href="https://pipeline-tau.vercel.app/api/github/webhook" target="_blank" class="underline text-lime-800">webhook.</a> 
            </p>
          </div>
          </div>
        
          
          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="linkedin"
              class="w-1/3 text-base font-semibold max-md:items-left max-md:w-full"
            >
              LinkedIn
            </label>

            <input
              type="url"
              id="linkedin"
              name="linkedin"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="twitter"
              class="w-1/3 text-base font-semibold max-md:items-left max-md:w-full"
            >
              X
            </label>

            <input
              type="url"
              id="twitter"
              name="twitter"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="website"
              class="w-1/3 text-base font-semibold max-md:items-left max-md:w-full"
            >
              Website
            </label>

            <input
              type="url"
              id="website"
              name="website"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <div class="flex items-center justify-between mt-4 max-md:flex-col">
            <label
              for="other"
              class="w-1/3 text-base font-semibold max-md:items-left max-md:w-full"
            >
              Other
            </label>

            <input
              type="url"
              id="other"
              name="other"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>
        </div>
      </div>

      <!-- Funding Section -->
      <div class="p-4 border shadow-md rounded-xl border-neutral-200 bg-neutral-50">
        <h2 class="mb-4 text-2xl font-semibold text-black">Funding</h2>
        <div class="flex flex-col gap-6 p-2 bg-white">
          <div class="flex items-center w-full max-md:flex-col">
            <label
              for="fundingGoal"
              class="w-1/3 text-base font-semibold max-md:items-left max-md:w-full max-md:py-2"
            >
              Funding Goal
            </label>
            <input
              id="fundingGoal"
              type="number"
              name="funding_goal"
              min="0"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <hr class="my-4 border-neutral-300" />

          <div class="flex items-center max-md:flex-col">
            <label
              for="bankAccount"
              class="w-1/3 text-lg font-medium max-md:items-left max-md:w-full max-md:py-2"
            >
              Bank Account
            </label>
            <input
              id="bankAccount"
              name="bank_acct"
              type="number"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
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
              class="w-1/3 text-lg font-medium max-md:items-left max-md:w-full max-md:py-2"
            >
              Wallet Address
            </label>
            <input
              id="walletAddress"
              name="wallet_address"
              type="text"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
              aria-label="Wallet Address"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="mt-10 flex w-[83%] justify-end max-md:ml-8 max-md:justify-center">
      <button
        type="submit"
        class="rounded-full !bg-lime-800 px-12 py-4 text-lg font-medium text-white disabled:bg-gray-500 max-md:px-8 max-md:py-3"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Project'}
      </button>
    </div>
  </div>
</form>
