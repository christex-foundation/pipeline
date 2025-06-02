<!-- <script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  export let user;
</script>

<Card class="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
  <CardHeader class="p-8 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50">
    <CardTitle class="text-3xl font-bold text-gray-900">Links & Social</CardTitle>
    <p class="mt-3 text-base text-gray-600">
      Connect your profile with social media and development platforms
    </p>
  </CardHeader>
  <CardContent class="p-8">
    <div class="space-y-8">

      <div class="space-y-3">
        <Label for="twitter" class="text-base font-semibold text-gray-800">
          X (Twitter) Profile
        </Label>
        <Input
          type="url"
          id="twitter"
          name="twitter"
          value={user.twitter}
          placeholder="https://x.com/username"
          class="w-full px-4 text-base border-2 border-gray-200 h-14 rounded-xl focus:border-teal-500"
        />
        <p class="text-sm text-gray-500">Share updates and engage with the community</p>
      </div>


      <div class="space-y-3">
        <Label for="github" class="text-base font-semibold text-gray-800">GitHub Profile</Label>
        <Input
          type="url"
          id="github"
          name="github"
          value={user.github}
          placeholder="https://github.com/username"
          class="w-full px-4 text-base border-2 border-gray-200 h-14 rounded-xl focus:border-teal-500"
        />
        <p class="text-sm text-gray-500">Showcase your code repositories and contributions</p>
      </div>

  
      <div class="space-y-3">
        <Label for="discord" class="text-base font-semibold text-gray-800">Discord Username</Label>
        <Input
          type="text"
          id="discord"
          name="discord"
          value={user.discord}
          placeholder="username#1234"
          class="w-full px-4 text-base border-2 border-gray-200 h-14 rounded-xl focus:border-teal-500"
        />
        <p class="text-sm text-gray-500">Connect with the developer community on Discord</p>
      </div>


      <div class="space-y-3">
        <Label for="linkedin" class="text-base font-semibold text-gray-800">LinkedIn Profile</Label>
        <Input
          type="url"
          id="linkedin"
          name="linkedin"
          value={user.linkedin}
          placeholder="https://linkedin.com/in/username"
          class="w-full px-4 text-base border-2 border-gray-200 h-14 rounded-xl focus:border-teal-500"
        />
        <p class="text-sm text-gray-500">Professional profile for networking and credibility</p>
      </div>


      <div class="space-y-3">
        <Label for="website" class="text-base font-semibold text-gray-800">Personal Website</Label>
        <Input
          type="url"
          id="website"
          name="web"
          value={user.website}
          placeholder="https://yourwebsite.com"
          class="w-full px-4 text-base border-2 border-gray-200 h-14 rounded-xl focus:border-teal-500"
        />
        <p class="text-sm text-gray-500">Your personal website or portfolio</p>
      </div>


      <div class="space-y-3">
        <Label for="others" class="text-base font-semibold text-gray-800">Other Link</Label>
        <Input
          type="url"
          id="others"
          name="others"
          value={user.others}
          placeholder="https://other-platform.com"
          class="w-full px-4 text-base border-2 border-gray-200 h-14 rounded-xl focus:border-teal-500"
        />
        <p class="text-sm text-gray-500">Additional relevant link (YouTube, Behance, etc.)</p>
      </div>
    </div>
  </CardContent>
