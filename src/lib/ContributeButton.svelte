<script>
  import { getContext } from 'svelte';
  const data = getContext('sharedData');
  export let project;

  const getProjectLink = () => {
    if (data?.isAuthenticated) {
      return project.user_id === data.user.id
        ? `/project/${project.id}`
        : `/project/${project.id}/contribute`; 
    }
    return '/sign-in'; 
  };

  const getButtonLabel = () => {
    if (data?.isAuthenticated) {
      return project.user_id === data.user.id ? 'View' : 'Contribute';
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

{#if !data?.isAuthenticated}
  <!-- We can implement Tooltip or additional message for unauthenticated users -->
  <p class="text-sm text-gray-400 mt-2">Please sign in to contribute.</p>
{/if}
