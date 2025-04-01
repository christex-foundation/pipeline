<script>
  import { onMount } from 'svelte';
  import { dateTimeFormat } from '$lib/utils/dateTimeFormat.js';
  import UpdateDetail from '../lib/UpdateDetail.svelte';
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import { Badge } from '$lib/components/ui/badge';

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

  let date = dateTimeFormat(update.created_at);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };
</script>

<Card class="mb-4 w-full bg-white p-0">
  <CardHeader class="px-4 pb-0 pt-4 md:px-9 md:pt-9">
    <CardTitle class="text-2xl font-bold leading-tight text-[#282828] md:text-[32px] md:leading-10">
      {update.title}
    </CardTitle>
  </CardHeader>

  <CardContent class="px-4 py-2 md:px-9">
    <div
      class="flex flex-col items-start justify-start gap-1 self-stretch border-b border-[#dcdedd] pb-5"
    >
      <div class="inline-flex w-full items-center justify-start gap-3">
        <Avatar class="h-10 w-10 border border-[#dcdedd] md:h-[42px] md:w-[42px]">
          <AvatarImage
            src={update.userProfile.image && update.userProfile.image !== ''
              ? update.userProfile.image
              : defaultImageUrl}
            alt="User Profile"
          />
          <AvatarFallback>{getInitials(update.userProfile.name)}</AvatarFallback>
        </Avatar>

        <div class="inline-flex w-full flex-col justify-between">
          <div class="inline-flex items-center gap-2 self-stretch">
            <div
              class="max-w-[200px] truncate text-sm font-normal leading-normal text-[#282828] md:max-w-none"
            >
              {update.userProfile.name}
            </div>
            <Badge
              class="h-auto rounded-[3px] bg-[#05ce78] px-[5px] py-[0.25px] text-xs font-bold text-white"
            >
              {update.user_id === update.userProfile.user_id ? 'Creator' : 'Member'}
            </Badge>
          </div>
          <div class="text-[13px] font-normal leading-[18px] text-[#282828]/50">
            {date}
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 flex flex-col items-start justify-start gap-1 self-stretch">
      <div class="flex flex-col items-start justify-start gap-[30px] self-stretch pb-2">
        <div class="self-stretch text-base font-normal leading-relaxed text-[#282828]">
          {@html truncatedContent}
        </div>
      </div>
    </div>
  </CardContent>

  <CardFooter class="flex justify-between px-4 pb-4 pt-0 md:px-9 md:pb-9">
    <div class="flex items-center justify-start gap-6">
      <div class="flex items-center justify-start gap-2">
        <Icon icon="mdi:chat-outline" class="text-2xl text-[#8C8C8C]" />
        <div class="text-sm font-normal leading-normal text-[#9b9e9e]">0</div>
      </div>
    </div>

    <button
      variant="outline"
      on:click={showDetail}
      class="flex h-auto items-center justify-center gap-1.5 border border-[#d1d1d1] bg-white px-4 py-2 md:px-[19px] md:py-[11.50px]"
    >
      <span class="text-center text-sm font-normal text-[#222222]">Read more</span>
      <Icon icon="mdi:chevron-right" class="text-2xl" />
    </button>
  </CardFooter>
</Card>
