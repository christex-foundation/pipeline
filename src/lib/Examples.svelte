<script>
  import ExampleCard from './ExampleCard.svelte';
</script>

<section
  class="mx-auto mt-16 flex w-full max-w-6xl flex-col items-center px-4 text-black max-md:mt-10"
>
  <h2 class="mb-8 text-center text-5xl leading-none font-semibold max-md:text-4xl">
    When is a Product a DPG?
  </h2>
  <div
    class="flex w-full flex-wrap items-center justify-center gap-8 text-5xl leading-[50px] font-thin max-md:text-4xl max-md:leading-[49px]"
  >
    <ExampleCard
      imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/2d296a83957a9191e4b8dbb798d505dbf3941e3e66870811a646b02bf1ab858d?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      imageAlt="Open Source icon"
      title="Open<br />Source"
    />
    <ExampleCard
      imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/868d9d50df6d9cd4bde88d36ea65b691533c95a0cdaf2fb9944c32b1249c7a98?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      imageAlt="Advancing the SDGs icon"
      title="Advancing<br />the SDGs"
    />
    <ExampleCard
      imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/ff83b0621bb8f444f11bdb653f7af05266f4a75e5e356e72a122a777709ea124?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      imageAlt="Do No Harm icon"
      title="Do<br />No Harm"
    />
  </div>
</section>
