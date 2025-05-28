<script>
  import ProjectBasics from '../ProjectBasics.svelte';
  import { applyAction, enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Separator } from '$lib/components/ui/separator';

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

  //$: project.title && project.bio && fetchMatchingDPGs();
</script>

<!-- Header Section -->
<div class="mb-12 w-full bg-[#d1ea9a]/90 py-20">
  <div class="mx-auto max-w-4xl px-4 text-center">
    <h1 class="mb-4 font-['Inter'] text-4xl font-semibold leading-tight text-[#08292c] md:text-5xl">
      Create a Project
    </h1>
    <p class="mx-auto max-w-2xl text-lg text-[#08292c]/80">
      Share your project with the world and start building your community
    </p>
  </div>
</div>

<!-- Main Form Container -->
<div class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
  <form
    action=""
    method="post"
    enctype="multipart/form-data"
    use:enhance={() => {
      loading = true;
      return async ({ result }) => {
        if (result.type === 'success' && result.data.redirectTo) {
          toast.success('Project has been created successfully');
          goto(result.data.redirectTo);
        } else if (result.type === 'failure') {
          toast.info(result?.data?.error || 'Could not create project');
        } else if (result.type === 'error') {
          toast.error('Could not create a project');
        } else {
          toast.success('Project has been created successfully');
        }

        await applyAction(result);
        loading = false;
      };
    }}
  >
    <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <!-- Left Column - Project Basics -->
      <div class="space-y-8">
        <Card class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <CardHeader
            class="border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-8"
          >
            <CardTitle class="text-3xl font-bold text-gray-900">Project Basics</CardTitle>
            <p class="mt-3 text-base text-gray-600">
              Tell us about your project and what makes it special
            </p>
          </CardHeader>
          <CardContent class="p-8">
            <ProjectBasics bind:project />
            <input type="hidden" name="matchedDPGs" value={JSON.stringify(matchProjects)} />
          </CardContent>
        </Card>
      </div>

      <!-- Right Column - Links & Funding -->
      <div class="space-y-8">
        <!-- Links Section -->
        <Card class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <CardHeader
            class="border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-8"
          >
            <CardTitle class="text-3xl font-bold text-gray-900">Links & Social</CardTitle>
            <p class="mt-3 text-base text-gray-600">
              Connect your project with social media and development platforms
            </p>
          </CardHeader>
          <CardContent class="p-8">
            <!-- Email -->
            <div class="space-y-3">
              <Label for="email" class="text-base font-semibold text-gray-800">
                Email Address *
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                required
                class="h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base focus:border-teal-500"
              />
              <p class="text-sm text-gray-500">Primary contact email for project communications</p>
            </div>

            <!-- GitHub -->
            <div class="mt-8 space-y-3">
              <Label for="github" class="text-base font-semibold text-gray-800">
                GitHub Repository
              </Label>
              <Input
                type="url"
                id="github"
                name="github"
                placeholder="https://github.com/username/repo"
                class="h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base focus:border-teal-500"
              />
              <p class="text-sm leading-relaxed text-gray-500">
                Follow
                <a
                  href="https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks"
                  target="_blank"
                  class="font-medium text-teal-600 underline hover:text-teal-800"
                >
                  this guide
                </a>
                to add the
                <a
                  href="https://pipeline-tau.vercel.app/api/github/webhook"
                  target="_blank"
                  class="font-medium text-teal-600 underline hover:text-teal-800"
                >
                  webhook
                </a>
                for automatic updates
              </p>
            </div>

            <!-- LinkedIn -->
            <div class="mt-8 space-y-3">
              <Label for="linkedin" class="text-base font-semibold text-gray-800">
                LinkedIn Profile
              </Label>
              <Input
                type="url"
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                class="h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base focus:border-teal-500"
              />
              <p class="text-sm text-gray-500">
                Professional profile for networking and credibility
              </p>
            </div>

            <!-- Twitter/X -->
            <div class="mt-8 space-y-3">
              <Label for="twitter" class="text-base font-semibold text-gray-800">
                X (Twitter) Profile
              </Label>
              <Input
                type="url"
                id="twitter"
                name="twitter"
                placeholder="https://x.com/username"
                class="h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base focus:border-teal-500"
              />
              <p class="text-sm text-gray-500">Share updates and engage with the community</p>
            </div>

            <!-- Website -->
            <div class="mt-8 space-y-3">
              <Label for="website" class="text-base font-semibold text-gray-800">Website</Label>
              <Input
                type="url"
                id="website"
                name="website"
                placeholder="https://yourwebsite.com"
                class="h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base focus:border-teal-500"
              />
              <p class="text-sm text-gray-500">Official project website or landing page</p>
            </div>

            <!-- Other -->
            <div class="mt-8 space-y-3">
              <Label for="other" class="text-base font-semibold text-gray-800">Other Link</Label>
              <Input
                type="url"
                id="other"
                name="other"
                placeholder="https://other-platform.com"
                class="h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base focus:border-teal-500"
              />
              <p class="text-sm text-gray-500">Additional relevant link (Discord, Slack, etc.)</p>
            </div>
          </CardContent>
        </Card>

        <!-- Funding Section -->
        <Card class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <CardHeader
            class="border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-8"
          >
            <CardTitle class="text-3xl font-bold text-gray-900">Funding Goals</CardTitle>
            <p class="mt-3 text-base text-gray-600">
              Set your funding goals and payment preferences
            </p>
          </CardHeader>
          <CardContent class="p-8">
            <!-- Funding Goal -->
            <div class="space-y-3">
              <Label for="fundingGoal" class="text-base font-semibold text-gray-800">
                Funding Goal (USD)
              </Label>
              <Input
                id="fundingGoal"
                type="number"
                name="funding_goal"
                min="0"
                step="1"
                placeholder="10000"
                class="h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base focus:border-teal-500"
              />
              <p class="text-sm leading-relaxed text-gray-500">
                Set a realistic funding target for your project (minimum $100)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-16 flex justify-center">
      <Button
        type="submit"
        disabled={loading}
        class="h-12 rounded-xl bg-teal-600 px-8 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-teal-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-teal-600"
      >
        {loading ? 'Creating Project...' : 'Create Project'}
      </Button>
    </div>
  </form>
</div>
