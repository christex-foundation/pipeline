<script>
  import { applyAction, enhance } from '$app/forms';
  import Logo from '$lib/Logo.svelte';
  import { toast } from 'svelte-sonner';
  
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";

  let loading = false;
  export let form;

  $: if (form?.error) {
    toast.error(form.error);
  }
</script>

<section class="mt-20 flex w-full max-w-[1235px] flex-col items-center justify-center max-md:mt-10 max-md:px-5">
  <form
    method="POST"
    class="mx-auto flex w-[60%] flex-col max-md:w-[90%]"
    use:enhance={() => {
      loading = true;
      
      return async ({ result }) => {
        if (result.type === 'redirect') {
          toast.success('login successful');
        }
        
        await applyAction(result);
        loading = false;
      };
    }}
  >
    <div class="hidden mb-10 max-md:block">
      <Logo />
    </div>
    <h2 class="mb-2 text-4xl font-semibold">Register</h2>
    <p class="mb-4 opacity-50">Enter your Info to signup for Pipeline</p>
    
    <div class="flex flex-col gap-2 font-medium">
      <Label for="name" class="block">Name</Label>
      <Input
        type="text"
        id="name"
        name="name"
        required
      />
    </div>
    
    <div class="flex flex-col gap-2 mt-4 font-medium">
      <Label for="email" class="block">Email</Label>
      <Input
        type="email"
        id="email"
        name="email"
        required
      />
    </div>
    
    <div class="flex flex-col gap-2 mt-4 font-medium">
      <Label for="password" class="block">Password</Label>
      <Input
        type="password"
        id="password"
        name="password"
        required
      />
    </div>
    
    <div class="flex flex-wrap items-center justify-between w-full gap-6 mt-6 text-sm leading-none">
      Already have an account?
      <a href="/sign-in" class="font-semibold text-neutral-400 hover:text-[#0b383c]">Sign In</a>
    </div>
    
    <Button
      type="submit"
      disabled={loading}
      variant="default"
    >
      {loading ? 'Signing up...' : 'Sign up'}
    </Button>
    
    <div class="flex w-full gap-2 mx-auto mt-6 text-sm font-light align-start max-md:mt-2">
      <Checkbox id="remember" name="rememberMe" />
      <Label for="remember" class="font-light">Remember me</Label>
    </div>
  </form>
</section>