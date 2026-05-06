<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';

  export let project = {};
  export let isEdit = false;
</script>

<div class="space-y-6">
  <!-- Funding Goal -->
  <div class="space-y-2">
    <Label for="fundingGoal" class="block font-medium text-gray-300 text-label-lg">
      Funding Goal (USD)
    </Label>
    <Input
      id="fundingGoal"
      type="number"
      name="funding_goal"
      value={project.funding_goal || ''}
      min="0"
      step="1"
      placeholder="10000"
      class="w-full px-4 py-3 text-white border rounded-lg border-dashboard-gray-600 bg-dashboard-gray-800 text-body-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
    />
    {#if !isEdit}
      <p class="text-gray-400 text-body-sm">
        Set a realistic funding target for your project (minimum $100)
      </p>
    {/if}
  </div>
</div>
