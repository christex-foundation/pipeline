<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';

  export let data;

  let user = data.user;
  let loading = false;
  let deleting = false;

  let consent = {
    necessary: true,
    functional: false,
    analytics: false
  };

  let showDeleteConfirm = false;

  onMount(async () => {
    await loadConsent();
  });

  async function loadConsent() {
    try {
      const response = await fetch('/api/privacy/consent');
      if (response.ok) {
        const data = await response.json();
        if (data.consents) {
          consent = {
            necessary: true,
            functional: data.consents.some(c => c.consent_type === 'cookies_functional' && c.consented),
            analytics: data.consents.some(c => c.consent_type === 'cookies_analytics' && c.consented)
          };
        }
      }
    } catch (e) {
      console.error('Failed to load consent:', e);
    }
  }

  async function updateConsent() {
    loading = true;
    try {
      const response = await fetch('/api/privacy/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functional: consent.functional,
          analytics: consent.analytics,
          userId: user.id
        })
      });

      if (response.ok) {
        localStorage.setItem('cookie-consent', JSON.stringify({
          preferences: {
            functional: consent.functional,
            analytics: consent.analytics
          },
          timestamp: Date.now()
        }));
        toast.success('Consent preferences saved');
      } else {
        toast.error('Failed to save consent preferences');
      }
    } catch (e) {
      toast.error('Failed to save consent preferences');
    } finally {
      loading = false;
    }
  }

  async function downloadData(format) {
    try {
      const response = await fetch(`/api/profile/export?format=${format}`);

      if (!response.ok) {
        throw new Error('Failed to export user data');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const disposition = response.headers.get('content-disposition');
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] || `pipeline-user-export.${format}`;

      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
      toast.success(`Downloaded your data as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(error.message || 'Could not download your data');
    }
  }

  function confirmDelete() {
    showDeleteConfirm = true;
  }

  function cancelDelete() {
    showDeleteConfirm = false;
  }

  async function deleteAccount() {
    deleting = true;
    try {
      const response = await fetch('/api/profile/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'deleteAccount=true'
      });

      if (response.ok) {
        toast.success('Account deleted successfully');
        goto('/');
      } else {
        toast.error('Failed to delete account');
      }
    } catch (e) {
      toast.error('Failed to delete account');
    } finally {
      deleting = false;
      showDeleteConfirm = false;
    }
  }
</script>

<div class="min-h-screen bg-dashboard-black py-12">
  <div class="container mx-auto max-w-4xl px-6">
    <div class="mb-8">
      <h1 class="text-display-md font-bold text-white">Privacy & Data</h1>
      <p class="mt-2 text-body-lg text-gray-400">
        Manage your data rights and privacy preferences
      </p>
    </div>

    <div class="space-y-6">
      <!-- Data Rights Section -->
      <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <h2 class="mb-4 text-heading-xl font-semibold text-white">Your Data Rights</h2>
        <p class="mb-6 text-body-md text-gray-400">
          Under GDPR, you have the following rights regarding your personal data
        </p>

        <div class="grid gap-4 md:grid-cols-2">
          <!-- Download Data -->
          <div class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-800 p-5">
            <div class="mb-3 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-dashboard-purple-500/20 text-dashboard-purple-400">
                <Icon icon="mdi:download" class="h-5 w-5" />
              </div>
              <h3 class="font-medium text-white">Right to Access</h3>
            </div>
            <p class="mb-4 text-sm text-gray-400">
              Download a copy of all your personal data
            </p>
            <div class="flex gap-2">
              <Button 
                variant="outline" 
                class="flex-1 border-dashboard-gray-600 text-white hover:bg-dashboard-gray-700"
                on:click={() => downloadData('json')}
              >
                JSON
              </Button>
              <Button 
                variant="outline" 
                class="flex-1 border-dashboard-gray-600 text-white hover:bg-dashboard-gray-700"
                on:click={() => downloadData('csv')}
              >
                CSV
              </Button>
            </div>
          </div>

          <!-- Data Portability -->
          <div class="rounded-xl border border-dashboard-gray-600 bg-dashboard-gray-800 p-5">
            <div class="mb-3 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-dashboard-purple-500/20 text-dashboard-purple-400">
                <Icon icon="mdi:database" class="h-5 w-5" />
              </div>
              <h3 class="font-medium text-white">Data Portability</h3>
            </div>
            <p class="mb-4 text-sm text-gray-400">
              Export your data in a machine-readable format
            </p>
            <Button 
              variant="outline" 
              class="w-full border-dashboard-gray-600 text-white hover:bg-dashboard-gray-700"
              on:click={() => downloadData('json')}
            >
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <!-- Consent Management Section -->
      <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <h2 class="mb-4 text-heading-xl font-semibold text-white">Consent Preferences</h2>
        <p class="mb-6 text-body-md text-gray-400">
          Manage how we use your data and cookies
        </p>

        <div class="space-y-4">
          <!-- Necessary Cookies -->
          <div class="flex items-center justify-between rounded-lg bg-dashboard-gray-800 p-4">
            <div>
              <h4 class="font-medium text-white">Necessary Cookies</h4>
              <p class="text-sm text-gray-400">Required for the website to function properly</p>
            </div>
            <input 
              type="checkbox" 
              checked={true} 
              disabled
              class="h-5 w-5 rounded border-gray-600 bg-dashboard-gray-700 text-dashboard-purple-500"
            />
          </div>

          <!-- Functional Cookies -->
          <div class="flex items-center justify-between rounded-lg bg-dashboard-gray-800 p-4">
            <div>
              <h4 class="font-medium text-white">Functional Cookies</h4>
              <p class="text-sm text-gray-400">Enable personalized features and preferences</p>
            </div>
            <input 
              type="checkbox" 
              bind:checked={consent.functional}
              class="h-5 w-5 rounded border-gray-600 bg-dashboard-gray-700 text-dashboard-purple-500 focus:ring-dashboard-purple-500"
            />
          </div>

          <!-- Analytics Cookies -->
          <div class="flex items-center justify-between rounded-lg bg-dashboard-gray-800 p-4">
            <div>
              <h4 class="font-medium text-white">Analytics Cookies</h4>
              <p class="text-sm text-gray-400">Help us understand how visitors interact with our website</p>
            </div>
            <input 
              type="checkbox" 
              bind:checked={consent.analytics}
              class="h-5 w-5 rounded border-gray-600 bg-dashboard-gray-700 text-dashboard-purple-500 focus:ring-dashboard-purple-500"
            />
          </div>

          <Button 
            class="mt-4 bg-dashboard-purple-500 text-white hover:bg-dashboard-purple-600"
            on:click={updateConsent}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>

      <!-- Account Deletion Section -->
      <div class="rounded-2xl border border-dashboard-error-500/50 bg-dashboard-gray-900 p-6">
        <h2 class="mb-4 text-heading-xl font-semibold text-white">Delete Account</h2>
        <p class="mb-4 text-body-md text-gray-400">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        
        {#if !showDeleteConfirm}
          <Button 
            variant="destructive"
            class="bg-dashboard-error-500 text-white hover:bg-red-600"
            on:click={confirmDelete}
          >
            Delete My Account
          </Button>
        {:else}
          <div class="rounded-lg border border-dashboard-error-500 bg-dashboard-error-500/10 p-4">
            <p class="mb-4 font-medium text-white">
              Are you sure you want to delete your account? This will:
            </p>
            <ul class="mb-4 list-inside list-disc text-sm text-gray-400">
              <li>Permanently delete your profile and personal information</li>
              <li>Remove all your project contributions</li>
              <li>Delete your bookmarks and following data</li>
              <li>Keep anonymized project content for community benefit</li>
            </ul>
            <div class="flex gap-3">
              <Button 
                variant="outline"
                class="border-dashboard-gray-600 text-white hover:bg-dashboard-gray-800"
                on:click={cancelDelete}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                class="bg-dashboard-error-500 text-white hover:bg-red-600"
                on:click={deleteAccount}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </Button>
            </div>
          </div>
        {/if}
      </div>

      <!-- Privacy Links -->
      <div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <h2 class="mb-4 text-heading-xl font-semibold text-white">Legal Information</h2>
        <div class="flex flex-wrap gap-4">
          <a href="/privacy" class="text-dashboard-purple-400 hover:underline">Privacy Policy</a>
          <span class="text-gray-600">|</span>
          <a href="/terms" class="text-dashboard-purple-400 hover:underline">Terms of Service</a>
          <span class="text-gray-600">|</span>
          <a href="/cookies" class="text-dashboard-purple-400 hover:underline">Cookie Policy</a>
        </div>
      </div>
    </div>
  </div>
</div>
