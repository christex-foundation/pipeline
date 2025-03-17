<script>
  export let rank;
  export let username;
  export let amount;
  export let points;
  export let imageSrc;
</script>

<article
  class="mt-2.5 flex w-full flex-wrap items-center justify-between gap-10 rounded-2xl border-b border-teal-400 px-3.5 pt-3.5 pb-6 font-[Inter] whitespace-nowrap max-md:max-w-full"
>
  <div class="my-auto w-[70px] gap-2.5 self-stretch p-2.5">{rank}</div>
  <div
    class="my-auto h-9 w-0 shrink-0 self-stretch border border-solid border-emerald-100"
    role="separator"
    aria-hidden="true"
  ></div>
  <div
    class="my-auto flex w-[159px] min-w-[150px] items-center gap-3 self-stretch text-xl text-black"
  >
    <img
      loading="lazy"
      src={imageSrc}
      alt={`Profile picture of ${username}`}
      class="my-auto aspect-square min-h-[42px] w-[42px] shrink-0 gap-0.5 self-stretch rounded-3xl object-contain"
    />
    <span class="my-auto self-stretch">{username}</span>
  </div>
  <div
    class="my-auto h-9 w-0 shrink-0 self-stretch border border-solid border-emerald-100"
    role="separator"
    aria-hidden="true"
  ></div>
  <div class="my-auto mr-2 gap-2.5 self-stretch p-2.5">{amount}</div>
  <div
    class="my-auto h-9 w-0 shrink-0 self-stretch border border-solid border-emerald-100"
    role="separator"
    aria-hidden="true"
  ></div>
  <div class="my-auto w-[123px] gap-2.5 self-stretch p-2.5">{points}</div>
</article>
