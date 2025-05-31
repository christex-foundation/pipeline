<script>
  function navigateToNextSection() {
    const currentIndex = navSections.findIndex((section) => section.id === currentSection);
    if (currentIndex < navSections.length - 1) {
      const nextSection = navSections[currentIndex + 1];
      currentSection = nextSection.id;
      goto(nextSection.href);
    }
  }

  let email = '';

  const addTemaMember = async (event) => {
    try {
    } catch (error) {}
  };
</script>

<section
  class="mt-14 flex w-full max-w-[998px] flex-col text-3xl font-semibold leading-none text-black max-md:mt-10 max-md:max-w-full"
>
  <h2 class="mb-10 text-4xl">Add team member</h2>
  <form class="flex w-full flex-col whitespace-nowrap max-md:max-w-full">
    <div class="mb-10 flex flex-col">
      <label for="email" class="mb-5">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        class="flex min-h-[80px] w-full gap-2 rounded-[52px] border border-solid border-lime-800 px-8 max-md:max-w-full"
        required
      />
    </div>
    <button
      type="submit"
      class="my-auto min-w-[240px] gap-1 self-stretch rounded-[82px] bg-cyan-950 px-12 py-8 text-white max-md:max-w-full max-md:px-5"
    >
      Send Invitation
    </button>
  </form>
</section>
