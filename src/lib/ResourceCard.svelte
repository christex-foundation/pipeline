<script>
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

  export let resource;
</script>

<!-- <Card
  class="flex w-[315px] min-w-[240px] shrink grow flex-col items-start overflow-hidden rounded-xl border border-solid border-gray-100 bg-white p-4 shadow-md "
>
  <div class="flex w-full items-start gap-4">
    <Avatar class="h-14 w-14 flex-shrink-0 rounded-full">
      <AvatarImage src={resource.user_profile.image} alt="Profile Image" />
      <AvatarFallback class="bg-amber-200">
    
        <img
          src="https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png"
          alt="Fallback Image"
          class="h-full w-full rounded-full object-cover"
        />
      </AvatarFallback>
    </Avatar>

    <div class="w-full flex-1">
      <CardTitle class="truncate text-base font-semibold leading-none text-black">
        {resource.title}
      </CardTitle>
      <CardDescription class="mt-1 truncate text-sm leading-tight text-neutral-400">
        {resource.user_profile.name}
      </CardDescription>
    </div>

    <a href={resource.link} target="_blank" class="flex-shrink-0">
      <Button
        class="h-5 rounded-md bg-[#0B383C] px-4 py-1 text-xs text-white hover:bg-[#0B383C]/90"
      >
        {resource.type_resource}
      </Button>
    </a>
  </div>

  <div class="mt-2">
    <p class="text-xs leading-5 text-slate-600">
      {resource.reason}
    </p>
  </div>
</Card> -->

<Card
  class="flex w-[315px] min-w-[240px] shrink grow flex-col items-start overflow-hidden rounded-xl border border-solid border-gray-100 bg-white p-4 shadow-md"
>
  <div class="flex w-full items-start gap-4">
    <Avatar class="h-14 w-14 flex-shrink-0 rounded-full">
      <AvatarImage src={resource.user_profile.image} alt="Profile Image" />
      <AvatarFallback class="bg-amber-200">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src="https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png"
          alt="Fallback Image"
          class="h-full w-full rounded-full object-cover"
        />
      </AvatarFallback>
    </Avatar>

    <div class="w-full flex-1 min-w-0">
      <CardTitle class="truncate text-base font-semibold leading-none text-black">
        {resource.title}
      </CardTitle>
      <CardDescription class="mt-1 truncate text-sm leading-tight text-neutral-400">
        {#if resource.user_profile.name.length > 12}
          <span class="hidden md:inline">{resource.user_profile.name}</span>
          <span class="md:hidden">{resource.user_profile.name.substring(0, 10)}...</span>
        {:else}
          {resource.user_profile.name}
        {/if}
      </CardDescription>
    </div>

    <a href={resource.link} target="_blank" class="flex-shrink-0">
      <Button
        class="h-5 rounded-md bg-[#0B383C] px-4 py-1 text-xs text-white hover:bg-[#0B383C]/90"
      >
        {resource.type_resource}
      </Button>
    </a>
  </div>

  <div class="mt-2">
    <p class="text-xs leading-5 text-slate-600">
      {resource.reason}
    </p>
  </div>
</Card>