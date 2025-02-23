<script>
    export let title;
    export let author;
    export let category;
    export let description;
    export let imageUrl;

    
    </script>
    
    <div class="flex overflow-hidden flex-col grow shrink items-center p-4 bg-white rounded-xl border border-gray-100 border-solid shadow-md min-w-[240px] w-[315px]">
      <div class="flex items-start w-full gap-4">
        <div class="flex items-start gap-6 w-14">
          <img loading="lazy" src={imageUrl} alt="" class="object-contain rounded-full w-14 h-14 bg-amber-200 aspect-square" />
        </div>
        <div class="flex flex-col flex-1 shrink basis-0 min-w-[240px]">
          <div class="flex items-start justify-between w-full gap-10">
            <div class="flex flex-col justify-center">
              <h3 class="text-sm font-semibold leading-none text-black">{title}</h3>
              <p class="mt-1 text-xs leading-tight text-neutral-400">{author}</p>
            </div>
            <div class="h-5 px-2 py-1 bg-[#e9f5d3] rounded-md border border-[#d5e1bf] justify-center items-center inline-flex">
                <div class="text-[#516027] text-xs font-normal font-['Jost'] leading-3">{category}</div>
            </div>
          </div>
          <p class="pb-4 mt-3 text-xs leading-5 text-slate-600 font-['Inter'] text-['305661']">{description}</p>
          
        </div>
      </div>
    </div>