</Card> -->
<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  export let user;

  // Social platform configurations with pre-built URLs
  const socialPlatforms = [
    {
      name: 'twitter',
      label: 'X (Twitter) Profile',
      type: 'text',
      placeholder: 'username',
      description: 'Share updates and engage with the community',
      baseUrl: 'https://x.com/',
      displayPlaceholder: 'username',
    },
    {
      name: 'github',
      label: 'GitHub Profile',
      type: 'text',
      placeholder: 'username',
      description: 'Showcase your code repositories and contributions',
      baseUrl: 'https://github.com/',
      displayPlaceholder: 'username',
    },
    {
      name: 'discord',
      label: 'Discord Username',
      type: 'text',
      placeholder: 'username#1234',
      description: 'Connect with the developer community on Discord',
      baseUrl: '',
      displayPlaceholder: 'username#1234',
    },
    {
      name: 'linkedin',
      label: 'LinkedIn Profile',
      type: 'text',
      placeholder: 'username',
      description: 'Professional profile for networking and credibility',
      baseUrl: 'https://linkedin.com/in/',
      displayPlaceholder: 'username',
    },
    {
      name: 'website',
      label: 'Personal Website',
      type: 'text',
      placeholder: 'yourwebsite.com',
      description: 'Your personal website or portfolio',
      baseUrl: 'https://',
      displayPlaceholder: 'yourwebsite.com',
    },
    {
      name: 'others',
      label: 'Other Link',
      type: 'text',
      placeholder: 'other-platform.com',
      description: 'Additional relevant link (YouTube, Behance, etc.)',
      baseUrl: 'https://',
      displayPlaceholder: 'other-platform.com',
    },
  ];

  // Store raw usernames separately from the user object
  let usernames = {};

  // Initialize usernames from existing user data (extract username from URLs)
  $: {
    socialPlatforms.forEach((platform) => {
      const dbColumnName = platform.name === 'website' ? 'web' : platform.name;
      const existingValue = user[dbColumnName];

      if (existingValue && !usernames[platform.name]) {
        if (platform.name === 'discord') {
          usernames[platform.name] = existingValue;
        } else if (existingValue.startsWith(platform.baseUrl)) {
          usernames[platform.name] = existingValue.replace(platform.baseUrl, '');
        } else {
          usernames[platform.name] = existingValue;
        }
      }
    });
  }

  // Function to construct full URL from username
  function constructFullUrl(platform, username) {
    if (!username) return '';

    if (platform.name === 'discord') {
      return username;
    } else if (platform.name === 'website' || platform.name === 'others') {
      return username.startsWith('http') ? username : platform.baseUrl + username;
    } else {
      return platform.baseUrl + username;
    }
  }

  // Update user object when usernames change
  function updateUserObject() {
    socialPlatforms.forEach((platform) => {
      const username = usernames[platform.name];
      const fullUrl = constructFullUrl(platform, username);
      const dbColumnName = platform.name === 'website' ? 'web' : platform.name;
      user[dbColumnName] = fullUrl;
    });
  }

  // Handle input changes
  function handleInputChange(platformName, value) {
    usernames[platformName] = value;
    updateUserObject();
  }
</script>

<Card class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
  <CardHeader class="border-b border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50 p-8">
    <CardTitle class="text-3xl font-bold text-gray-900">Links & Social</CardTitle>
    <p class="mt-3 text-base text-gray-600">
      Connect your profile with social media and development platforms
    </p>
  </CardHeader>
  <CardContent class="p-8">
    <div class="space-y-8">
      {#each socialPlatforms as platform}
        <div class="space-y-3">
          <Label for={platform.name} class="text-base font-semibold text-gray-800">
            {platform.label}
          </Label>

          {#if platform.name === 'discord'}
            <!-- Discord doesn't need URL prefix -->
            <Input
              type={platform.type}
              id={platform.name}
              name={platform.name}
              value={usernames[platform.name] || ''}
              on:input={(e) => handleInputChange(platform.name, e.target.value)}
              placeholder={platform.displayPlaceholder}
              class="h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base focus:border-teal-500"
            />
          {:else}
            <!-- Other platforms with URL prefix display -->
            <div
              class="flex items-center overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50 focus-within:border-teal-500"
            >
              <span
                class="border-r border-gray-200 bg-gray-100 px-4 py-3 font-mono text-base text-gray-600"
              >
                {platform.baseUrl}
              </span>
              <Input
                type={platform.type}
                id={platform.name}
                name={platform.name === 'website' ? 'web' : platform.name}
                value={usernames[platform.name] || ''}
                on:input={(e) => handleInputChange(platform.name, e.target.value)}
                placeholder={platform.displayPlaceholder}
                class="h-14 flex-1 rounded-none border-0 bg-transparent px-4 text-base focus:border-0 focus:ring-0"
              />
            </div>
          {/if}

          <p class="text-sm text-gray-500">{platform.description}</p>

          <!-- Hidden inputs with full URLs for form submission -->
          <input
            type="hidden"
            name={platform.name === 'website' ? 'web' : platform.name}
            value={constructFullUrl(platform, usernames[platform.name])}
          />
        </div>
      {/each}
    </div>
  </CardContent>
</Card>
