<script>
    export let rank;
    export let username;
    export let amount;
    export let points;
    export let imageSrc;
    </script>
    
    <article class="flex flex-wrap gap-10 justify-between items-center px-3.5 pt-3.5 pb-6 mt-2.5 w-full whitespace-nowrap rounded-2xl border-b border-teal-400 max-md:max-w-full">
      <div class="gap-2.5 self-stretch p-2.5 my-auto w-[123px]">{rank}</div>
      <div class="self-stretch my-auto w-0 h-9 border border-emerald-100 border-solid shrink-0" role="separator" aria-hidden="true"></div>
      <div class="flex gap-3 items-center self-stretch my-auto text-xl text-black min-w-[240px] w-[299px]">
        <img loading="lazy" src={imageSrc} alt={`Profile picture of ${username}`} class="object-contain shrink-0 gap-0.5 self-stretch my-auto rounded-3xl aspect-square min-h-[42px] w-[42px]" />
        <span class="self-stretch my-auto">{username}</span>
      </div>
      <div class="self-stretch my-auto w-0 h-9 border border-emerald-100 border-solid shrink-0" role="separator" aria-hidden="true"></div>
      <div class="gap-2.5 self-stretch p-2.5 my-auto w-[214px]">{amount}</div>
      <div class="self-stretch my-auto w-0 h-9 border border-emerald-100 border-solid shrink-0" role="separator" aria-hidden="true"></div>
      <div class="gap-2.5 self-stretch p-2.5 my-auto w-[123px]">{points}</div>
    </article>