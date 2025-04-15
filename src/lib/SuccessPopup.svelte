<script>
  import { modalOpen } from './modalStore.js';
  import { Button } from '$lib/components/ui/button';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';

  function closeModal() {
    modalOpen.set(false);
  }
</script>

<div class="relative">
  <Dialog open={$modalOpen} onOpenChange={closeModal}>
    <DialogContent
      class="fixed left-[50%] top-[50%] z-50 !flex !max-w-[678px] translate-x-[-50%] translate-y-[-50%] flex-col items-center overflow-hidden !rounded-[53px] border-0 bg-teal-600 p-0 px-20 !pb-14 !pt-24 !text-center font-semibold leading-none text-white max-md:px-5"
    >
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/37fdd80cf276a36769f1558ad7c5b5a5a72b870fcf8df808b02f069f5e5d61e1?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
        alt="Donation success illustration"
        class="aspect-[1.05] !w-[310px] max-w-full !object-contain"
      />

      <DialogHeader class="mt-8 w-full !text-center">
        <DialogTitle class="text-5xl max-md:text-4xl">Donation Successful</DialogTitle>
      </DialogHeader>

      <div class="mt-2 text-lg leading-5">
        Your contribution will help bring this project to life.<br />
      </div>

      <a href="/explore" class="flex justify-center w-full mt-5">
        <Button
          class="w-[411px] max-w-full gap-1 rounded-3xl bg-teal-950 px-5 py-5 text-sm text-lime-100 hover:bg-teal-900"
        >
          Explore other projects
        </Button>
      </a>
    </DialogContent>
  </Dialog>
</div>
