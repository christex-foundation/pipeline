<script>
  import ProfileInfo from '../../lib/ProfileInfo.svelte';
  import ProjectSection from '../../lib/ProjectSection.svelte';
  import { onMount } from 'svelte';

  let projects = [];
  let bookmarkProjects = [];
  let loading = true;
  let error = null;

  async function fetchMyProjects() {
    try {
      const response = await fetch('/api/projects/user/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      projects = data.projects;
    } catch (error) {
      console.log(error);
      error = e.message;
      alert(error);
    } finally {
      loading = false;
    }
  }

  async function fetchBookmarkedProjects() {
    try {
      const response = await fetch('/api/projects/user/bookmarks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      bookmarkProjects = data.projects;
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchMyProjects();
    fetchBookmarkedProjects();
  });
</script>

<!-- new code -->
<!-- container below to center the inner container -->
<div class="flex w-full items-start justify-center">
  <div
    class="mx-auto grid w-[90%] justify-center space-y-4 md:flex md:flex-row md:space-x-4 md:space-y-0"
  >
    <div class="h-max px-5 md:sticky md:w-1/3 md:px-0">
      <ProfileInfo />
    </div>

    <div class="md:w-2/3">
      {#if loading}
        <p>Loading projects...</p>
      {:else if error}
        <p>Error: {error}</p>
      {:else}
        <ProjectSection {projects} {bookmarkProjects} />
      {/if}
    </div>
  </div>
</div>
