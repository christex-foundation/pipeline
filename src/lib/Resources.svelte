<script>
  import Icon from '@iconify/svelte';

  export let username = '@username';
  export let title = 'Resource Title';
  export let description =
    'Description of the resource goes here. This is a brief summary of what the resource is about.';
  export let likes = 0;
  export let comments = 0;
</script>

<div class="inline-flex flex-col items-start justify-start w-full gap-4 mt-10">
  <div class="self-stretch p-4 bg-[#ebebeb] justify-between items-center inline-flex">
    <div class="grow shrink basis-0 h-[132px] justify-start items-start gap-6 flex">
      <div class="w-20 h-20 p-2 bg-[#d9d9d9] justify-center items-center flex">
        <slot name="icon">
          <div class="relative flex flex-col items-start justify-start w-16 h-16"></div>
        </slot>
      </div>

      <div class="inline-flex flex-col items-start justify-start gap-2 grow shrink basis-0">
        <div class="inline-flex items-center justify-center gap-2">
          <div class="w-6 h-6 p-1 bg-[#d9d9d9] rounded-full justify-center items-center flex">
            <slot name="profile-icon">
              <div class="relative flex flex-col items-start justify-start w-4 h-4"></div>
            </slot>
          </div>
          <div class="text-[#8a8a8a] text-sm font-normal font-['Roboto'] leading-[14px]">
            {username}
          </div>
        </div>

        <div class="inline-flex items-center justify-center gap-1">
          <div class="text-center text-black text-xl font-medium font-['Roboto'] leading-7">
            {title}
          </div>
        </div>

        <div class="self-stretch text-gray-700 text-sm font-normal font-['Roboto'] leading-tight">
          {description}
        </div>

        <div class="inline-flex items-center justify-start gap-3">
          <div class="flex items-center justify-start gap-1">
            <slot name="like-icon">
              <Icon icon="mdi-light:heart" class="text-2xl" />
            </slot>
            <div class="text-center text-black text-xs font-normal font-['Roboto'] leading-3">
              {likes}
            </div>
          </div>
          <div class="flex items-center justify-start gap-1">
            <slot name="comment-icon">
              <Icon icon="bi:chat" class="text-2xl" />
            </slot>
            <div class="text-center text-black text-xs font-normal font-['Roboto'] leading-3">
              {comments}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
