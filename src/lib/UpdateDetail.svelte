<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { dateTimeFormat } from './utils/dateTimeFormat.js';

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
  let commentDate;

  $: updateDate = dateTimeFormat(selectedUpdate.created_at);
  //$: commentDate = dateTimeFormat(comments.created_at);

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
        throw new Error(response.statusText);
      }

      newComment = '';

      await getUpdateComments();

      alert('Comment added successfully');
    } catch (error) {
      error = e.message;
      alert(error);
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

<div class=" inline-flex h-full flex-col items-start justify-start px-[18px] font-['Inter']">
  <div class="flex h-[89px] flex-col items-start justify-start self-stretch pb-12">
    <div
      class="inline-flex items-center justify-center border border-[#d1d1d1] bg-white px-[19px] py-[11.50px]"
    >
      <div class="flex items-center justify-start">
        <div class="flex h-3 w-3 items-center justify-center">
          <div class="relative flex h-3 w-3 flex-col items-start justify-start"></div>
        </div>
        <button class="inline-flex flex-col items-start justify-start pl-3" on:click={goBack}>
          <div class="flex flex-col items-center justify-start">
            <div
              class="ml-[-10px] flex gap-2 text-center font-['Inter'] text-sm font-normal leading-[17.50px] text-[#222222]"
            >
              <svg
                width="13"
                height="15"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="icon--chevron-left">
                  <path
                    id="Vector"
                    d="M3.45996 6.65996L8.65996 11.86L9.65996 10.86L5.45996 6.65996L9.65996 2.45996L8.65996 1.45996"
                    fill="black"
                  />
                </g>
              </svg>

              All Updates
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
  <div class="flex flex-col items-start justify-start gap-6 self-stretch">
    <div class="flex flex-col items-start justify-start gap-3 self-stretch">
      <div class="inline-flex items-start justify-start self-stretch"></div>
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
            class="w-[42px] h-[42px] relative rounded-[42px] border border-[#dcdedd]"
          />

          <div class="inline-flex flex-col items-start justify-start">
            <div class="inline-flex items-center self-stretch justify-between gap-2">
              <div class=" h-6 text-[#282828] text-sm font-normal font-['Inter'] leading-normal">
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
    <div class="flex h-5 flex-col items-start justify-start self-stretch">
      <div class="self-stretch font-['Inter'] text-base font-bold leading-tight text-[#282828]">
        Comments ({comments.length})
      </div>
    </div>
    <div class="flex w-[97%] justify-between gap-4 pb-8 pl-4 pt-4">
      {#if data.isAuthenticated}
        <input
          type="text"
          bind:value={newComment}
          placeholder="Add a comment..."
          class="w-full rounded-lg border-2 border-[#dcdedd] px-4 py-2 text-base text-[#0b383c] transition-colors duration-200 focus:border-[#0b383c] focus:outline-none"
        />
        <button
          on:click={addUpdateComment}
          class="w-full rounded-lg bg-[#0b383c] px-4 py-2 text-base text-white transition-colors duration-300 focus:border-[#0b383c] focus:outline-none md:w-1/4"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Comment'}
        </button>
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
        class="flex h-[385px] flex-col items-start justify-start gap-3 self-stretch border border-[#e8e8e8] bg-[#fbfbfa] px-[13px] pb-[13px] pt-[15px]"
      >
        {#each comments as comment}
          <div
            class="flex h-[113px] flex-col items-start justify-start gap-[18px] self-stretch border border-[#e8e8e8] bg-white px-[19px] pb-[13px] pt-[19px]"
          >
            <div class="inline-flex items-start justify-start self-stretch">
              <div class="flex items-start justify-start gap-3 self-stretch">
                <div class="inline-flex h-9 flex-col items-start justify-start">
                  <img
                    class="w-9 h-9 relative rounded-[36px] border border-[#dcdedd]"
                    src={comment.userProfile.image && comment.userProfile.image !== ''
                      ? comment.userProfile.image
                      : defaultImageUrl}
                    alt=""
                  />
                </div>
                <div class="inline-flex w-[195.45px] flex-col items-start justify-start">
                  <div class="inline-flex items-center justify-start gap-3 self-stretch">
                    <div
                      class="h-[21px] w-[92.93px] font-['Inter'] text-sm font-normal leading-[21px] text-[#282828]"
                    >
                      {comment.userProfile.name}
                    </div>
                  </div>
                  <div class="self-stretch h-[18px] flex-col justify-start items-start flex">
                    <div class="text-[#9b9e9e] text-xs font-normal font-['Inter'] leading-[18px]">
                      {comment.created_at}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="inline-flex items-start justify-center self-stretch">
              <div
                class="inline-flex shrink grow basis-0 flex-col items-start justify-start self-stretch"
              >
                <div class="flex h-6 flex-col items-start justify-start self-stretch">
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
      <p>No comments</p>
    {/if}
  </div>
</div>
