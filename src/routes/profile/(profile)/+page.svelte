<script>
  import Card from '$lib/Card.svelte';

  export let data;
</script>

{#if data.projects && data.projects.length > 0}
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#each data.projects as project}
      <Card {project} />
    {/each}
  </div>
{:else}
  <!-- Premium Empty State -->
  <div class="flex min-h-[400px] items-center justify-center">
    <div class="max-w-md text-center">
      <div
        class="mb-6 rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900/50 p-8 backdrop-blur-sm"
      >
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dashboard-gray-800"
        >
          <svg class="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        <h3 class="mb-2 text-heading-lg text-white">No projects yet</h3>
        <p class="mb-6 text-body-md text-gray-400">
          Start building something amazing! Create your first project and share it with the
          community.
        </p>

        <a href="/project/create">
          <button
            class="focus-ring mx-auto flex items-center justify-center gap-2 rounded-xl bg-dashboard-purple-500 px-6 py-3 text-label-lg font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-dashboard-purple-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Your First Project
          </button>
        </a>
      </div>

      <p class="text-body-sm text-gray-500">
        Need inspiration? <a
          href="/explore"
          class="text-dashboard-yellow-400 transition-colors hover:text-dashboard-yellow-300"
          >Browse existing projects</a
        >
      </p>
    </div>
  </div>
{/if}
