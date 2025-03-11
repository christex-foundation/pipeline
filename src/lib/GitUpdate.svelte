<script>
  export let update;
  import Icon from '@iconify/svelte';
  import { dateTimeFormat } from '$lib/utils/dateTimeFormat.js';

  let date = '';
  date = dateTimeFormat(update.created_at);
</script>

<div class="inline-flex w-full flex-col items-start justify-start bg-white p-4 md:p-9">
  <div class="flex flex-col items-start justify-start gap-2 self-stretch">
    <div class="flex w-full flex-col items-start justify-start gap-[13.30px] pt-[1.75px]">
      <div
        class="self-stretch font-['Inter'] text-2xl font-bold leading-tight text-[#282828] md:text-[32px] md:leading-10"
      >
        {update.title}
      </div>
      <div
        class="flex flex-col items-start justify-start gap-1 self-stretch border-b border-[#dcdedd] pb-5"
      >
        <div class="inline-flex w-full items-center justify-start gap-3">
          <img
            loading="lazy"
            src={update.user.avatar_url}
            alt="User Profile"
            class="h-10 w-10 rounded-full border border-[#dcdedd] md:h-[42px] md:w-[42px]"
          />

          <div class="inline-flex w-full flex-col justify-between">
            <div class="flex justify-between">
              <div class="inline-flex items-center gap-2 self-stretch">
                <div
                  class="max-w-[200px] truncate font-['Inter'] text-sm font-normal leading-normal text-[#282828] md:max-w-none"
                >
                  <a
                    href={update.user.html_url}
                    target="_blank"
                    class="text-2xl font-bold text-[#0B383C] hover:underline"
                  >
                    {update.user.login}
                  </a>
                </div>
                <div
                  class="inline-flex flex-col items-start justify-center rounded-[3px] bg-[#05ce78] px-[5px] py-[0.25px]"
                >
                  <div class="font-['Inter'] text-xs font-bold leading-[18px] text-white">
                    <!-- {update.user_id === update.userProfile.user_id ? 'Creator' : 'Member'} -->
                    Github
                  </div>
                </div>
              </div>

              <div class="mt-2 flex justify-end">
                <a
                  href={update.merged_url}
                  target="_blank"
                  class="font-mediu rounded-md bg-[#0B383C] px-1 py-1 text-[0.625rem] text-white transition hover:bg-opacity-80"
                >
                  View PR Code
                </a>
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
    <!-- <div class="flex flex-col items-start self-stretch justify-start gap-1">
        <div class="flex flex-col items-start justify-start gap-[30px] self-stretch pb-2">
          <div
            class="self-stretch font-['Inter'] text-base font-normal leading-relaxed text-[#282828]"
          >
       Project description
          </div>
        </div>
      </div> -->
    <div class="inline-flex w-full items-center justify-between">
      <div class="flex items-center justify-start gap-6">
        <div class="flex items-center justify-start gap-2">
          <Icon icon="radix-icons:commit" class="text-2xl text-[#8C8C8C]" />
          <div class="font-['Inter'] text-sm font-normal leading-normal text-[#9b9e9e]">16</div>
        </div>
      </div>
    </div>
  </div>
</div>
