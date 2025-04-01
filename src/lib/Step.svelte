<script>
  export let number;
  export let title;
  export let description;
  import { Card } from '$lib/components/ui/card';
</script>

<Card class="border border-gray-200 p-6 shadow-lg">
  <h3 class="mb-2 text-2xl font-semibold">Step {number}: {title}</h3>
  <p class="text-gray-600">{description}</p>
</Card>
