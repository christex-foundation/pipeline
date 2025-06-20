<script>
  export let number;
  export let title;
  export let description;
  export let icon;
  export let color;

  import { Card } from '$lib/components/ui/card';

  let isPurple = color === 'purple';
</script>

<Card class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 hover:border-dashboard-gray-600 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300">
 <div class="p-4 sm:p-6">
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div class="flex items-center flex-shrink-0 gap-4 sm:flex-col sm:items-center sm:gap-2">
   <div class={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
                   isPurple ? 'bg-dashboard-purple-500' : 'bg-dashboard-yellow-600'
                }`}>
         <svelte:component this={icon} class="w-6 h-6 text-white" />
   </div>
      <div class="mt-2 text-center">
        <span class={`text-label-sm font-medium ${
          isPurple ? 'text-dashboard-purple-500' : 'text-dashboard-yellow-600'
        }`}>
          Step {number}
        </span>
      </div>
    </div>
    <!-- Content -->
   <div class="flex-1 min-w-0">
      <div class="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-white text-heading-lg sm:text-heading-xl">{title}</h3>
      </div>
      <p class="text-gray-300 text-body-lg">
        {description}
      </p>
      </div>  
    </div>
  </div>
</Card>
