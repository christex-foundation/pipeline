<!-- <script>
  export let update;
  import Icon from '@iconify/svelte';
  import { dateTimeFormat } from '$lib/utils/dateTimeFormat.js';

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
            src={update.user.avatar_url}
            alt="User Profile"
            class="h-10 w-10 rounded-full border border-[#dcdedd] md:h-[42px] md:w-[42px]"
          />

          <div class="inline-flex flex-col justify-between w-full">
            <div class="flex justify-between">
              <div class="inline-flex items-center self-stretch gap-2">
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
                    Github
                  </div>
                </div>
              </div>

              <div class="flex justify-end mt-2">
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
    <div class="inline-flex items-center justify-between w-full">
      <div class="flex items-center justify-start gap-6">
        <div class="flex items-center justify-start gap-2">
          <Icon icon="radix-icons:commit" class="text-2xl text-[#8C8C8C]" />
          <div class="font-['Inter'] text-sm font-normal leading-normal text-[#9b9e9e]">16</div>
        </div>
      </div>
    </div>
  </div>
</div> -->


<script>
  export let update;
  import Icon from '@iconify/svelte';
  import { dateTimeFormat } from '$lib/utils/dateTimeFormat.js';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';


  let date = '';
  date = dateTimeFormat(update.created_at);
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };
</script>

<Card class="w-full mb-4 bg-white">
  <CardHeader class="pb-2">
    <CardTitle class="text-2xl font-bold text-[#282828] md:text-[32px] md:leading-10">
      {update.title}
    </CardTitle>
  </CardHeader>
  
  <CardContent class="px-4 py-2 md:px-6">
    <div class="flex items-center justify-start gap-3 pb-5 border-b border-[#dcdedd]">
      <Avatar class="h-10 w-10 border border-[#dcdedd] md:h-[42px] md:w-[42px]">
        <AvatarImage src={update.user.avatar_url} alt="User Profile" />
        <AvatarFallback>{getInitials(update.user.login)}</AvatarFallback>
      </Avatar>
      
      <div class="inline-flex flex-col justify-between w-full">
        <div class="flex justify-between">
          <div class="inline-flex items-center self-stretch gap-2">
            <div class="max-w-[200px] truncate font-['Inter'] text-sm md:max-w-none">
              <a
                href={update.user.html_url}
                target="_blank"
                class="text-2xl font-bold text-[#0B383C] hover:underline"
              >
                {update.user.login}
              </a>
            </div>
            <Badge class="bg-[#05ce78] text-white px-[5px] py-[0.25px] h-auto rounded-[3px]">
              Github
            </Badge>
          </div>

          <div class="flex justify-end mt-2">
            <Button 
              variant="default" 
              size="sm" 
              asChild
              class="bg-[#0B383C] hover:bg-[#0B383C]/80 text-[0.625rem] text-white h-auto py-1 px-1"
            >
              <a href={update.merged_url} target="_blank">
                View PR Code
              </a>
            </Button>
          </div>
        </div>

        <div class="text-[13px] font-normal leading-[18px] text-[#282828]/50">
          {date}
        </div>
      </div>
    </div>
  </CardContent>
  
  <CardFooter class="px-4 pt-0 md:px-6">
    <div class="inline-flex items-center justify-between w-full">
      <div class="flex items-center justify-start gap-6">
        <div class="flex items-center justify-start gap-2">
          <Icon icon="radix-icons:commit" class="text-2xl text-[#8C8C8C]" />
          <div class="font-['Inter'] text-sm font-normal leading-normal text-[#9b9e9e]">16</div>
        </div>
      </div>
    </div>
  </CardFooter>
</Card>