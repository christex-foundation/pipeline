<script>
  import ProjectBasics from '../../ProjectBasics.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';

  export let data;
  const { project } = data;

  let loading = false;
  export let form;

  $: if (form?.error) {
    toast.error(form?.error);
  }

  let bannerImage = project.banner_image || null;
  let profileImage = project.image || null;

  function handleBannerUpload(event) {
    const file = event.target.files[0];
    if (file) {
      bannerImage = URL.createObjectURL(file);
    }
  }

  function handleProfileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      profileImage = URL.createObjectURL(file);
    }
  }
</script>

<div class="mb-10 w-full bg-[#d1ea9a]/90 py-16">
  <div class="max-w-4xl mx-auto text-center">
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
  <Input type="hidden" name="old_image" value={project.image} />
  <Input type="hidden" name="old_banner" value={project.banner_image} />
  <div
    class="flex flex-row flex-wrap items-start justify-center gap-10 px-10 py-5 max-md:mt-10 max-md:flex-col max-md:gap-5 max-md:px-5"
  >
    <section class="flex w-full max-w-[600px] flex-1 flex-col gap-10">
      <div class="p-4 border shadow-md rounded-xl border-neutral-200 bg-neutral-50">
        <h2 class="mb-4 text-2xl font-semibold text-black">Project Basics</h2>
        <ProjectBasics {project} />
      </div>
    </section>

    <section class="flex w-full max-w-[600px] flex-1 flex-col gap-10">
      <div class="p-4 border shadow-md rounded-xl border-neutral-200 bg-neutral-50">
        <h2 class="mb-4 text-2xl font-semibold text-black">Links</h2>
        <div class="flex flex-col gap-4 p-2 bg-white">
          <div class="flex justify-between w-full mt-4 max-md:flex-col">
            <Label for="email" class="text-base font-semibold">Email</Label>
            <div class="w-2/3 max-md:w-full">
              <Input type="email" id="email" name="email" value={project.email} />
            </div>
          </div>

          <div class="flex justify-between w-full mt-4 max-md:flex-col">
            <Label for="github" class="text-base font-semibold">Github</Label>
            <div class="w-2/3 max-md:w-full">
              <Input type="url" id="github" name="github" value={project.github} />
              <p class="mt-1 ml-1 text-sm text-gray-600">
                Follow <a
                  href="https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks"
                  target="_blank"
                  class="underline text-lime-800">this guide</a
                >
                to add the
                <a
                  href="https://pipeline-tau.vercel.app/api/github/webhook"
                  target="_blank"
                  class="underline text-lime-800">webhook.</a
                >
              </p>
            </div>
          </div>

          <div class="flex justify-between w-full mt-4 max-md:flex-col">
            <Label for="linkedin" class="text-base font-semibold">LinkedIn</Label>
            <div class="w-2/3 max-md:w-full">
              <Input type="url" id="linkedin" name="linkedin" value={project.linkedin} />
            </div>
          </div>

          <div class="flex justify-between w-full mt-4 max-md:flex-col">
            <Label for="twitter" class="text-base font-semibold">X</Label>
            <div class="w-2/3 max-md:w-full">
              <Input type="url" id="twitter" name="twitter" value={project.twitter} />
            </div>
          </div>

          <div class="flex justify-between w-full mt-4 max-md:flex-col">
            <Label for="website" class="text-base font-semibold">Website</Label>
            <div class="w-2/3 max-md:w-full">
              <Input type="url" id="website" name="website" value={project.website} />
            </div>
          </div>

          <div class="flex justify-between w-full mt-4 max-md:flex-col">
            <Label for="other" class="text-base font-semibold">Other</Label>
            <div class="w-2/3 max-md:w-full">
              <Input type="url" id="other" name="other" value={project.other} />
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 border shadow-md rounded-xl border-neutral-200 bg-neutral-50">
        <h2 class="mb-4 text-2xl font-semibold text-black">Funding</h2>
        <div class="flex flex-col gap-6 p-2 bg-white">
          <div class="flex justify-between w-full max-md:flex-col">
            <Label for="fundingGoal" class="text-base font-semibold">Funding Goal</Label>
            <div class="w-2/3 max-md:w-full">
              <Input
                id="fundingGoal"
                type="number"
                name="funding_goal"
                value={project.funding_goal}
                min="0"
              />
            </div>
          </div>

          <hr class="my-4 border-neutral-300" />

          <div class="flex justify-between w-full max-md:flex-col">
            <Label for="bankAccount" class="text-base font-semibold">Bank Account</Label>
            <div class="w-2/3 max-md:w-full">
              <Input id="bankAccount" name="bank_acct" type="number" value={project.bank_acct} />
            </div>
          </div>

          <div class="flex items-center justify-center text-neutral-400">
            <hr class="flex-grow border-t-2 border-neutral-300" />
            <span class="px-4 text-lg font-medium">or</span>
            <hr class="flex-grow border-t-2 border-neutral-300" />
          </div>

          <div class="flex justify-between w-full max-md:flex-col">
            <Label for="walletAddress" class="text-base font-semibold">Wallet Address</Label>
            <div class="w-2/3 max-md:w-full">
              <Input
                id="walletAddress"
                name="wallet_address"
                type="text"
                value={project.wallet_address}
                aria-label="Wallet Address"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="flex justify-end w-full mt-10 max-md:justify-center">
      <Button
        type="submit"
        class="px-12 py-4 text-lg font-medium text-white rounded-full bg-lime-800 disabled:bg-gray-500 max-md:px-8 max-md:py-3"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Project'}
      </Button>
    </div>
  </div>
</form>
