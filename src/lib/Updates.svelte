<script>
  import { onMount } from 'svelte';
  import { dateTimeFormat } from '$lib/utils/dateTimeFormat.js';
  import UpdateDetail from '../lib/UpdateDetail.svelte';
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  function showDetail() {
    dispatch('showDetail', { update }); 
  }

  export let update;

  console.log(update);

  const maxLength = 850;

  function truncateContent(content) {
    const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, ""); 
    return strippedContent.length > maxLength 
      ? strippedContent.slice(0, maxLength) + '...' 
      : strippedContent;
  }

  const truncatedContent = truncateContent(update.body);

  const defaultImageUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png';

  let date = '';
  date = dateTimeFormat(update.created_at);
</script>

<div class="inline-flex flex-col items-start justify-start w-full p-4 bg-white md:p-9">
  <div class="flex flex-col items-start self-stretch justify-start gap-2">
    <div class="w-full pt-[1.75px] flex-col justify-start items-start gap-[13.30px] flex">
      <div class="self-stretch text-[#282828] text-2xl md:text-[32px] font-bold font-['Inter'] leading-tight md:leading-10">
        {update.title}
      </div>
      <div class="self-stretch pb-5 border-b border-[#dcdedd] flex-col justify-start items-start gap-1 flex">
        <div class="inline-flex items-center justify-start w-full gap-3">
          <img
            loading="lazy"
            src={update.userProfile.image && update.userProfile.image !== '' 
              ? update.userProfile.image 
              : defaultImageUrl}
            alt="User Profile"
            class="w-10 h-10 md:w-[42px] md:h-[42px] rounded-full border border-[#dcdedd]"
          />

          <div class="inline-flex flex-col justify-between w-full">
            <div class="inline-flex items-center self-stretch gap-2">
              <div class="text-[#282828] text-sm font-normal font-['Inter'] leading-normal truncate max-w-[200px] md:max-w-none">
                {update.userProfile.name}
              </div>
              <div class="px-[5px] py-[0.25px] bg-[#05ce78] rounded-[3px] flex-col justify-center items-start inline-flex">
                <div class="text-white text-xs font-bold font-['Inter'] leading-[18px]">
                  {update.user_id === update.userProfile.user_id ? 'Creator' : 'Member'}
                </div>
              </div>
            </div>
            <div class="self-stretch text-[#282828]/50 text-[13px] font-normal font-['Inter'] leading-[18px]">
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-start self-stretch justify-start gap-1">
      <div class="self-stretch pb-2 flex-col justify-start items-start gap-[30px] flex">
        <div class="self-stretch text-[#282828] text-base font-normal font-['Inter'] leading-relaxed">
          {@html truncatedContent}
        </div>
      </div>
    </div>
    <div class="inline-flex items-center justify-between w-full">
      <div class="flex items-center justify-start gap-6">
        <div class="flex items-center justify-start gap-2">
          <Icon icon="mdi:chat-outline" class="text-2xl text-[#8C8C8C]" />
          <div class="text-[#9b9e9e] text-sm font-normal font-['Inter'] leading-normal">
            16
          </div>
        </div>
      </div>
      <button 
        on:click={showDetail} 
        class="px-4 md:px-[19px] py-2 md:py-[11.50px] bg-white border border-[#d1d1d1] justify-center items-center gap-1.5 flex"
      >
        <div class="text-center text-[#222222] text-sm font-normal">Read more</div>
        <Icon icon="mdi:chevron-right" class="text-2xl" />
      </button>
    </div>
  </div>
</div>