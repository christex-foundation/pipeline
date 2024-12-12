<script>
  export let icon;
  export let text;
</script>

<li class="mt-6 flex w-full items-center gap-4 whitespace-nowrap first:mt-0">
  <img
    loading="lazy"
    src={icon}
    alt=""
    class="my-auto aspect-square w-[17px] shrink-0 self-stretch object-contain"
  />
  <span class="my-auto self-stretch">{text}</span>
</li>
