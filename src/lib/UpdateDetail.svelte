<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { dateTimeFormat, timeAgo } from '$lib/utils/dateTimeFormat.js';
  import { toast } from 'svelte-sonner';

  const dispatch = createEventDispatcher();

  function goBack() {
    console.log('goBack function triggered');
    dispatch('goBack');
  }

  export let selectedUpdate;
  export let data;

  let newComment = '';
  let comments = [];
  let loading = false;
  let updateDate;

  $: updateDate = dateTimeFormat(selectedUpdate.created_at);

  async function getUpdateComments() {
    try {
      const response = await fetch(
        `/api/projects/singleProject/${selectedUpdate.project_id}/projectUpdates/${selectedUpdate.id}/comments`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      comments = data.comments;
    } catch (error) {
      error = e.message;
      alert(error);
    } finally {
      loading = false;
    }
  }

  async function addUpdateComment() {
    loading = true;
    try {
      const response = await fetch(
        `/api/projects/singleProject/${selectedUpdate.project_id}/projectUpdates/${selectedUpdate.id}/comments/store`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: newComment }),
        },
      );

      if (!response.ok) {
        toast.error('could not add comment to this project update.');
        throw new Error(response.statusText);
      }

      newComment = '';

      await getUpdateComments();

      toast.success('Comment added successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    await getUpdateComments();
  });

  const defaultImageUrl =
    'https://zyfpmpmcpzmickajgkwp.supabase.co/storage/v1/object/public/pipeline-images/defaults/userProfile.png';
</script>

<div class="inline-flex h-full w-full flex-col items-start justify-start px-[18px] font-['Inter']">
  <div class="flex h-[89px] flex-col items-start justify-start self-stretch pb-12">
    <div
      class="inline-flex items-center justify-center border border-[#d1d1d1] bg-white px-[19px] py-[11.50px]"
    >
      <div class="flex items-center justify-start">
        <div class="flex items-center justify-center w-3 h-3">
          <div class="relative flex flex-col items-start justify-start w-3 h-3"></div>
        </div>
        <button class="inline-flex flex-col items-start justify-start pl-3" on:click={goBack}>
          <div class="flex flex-col items-center justify-start">
            <div
              class="ml-[-10px] flex gap-2 text-center font-['Inter'] text-sm font-normal leading-[17.50px] text-[#222222]"
            >
              <Icon icon="mdi-light:chevron-left" class="text-2xl" />
              All Updates
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
  <div class="flex flex-col items-start self-stretch justify-start gap-6">
    <div class="flex flex-col items-start self-stretch justify-start gap-3">
      <div class="inline-flex items-start self-stretch justify-start"></div>
      <div class="self-stretch font-['Inter'] text-[32px] font-bold leading-10 text-[#282828]">
        {selectedUpdate.title}
      </div>
      <div
        class="flex h-[62px] flex-col items-start justify-start gap-1 self-stretch border-b border-[#dcdedd] pb-5"
      >
        <div class="inline-flex items-center justify-start gap-3">
          <img
            loading="lazy"
            src={selectedUpdate.userProfile.image && selectedUpdate.userProfile.image !== ''
              ? selectedUpdate.userProfile.image
              : defaultImageUrl}
            alt="User Profile"
            class="relative h-[42px] w-[42px] rounded-[42px] border border-[#dcdedd]"
          />

          <div class="inline-flex flex-col items-start justify-start">
            <div class="inline-flex items-center self-stretch justify-between gap-2">
              <div class=" h-6 font-['Inter'] text-sm font-normal leading-normal text-[#282828]">
                {selectedUpdate.userProfile.name}
              </div>
              <div
                class="inline-flex flex-col items-start justify-center rounded-[3px] bg-[#05ce78] px-[5px] py-[0.25px]"
              >
                <div class="font-['Inter'] text-xs font-bold leading-[18px] text-white">
                  {selectedUpdate.user_id === selectedUpdate.userProfile.user_id
                    ? 'Creator'
                    : 'Member'}
                </div>
              </div>
            </div>
            <div
              class="h-[18px] self-stretch font-['Inter'] text-[13px] font-normal leading-[18px] text-[#282828]/50"
            >
              {updateDate}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-start justify-start gap-[30px] self-stretch pb-2">
      <div class="self-stretch font-['Inter'] text-base font-normal leading-[29px] text-[#282828]">
        {@html selectedUpdate.body}
      </div>
    </div>
  </div>

  <div class="flex flex-col items-start justify-start gap-[18px] self-stretch pt-[42px]">
    <div class="flex flex-col items-start self-stretch justify-start h-5">
      <div class="self-stretch font-['Inter'] text-base font-bold leading-tight text-[#282828]">
        Comments ({comments.length})
      </div>
    </div>

    <div
      class="flex flex-col w-full gap-4 pt-4 pb-8 md:flex-row md:items-center md:justify-between"
    >
      {#if data.isAuthenticated}
        <div class="flex flex-col w-full gap-4 md:flex-row">
          <input
            type="text"
            bind:value={newComment}
            placeholder="Add a comment..."
            class="w-full rounded-lg border-2 border-[#dcdedd] px-4 py-2 text-base text-[#0b383c] transition-colors duration-200 focus:border-[#0b383c] focus:outline-none
                   md:w-3/4"
          />
          <button
            on:click={addUpdateComment}
            class="mt-2 self-end rounded-lg bg-[#0b383c] px-4 py-2 text-base text-white transition-colors duration-300 focus:border-[#0b383c]
                   focus:outline-none md:mt-0 md:w-1/4"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Comment'}
          </button>
        </div>
      {:else}
        <span class="text-sm text-gray-700">
          <a
            href="/sign-in"
            class="font-semibold text-teal-600 transition-colors duration-200 hover:text-teal-800"
            >Login</a
          > to comment
        </span>
      {/if}
    </div>

    {#if comments.length > 0}
      <div
        class="flex max-h-[385px] flex-col items-start justify-start gap-3 self-stretch overflow-y-auto border border-[#e8e8e8] bg-[#fbfbfa] px-[13px] pb-[13px] pt-[15px]"
      >
        {#each comments as comment}
          <div
            class="flex flex-col items-start justify-start gap-[18px] self-stretch border border-[#e8e8e8] bg-white p-4"
          >
            <div class="inline-flex items-start self-stretch justify-start">
              <div class="flex items-start self-stretch justify-start gap-3">
                <div class="inline-flex flex-col items-start justify-start">
                  <img
                    class="h-9 w-9 rounded-full border border-[#dcdedd]"
                    src={comment.userProfile.image && comment.userProfile.image !== ''
                      ? comment.userProfile.image
                      : defaultImageUrl}
                    alt=""
                  />
                </div>
                <div class="inline-flex flex-col items-start justify-start flex-grow">
                  <div class="inline-flex items-center self-stretch justify-start gap-3">
                    <div class="font-['Inter'] text-sm font-normal leading-[21px] text-[#282828]">
                      {comment.userProfile.name}
                    </div>
                  </div>
                  <div class="flex flex-col items-start self-stretch justify-start">
                    <div class="font-['Inter'] text-xs font-normal leading-[18px] text-[#9b9e9e]">
                      {timeAgo(comment.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="inline-flex items-start self-stretch justify-center">
              <div class="flex flex-col items-start self-stretch justify-start w-full">
                <div class="flex flex-col items-start self-stretch justify-start">
                  <div
                    class="self-stretch font-['Inter'] text-sm font-normal leading-normal text-[#282828]"
                  >
                    {comment.body}
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="italic text-gray-500">No comments yet</p>
    {/if}
  </div>
</div>
