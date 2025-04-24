<!-- <script>
  import { page } from '$app/stores';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
  import { Separator } from '$lib/components/ui/separator';
  import Icon from '@iconify/svelte';

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.round((now - date) / 1000 / 60);

    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.round(diff / 60)} hours ago`;
    return `${Math.round(diff / 1440)} days ago`;
  }

  const fetchProjectIssues = async () => {
    const githubLinkSplit = $page.data?.project?.github?.split('/') || [];
    const concat = githubLinkSplit[3] + '/' + githubLinkSplit[4];

    try {
      const res = await fetch(`https://api.github.com/repos/${concat}/issues`);
      const data = await res.json();
      return data;
    } catch (_e) {
      return [];
    }
  };
</script>

<h2 class="self-start mb-4 text-3xl font-bold text-teal-950">Tasks</h2>

<div class="flex flex-col items-start w-full">
  {#await fetchProjectIssues()}
    <p class="text-sm text-gray-500">Loading issues...</p>
  {:then issues}
    {#if issues.length > 0}
      <Card class="w-full border-0 shadow-none md:w-[70%]">
        {#each issues as issue, index}
          <CardContent class="p-0">
            <div
              class="flex items-center gap-4 p-4 {index !== issues.length - 1
                ? 'border-b border-gray-300'
                : ''}"
            >
              <Icon icon="codicon:issues" class="text-3xl text-green-500" />

              <div class="flex-1 min-w-0">
                <a
                  href={issue.html_url}
                  target="_blank"
                  class="block font-semibold truncate text-teal-950 hover:underline"
                  title={issue.title}
                >
                  {issue.title}
                </a>
                <p class="mt-1 text-sm text-gray-500">
                  #{issue.number} · <span class="text-md">{issue.user.login}</span> opened {timeAgo(
                    issue.created_at,
                  )}
                </p>
              </div>

              <Avatar class="flex-shrink-0 w-8 h-8">
                <AvatarImage src={issue.user.avatar_url} alt={issue.user.login} />
                <AvatarFallback>{issue.user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        {/each}
      </Card>
    {:else}
      <p class="text-sm italic text-gray-600">No open issues on this repository</p>
    {/if}
  {/await}
</div> -->



<script>
  import { page } from '$app/stores';
  import { Card, CardContent } from '$lib/components/ui/card';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { Button } from '$lib/components/ui/button';
  import Icon from '@iconify/svelte';

  let activeTab = "open";

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.round((now - date) / 1000 / 60);

    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.round(diff / 60)} hours ago`;
    return `${Math.round(diff / 1440)} days ago`;
  }

  const fetchIssues = async (state) => {
    const githubLinkSplit = $page.data?.project?.github?.split('/') || [];
    if (githubLinkSplit.length < 5) return [];
    
    const repoPath = githubLinkSplit[3] + '/' + githubLinkSplit[4];

    try {
      const res = await fetch(`https://api.github.com/repos/${repoPath}/issues?state=${state}`);
      const data = await res.json();
      return data;
    } catch (_e) {
      return [];
    }
  };

  const handlePayContributor = (issue) => {
    console.log(`Paying contributor for issue #${issue.number}: ${issue.title}`);
    alert(`Payment initiated for issue #${issue.number}`);
  };
</script>

<h2 class="self-start mb-4 text-3xl font-bold text-teal-950">Tasks</h2>

