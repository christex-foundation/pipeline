<script>
  export let iconSrc;
  export let title;
  export let description;
</script>

<article
  class="mx-auto flex w-[410px] min-w-[240px] shrink grow flex-col rounded-[54px] bg-teal-800 py-10 pl-10 pr-9 max-md:max-w-full max-md:px-5 max-sm:max-w-[90%]"
>
  <div
    class="flex h-[84px] w-[84px] items-center gap-4 self-end rounded-[81px] bg-lime-300 p-4 max-sm:rounded-[60px]"
  >
    <img
      loading="lazy"
      src={iconSrc}
      alt=""
      class="my-auto aspect-square w-[51px] self-stretch object-contain"
    />
  </div>
  <div class="mt-14 flex w-full flex-col max-md:mt-10 max-md:max-w-full">
    <h3 class="text-5xl font-semibold leading-none text-lime-300 max-md:max-w-full max-sm:text-4xl">
      {title}
    </h3>
    <p class="font-['PP Mori'] text-3xl font-normal leading-[40.86px] text-white max-sm:text-2xl">
      {description}
    </p>
  </div>
</article>
