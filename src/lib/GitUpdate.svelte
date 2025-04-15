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

<Card class="w-full p-4 mb-4 bg-white md:p-6">
  <CardHeader class="px-0 pb-2">
    <CardTitle class="text-xl font-bold text-[#282828] md:text-2xl">
      {update.title}
    </CardTitle>
  </CardHeader>

  <CardContent class="px-0 py-2">
    <div class="flex flex-col gap-1 border-b border-[#dcdedd] pb-5">
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center min-w-0 gap-3"> 
          <Avatar class="h-10 w-10 shrink-0 border border-[#dcdedd] md:h-[42px] md:w-[42px]">
            <AvatarImage src={update.user.avatar_url} alt="User Profile" />
            <AvatarFallback>{getInitials(update.user.login)}</AvatarFallback>
          </Avatar>

          <div class="flex-1 min-w-0"> 
            <div class="flex items-center gap-2">
              <a
                href={update.user.html_url}
                target="_blank"
                class="truncate text-lg font-bold text-[#0B383C] hover:underline"
              >
                {update.user.login}
              </a>
              <Badge class="h-auto shrink-0 rounded-[3px] bg-[#05ce78] px-[5px] py-[0.25px] text-white">
                Github
              </Badge>
            </div>
            <div class="text-xs text-[#282828]/50">
              {date}
            </div>
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          asChild
          class="h-auto shrink-0 bg-[#0B383C] px-2 py-1 text-xs text-white hover:bg-[#0B383C]/80 whitespace-nowrap"
        >
          <a href={update.merged_url} target="_blank">View PR</a>
        </Button>
      </div>
    </div>
  </CardContent>

  <CardFooter class="px-0 pt-0">
    <div class="flex items-center gap-2 text-sm text-[#9b9e9e]">
      <Icon icon="radix-icons:commit" class="text-xl text-[#8C8C8C]" />
      <span>{update.commits}</span>
    </div>
  </CardFooter>
</Card>
