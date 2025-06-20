<script>
  export let user = {};

  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import Icon from '@iconify/svelte';

  let bannerImage = user.banner_url || null;
  let profileImage = user.image_url || null;

  function handleBannerUpload(event) {
    const file = event.target.files[0];
    if (file) {
      bannerImage = URL.createObjectURL(file);
    }
  }

  function handleProfileUpload(event) {
    const file = event.target.files[0];
    if (file) {
      profileImage = URL.createObjectURL(file);
    }
  }
</script>

<div class="rounded-2xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6 shadow-card">
  <div class="mb-6">
    <h2 class="mb-2 text-heading-xl font-semibold text-white">Profile Information</h2>
    <p class="text-body-lg text-gray-300">Update your profile details and upload your images</p>
  </div>

  <input type="hidden" name="old_image" value={user.image_url} />
  <input type="hidden" name="old_banner" value={user.banner_url} />

  <!-- Image Upload Section -->
  <div class="relative mb-[100px] h-[295.61px] self-stretch">
    <label for="banner-upload" class="cursor-pointer">
      <div
        class="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-dashboard-gray-600 bg-dashboard-gray-800 transition-colors hover:border-dashboard-purple-500 hover:bg-dashboard-gray-700"
      >
        {#if bannerImage}
          <img src={bannerImage} alt="Banner" class="h-full w-full rounded-2xl object-cover" />
        {:else}
          <div class="text-center text-gray-400">
            <Icon icon="mdi:image-plus" class="mx-auto mb-2 text-4xl" />
            <div class="text-body-lg font-medium">Click to upload banner image</div>
            <div class="text-body-sm">PNG, JPG, WEBP up to 10MB</div>
          </div>
        {/if}
      </div>
    </label>
    <input
      type="file"
      id="banner-upload"
      class="hidden"
      name="banner"
      accept="image/*"
      on:change={handleBannerUpload}
    />

    <label for="profile-upload" class="cursor-pointer">
      <div
        class="absolute bottom-[-92.6px] left-[46.69px] flex h-[185.19px] w-[185.19px] items-center justify-center overflow-hidden rounded-full border-8 border-dashboard-gray-900 bg-dashboard-gray-800 shadow-card transition-shadow hover:shadow-cardHover max-lg:left-[20.69px] max-md:left-[46.69px]"
      >
        {#if profileImage}
          <img src={profileImage} alt="Profile" class="h-full w-full rounded-full object-cover" />
        {:else}
          <div class="text-center text-gray-400">
            <Icon icon="mdi:account-plus" class="mx-auto mb-1 text-3xl" />
            <div class="text-body-sm font-medium">Profile Picture</div>
          </div>
        {/if}
      </div>
    </label>
    <input
      type="file"
      id="profile-upload"
      class="hidden"
      name="image"
      accept="image/*"
      on:change={handleProfileUpload}
    />
  </div>

  <!-- Form Fields -->
  <div class="space-y-8">
    <!-- Full Name -->
    <div class="space-y-3">
      <Label for="firstName" class="text-label-lg font-medium text-gray-300">Full Name *</Label>
      <Input
        type="text"
        id="firstName"
        name="name"
        value={user.display_name}
        required
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
      <p class="text-body-sm text-gray-400">This is how your name will appear on your profile</p>
    </div>

    <!-- Email -->
    <div class="space-y-3">
      <Label for="email" class="text-label-lg font-medium text-gray-300">Email Address</Label>
      <Input
        type="email"
        id="email"
        value={user.email}
        disabled
        class="w-full rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-700 px-4 py-3 text-body-lg text-gray-400"
      />
      <p class="text-body-sm text-gray-400">Email address cannot be changed</p>
    </div>

    <!-- Bio -->
    <div class="space-y-3">
      <Label for="bio" class="text-label-lg font-medium text-gray-300">Bio</Label>
      <Textarea
        id="bio"
        name="bio"
        value={user.bio}
        placeholder="Tell us a little bit about yourself and your interests..."
        class="min-h-[120px] w-full resize-none rounded-lg border border-dashboard-gray-600 bg-dashboard-gray-800 px-4 py-3 text-body-lg text-white focus:border-dashboard-purple-500 focus:outline-none focus:ring-2 focus:ring-dashboard-purple-500"
      />
      <p class="text-body-sm text-gray-400">
        Share your background, interests, and what drives your work
      </p>
    </div>
  </div>
</div>
