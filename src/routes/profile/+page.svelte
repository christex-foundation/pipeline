<script>
  import ProfileInfo from '$lib/ProfileInfo.svelte';
  import ProjectSection from '$lib/ProjectSection.svelte';

  export let data;
  let projects = data.allProjects || [];
  let bookmarkProjects = data.bookmarks || [];
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
      <ProjectSection {projects} contributed={data.contributed} {bookmarkProjects} />
    </div>
  </div>
</div>
