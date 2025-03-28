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

<Card class="w-full bg-white p-4 md:p-6">
  <CardHeader class="pb-2 px-0">
    <CardTitle class="text-xl font-bold text-[#282828] md:text-2xl">
      {update.title}
    </CardTitle>
  </CardHeader>
  
  <CardContent class="px-0 py-2">
    <div class="flex flex-col gap-1 pb-5 border-b border-[#dcdedd]">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <Avatar class="h-10 w-10 border border-[#dcdedd] md:h-[42px] md:w-[42px]">
            <AvatarImage src={update.user.avatar_url} alt="User Profile" />
            <AvatarFallback>{getInitials(update.user.login)}</AvatarFallback>
          </Avatar>
          
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <a
                href={update.user.html_url}
                target="_blank"
                class="text-lg font-bold text-[#0B383C] hover:underline truncate max-w-[200px] md:max-w-none"
              >
                {update.user.login}
              </a>
              <Badge class="bg-[#05ce78] text-white px-[5px] py-[0.25px] h-auto rounded-[3px]">
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
          class="bg-[#0B383C] hover:bg-[#0B383C]/80 text-xs text-white h-auto py-1 px-2"
        >
          <a href={update.merged_url} target="_blank">
            View PR Code
          </a>
        </Button>
      </div>
    </div>
  </CardContent>
  
  <CardFooter class="px-0 pt-0">
    <div class="flex items-center gap-2 text-sm text-[#9b9e9e]">
      <Icon icon="radix-icons:commit" class="text-xl text-[#8C8C8C]" />
      <span>16</span>
    </div>
  </CardFooter>
</Card>