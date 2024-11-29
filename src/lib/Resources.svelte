<!-- <div class="h-[392px] flex-col justify-start items-start gap-4 inline-flex w-full mt-20">
    <div class="inline-flex items-center self-stretch justify-start gap-1">
        <div class="text-center text-black text-[32px] font-normal font-['Roboto'] leading-loose">Resources</div>
    </div>
    <div class="self-stretch p-4 bg-[#ebebeb] justify-between items-center inline-flex">
        <div class="grow shrink basis-0 h-[132px] justify-start items-start gap-6 flex">
            <div class="w-20 h-20 p-2 bg-[#d9d9d9] justify-center items-center flex">
                <div class="relative flex flex-col items-start justify-start w-16 h-16"></div>
            </div>
            <div class="inline-flex flex-col items-start justify-start gap-2 grow shrink basis-0">
                <div class="inline-flex items-center justify-center gap-2">
                    <div class="w-6 h-6 p-1 bg-[#d9d9d9] rounded-full justify-center items-center flex">
                        <div class="relative flex flex-col items-start justify-start w-4 h-4"></div>
                    </div>
                    <div class="text-[#8a8a8a] text-sm font-normal font-['Roboto'] leading-[14px]">@username392</div>
                </div>
                <div class="inline-flex items-center justify-center gap-1">
                    <div class="text-center text-black text-xl font-medium font-['Roboto'] leading-7">UX Case Study for an Internship App in Sierra Leone</div>
                </div>
                <div class="self-stretch text-gray-700 text-sm font-normal font-['Roboto'] leading-tight">Description of the resource goes here. This is a brief summary of what the resource is about.</div>
                <div class="inline-flex items-center justify-start gap-3">
                    <div class="flex items-center justify-start gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8936 3.07333C13.5531 2.73267 13.1488 2.46243 12.7038 2.27805C12.2588 2.09368 11.7819 1.99878 11.3002 1.99878C10.8186 1.99878 10.3416 2.09368 9.89667 2.27805C9.4517 2.46243 9.04741 2.73267 8.70691 3.07333L8.00024 3.78L7.29358 3.07333C6.60578 2.38553 5.67293 1.99914 4.70024 1.99914C3.72755 1.99914 2.7947 2.38553 2.10691 3.07333C1.41911 3.76112 1.03271 4.69397 1.03271 5.66666C1.03271 6.63935 1.41911 7.5722 2.10691 8.26L8.00024 14.1533L13.8936 8.26C14.2342 7.91949 14.5045 7.51521 14.6889 7.07023C14.8732 6.62526 14.9681 6.14832 14.9681 5.66666C14.9681 5.185 14.8732 4.70807 14.6889 4.26309C14.5045 3.81812 14.2342 3.41383 13.8936 3.07333Z" stroke="#8C8C8C" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>

                        <div class="text-center text-black text-xs font-normal font-['Roboto'] leading-3">187</div>
                    </div>
                    <div class="flex items-center justify-start gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 7.66669C14.0023 8.5466 13.7967 9.41461 13.4 10.2C12.9296 11.1412 12.2065 11.9328 11.3116 12.4862C10.4168 13.0396 9.3855 13.3329 8.33333 13.3334C7.45342 13.3356 6.58541 13.1301 5.8 12.7334L2 14L3.26667 10.2C2.86995 9.41461 2.66437 8.5466 2.66667 7.66669C2.66707 6.61452 2.96041 5.58325 3.51381 4.68839C4.06722 3.79352 4.85884 3.0704 5.8 2.60002C6.58541 2.20331 7.45342 1.99772 8.33333 2.00002H8.66667C10.0562 2.07668 11.3687 2.66319 12.3528 3.64726C13.3368 4.63132 13.9233 5.94379 14 7.33335V7.66669Z" stroke="#8C8C8C" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>

                        <div class="text-center text-black text-xs font-normal font-['Roboto'] leading-3">64</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-start gap-2">
            <div class="relative w-6 h-6"></div>
        </div>
    </div>

</div> -->

<!-- ResourceCard.svelte -->
<script>
  import Icon from '@iconify/svelte';

  export let username = '@username';
  export let title = 'Resource Title';
  export let description =
    'Description of the resource goes here. This is a brief summary of what the resource is about.';
  export let likes = 0;
  export let comments = 0;
</script>

<div class="inline-flex flex-col items-start justify-start w-full gap-4 mt-10">
  <div class="self-stretch p-4 bg-[#ebebeb] justify-between items-center inline-flex">
    <div class="grow shrink basis-0 h-[132px] justify-start items-start gap-6 flex">
      <div class="w-20 h-20 p-2 bg-[#d9d9d9] justify-center items-center flex">
        <slot name="icon">
          <div class="relative flex flex-col items-start justify-start w-16 h-16"></div>
        </slot>
      </div>

      <div class="inline-flex flex-col items-start justify-start gap-2 grow shrink basis-0">
        <div class="inline-flex items-center justify-center gap-2">
          <div class="w-6 h-6 p-1 bg-[#d9d9d9] rounded-full justify-center items-center flex">
            <slot name="profile-icon">
              <div class="relative flex flex-col items-start justify-start w-4 h-4"></div>
            </slot>
          </div>
          <div class="text-[#8a8a8a] text-sm font-normal font-['Roboto'] leading-[14px]">
            {username}
          </div>
        </div>

        <div class="inline-flex items-center justify-center gap-1">
          <div class="text-center text-black text-xl font-medium font-['Roboto'] leading-7">
            {title}
          </div>
        </div>

        <div class="self-stretch text-gray-700 text-sm font-normal font-['Roboto'] leading-tight">
          {description}
        </div>

        <div class="inline-flex items-center justify-start gap-3">
          <div class="flex items-center justify-start gap-1">
            <slot name="like-icon">
              <Icon icon="mdi-light:heart" class="text-2xl" />
            </slot>
            <div class="text-center text-black text-xs font-normal font-['Roboto'] leading-3">
              {likes}
            </div>
          </div>
          <div class="flex items-center justify-start gap-1">
            <slot name="comment-icon">
              <Icon icon="bi:chat" class="text-2xl" />
            </slot>
            <div class="text-center text-black text-xs font-normal font-['Roboto'] leading-3">
              {comments}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
