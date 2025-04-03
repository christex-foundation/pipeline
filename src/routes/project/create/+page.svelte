<script>
  import ProjectBasics from '../ProjectBasics.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';

  import { goto } from '$app/navigation';

  let loading = false;
  let loadingMatchingDPGs = false;
  let project = { title: '', bio: '' };
  let matchProjects = [];

  async function fetchMatchingDPGs() {
    if (!project.title || !project.bio) return;
    loadingMatchingDPGs = true;
    try {
      const response = await fetch('/api/github/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: project.title, description: project.bio }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      matchProjects = data.matchProjects.data || [];
      loadingMatchingDPGs = false;
    } catch (error) {}
  }

  $: project.title && project.bio && fetchMatchingDPGs();
</script>

<div class="mb-10 w-full bg-[#d1ea9a]/90 py-16">
  <div class="mx-auto max-w-4xl text-center">
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
    loading = true;
    return async ({ result }) => {
      if (result.type === 'success' && result.data.redirectTo) {
        toast.success('project has been created successfully');
        goto(result.data.redirectTo);
      } else if (result.type === 'failure') {
        toast.warn(result?.data?.error || 'could not create project');
      } else if (result.type === 'error') {
        toast.error('could not create a project');
      } else {
        toast.success('project has been created successfully');
      }

      await applyAction(result);
      loading = false;
    };
  }}
>
  <div
    class="flex flex-row flex-wrap items-start justify-center gap-10 rounded-[37px] px-10 py-5 max-md:mt-10 max-md:flex-col max-md:gap-5 max-md:px-5"
  >
    <section class="flex w-full max-w-[600px] flex-1 flex-col">
      <div class="rounded-xl border border-neutral-100 bg-neutral-50 p-4 shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-black">Project Basics</h2>
        <ProjectBasics bind:project />
        <input type="hidden" name="matchedDPGs" value={JSON.stringify(matchProjects)} />
      </div>
    </section>

    <section class="flex w-full max-w-[600px] flex-1 flex-col gap-10">
      <div class="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-black">Links</h2>
        <div class="flex flex-col gap-4 bg-white p-2">
          <div class="mt-4 flex w-full justify-between max-md:flex-col">
            <Label for="email" class="text-base font-semibold ">Email</Label>

            <div class="w-2/3">
              <Input type="email" id="email" name="email" required />
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <Label for="github" class="text-base font-semibold">Github</Label>

            <div class="flex w-2/3 flex-col">
              <Input type="url" id="github" name="github" />
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
            <Label for="linkedin" class="text-base font-semibold">LinkedIn</Label>

            <div class="w-2/3">
              <Input type="url" id="linkedin" name="linkedin" />
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <Label for="twitter" class="text-base font-semibold">X</Label>

            <div class="w-2/3">
              <Input type="url" id="twitter" name="twitter" />
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <Label for="website" class="text-base font-semibold">Website</Label>

            <div class="w-2/3">
              <Input type="url" id="website" name="website" />
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between max-md:flex-col">
            <Label for="other" class="text-base font-semibold">Other</Label>

            <div class="w-2/3">
              <Input type="url" id="other" name="other" />
            </div>
          </div>
        </div>
      </div>

      <!-- Funding Section -->
      <div class="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md">
        <h2 class="mb-4 text-2xl font-semibold text-black">Funding</h2>
        <div class="flex flex-col gap-6 bg-white p-2">
          <div class="flex w-full items-center max-md:flex-col">
            <Label
              for="fundingGoal"
              class="max-md:items-left w-1/3 text-base font-semibold max-md:w-full max-md:py-2"
            >
              Funding Goal
            </Label>

            <div class="w-2/3">
              <Input id="fundingGoal" type="number" name="funding_goal" min="0" />
            </div>
          </div>

          <hr class="my-4 border-neutral-300" />

          <div class="flex items-center max-md:flex-col">
            <Label
              for="bankAccount"
              class="max-md:items-left w-1/3 text-lg font-medium max-md:w-full max-md:py-2"
            >
              Bank Account
            </Label>

            <div class="w-2/3">
              <Input id="bankAccount" name="bank_acct" type="number" />
            </div>
          </div>

          <div class="flex items-center justify-center text-neutral-400">
            <hr class="flex-grow border-t-2 border-neutral-300" />
            <span class="px-4 text-lg font-medium">or</span>
            <hr class="flex-grow border-t-2 border-neutral-300" />
          </div>

          <div class="flex items-center max-md:flex-col">
            <Label
              for="walletAddress"
              class="max-md:items-left w-1/3 text-lg font-medium max-md:w-full max-md:py-2"
            >
              Wallet Address
            </Label>

            <div class="w-2/3">
              <Input id="walletAddress" name="wallet_address" type="text" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="mt-10 flex w-[83%] justify-end max-md:ml-8 max-md:justify-center">
      <button
        type="submit"
        class="rounded-full bg-lime-800 px-12 py-4 text-lg font-medium text-white disabled:bg-gray-500 max-md:px-8 max-md:py-3"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create new Project'}
      </button>
    </div>
  </div>
</form>
