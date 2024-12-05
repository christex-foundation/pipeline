<!-- <script>
  import { dateTimeFormat } from '$lib/utils/dateTimeFormat.js';
  import UpdateDetail from '../lib/UpdateDetail.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function showDetail() {
    dispatch('showDetail', { update });
  }

  export let update;
  let date = '';
  date = dateTimeFormat(update.created_at);

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
              {date}
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
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.0403 4.61998C20.5296 4.10899 19.9231 3.70363 19.2557 3.42707C18.5882 3.1505 17.8728 3.00816 17.1503 3.00816C16.4278 3.00816 15.7124 3.1505 15.045 3.42707C14.3775 3.70363 13.7711 4.10899 13.2603 4.61998L12.2003 5.67998L11.1403 4.61998C10.1086 3.58829 8.70935 3.00869 7.25031 3.00869C5.79128 3.00869 4.39201 3.58829 3.36031 4.61998C2.32862 5.65167 1.74902 7.05095 1.74902 8.50998C1.74902 9.96901 2.32862 11.3683 3.36031 12.4L12.2003 21.24L21.0403 12.4C21.5513 11.8892 21.9567 11.2828 22.2332 10.6153C22.5098 9.94788 22.6521 9.23247 22.6521 8.50998C22.6521 7.78749 22.5098 7.07209 22.2332 6.40463C21.9567 5.73717 21.5513 5.13074 21.0403 4.61998Z"
              stroke="#8C8C8C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div
            class="w-[15.54px] h-6 text-[#9b9e9e] text-sm font-normal font-['Inter'] leading-normal"
          >
            13
          </div>
        </div>
        <div class="flex items-center justify-start gap-2">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.6602 11.51C21.6636 12.8298 21.3552 14.1319 20.7602 15.31C20.0546 16.7217 18.9699 17.9092 17.6276 18.7393C16.2853 19.5694 14.7384 20.0094 13.1602 20.01C11.8403 20.0134 10.5383 19.705 9.36016 19.11L3.66016 21.01L5.56016 15.31C4.96509 14.1319 4.65671 12.8298 4.66016 11.51C4.66077 9.93173 5.10077 8.38483 5.93088 7.04253C6.76098 5.70023 7.94841 4.61554 9.36016 3.90998C10.5383 3.31491 11.8403 3.00654 13.1602 3.00998H13.6602C15.7445 3.12497 17.7132 4.00474 19.1893 5.48084C20.6654 6.95693 21.5452 8.92563 21.6602 11.01V11.51Z"
              stroke="#8C8C8C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
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
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.82031 15.01L12.8203 10.01L7.82031 5.00998"
            stroke="#282828"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</div> -->


<script>
    import { onMount } from 'svelte';
	import {dateTimeFormat} from '$lib/utils/dateTimeFormat.js'
     import UpdateDetail from '../lib/UpdateDetail.svelte';
     import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function showDetail() {
        dispatch('showDetail', { update }); 
    }

    export let update;

    console.log(update)

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



