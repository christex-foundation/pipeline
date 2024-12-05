<script>
  export let data;
  export let projectTeam;
</script>

{#if projectTeam.length > 0}
  {#each projectTeam as member}
    <section
      class="mt-8 flex w-full max-w-[900px] flex-wrap items-center gap-6 max-md:mt-6 max-md:max-w-full"
    >
      <img
        src="/"
        class="my-auto flex h-[80px] w-[80px] shrink-0 gap-2 self-stretch rounded-full border-4 border-solid border-white bg-zinc-300"
        aria-label="Creator profile picture"
        alt=""
      />
      <div class="my-auto flex max-w-[calc(100%-140px)] flex-grow flex-col self-stretch">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-semibold leading-tight text-black">
            {member.userProfile.name}
          </h1>
          <span
            class="whitespace-nowrap rounded-full border border-solid border-lime-800 bg-lime-200 px-3 py-1 text-sm leading-none text-lime-800"
          >
            {member.creator_id === data.user.id ? 'Creator' : 'Member'}
          </span>
        </div>
        <p class="mt-2 text-sm leading-snug text-stone-500 max-md:max-w-full">
          {member.userProfile.bio}
        </p>
      </div>
      {#if data.isAuthenticated && member.creator_id === data.user.id}
        {#if member.creator_id === data.user.id}
          <button
            type="button"
            class="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
            disable
          >
            Remove
          </button>
        {:else if member.creator_id != data.user.id}
          <button
            type="button"
            class="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
          >
            Remove
          </button>
        {/if}
      {/if}
    </section>
  {/each}
{:else}
  <p>No team members</p>
{/if}

<!-- <section class="flex flex-wrap items-center gap-6 mt-8 w-full max-w-[900px] max-md:mt-6 max-md:max-w-full justify-between">

    <div class="flex items-center flex-grow gap-6">
      <div class="flex justify-around">
      <img src="/" class="flex-shrink-0 border-4 border-white bg-zinc-300 h-[80px] w-[80px] rounded-full" aria-label="teammate profile picture" alt=""></div>
      
   
      <div class="flex flex-col flex-grow mr-14">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-semibold text-black">Teammate</h1>
          <span class="px-3 py-1 text-sm border rounded-full border-lime-800 bg-lime-200 text-lime-800">Designer</span>
        </div>
        <p class="mt-2 text-sm text-stone-500">
          This will appear on your project page and must include your name, photo, and biography.
        </p>
      </div>
    <button type="button" class="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-full hover:bg-red-500">
      Delete
    </button>
  </div>
  </section> -->

<form class="mt-8 flex w-[93%] max-w-[900px] flex-col max-md:max-w-full">
  <div class="mb-6 flex w-full items-center space-x-4">
    <label for="email" class="w-1/3 text-base font-medium">Email / Username</label>
    <input
      type="email"
      id="email"
      class="h-12 flex-grow rounded-full border border-solid border-lime-800 px-4 text-base"
      required
    />
  </div>

  <div class="mb-6 flex w-full items-center space-x-4">
    <label for="title" class="w-1/3 text-base font-medium">Title</label>
    <input
      type="text"
      id="title"
      class="h-12 flex-grow rounded-full border border-solid border-lime-800 px-4 text-base"
      required
    />
  </div>

  <div class="mt-2 flex w-full flex-wrap items-center justify-end gap-3">
    <button
      type="submit"
      class="rounded-full bg-cyan-950 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-cyan-900"
    >
      Send Invitation
    </button>
  </div>
</form>
