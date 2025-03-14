<script>
  import ProjectBasics from '../../ProjectBasics.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';

  export let data;
  const { project } = data;

  let loading = false;

  export let form;

  $: if (form?.error) {
    toast.error(form?.error);
  }
</script>

<div class="mb-10 w-full bg-[#d1ea9a]/90 py-16">
  <div class="mx-auto max-w-4xl text-center">
    <h2 class="font-['Inter'] text-[30.43px] font-semibold leading-[54.51px] text-[#08292c]">
      Edit Project - {project.title}
    </h2>
  </div>
</div>

<form
  action=""
  method="post"
  enctype="multipart/form-data"
  use:enhance={() => {
    loading = true;
    return async ({ result }) => {
      if (result.type === 'failure') {
        toast.warn(result?.data?.error || 'failed to edit project');
      } else if (result.type === 'error') {
        toast.error('could not update project');
      }

      toast.success('Project updated successfully');
      loading = false;
      await applyAction(result);
    };
  }}
>
  <input
    type="hidden"
    name="old_image"
    bind:value={project.image}
    class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
  />
  <input
    type="hidden"
    name="old_banner"
    bind:value={project.banner_image}
    class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
  />
  <div
    class="flex flex-row flex-wrap items-start justify-center gap-10 rounded-[37px] px-10 py-5 max-md:mt-10 max-md:flex-col max-md:gap-5 max-md:px-5"
  >
    <!-- Left Section: Project Basics -->
    <section class="flex w-full max-w-[600px] flex-1 flex-col">
      <div class="rounded-xl border border-neutral-100 bg-neutral-50 p-4 shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-black">Project Basics</h2>
        <ProjectBasics {project} />
      </div>
    </section>

    <!-- Right Section: Links and Funding -->
    <section class="flex w-full max-w-[600px] flex-1 flex-col gap-10">
      <!-- Links Section -->
      <div class="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-black">Links</h2>
        <div class="flex flex-col gap-4 bg-white p-2">
          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <label
              for="email"
              class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              bind:value={project.email}
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <label
              for="github"
              class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full"
            >
              Github
            </label>

            <div class="flex w-2/3 flex-col">
              <input
                type="url"
                id="github"
                name="github"
                bind:value={project.github}
                class="min-h-[48px] w-full max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
              />
              <p class="ml-5 mt-1 text-sm text-gray-600 max-md:w-[100%]">
                Follow <a
                  href="https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks"
                  target="_blank"
                  class="text-lime-800 underline">this guide</a
                >
                to add the
                <a
                  href="https://pipeline-tau.vercel.app/api/github/webhook"
                  target="_blank"
                  class="text-lime-800 underline">webhook.</a
                >
              </p>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <label
              for="linkedin"
              class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full"
            >
              LinkedIn
            </label>

            <input
              type="url"
              id="linkedin"
              name="linkedin"
              bind:value={project.linkedin}
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <label
              for="twitter"
              class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full"
            >
              X
            </label>

            <input
              type="url"
              id="twitter"
              name="twitter"
              bind:value={project.twitter}
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <label
              for="website"
              class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full"
            >
              Website
            </label>

            <input
              type="url"
              id="website"
              name="website"
              bind:value={project.website}
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <label
              for="other"
              class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full"
            >
              Other
            </label>

            <input
              type="url"
              id="other"
              name="other"
              bind:value={project.other}
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>
        </div>
      </div>

      <!-- Funding Section -->
      <div class="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-black">Funding</h2>
        <div class="flex flex-col gap-6 bg-white p-2">
          <div class="flex w-full items-center max-md:flex-col">
            <label
              for="fundingGoal"
              class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full max-md:py-2"
            >
              Funding Goal
            </label>
            <input
              id="fundingGoal"
              type="number"
              name="funding_goal"
              bind:value={project.funding_goal}
              min="0"
              class="min-h-[48px] w-2/3 max-w-lg rounded-full border border-solid border-lime-800 px-6 py-2 transition-colors duration-200 focus:border-[#0b383c] focus:outline-none max-md:w-[100%]"
            />
          </div>

          <hr class="my-4 border-neutral-300" />

          <div class="flex items-center max-md:flex-col">
            <label
              for="bankAccount"
              class="max-md:items-left w-1/3 text-lg font-medium max-md:w-full max-md:py-2"
            >
              Bank Account
            </label>
            <input
              id="bankAccount"
              name="bank_acct"
              type="number"
              bind:value={project.bank_acct}
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
              class="max-md:items-left w-1/3 text-lg font-medium max-md:w-full max-md:py-2"
            >
              Wallet Address
            </label>
            <input
              id="walletAddress"
              name="wallet_address"
              type="text"
              bind:value={project.wallet_address}
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
        class="text-whit rounded-full bg-lime-800 px-12 py-4 text-lg font-medium text-white disabled:bg-gray-500 max-md:px-8 max-md:py-3"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Project'}
      </button>
    </div>
  </div>
</form>
