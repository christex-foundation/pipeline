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
        class="p-8 mb-6 border rounded-2xl border-dashboard-gray-700 bg-dashboard-gray-900/50 backdrop-blur-sm"
      >
        <div
          class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-dashboard-gray-800"
        >
          <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        <h3 class="mb-2 text-white text-heading-lg">No projects yet</h3>
        <p class="mb-6 text-gray-400 text-body-md">
          Start building something amazing! Create your first project and share it with the
          community.
        </p>

        <a href="/project/create">
          <button
            class="flex items-center justify-center gap-2 px-6 py-3 mx-auto font-medium text-white transition-all duration-200 focus-ring rounded-xl bg-dashboard-purple-500 text-label-lg hover:scale-105 hover:bg-dashboard-purple-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <p class="text-gray-500 text-body-sm">
        Need inspiration? <a
          href="/explore"
          class="transition-colors text-dashboard-yellow-400 hover:text-dashboard-yellow-300"
          >Browse existing projects</a
        >
      </p>
    </div>
  </div>
{/if}
