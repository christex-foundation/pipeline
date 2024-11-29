<script>
  import DateTimeFormat from './DateTimeFormat.svelte';
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
</script>

<div class="h-[567.35px] p-9 bg-white flex-col justify-start items-start inline-flex">
  <div class="self-stretch h-[495.35px] flex-col justify-start items-start gap-6 flex">
    <div class="h-[188.35px] pt-[1.75px] flex-col justify-start items-start gap-[13.30px] flex">
      <div class="self-stretch text-[#282828] text-[32px] font-bold font-['Inter'] leading-10">
        {update.title}
      </div>
      <div
        class="self-stretch h-[62px] pb-5 border-b border-[#dcdedd] flex-col justify-start items-start gap-1 flex"
      >
        <div class="inline-flex items-center justify-start gap-3">
          <img
            class="w-[42px] h-[42px] relative rounded-[42px] border border-[#dcdedd]"
            src="https://via.placeholder.com/42x42"
            alt=""
          />
          <div class="w-[120.07px] flex-col justify-start items-start inline-flex">
            <div class="inline-flex items-center self-stretch justify-start gap-2">
              <div
                class="w-[57.07px] h-6 text-[#282828] text-sm font-normal font-['Inter'] leading-normal"
              >
                {update.userProfile.name}
              </div>
              <div
                class="px-[5px] py-[0.25px] bg-[#05ce78] rounded-[3px] flex-col justify-center items-start inline-flex"
              >
                <div class="text-white text-xs font-bold font-['Inter'] leading-[18px]">
                  {update.user_id === update.userProfile.user_id ? 'Creator' : 'Member'}
                </div>
              </div>
            </div>
            <div
              class="self-stretch h-[18px] text-[#282828]/50 text-[13px] font-normal font-['Inter'] leading-[18px]"
            >
              <DateTimeFormat date={update.created_at} />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="self-stretch h-[216px] flex-col justify-start items-start gap-1 flex">
      <div class="self-stretch h-[216px] pb-2 flex-col justify-start items-start gap-[30px] flex">
        <div
          class="self-stretch text-[#282828] text-base font-normal font-['Inter'] leading-[29px]"
        >
          {@html truncatedContent}
        </div>
      </div>
    </div>
    <div class="w-[744.66px] h-[120px] bg-gradient-to-b from-white to-white"></div>
    <div class="w-[744.66px] justify-between items-center inline-flex">
      <div class="flex items-center justify-start gap-6">
        <div class="flex items-center justify-start gap-2">
          <Icon icon="mdi-light:heart" class="text-2xl" />
          <div
            class="w-[15.54px] h-6 text-[#9b9e9e] text-sm font-normal font-['Inter'] leading-normal"
          >
            13
          </div>
        </div>
        <div class="flex items-center justify-start gap-2">
          <Icon icon="mdi:chat-outline" class="text-2xl" />
          <div
            class="w-[15.25px] h-6 text-[#9b9e9e] text-sm font-normal font-['Inter'] leading-normal"
          >
            16
          </div>
        </div>
      </div>
      <button
        on:click={showDetail}
        class="px-[19px] py-[11.50px] bg-white border border-[#d1d1d1] justify-center items-center gap-1.5 flex"
      >
        <div class="text-center text-[#222222] text-sm font-normal">Read more</div>
        <Icon icon="mdi:chevron-right" class="text-2xl" />
      </button>
    </div>
  </div>
</div>
