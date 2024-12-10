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

<div class="h-full px-[18px] flex-col justify-start items-start inline-flex font-['Inter'] w-full">
  <div class="self-stretch h-[89px] pb-12 flex-col justify-start items-start flex">
    <div
      class="px-[19px] py-[11.50px] bg-white border border-[#d1d1d1] justify-center items-center inline-flex"
    >
      <div class="flex items-center justify-start">
        <div class="flex items-center justify-center w-3 h-3">
          <div class="relative flex flex-col items-start justify-start w-3 h-3"></div>
        </div>
        <button class="inline-flex flex-col items-start justify-start pl-3" on:click={goBack}>
          <div class="flex flex-col items-center justify-start">
            <div
              class="text-center text-[#222222] text-sm font-normal font-['Inter'] leading-[17.50px] flex gap-2 ml-[-10px]"
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
      <div class="self-stretch text-[#282828] text-[32px] font-bold font-['Inter'] leading-10">
        {selectedUpdate.title}
      </div>
      <div
        class="self-stretch h-[62px] pb-5 border-b border-[#dcdedd] flex-col justify-start items-start gap-1 flex"
      >
        <div class="inline-flex items-center justify-start gap-3">
          <img
            loading="lazy"
            src={selectedUpdate.userProfile.image && selectedUpdate.userProfile.image !== ''
              ? selectedUpdate.userProfile.image
              : defaultImageUrl}
            alt="User Profile"
            class="w-[42px] h-[42px] relative rounded-[42px] border border-[#dcdedd]"
          />

          <div class="inline-flex flex-col items-start justify-start">
            <div class="inline-flex items-center self-stretch justify-between gap-2">
              <div class=" h-6 text-[#282828] text-sm font-normal font-['Inter'] leading-normal">
                {selectedUpdate.userProfile.name}
              </div>
              <div
                class="px-[5px] py-[0.25px] bg-[#05ce78] rounded-[3px] flex-col justify-center items-start inline-flex"
              >
                <div class="text-white text-xs font-bold font-['Inter'] leading-[18px]">
                  {selectedUpdate.user_id === selectedUpdate.userProfile.user_id
                    ? 'Creator'
                    : 'Member'}
                </div>
              </div>
            </div>
            <div
              class="self-stretch h-[18px] text-[#282828]/50 text-[13px] font-normal font-['Inter'] leading-[18px]"
            >
              {updateDate}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="self-stretch pb-2 flex-col justify-start items-start gap-[30px] flex">
      <div class="self-stretch text-[#282828] text-base font-normal font-['Inter'] leading-[29px]">
        {@html selectedUpdate.body}
      </div>
    </div>
  </div>

  <div class="self-stretch pt-[42px] flex-col justify-start items-start gap-[18px] flex">
    <div class="flex flex-col items-start self-stretch justify-start h-5">
      <div class="self-stretch text-[#282828] text-base font-bold font-['Inter'] leading-tight">
        Comments ({comments.length})
      </div>
    </div>

    <div
      class="flex flex-col w-full gap-4 pt-4 pb-8 md:flex-row md:justify-between md:items-center"
    >
      {#if data.isAuthenticated}
        <div class="flex flex-col w-full gap-4 md:flex-row">
          <input
            type="text"
            bind:value={newComment}
            placeholder="Add a comment..."
            class="w-full border-2 border-[#dcdedd] rounded-lg px-4 py-2 text-base text-[#0b383c] focus:outline-none focus:border-[#0b383c] transition-colors duration-200
                   md:w-3/4"
          />
          <button
            on:click={addUpdateComment}
            class="md:w-1/4 px-4 py-2 bg-[#0b383c] text-white text-base rounded-lg transition-colors duration-300 focus:outline-none focus:border-[#0b383c]
                   mt-2 md:mt-0 self-end"
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
        class="self-stretch max-h-[385px] overflow-y-auto px-[13px] pt-[15px] pb-[13px] bg-[#fbfbfa] border border-[#e8e8e8] flex-col justify-start items-start gap-3 flex"
      >
        {#each comments as comment}
          <div
            class="self-stretch p-4 bg-white border border-[#e8e8e8] flex-col justify-start items-start gap-[18px] flex"
          >
            <div class="inline-flex items-start self-stretch justify-start">
              <div class="flex items-start self-stretch justify-start gap-3">
                <div class="inline-flex flex-col items-start justify-start">
                  <img
                    class="w-9 h-9 rounded-full border border-[#dcdedd]"
                    src={comment.userProfile.image && comment.userProfile.image !== ''
                      ? comment.userProfile.image
                      : defaultImageUrl}
                    alt=""
                  />
                </div>
                <div class="inline-flex flex-col items-start justify-start flex-grow">
                  <div class="inline-flex items-center self-stretch justify-start gap-3">
                    <div class="text-[#282828] text-sm font-normal font-['Inter'] leading-[21px]">
                      {comment.userProfile.name}
                    </div>
                  </div>
                  <div class="flex flex-col items-start self-stretch justify-start">
                    <div class="text-[#9b9e9e] text-xs font-normal font-['Inter'] leading-[18px]">
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
                    class="self-stretch text-[#282828] text-sm font-normal font-['Inter'] leading-normal"
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
