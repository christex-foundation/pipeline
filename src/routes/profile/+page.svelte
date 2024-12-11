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
    class="w-[90%] mx-auto grid justify-center md:flex md:flex-row space-y-4 md:space-y-0 md:space-x-4"
  >
    <div class="px-5 md:px-0 md:w-1/3 md:sticky h-max">
      <ProfileInfo />
    </div>

    <div class="md:w-2/3">
      <ProjectSection {projects} {bookmarkProjects} />
    </div>
  </div>
</div>
