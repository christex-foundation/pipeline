<script>
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import Icon from '@iconify/svelte';

  export let username = '@username';
  export let title = 'Resource Title';
  export let description =
    'Description of the resource goes here. This is a brief summary of what the resource is about.';
  export let likes = 0;
  export let comments = 0;
</script>

<div class="mt-10 inline-flex w-full flex-col items-start justify-start gap-4">
  <Card class="w-full bg-gray-200 p-0 shadow-none">
    <CardContent class="flex h-full items-start justify-start gap-6 p-4">
      <div class="flex h-20 w-20 items-center justify-center bg-gray-300">
        <slot name="icon">
          <div class="relative flex h-16 w-16 flex-col items-start justify-start"></div>
        </slot>
      </div>

      <div class="inline-flex flex-1 flex-col items-start justify-start gap-2">
        <div class="inline-flex items-center justify-center gap-2">
          <Avatar class="h-6 w-6 bg-gray-300">
            <slot name="profile-icon">
              <AvatarFallback class="text-xs">U</AvatarFallback>
            </slot>
          </Avatar>
          <div class="font-sans text-sm font-normal text-gray-500">
            {username}
          </div>
        </div>

        <div class="inline-flex items-center justify-center gap-1">
          <div class="text-center text-xl font-medium text-black">
            {title}
          </div>
        </div>

        <div class="self-stretch text-sm font-normal text-gray-700">
          {description}
        </div>

        <div class="inline-flex items-center justify-start gap-3">
          <div class="flex items-center justify-start gap-1">
            <slot name="like-icon">
              <Icon icon="mdi-light:heart" class="text-2xl" />
            </slot>
            <div class="text-center text-xs font-normal text-black">
              {likes}
            </div>
          </div>
          <div class="flex items-center justify-start gap-1">
            <slot name="comment-icon">
              <Icon icon="bi:chat" class="text-2xl" />
            </slot>
            <div class="text-center text-xs font-normal text-black">
              {comments}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>
