<!-- <script>
  export let resource;
  //use this link  - resource.link
</script>

<div
  class="flex w-[315px] min-w-[240px] shrink grow flex-col items-center overflow-hidden rounded-xl border border-solid border-gray-100 bg-white p-4 shadow-md"
>
  <div class="flex items-start w-full gap-4">
    <div class="flex items-start gap-6 w-14">
      <img
        loading="lazy"
        src={resource.user_profile.image}
        alt=""
        class="object-contain rounded-full aspect-square h-14 w-14 bg-amber-200"
      />
    </div>
    <div class="flex min-w-[240px] flex-1 shrink basis-0 flex-col">
      <div class="flex items-start justify-between w-full gap-10">
        <div class="flex flex-col justify-center">
          <h3 class="text-sm font-semibold leading-none text-black">{resource.title}</h3>
          <p class="mt-1 text-xs leading-tight text-neutral-400">{resource.user_profile.name}</p>
        </div>
        <a href={resource.link} target="_blank">
          <div
            class="inline-flex h-5 items-center justify-center rounded-md border border-[#0B383C] bg-[#0B383C] px-4 py-1"
          >
            <div class="text-md font-['Jost'] font-normal leading-3 text-white">
              {resource.type_resource}
            </div>
          </div>
        </a>
      </div>
      <p class="mt-3 pb-4 font-['Inter'] text-xs leading-5 text-['305661'] text-slate-600">
        {resource.reason}
      </p>
    </div>
  </div>
</div> -->



<script>
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";

  export let resource;
</script>
<!-- 
<Card class="w-[315px] min-w-[240px] rounded-xl border border-gray-100 bg-white shadow-md fex-col p-4">
  <CardHeader class="flex flex-row items-start gap-4 p-4">
    <Avatar class="rounded-full h-14 w-14">
      <AvatarImage src={resource.user_profile.image} alt="Profile Image" />
      <AvatarFallback class="bg-amber-200">
      </AvatarFallback>
    </Avatar>
    <div class="flex-1 space-y-2">
      <div class="flex items-start justify-between">
        <div>
          <CardTitle class="text-sm font-semibold leading-none text-black">
            {resource.title}
          </CardTitle>
          <CardDescription class="mt-1 text-xs leading-tight text-neutral-400">
            {resource.user_profile.name}
          </CardDescription>
        </div>
        <a href={resource.link} target="_blank">
          <Button class="h-5 rounded-md bg-[#0B383C] px-4 py-1 text-xs text-white hover:bg-[#0B383C]/90">
            {resource.type_resource}
          </Button>
        </a>
      </div>
      <CardContent class="p-0">
        <p class="text-xs leading-5 text-slate-600">
          {resource.reason}
        </p>
      </CardContent>
    </div>
  </CardHeader>
</Card> -->


<Card class="flex w-[315px] min-w-[240px] shrink grow flex-col items-start overflow-hidden rounded-xl border border-solid border-gray-100 bg-white p-4 shadow-md ">
  <div class="flex items-start w-full gap-4">
    <Avatar class="flex-shrink-0 rounded-full h-14 w-14">
      <AvatarImage src={resource.user_profile.image} alt="Profile Image"  />
      <AvatarFallback class="bg-amber-200">
        <img
        src="https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png" 
        alt="Fallback Image"
        class="object-cover w-full h-full rounded-full"
      />
      </AvatarFallback>
    </Avatar>

    <div class="flex-1 w-full">
      <CardTitle class="text-base font-semibold leading-none text-black truncate">
        {resource.title}
      </CardTitle>
      <CardDescription class="mt-1 text-sm leading-tight truncate text-neutral-400">
        {resource.user_profile.name}
      </CardDescription>
    </div>

    <a href={resource.link} target="_blank" class="flex-shrink-0">
      <Button class="h-5 rounded-md bg-[#0B383C] px-4 py-1 text-xs text-white hover:bg-[#0B383C]/90">
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