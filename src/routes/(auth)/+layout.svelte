<script>
  import { Toaster } from 'svelte-sonner';
</script>

<Toaster richColors position="top-right" closeButton />
<main class="-mb-16 h-screen overflow-hidden bg-white md:pr-0">
  <div class="flex h-full flex-col gap-5 md:flex-row">
    <section class="h-full w-full basis-full max-md:hidden md:w-5/12">
      <div
        class="flex h-full grow items-center gap-2.5 bg-cyan-950 py-10 pl-5 pr-2 md:py-24 md:pl-12"
      >
        <div
          class="my-auto flex w-full min-w-[240px] max-w-[534px] flex-col items-center self-stretch"
        >
          <a href="/">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad49722deb9607c50bec0aa4159ff15d8108741c5e49ac832886fb785b83c09b?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              alt="Pipeline logo"
              class="ml-36 aspect-[5.95] h-[48px] max-w-full object-contain"
            />
          </a>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2c87d36d522646afc65e2334ae141b78ca66fc63c07d8edf349286480639e46?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt=""
            class="mt-10 aspect-[1.34] w-full object-contain md:mt-48"
          />
        </div>
      </div>
    </section>

    <slot></slot>
  </div>
</main>
