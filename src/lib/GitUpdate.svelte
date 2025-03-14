<script>
  export let update;
  import Icon from '@iconify/svelte';
  import { dateTimeFormat } from '$lib/utils/dateTimeFormat.js';

  let date = '';
  date = dateTimeFormat(update.created_at);
</script>

<div
  class="inline-flex w-full flex-col items-start justify-start bg-white p-4 max-md:w-full md:p-9"
>
  <div class="flex flex-col items-start justify-start gap-2 self-stretch">
    <div class="flex w-full flex-col items-start justify-start gap-[13.30px] pt-[1.75px]">
      <div
        class="self-stretch font-['Inter'] text-2xl leading-tight font-bold text-[#282828] max-md:text-xl md:text-[32px] md:leading-10"
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
            <div class="flex flex-col sm:flex-row sm:justify-between">
              <div class="inline-flex items-center gap-2 self-stretch">
                <div
                  class="max-w-[200px] truncate font-['Inter'] text-sm leading-normal font-normal text-[#282828] md:max-w-none"
                >
                  <a
                    href={update.user.html_url}
                    target="_blank"
                    class="text-2xl font-bold text-[#0B383C] hover:underline max-md:text-xl"
                  >
                    {update.user.login}
                  </a>
                </div>
                <div
                  class="inline-flex flex-col items-start justify-center rounded-[3px] bg-[#05ce78] px-[5px] py-[0.25px]"
                >
                  <div class="font-['Inter'] text-xs leading-[18px] font-bold text-white">
                    Github
                  </div>
                </div>
              </div>

              <div class="mt-2 flex justify-end">
                <a
                  href={update.merged_url}
                  target="_blank"
                  class="hover:bg-opacity-80 rounded-md bg-[#0B383C] px-1 py-1 text-[0.625rem] font-medium text-white transition max-md:w-[60px] max-md:text-[0.45rem]"
                >
                  View PR Code
                </a>
              </div>
            </div>

            <div
              class="self-stretch font-['Inter'] text-[13px] leading-[18px] font-normal text-[#282828]/50"
            >
              {date}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="inline-flex w-full items-center justify-between">
      <div class="flex items-center justify-start gap-6">
        <div class="flex items-center justify-start gap-2">
          <Icon icon="radix-icons:commit" class="text-2xl text-[#8C8C8C]" />
          <div class="font-['Inter'] text-sm leading-normal font-normal text-[#9b9e9e]">16</div>
        </div>
      </div>
    </div>
  </div>
</div>
