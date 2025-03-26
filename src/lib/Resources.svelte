<!-- <script>
  import Icon from '@iconify/svelte';

  export let username = '@username';
  export let title = 'Resource Title';
  export let description =
    'Description of the resource goes here. This is a brief summary of what the resource is about.';
  export let likes = 0;
  export let comments = 0;
</script>

<div class="inline-flex flex-col items-start justify-start w-full gap-4 mt-10">
  <div class="inline-flex items-center justify-between self-stretch bg-[#ebebeb] p-4">
    <div class="flex h-[132px] shrink grow basis-0 items-start justify-start gap-6">
      <div class="flex h-20 w-20 items-center justify-center bg-[#d9d9d9] p-2">
        <slot name="icon">
          <div class="relative flex flex-col items-start justify-start w-16 h-16"></div>
        </slot>
      </div>

      <div class="inline-flex flex-col items-start justify-start gap-2 shrink grow basis-0">
        <div class="inline-flex items-center justify-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#d9d9d9] p-1">
            <slot name="profile-icon">
              <div class="relative flex flex-col items-start justify-start w-4 h-4"></div>
            </slot>
          </div>
          <div class="font-['Roboto'] text-sm font-normal leading-[14px] text-[#8a8a8a]">
            {username}
          </div>
        </div>

        <div class="inline-flex items-center justify-center gap-1">
          <div class="text-center font-['Roboto'] text-xl font-medium leading-7 text-black">
            {title}
          </div>
        </div>

        <div class="self-stretch font-['Roboto'] text-sm font-normal leading-tight text-gray-700">
          {description}
        </div>

        <div class="inline-flex items-center justify-start gap-3">
          <div class="flex items-center justify-start gap-1">
            <slot name="like-icon">
              <Icon icon="mdi-light:heart" class="text-2xl" />
            </slot>
            <div class="text-center font-['Roboto'] text-xs font-normal leading-3 text-black">
              {likes}
            </div>
          </div>
          <div class="flex items-center justify-start gap-1">
            <slot name="comment-icon">
              <Icon icon="bi:chat" class="text-2xl" />
            </slot>
            <div class="text-center font-['Roboto'] text-xs font-normal leading-3 text-black">
              {comments}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> -->


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

<div class="inline-flex flex-col items-start justify-start w-full gap-4 mt-10">
  <Card class="w-full p-0 bg-gray-200 shadow-none">
    <CardContent class="flex items-start justify-start h-full gap-6 p-4">
      <div class="flex items-center justify-center w-20 h-20 bg-gray-300">
        <slot name="icon">
          <div class="relative flex flex-col items-start justify-start w-16 h-16"></div>
        </slot>
      </div>

      <div class="inline-flex flex-col items-start justify-start flex-1 gap-2">
        <div class="inline-flex items-center justify-center gap-2">
          <Avatar class="w-6 h-6 bg-gray-300">
            <slot name="profile-icon">
              <AvatarFallback class="text-xs">U</AvatarFallback>
            </slot>
          </Avatar>
          <div class="font-sans text-sm font-normal text-gray-500">
            {username}
          </div>
        </div>

        <div class="inline-flex items-center justify-center gap-1">
          <div class="text-xl font-medium text-center text-black">
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
            <div class="text-xs font-normal text-center text-black">
              {likes}
            </div>
          </div>
          <div class="flex items-center justify-start gap-1">
            <slot name="comment-icon">
              <Icon icon="bi:chat" class="text-2xl" />
            </slot>
            <div class="text-xs font-normal text-center text-black">
              {comments}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>