<div class="inline-flex flex-col items-start justify-start bg-white p-9">
    <div class="flex flex-col items-start self-stretch justify-start gap-2">
        <div class=" pt-[1.75px] flex-col justify-start items-start gap-[13.30px] flex">
            <div class="self-stretch text-[#282828] text-[32px] font-bold font-['Inter'] leading-10">{update.title}</div>
            <div class="self-stretch h-[62px] pb-5 border-b border-[#dcdedd] flex-col justify-start items-start gap-1 flex">
                <div class="inline-flex items-center justify-start gap-3">
                    <!-- <img class="w-[42px] h-[42px] relative rounded-[42px] border border-[#dcdedd]"  src={user.image_url && user.image_url !== '' ? user.image_url : defaultImageUrl} alt=""/> -->
  
      <img
        loading="lazy"
        src={update.userProfile.image && update.userProfile.image !== '' ? update.userProfile.image : defaultImageUrl}
        alt="User Profile"
        class="w-[42px] h-[42px] relative rounded-[42px] border border-[#dcdedd]"
      />

                    <div class="inline-flex flex-col justify-between w-full ">
                        <div class="inline-flex items-center self-stretch justify-between gap-2">
                            <div class=" h-6 text-[#282828] text-sm font-normal font-['Inter'] leading-normal">{update.userProfile.name}</div>
                            <div class="px-[5px] py-[0.25px] bg-[#05ce78] rounded-[3px] flex-col justify-center items-start inline-flex">
                                <div class="text-white text-xs font-bold font-['Inter'] leading-[18px]">{update.user_id === update.userProfile.user_id ? 'Creator' : 'Member'}</div>
                            </div>
                        </div>
                        <div class="self-stretch h-[18px] text-[#282828]/50 text-[13px] font-normal font-['Inter'] leading-[18px]">{date}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-start self-stretch justify-start gap-1">
            <div class="self-stretch pb-2 flex-col justify-start items-start gap-[30px] flex">
                <div class="self-stretch text-[#282828] text-base font-normal font-['Inter'] leading-[29px]">{@html truncatedContent}</div>
            </div>
        </div>
        <div class="w-[744.66px] bg-gradient-to-b from-white to-white"></div>
        <div class="w-[744.66px] justify-between items-center inline-flex">
            <div class="flex items-center justify-start gap-6">
                <!-- <div class="flex items-center justify-start gap-2">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.0403 4.61998C20.5296 4.10899 19.9231 3.70363 19.2557 3.42707C18.5882 3.1505 17.8728 3.00816 17.1503 3.00816C16.4278 3.00816 15.7124 3.1505 15.045 3.42707C14.3775 3.70363 13.7711 4.10899 13.2603 4.61998L12.2003 5.67998L11.1403 4.61998C10.1086 3.58829 8.70935 3.00869 7.25031 3.00869C5.79128 3.00869 4.39201 3.58829 3.36031 4.61998C2.32862 5.65167 1.74902 7.05095 1.74902 8.50998C1.74902 9.96901 2.32862 11.3683 3.36031 12.4L12.2003 21.24L21.0403 12.4C21.5513 11.8892 21.9567 11.2828 22.2332 10.6153C22.5098 9.94788 22.6521 9.23247 22.6521 8.50998C22.6521 7.78749 22.5098 7.07209 22.2332 6.40463C21.9567 5.73717 21.5513 5.13074 21.0403 4.61998Z" stroke="#8C8C8C" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    <div class="w-[15.54px] h-6 text-[#9b9e9e] text-sm font-normal font-['Inter'] leading-normal">13</div>
                </div> -->
                <div class="flex items-center justify-start gap-2">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.6602 11.51C21.6636 12.8298 21.3552 14.1319 20.7602 15.31C20.0546 16.7217 18.9699 17.9092 17.6276 18.7393C16.2853 19.5694 14.7384 20.0094 13.1602 20.01C11.8403 20.0134 10.5383 19.705 9.36016 19.11L3.66016 21.01L5.56016 15.31C4.96509 14.1319 4.65671 12.8298 4.66016 11.51C4.66077 9.93173 5.10077 8.38483 5.93088 7.04253C6.76098 5.70023 7.94841 4.61554 9.36016 3.90998C10.5383 3.31491 11.8403 3.00654 13.1602 3.00998H13.6602C15.7445 3.12497 17.7132 4.00474 19.1893 5.48084C20.6654 6.95693 21.5452 8.92563 21.6602 11.01V11.51Z" stroke="#8C8C8C" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    <div class="w-[15.25px] h-6 text-[#9b9e9e] text-sm font-normal font-['Inter'] leading-normal">16</div>
                </div>
            </div>
            <button on:click={showDetail} class="px-[19px] py-[11.50px] bg-white border border-[#d1d1d1] justify-center items-center gap-1.5 flex">
                <div class="text-center text-[#222222] text-sm font-normal">Read more</div>
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.82031 15.01L12.8203 10.01L7.82031 5.00998" stroke="#282828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
        </div>
    </div>
</div>






