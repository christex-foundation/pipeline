<script>
  import { page } from '$app/stores';

  export let project;

  const getProjectLink = () => {
    if ($page.data.isAuthenticated) {
      return project.user_id === $page.data.user?.id
        ? `/project/${project.id}` // Owner's project link
        : `/project/${project.id}/contribute`; // Contributor's link
    }
    return '/sign-in';
  };

  const getButtonLabel = () => {
    if ($page.data.isAuthenticated) {
      return project.user_id === $page.data.user?.id ? 'View' : 'Contribute';
    }
    return 'Contribute';
  };
</script>

<a
  href={getProjectLink()}
  class="flex items-center justify-center w-full mt-5 text-xs font-medium leading-loose border border-solid whitespace-nowrap rounded-[48px] bg-cyan-950 border-teal-950 text-zinc-100"
>
  <span
    class="overflow-hidden gap-2 self-stretch px-7 py-3.5 my-auto rounded-3xl max-md:px-5 text-xl"
  >
    {getButtonLabel()}
  </span>
</a>

{#if !$page.data.isAuthenticated}
  <!-- We can implement Tooltip or additional message for unauthenticated users -->
  <p class="text-sm text-gray-400 mt-2">Please sign in to contribute.</p>
{/if}
