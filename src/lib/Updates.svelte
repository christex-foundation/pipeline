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

  const maxLength = 850;

  function truncateContent(content) {
    const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, '');
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
    <div class="flex w-full flex-col items-start justify-start gap-[13.30px] pt-[1.75px]">
      <div
        class="self-stretch font-['Inter'] text-2xl font-bold leading-tight text-[#282828] md:text-[32px] md:leading-10"
      >
        {update.title}
      </div>
      <div
        class="flex flex-col items-start justify-start gap-1 self-stretch border-b border-[#dcdedd] pb-5"
      >
        <div class="inline-flex items-center justify-start w-full gap-3">
          <img
            loading="lazy"
            src={update.userProfile.image && update.userProfile.image !== ''
              ? update.userProfile.image
              : defaultImageUrl}
            alt="User Profile"
            class="h-10 w-10 rounded-full border border-[#dcdedd] md:h-[42px] md:w-[42px]"
          />

          <div class="inline-flex flex-col justify-between w-full">
            <div class="inline-flex items-center self-stretch gap-2">
              <div
                class="max-w-[200px] truncate font-['Inter'] text-sm font-normal leading-normal text-[#282828] md:max-w-none"
              >
                {update.userProfile.name}
              </div>
              <div
                class="inline-flex flex-col items-start justify-center rounded-[3px] bg-[#05ce78] px-[5px] py-[0.25px]"
              >
                <div class="font-['Inter'] text-xs font-bold leading-[18px] text-white">
                  {update.user_id === update.userProfile.user_id ? 'Creator' : 'Member'}
                </div>
              </div>
            </div>
            <div
              class="self-stretch font-['Inter'] text-[13px] font-normal leading-[18px] text-[#282828]/50"
            >
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-start self-stretch justify-start gap-1">
      <div class="flex flex-col items-start justify-start gap-[30px] self-stretch pb-2">
        <div
          class="self-stretch font-['Inter'] text-base font-normal leading-relaxed text-[#282828]"
        >
          {@html truncatedContent}
        </div>
      </div>
    </div>
    <div class="inline-flex items-center justify-between w-full">
      <div class="flex items-center justify-start gap-6">
        <div class="flex items-center justify-start gap-2">
          <Icon icon="mdi:chat-outline" class="text-2xl text-[#8C8C8C]" />
          <div class="font-['Inter'] text-sm font-normal leading-normal text-[#9b9e9e]">16</div>
        </div>
      </div>
      <button
        on:click={showDetail}
        class="flex items-center justify-center gap-1.5 border border-[#d1d1d1] bg-white px-4 py-2 md:px-[19px] md:py-[11.50px]"
      >
        <div class="text-center text-sm font-normal text-[#222222]">Read more</div>
        <Icon icon="mdi:chevron-right" class="text-2xl" />
      </button>
    </div>
  </div>
</div>
