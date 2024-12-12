<script>
  import Icon from '@iconify/svelte';

  export let username = '@username';
  export let title = 'Resource Title';
  export let description =
    'Description of the resource goes here. This is a brief summary of what the resource is about.';
  export let likes = 0;
  export let comments = 0;
</script>

<div class="mt-10 inline-flex w-full flex-col items-start justify-start gap-4">
  <div class="inline-flex items-center justify-between self-stretch bg-[#ebebeb] p-4">
    <div class="flex h-[132px] shrink grow basis-0 items-start justify-start gap-6">
      <div class="flex h-20 w-20 items-center justify-center bg-[#d9d9d9] p-2">
        <slot name="icon">
          <div class="relative flex h-16 w-16 flex-col items-start justify-start"></div>
        </slot>
      </div>

      <div class="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
        <div class="inline-flex items-center justify-center gap-2">
          <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#d9d9d9] p-1">
            <slot name="profile-icon">
              <div class="relative flex h-4 w-4 flex-col items-start justify-start"></div>
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
</div>
