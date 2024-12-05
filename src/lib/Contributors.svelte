<script>
  import LeaderboardItem from './LeaderboardItem.svelte';
</script>

<main class="flex w-[100%] flex-col font-[Inter] max-md:max-w-full">
  <header
    class="flex w-full flex-wrap items-center justify-between gap-10 rounded-2xl bg-emerald-100 p-3.5 max-md:max-w-full"
  >
    <h2 class="my-auto w-[70px] gap-2.5 self-stretch whitespace-nowrap p-2.5">Rank</h2>
    <div
      class="my-auto h-9 w-0 shrink-0 self-stretch border border-solid border-teal-400"
      role="separator"
      aria-hidden="true"
    ></div>
    <h2 class="my-auto w-[40px] min-w-[150px] gap-2.5 self-stretch whitespace-nowrap p-2.5">
      Contributor
    </h2>
    <div
      class="my-auto h-9 w-0 shrink-0 self-stretch border border-solid border-teal-400"
      role="separator"
      aria-hidden="true"
    ></div>
    <h2 class="my-auto w-[150px] gap-2.5 self-stretch p-2.5">Amount Contributed</h2>
    <div
      class="my-auto h-9 w-0 shrink-0 self-stretch border border-solid border-teal-400"
      role="separator"
      aria-hidden="true"
    ></div>
    <h2 class="my-auto w-[100px] gap-2.5 self-stretch whitespace-nowrap p-2.5">Points</h2>
  </header>
  <LeaderboardItem
    rank="1"
    username="Username"
    amount="$50"
    points="5"
    imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/e7c0c202b455fb673a473feba19d93abcab44e07b1613ae7092511d4c5bba696?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
  />
  <LeaderboardItem
    rank="2"
    username="Username"
    amount="-"
    points="10"
    imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/4b1d2ec53aedff863ac80bbba0102923259a4c3adb2f833e1ba53fe9e8c4b4e1?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
  />
</main>
