<script>
  import LeaderboardItem from './LeaderboardItem.svelte';
</script>

<section class="">
  <table>
    <thead>
      <tr>
        <th>Rank</th>
        <th>Contributor</th>
        <th>Amount Contributed</th>
        <th>Points</th>
      </tr>
    </thead>

    <tbody>
      {#each { length: 2 } as _, i}
        <tr>
          <td>{i + 1}</td>
          <td>
            <div class="flex gap-3 items-center self-stretch my-auto text-xl text-black w-40">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7c0c202b455fb673a473feba19d93abcab44e07b1613ae7092511d4c5bba696?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
                alt={`Profile picture of username`}
                class="object-contain shrink-0 gap-0.5 self-stretch my-auto rounded-3xl aspect-square min-h-[42px] w-[42px]"
              />
              <span>Username</span>
            </div>
          </td>
          <td>$50</td>
          <td>5</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- <header
    class="flex flex-wrap gap-10 justify-between items-center p-3.5 w-full bg-emerald-100 rounded-2xl max-md:max-w-full"
  >
    <h2 class="gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap w-[70px]">Rank</h2>
    <div
      class="self-stretch w-0 my-auto border border-teal-400 border-solid h-9 shrink-0"
      role="separator"
      aria-hidden="true"
    ></div>
    <h2 class="gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap min-w-[150px] w-[40px]">
      Contributor
    </h2>
    <div
      class="self-stretch w-0 my-auto border border-teal-400 border-solid h-9 shrink-0"
      role="separator"
      aria-hidden="true"
    ></div>
    <h2 class="gap-2.5 self-stretch p-2.5 my-auto w-[150px]">Amount Contributed</h2>
    <div
      class="self-stretch w-0 my-auto border border-teal-400 border-solid h-9 shrink-0"
      role="separator"
      aria-hidden="true"
    ></div>
    <h2 class="gap-2.5 self-stretch p-2.5 my-auto whitespace-nowrap w-[100px]">Points</h2>
  </header> -->
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
</section>
