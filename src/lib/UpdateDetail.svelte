<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { dateTimeFormat, timeAgo } from '$lib/utils/dateTimeFormat.js';
  import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import { Badge } from '$lib/components/ui/badge';
  import Icon from '@iconify/svelte';

  const dispatch = createEventDispatcher();

  function goBack() {
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

<div class="inline-flex h-full w-full flex-col items-start justify-start px-4 font-sans">
  <div class="flex h-20 flex-col items-start justify-start self-stretch pb-12">
    <button
      variant="outline"
      class="flex items-center justify-center border border-gray-300 bg-white px-5 py-3"
      on:click={goBack}
    >
      <Icon icon="mdi-light:chevron-left" class="text-2xl" />
      <span class="text-sm font-normal text-gray-900">All Updates</span>
    </button>
  </div>

  <div class="flex flex-col items-start justify-start gap-6 self-stretch">
    <div class="flex flex-col items-start justify-start gap-3 self-stretch">
      <div class="self-stretch text-3xl font-bold text-gray-900">
        {selectedUpdate.title}
      </div>

      <div
        class="flex h-16 flex-col items-start justify-start gap-1 self-stretch border-b border-gray-200 pb-5"
      >
        <div class="inline-flex items-center justify-start gap-3">
          <Avatar class="h-10 w-10 border border-gray-200">
            <AvatarImage
              src={selectedUpdate.userProfile.image && selectedUpdate.userProfile.image !== ''
                ? selectedUpdate.userProfile.image
                : defaultImageUrl}
              alt="User Profile"
            />
            <AvatarFallback>{selectedUpdate.userProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div class="inline-flex flex-col items-start justify-start">
            <div class="inline-flex items-center justify-between gap-2 self-stretch">
              <div class="h-6 text-sm font-normal text-gray-900">
                {selectedUpdate.userProfile.name}
              </div>
              <Badge variant="success" class="bg-green-500 text-xs font-bold text-white">
                {selectedUpdate.user_id === selectedUpdate.userProfile.user_id
                  ? 'Creator'
                  : 'Member'}
              </Badge>
            </div>
            <div class="h-4 self-stretch text-xs font-normal text-gray-500">
              {updateDate}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-start justify-start gap-8 self-stretch pb-2">
      <div class="self-stretch text-base font-normal leading-7 text-gray-900">
        {@html selectedUpdate.body}
      </div>
    </div>
  </div>

  <div class="flex flex-col items-start justify-start gap-4 self-stretch pt-10">
    <div class="flex h-5 flex-col items-start justify-start self-stretch">
      <div class="self-stretch text-base font-bold leading-tight text-gray-900">
        Comments ({comments.length})
      </div>
    </div>

    <div class="flex w-full flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
      {#if data.isAuthenticated}
        <div class="flex w-full flex-col gap-4 md:flex-row">
          <Input
            type="text"
            bind:value={newComment}
            placeholder="Add a comment..."
            class="w-full rounded-lg border-2 border-[#dcdedd] px-4 py-2 text-base text-[#0b383c] transition-colors duration-200 focus:border-[#0b383c] focus:outline-none
            md:w-3/4"
          />
          <Button
            on:click={addUpdateComment}
            variant="default"
            class="mt-2 self-end rounded-lg bg-[#0b383c] px-4 py-2 text-base text-white transition-colors duration-300 focus:border-[#0b383c]
            focus:outline-none md:mt-0 md:w-1/4"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Comment'}
          </Button>
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
      <div class="max-h-96 w-full overflow-y-auto pr-1">
        <div class="flex flex-col gap-3 p-1">
          {#each comments as comment}
            <Card class="border border-gray-200">
              <CardHeader class="p-4 pb-0">
                <div class="flex items-start gap-3">
                  <Avatar class="h-8 w-8 border border-gray-200">
                    <AvatarImage
                      src={comment.userProfile.image && comment.userProfile.image !== ''
                        ? comment.userProfile.image
                        : defaultImageUrl}
                      alt={comment.userProfile.name}
                    />
                    <AvatarFallback>{comment.userProfile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div class="flex flex-col">
                    <div class="text-sm font-normal text-gray-900">
                      {comment.userProfile.name}
                    </div>
                    <div class="text-xs font-normal text-gray-400">
                      {timeAgo(comment.created_at)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="p-4 pt-5">
                <div class="text-sm font-normal text-gray-900">
                  {comment.body}
                </div>
              </CardContent>
            </Card>
          {/each}
        </div>
      </div>
    {:else}
      <p class="italic text-gray-500">No comments yet</p>
    {/if}
  </div>
</div>
