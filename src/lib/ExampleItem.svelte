<script>
  export let src;
  export let alt;
  export let title;
</script>

<div class="flex w-[119px] flex-col items-center justify-center">
  <img {src} {alt} loading="lazy" class="aspect-[0.99] w-[82px] object-contain" />
  <p class="mt-5 w-full text-center text-2xl">{@html title.replace('\n', '<br />')}</p>
</div>

<style>
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 2.5em;
  }
</style>
