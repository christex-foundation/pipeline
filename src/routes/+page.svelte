<script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  export let data;

  // User avatars for the stats section
  const userAvatars = [
    'https://avatars.githubusercontent.com/u/165312202?v=4',
    'https://avatars.githubusercontent.com/u/97176661?v=4',
    'https://avatars.githubusercontent.com/u/14809642?v=4',
    'https://avatars.githubusercontent.com/u/61359802?v=4',
    'https://avatars.githubusercontent.com/u/113233530?v=4',
    'https://avatars.githubusercontent.com/u/106969604?v=4',
  ];
</script>

<svelte:head>
  <title>Pipeline - Empower the Future of Digital Public Goods</title>
  <meta
    name="description"
    content="Discover, contribute, and collaborate on open-source projects that drive social impact globally. Connect with a community of creators, contributors, and supporters passionate about digital public goods."
  />
</svelte:head>

<div class="min-h-screen bg-dashboard-black">
  <!-- Main Content Grid -->
  <main
    class="mx-auto grid max-w-[1400px] grid-cols-[1fr_1.2fr] grid-rows-[1fr_auto] px-8 pt-20 max-lg:grid-cols-1 max-lg:grid-rows-[auto_auto_auto] max-lg:p-4"
  >
    <!-- Left Content -->
    <section
      class="col-start-1 row-start-1 flex items-center py-16 pl-0 pr-8 max-lg:col-start-1 max-lg:row-start-1 max-lg:p-8 max-md:p-6"
    >
      <div class="max-w-[500px]">
        <h1
          class="mb-8 flex flex-wrap items-center gap-2 text-[3.5rem] font-bold leading-[1.1] text-white max-lg:text-[2.5rem] max-md:text-[2rem]"
        >
          Empower the Future of Digital Public Goods
        </h1>

        <p class="mb-12 text-lg leading-relaxed text-gray-300">
          Discover, contribute, and collaborate on open-source projects that drive social impact
          globally. Connect with a community of creators, contributors, and supporters passionate
          about digital public goods.
        </p>

        <a
          href="/explore"
          class="inline-flex items-center gap-2 rounded-full bg-dashboard-yellow-400 px-10 py-5 font-semibold text-dashboard-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-dashboard-yellow-500 hover:shadow-[0_10px_25px_rgba(250,204,21,0.3)]"
        >
          Explore Projects
          <Icon icon="lucide:arrow-right" class="h-5 w-5" />
        </a>
      </div>
    </section>

    <!-- Right Visual Section -->
    <section
      class="relative col-start-2 row-start-1 flex items-center justify-center max-lg:col-start-1 max-lg:row-start-2 max-lg:px-8 max-lg:py-12 max-md:px-4 max-md:py-8"
    >
      <div
        class="relative flex h-[600px] w-full items-center justify-center rounded-[30px] bg-gradient-to-br from-dashboard-gray-900 via-dashboard-gray-800 p-12 shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-lg:h-auto max-lg:bg-transparent max-lg:p-8 max-lg:shadow-none"
      >
        <div
          class="organic-shape relative h-[400px] w-[400px] bg-gradient-to-br from-dashboard-purple-500 via-dashboard-purple-600 to-dashboard-purple-700 shadow-[0_20px_60px_rgba(139,92,246,0.4)] max-lg:hidden"
        ></div>

        <!-- Stats Cards -->
        <div
          class="absolute -bottom-12 left-0 right-0 z-10 grid grid-cols-2 gap-6 px-4 max-lg:static max-lg:mt-0 max-lg:mt-8 max-lg:grid-cols-1 max-lg:gap-4 max-lg:px-0"
        >
          <!-- Users Stats -->
          <div
            class="rounded-[20px] border border-dashboard-gray-600/50 bg-dashboard-gray-900/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-dashboard-gray-800/80 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] max-md:p-6"
          >
            <div class="mb-4 flex items-start justify-between">
              <span class="text-sm font-medium leading-tight text-gray-300"
                >Active creators and contributors in our DPG ecosystem</span
              >
              <Icon icon="lucide:trending-up" class="h-4 w-4 text-dashboard-success-500" />
            </div>
            <div class="mb-2 text-4xl font-bold text-white">
              +200<span class="text-3xl">%</span>
            </div>
            <div class="mb-6 text-sm text-gray-400">growth this year</div>

            <div class="flex items-center">
              {#each userAvatars as avatar, i}
                <img
                  src={avatar}
                  alt="User {i + 1}"
                  class="-ml-2.5 h-9 w-9 rounded-full border-[3px] border-dashboard-gray-700 object-cover shadow-sm first:ml-0"
                  style="z-index: {userAvatars.length - i}"
                />
              {/each}
            </div>
          </div>

          <!-- Monetization Stats -->
          <div
            class="rounded-[20px] border border-dashboard-gray-600/50 bg-dashboard-gray-900/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-dashboard-gray-800/80 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] max-md:p-6"
          >
            <div class="mb-4 flex items-start justify-between">
              <span class="text-sm font-medium leading-tight text-gray-300"
                >Projects successfully meeting DPG standards</span
              >
              <Icon icon="lucide:trending-up" class="h-4 w-4 text-dashboard-success-500" />
            </div>
            <div class="mb-2 text-4xl font-bold text-white">
              85<span class="text-3xl">%</span>
            </div>
            <div class="mb-6 text-sm text-gray-400">success rate</div>

            <div class="grid h-10 grid-cols-4 items-end gap-3">
              <div class="h-2 rounded-md bg-dashboard-gray-600 transition-all duration-200"></div>
              <div class="h-8 rounded-md bg-dashboard-gray-600 transition-all duration-200"></div>
              <div class="h-6 rounded-md bg-dashboard-gray-600 transition-all duration-200"></div>
              <div
                class="h-10 rounded-md bg-dashboard-purple-500 transition-all duration-200"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- What is DPG & Pipeline Section -->
  <section class="lg:my-32">
    <div class="mx-auto max-w-[1400px] px-8 max-lg:px-4">
      <!-- Main Grid - Bento Box Style -->
      <div
        class="grid grid-cols-4 grid-rows-3 gap-6 max-lg:flex max-lg:h-auto max-lg:grid-cols-2 max-lg:grid-rows-6 max-lg:flex-col max-lg:gap-6 lg:h-[800px]"
      >
        <!-- What are DPGs - Large Header Card -->
        <div
          class="col-span-2 row-span-1 rounded-[24px] bg-gradient-to-br from-dashboard-purple-600 via-dashboard-purple-700 to-dashboard-purple-800 p-8 text-white shadow-[0_20px_60px_rgba(139,92,246,0.3)] max-lg:col-span-2 max-md:col-span-1"
        >
          <h2 class="mb-4 text-4xl font-bold max-lg:text-3xl max-md:text-2xl">
            What are Digital Public Goods?
          </h2>
          <p class="text-lg text-purple-100 max-md:text-base">
            Resources, tools, or content that are made available to the public for social impact.
          </p>
          <div class="mt-6 flex items-center gap-2">
            <a
              href="/resources/digital-public-good"
              class="flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 font-semibold text-white transition-all hover:bg-dashboard-gray-800"
            >
              Learn More
              <Icon icon="lucide:arrow-right" class="h-4 w-4" />
            </a>
          </div>
        </div>

        <!-- Open Source Card -->
        <div
          class="col-span-1 row-span-1 rounded-[24px] border border-dashboard-gray-700/50 bg-dashboard-gray-800/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-dashboard-gray-700/80 max-md:col-span-1"
        >
          <div
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashboard-gray-400/10 bg-dashboard-gray-400/10"
          >
            <Icon icon="lucide:unlock" class="h-6 w-6 text-gray-400" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-white">Open Source</h3>
          <p class="text-sm text-gray-400">Source code must be publicly available</p>
        </div>

        <!-- Advancing SDGs Card -->
        <div
          class="col-span-1 row-span-1 rounded-[24px] border border-dashboard-gray-700/50 bg-dashboard-gray-800/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-dashboard-gray-700/80 max-md:col-span-1"
        >
          <div
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashboard-gray-400/50 bg-dashboard-gray-400/10"
          >
            <Icon icon="lucide:target" class="h-6 w-6 text-dashboard-gray-400" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-white">Advancing SDGs</h3>
          <p class="text-sm text-gray-400">Contributing to sustainable development goals</p>
        </div>

        <!-- Pipeline Process - Tall Card -->
        <div
          class="col-span-1 row-span-2 rounded-[24px] bg-gradient-to-b from-dashboard-gray-800 to-dashboard-gray-900 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-lg:row-span-1 max-md:col-span-1"
        >
          <h3 class="mb-8 text-center text-xl font-semibold text-white max-lg:mb-4">
            Pipeline Process
          </h3>
          <div
            class="flex h-full max-h-[300px] flex-col justify-between max-lg:max-h-none max-lg:flex-row max-lg:items-center max-lg:gap-4"
          >
            <div class="text-center">
              <div
                class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-dashboard-purple-500 to-dashboard-purple-600 max-lg:h-12 max-lg:w-12"
              >
                <Icon icon="lucide:lightbulb" class="h-8 w-8 text-white max-lg:h-6 max-lg:w-6" />
              </div>
              <h4 class="text-sm font-medium text-white">Your Idea</h4>
            </div>

            <div class="flex justify-center py-4 max-lg:py-0">
              <Icon
                icon="lucide:arrow-down"
                class="h-6 w-6 text-dashboard-yellow-400 max-lg:hidden"
              />
              <Icon
                icon="lucide:arrow-right"
                class="hidden h-6 w-6 text-dashboard-yellow-400 max-lg:block"
              />
            </div>

            <div class="text-center">
              <div
                class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-dashboard-yellow-400 to-dashboard-yellow-500 max-lg:h-12 max-lg:w-12"
              >
                <Icon
                  icon="lucide:cog"
                  class="h-8 w-8 text-dashboard-black max-lg:h-6 max-lg:w-6"
                />
              </div>
              <h4 class="text-sm font-medium text-white">Pipeline</h4>
            </div>

            <div class="flex justify-center py-4 max-lg:py-0">
              <Icon
                icon="lucide:arrow-down"
                class="h-6 w-6 text-dashboard-success-500 max-lg:hidden"
              />
              <Icon
                icon="lucide:arrow-right"
                class="hidden h-6 w-6 text-dashboard-success-500 max-lg:block"
              />
            </div>

            <div class="text-center">
              <div
                class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-dashboard-success-500 to-dashboard-success-600 max-lg:h-12 max-lg:w-12"
              >
                <Icon icon="lucide:award" class="h-8 w-8 text-white max-lg:h-6 max-lg:w-6" />
              </div>
              <h4 class="text-sm font-medium text-white">DPG Registry</h4>
            </div>
          </div>
        </div>

        <!-- What is Pipeline - Large Card -->
        <div
          class="col-span-2 row-span-1 rounded-[24px] bg-gradient-to-r from-dashboard-yellow-400 to-dashboard-yellow-500 p-8 text-dashboard-black max-lg:col-span-2 max-md:col-span-1"
        >
          <h2 class="mb-4 text-3xl font-bold max-lg:text-2xl">What is Pipeline?</h2>
          <p class="mb-6 text-lg max-md:text-base">
            We help creators, contributors, and funders recognize and use DPG Standards to qualify
            projects as Digital Public Goods.
          </p>

          <a
            href="/resources/pipeline"
            class="inline-flex items-center gap-2 rounded-full bg-dashboard-black px-6 py-3 font-semibold text-white transition-all hover:bg-dashboard-gray-800"
          >
            Learn More
            <Icon icon="lucide:arrow-right" class="h-4 w-4" />
          </a>
        </div>

        <!-- Do No Harm Card -->
        <div
          class="col-span-1 row-span-1 rounded-[24px] border border-dashboard-gray-700/50 bg-dashboard-gray-800/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-dashboard-gray-700/80 max-md:col-span-1"
        >
          <div
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashboard-gray-400/50 bg-dashboard-gray-400/10"
          >
            <Icon icon="lucide:shield-check" class="h-6 w-6 text-dashboard-gray-400" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-white">Do No Harm</h3>
          <p class="text-sm text-gray-400">Must not cause negative impact</p>
        </div>

        <!-- Pipeline Features -->
        <div
          class="col-span-3 row-span-1 rounded-[24px] border border-dashboard-gray-700/50 bg-dashboard-gray-800/50 p-8 backdrop-blur-xl max-lg:col-span-1 max-lg:col-span-2"
        >
          <h3 class="mb-6 text-xl font-semibold text-white">How Pipeline Helps</h3>
          <div class="grid grid-cols-3 gap-6 max-lg:grid-cols-3 max-lg:gap-2">
            <div class="text-center">
              <div class="mb-3 flex justify-center">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-dashboard-yellow-400/20"
                >
                  <Icon icon="lucide:check-circle" class="h-6 w-6 text-dashboard-yellow-400" />
                </div>
              </div>
              <h4 class="mb-1 text-sm font-medium text-white">Track Progress</h4>
              <p class="text-xs text-gray-400">Monitor your DPG journey</p>
            </div>

            <div class="text-center">
              <div class="mb-3 flex justify-center">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-dashboard-yellow-400/20"
                >
                  <Icon icon="lucide:users" class="h-6 w-6 text-dashboard-yellow-400" />
                </div>
              </div>
              <h4 class="mb-1 text-sm font-medium text-white">Get Support</h4>
              <p class="text-xs text-gray-400">Connect with community</p>
            </div>

            <div class="text-center">
              <div class="mb-3 flex justify-center">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-dashboard-yellow-400/20"
                >
                  <Icon icon="lucide:bookmark" class="h-6 w-6 text-dashboard-yellow-400" />
                </div>
              </div>
              <h4 class="mb-1 text-sm font-medium text-white">Registry Ready</h4>
              <p class="text-xs text-gray-400">Meet all DPG criteria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  /* Only keeping the organic shape animation since Tailwind doesn't handle complex animations */
  .organic-shape {
    border-radius: 50% 30% 60% 40%;
    animation: float 6s ease-in-out infinite;
  }

  .organic-shape::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), transparent);
    border-radius: 50% 70% 30% 50%;
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(-10px) rotate(0deg);
      border-radius: 50% 30% 60% 40%;
    }
    50% {
      transform: translateY(10px) rotate(2deg);
      border-radius: 30% 60% 40% 50%;
    }
  }
</style>
