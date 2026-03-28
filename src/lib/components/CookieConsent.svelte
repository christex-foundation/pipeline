<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';

  let showBanner = false;
  let showPreferences = false;
  let loading = true;

  let consent = {
    necessary: true,
    functional: false,
    analytics: false
  };

  let user = null;

  $: user = $page.data.user;

  onMount(() => {
    if (browser) {
      const savedConsent = localStorage.getItem('cookie-consent');
      if (savedConsent) {
        const parsed = JSON.parse(savedConsent);
        consent = {
          necessary: true,
          functional: parsed.preferences?.functional ?? false,
          analytics: parsed.preferences?.analytics ?? false
        };
        loading = false;
      } else {
        loading = false;
        setTimeout(() => {
          showBanner = true;
        }, 500);
      }
    }
  });

  async function saveConsent(preferences) {
    const consentData = {
      preferences,
      timestamp: Date.now(),
      user_id: user?.id || null
    };

    localStorage.setItem('cookie-consent', JSON.stringify(consentData));
    consent = { necessary: true, ...preferences };

    if (user) {
      try {
        await fetch('/api/privacy/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...preferences,
            userId: user.id
          })
        });
      } catch (e) {
        console.error('Failed to save consent to backend:', e);
      }
    }

    showBanner = false;
    showPreferences = false;
  }

  function acceptAll() {
    saveConsent({ functional: true, analytics: true });
  }

  function acceptNecessary() {
    saveConsent({ functional: false, analytics: false });
  }

  function showPreferencesModal() {
    showPreferences = true;
  }

  function savePreferences() {
    saveConsent({
      functional: consent.functional,
      analytics: consent.analytics
    });
  }

  function closePreferences() {
    showPreferences = false;
  }
</script>

{#if !loading}
  {#if showBanner}
    <div class="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div class="mx-auto max-w-5xl rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-lg">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-white">Cookie Preferences</h3>
            <p class="text-sm text-gray-300 max-w-xl">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies. 
              <a href="/cookies" class="text-dashboard-purple-400 hover:underline">Learn more</a>
            </p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              class="border-dashboard-gray-600 text-white hover:bg-dashboard-gray-800"
              on:click={showPreferencesModal}
            >
              Customize
            </Button>
            <Button 
              variant="ghost"
              class="bg-dashboard-gray-700 text-white hover:bg-dashboard-gray-600"
              on:click={acceptNecessary}
            >
              Necessary Only
            </Button>
            <Button 
              class="bg-dashboard-purple-500 text-white hover:bg-dashboard-purple-600"
              on:click={acceptAll}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if showPreferences}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="w-full max-w-md rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-xl">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-white">Cookie Preferences</h3>
          <button 
            on:click={closePreferences}
            class="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-lg bg-dashboard-gray-800 p-4">
            <div>
              <h4 class="font-medium text-white">Necessary</h4>
              <p class="text-sm text-gray-400">Required for the website to function</p>
            </div>
            <input 
              type="checkbox" 
              checked={true} 
              disabled
              class="h-5 w-5 rounded border-gray-600 bg-dashboard-gray-700 text-dashboard-purple-500"
            />
          </div>

          <div class="flex items-center justify-between rounded-lg bg-dashboard-gray-800 p-4">
            <div>
              <h4 class="font-medium text-white">Functional</h4>
              <p class="text-sm text-gray-400">Enable personalized features</p>
            </div>
            <input 
              type="checkbox" 
              bind:checked={consent.functional}
              class="h-5 w-5 rounded border-gray-600 bg-dashboard-gray-700 text-dashboard-purple-500 focus:ring-dashboard-purple-500"
            />
          </div>

          <div class="flex items-center justify-between rounded-lg bg-dashboard-gray-800 p-4">
            <div>
              <h4 class="font-medium text-white">Analytics</h4>
              <p class="text-sm text-gray-400">Help us improve our service</p>
            </div>
            <input 
              type="checkbox" 
              bind:checked={consent.analytics}
              class="h-5 w-5 rounded border-gray-600 bg-dashboard-gray-700 text-dashboard-purple-500 focus:ring-dashboard-purple-500"
            />
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <Button 
            variant="outline" 
            class="flex-1 border-dashboard-gray-600 text-white hover:bg-dashboard-gray-800"
            on:click={closePreferences}
          >
            Cancel
          </Button>
          <Button 
            class="flex-1 bg-dashboard-purple-500 text-white hover:bg-dashboard-purple-600"
            on:click={savePreferences}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  {/if}
{/if}
