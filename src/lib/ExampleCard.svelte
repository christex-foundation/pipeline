<script>
  export let imageSrc;
  export let imageAlt;
  export let title;
</script>

<div
  class="flex aspect-square w-full max-w-[270px] flex-col items-center justify-center rounded-[32px] bg-lime-300 p-6"
>
  <img src={imageSrc} alt={imageAlt} loading="lazy" class="aspect-[0.93] w-[99px] object-contain" />
  <h3 class="mt-8 whitespace-normal text-center">{@html title}</h3>
</div>

<style>
  h3 {
    font-size: 2rem;
    line-height: 1.2;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.5rem;
      line-height: 1.2;
    }
  }
</style>
