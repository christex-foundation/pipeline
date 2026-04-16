<script>
  export let tag;

  $: label = tag?.title ?? 'SDG category';
</script>

<img src={tag.image} class="relative h-8 w-8 rounded shadow" alt={label} title={label} />
