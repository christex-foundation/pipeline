<script>
  export let question;
  export let imageSrc;
  export let answer;

  let isOpen = false;

  function toggleAnswer() {
    isOpen = !isOpen;
  }
</script>

<article class="mt-12 flex w-[1199px] max-w-full flex-col rounded-2xl bg-white max-md:mt-10">
  <div
    class="flex flex-col justify-center w-full border border-solid rounded-2xl border-teal-950 px-7 py-7 max-md:max-w-full max-md:px-5"
  >
    <div class="flex flex-col w-full max-md:max-w-full">
      <div
        class="flex flex-wrap items-center justify-between w-full gap-10 cursor-pointer max-md:max-w-full"
        on:click={toggleAnswer}
      >
        <h2 class="my-auto self-stretch text-3xl max-md:text-[17px]">{question}</h2>
        <img
          src={imageSrc}
          alt="Toggle answer"
          class="my-auto aspect-square w-[37px] shrink-0 self-stretch object-contain transition-transform duration-300 max-sm:w-[15px] {isOpen
            ? 'rotate-180'
            : ''}"
        />
      </div>
      {#if isOpen}
        <p
          class="mt-6 text-2xl font-normal leading-relaxed text-left text-gray-700 max-md:text-base max-md:leading-normal"
        >
          {answer}
        </p>
      {/if}
    </div>
  </div>
</article>
