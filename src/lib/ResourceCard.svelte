<script>
  export let resource;
  //use this link  - resource.link
</script>

<div
  class="flex w-[315px] min-w-[240px] shrink grow flex-col items-center overflow-hidden rounded-xl border border-solid border-gray-100 bg-white p-4 shadow-md"
>
  <div class="flex w-full items-start gap-4">
    <div class="flex w-14 items-start gap-6">
      <img
        loading="lazy"
        src={resource.user_profile.image}
        alt=""
        class="aspect-square h-14 w-14 rounded-full bg-amber-200 object-contain"
      />
    </div>
    <div class="flex min-w-[240px] flex-1 shrink basis-0 flex-col">
      <div class="flex w-full items-start justify-between gap-10">
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
</div>
