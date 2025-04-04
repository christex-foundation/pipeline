<script>
  export let data;
</script>

<section
  class="mt-44 mb-0 flex flex-wrap items-center gap-10 self-center max-md:mt-10 max-md:mb-2.5 max-md:max-w-full"
>
  <div
    class="my-auto flex w-[583px] min-w-[240px] flex-col justify-center self-stretch max-md:max-w-full"
  >
    <div class="flex w-full flex-col max-md:max-w-full">
      <h1
        class="text-7xl leading-[94px] font-semibold text-white max-md:max-w-full max-md:text-4xl max-md:leading-[50px] max-sm:ml-2"
      >
        Building a <br />Better<br /><span class="text-lime-300">Digital Future</span>
      </h1>
      <p class="mt-3.5 text-2xl leading-7 text-gray-200 max-md:max-w-full max-sm:ml-4">
        Discover, contribute, and collaborate on <br />open-source projects that drive social impact
        globally.
      </p>
    </div>

    <div
      class="mt-20 flex w-full max-w-[550px] flex-wrap items-center justify-between gap-5 leading-none max-md:mt-10 max-md:max-w-[500px]"
    >
      <div class="flex w-full gap-3">
        <a
          href="#discover"
          class="my-auto flex w-[57%] items-center justify-center gap-3 rounded-[91px] bg-lime-300 p-6 text-xl text-black max-sm:ml-[2px]"
        >
          <span class="my-auto self-stretch text-2xl max-sm:text-[15px]">Discover Projects</span>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ee85afd95f21137b0259c2e12860243ce44ca3d6eeef6dbee9406e15ee48684?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt=""
            class="my-auto aspect-[0.97] w-8 shrink-0 self-stretch object-contain max-sm:w-[25px]"
          />
        </a>
        {#if !data.isAuthenticated}
          <a
            href="#signup"
            class="my-auto flex w-[36%] items-center justify-center gap-3 rounded-[61px] border-2 border-solid border-lime-300 p-6 text-2xl text-lime-300 max-sm:text-xl"
          >
            Sign up
          </a>
        {/if}
      </div>
    </div>
  </div>
  <div
    class="my-auto flex w-[503px] min-w-[240px] items-center gap-2 self-stretch max-md:max-w-full"
  >
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/57cf35930d02cbe6dc515733ea696508f4e4050139500aa10ab40489da63e872?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      alt="Illustration of digital future concept"
      class="my-auto aspect-[0.94] w-[503px] min-w-[240px] self-stretch object-contain"
    />
  </div>
</section>