<div class="flex flex-col items-start w-full">
  <Tabs value={activeTab} onValueChange={(value) => activeTab = value} class="w-full md:w-[70%] ">
    <TabsList class="grid w-3/4 items-center align-center grid-cols-2 mb-6 [&_[data-state=active]]:bg-cyan-950 [&_[data-state=active]]:text-white mx-auto">
      <TabsTrigger value="open" >Opened Issues</TabsTrigger>
      <TabsTrigger value="closed">Closed Issues</TabsTrigger>
    </TabsList>
    
    <TabsContent value="open" class="w-full">
      {#await fetchIssues('open')}
        <p class="text-sm text-gray-500">Loading issues...</p>
      {:then issues}
        {#if issues.length > 0}
          <Card class="w-full border-0 shadow-none">
            {#each issues as issue, index}
              <CardContent class="p-0">
                <div
                  class="flex items-center gap-4 p-4 {index !== issues.length - 1
                    ? 'border-b border-gray-300'
                    : ''}"
                >
                  <Icon icon="codicon:issues" class="text-3xl text-green-500" />

                  <div class="flex-1 min-w-0">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      class="block font-semibold truncate text-teal-950 hover:underline"
                      title={issue.title}
                    >
                      {issue.title}
                    </a>
                    <p class="mt-1 text-sm text-gray-500">
                      #{issue.number} · <span class="text-md">{issue.user.login}</span> opened {timeAgo(
                        issue.created_at,
                      )}
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    class="p-2 text-sm text-white rounded-md bg-cyan-950"
                    onClick={() => handlePayContributor(issue)}
                  >
                    Pay Contributor
                  </Button>
                </div>
              </CardContent>
            {/each}
          </Card>
        {:else}
          <p class="text-sm italic text-gray-600">No open issues on this repository</p>
        {/if}
      {/await}
    </TabsContent>
    
    <TabsContent value="closed" class="w-full">
      {#await fetchIssues('closed')}
        <p class="text-sm text-gray-500">Loading issues...</p>
      {:then issues}
        {#if issues.length > 0}
          <Card class="w-full border-0 shadow-none">
            {#each issues as issue, index}
              <CardContent class="p-0">
                <div
                  class="flex items-center gap-4 p-4 {index !== issues.length - 1
                    ? 'border-b border-gray-300'
                    : ''}"
                >
               

                  <Icon icon="codicon:issues" class="text-3xl text-red-500" />

                  <div class="flex-1 min-w-0">
                    <a
                      href={issue.html_url}
                      target="_blank"
                      class="block font-semibold truncate text-teal-950 hover:underline"
                      title={issue.title}
                    >
                      {issue.title}
                    </a>
                    <p class="mt-1 text-sm text-gray-500">
                      #{issue.number} · <span class="text-md">{issue.user.login}</span> closed {timeAgo(
                        issue.closed_at || issue.updated_at,
                      )}
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    class="p-2 text-sm text-white rounded-md bg-cyan-950"
                    onClick={() => handlePayContributor(issue)}
                  >
                    Pay Contributor
                  </Button>
                </div>
              </CardContent>
            {/each}
          </Card>
        {:else}
          <p class="text-sm italic text-gray-600">No closed issues on this repository</p>
        {/if}
      {/await}

      <h2 class="self-start mt-8 mb-4 text-3xl font-bold text-teal-950">Paid Issues</h2>

      {#await fetchIssues('closed')}
      <p class="text-sm text-gray-500">Loading issues...</p>
    {:then issues}
      {#if issues.length > 0}
        <Card class="w-full border-0 shadow-none">
          {#each issues as issue, index}
            <CardContent class="p-0">
              <div
                class="flex items-center gap-4 p-4 {index !== issues.length - 1
                  ? 'border-b border-gray-300'
                  : ''}"
              >
             

                <Icon icon="codicon:issues" class="text-3xl text-red-500" />

                <div class="flex-1 min-w-0">
                  <a
                    href={issue.html_url}
                    target="_blank"
                    class="block font-semibold truncate text-teal-950 hover:underline"
                    title={issue.title}
                  >
                    {issue.title}
                  </a>
                  <p class="mt-1 text-sm text-gray-500">
                    #{issue.number} · <span class="text-md">{issue.user.login}</span> closed {timeAgo(
                      issue.closed_at || issue.updated_at,
                    )}
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  class="p-2 text-sm text-white rounded-md bg-stone-300"
                  onClick={() => handlePayContributor(issue)}
                  disabled={true}
                >
                  Pay Contributor
                </Button>
              </div>
            </CardContent>
          {/each}
        </Card>
      {:else}
        <p class="text-sm italic text-gray-600">No closed issues on this repository</p>
      {/if}
    {/await}

      
    </TabsContent>
  </Tabs>
</div>