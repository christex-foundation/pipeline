<script>
  import Icon from '@iconify/svelte';
  import Logo from '$lib/Logo.svelte';
</script>

<div class="min-h-screen bg-dashboard-black">
  <div class="container mx-auto px-6 py-8">
    <div
      class="mb-8 flex flex-wrap justify-center gap-4 rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-4"
    >
      <a
        href="/privacy"
        class="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-dashboard-gray-800 hover:text-white"
      >
        <Icon icon="mdi:shield-account" class="h-5 w-5" />
        Privacy Policy
      </a>
      <a
        href="/terms"
        class="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-dashboard-gray-800 hover:text-white"
      >
        <Icon icon="mdi:file-document-outline" class="h-5 w-5" />
        Terms of Service
      </a>
      <a
        href="/cookies"
        class="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-dashboard-gray-800 hover:text-white"
      >
        <Icon icon="mdi:cookie" class="h-5 w-5" />
        Cookie Policy
      </a>
      <a
        href="/dpa"
        class="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-dashboard-gray-800 hover:text-white"
      >
        <Icon icon="mdi:file-sign" class="h-5 w-5" />
        DPA
      </a>
    </div>
  </div>

  <main>
    <slot />
  </main>
</div>
