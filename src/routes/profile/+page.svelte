<script>
  import ProjectSection from './ProjectSection.svelte';

  const bannerImg =
    'https://cdn.builder.io/api/v1/image/assets/TEMP/8030ec6426e85620456b5636b4a5396ca24f43b5e55a6739527e90baef3c9203?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8';
  const userImg = 'https://i.pinimg.com/474x/76/4d/59/764d59d32f61f0f91dec8c442ab052c5.jpg';

  export let data;
</script>

<main class="max-w-6xl mx-auto">
  <section class="min-h-80 mt-10">
    <div class="relative">
      <img src={bannerImg} alt="user profile banner" loading="lazy" class="h-56 w-full bg-center" />

      <div class="flex justify-between items-center">
        <img
          src={userImg}
          alt="user profile"
          loading="lazy"
          class="w-32 absolute inset-0 top-[65%] left-[10%] rounded-full border-4 border-white"
        />
        <a
          href="/profile"
          class="block w-fit ml-auto mt-4 mr-7 bg-lime-200 text-sm px-6 py-2 rounded-full"
        >
          Edit Profile
        </a>
      </div>
    </div>
  </section>

  <section class="px-3 mt-5">
    <div class="flex justify-between items-center">
      <h2 class="font-bold text-3xl">Username</h2>

      <p>Contribution points: <span class="font-semibold">30</span></p>
    </div>

    <p class="mt-4 font-light">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem ad ratione recusandae
      architecto voluptatibus at molestias asperiores iure magni facere. Architecto praesentium
      ipsum mollitia labore eos ut dolorem, officiis nostrum.
    </p>

    <div class="flex items-center justify-between">
      <!-- interests -->
      <div class="mt-5 flex items-center gap-5">
        <h4 class="font-semibold">Interests</h4>
        <div class="flex items-center gap-3">
          {#each ['Design', 'Engineering', 'Art'] as interest}
            <span class="text-sm border-2 rounded-full px-4 py-1 text-gray-700">{interest}</span>
          {/each}
        </div>
      </div>

      <!-- social media links -->
      <!-- to be removed in favor of adding icons -->
      <div class="flex items-center gap-4">
        <a href="/">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed41f92bba82baae689f0c6bf194e5e860148c6bf243751d8f5bad9269b52c35?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt="Social media icon"
            class="object-contain w-7"
          />
        </a>
        <a href="/">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7474ab52ea2bcf440a46f5fb1fad4298c0f23ee2d44508673fd6b829049e9898?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt="Social media icon"
            class="object-contain w-7"
          />
        </a>
        <a href="/">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ca4a0b2000221b9401e114cd438fa66ea601d926e01835174c44d0c7ee86b4f1?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt="Social media icon"
            class="object-contain shrink-0 self-stretch my-auto aspect-[0.97] w-[32px]"
          />
        </a>
        <a href="/">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7fed8ec7ff1d1bcef64eecc58e57b68fc276ad64ae9cc02199c523dd749c795?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt="Social media icon"
            class="object-contain w-7"
          />
        </a>
        <a href="/">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/59b522da565ee0cc67ef9a132ebe08bd8095a4d0b73228fb806cc3b20bf771fd?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt="Social media icon"
            class="object-contain w-7"
          />
        </a>
      </div>
    </div>

    <div class="flex items-center justify-between mt-10 *:text-sm gap-10">
      <a href="/project/create" class="bg-cyan-950 text-white rounded-full py-3 w-full text-center">
        Create Project
      </a>
      <a href="/explore" class="bg-lime-200 text-nowrap py-3 rounded-full w-[50%] text-center">
        Explore Projects
      </a>
    </div>
  </section>

  <ProjectSection projects={data.projects} />
</main>
