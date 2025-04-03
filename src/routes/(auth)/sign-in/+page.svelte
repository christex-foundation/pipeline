<script>
  import { applyAction, enhance } from '$app/forms';
  import Logo from '$lib/Logo.svelte';
  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';

  let loading = false;
  export let form;

  $: if (form?.error) {
    toast.error(form.error);
  }
</script>

<section class="flex basis-full items-center justify-center">
  <form
    method="POST"
    class="w-[60%] max-md:w-[80%]"
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
    <div class="mb-10 hidden max-md:block">
      <Logo />
    </div>
    <h2 class="mb-2 text-4xl font-semibold">Sign in</h2>
    <p class="mb-8 opacity-50">Enter your info to sign in</p>
    <div class="flex flex-col gap-2 font-medium">
      <Label for="email" class="block">Email</Label>
      <Input type="email" id="email" name="email" required />
    </div>

    <div class="mt-6 flex flex-col gap-2 font-medium">
      <Label for="password" class="block">Password</Label>
      <Input type="password" id="password" name="password" required />
    </div>

    <div class="mt-6 flex w-full flex-wrap items-center justify-between gap-6 text-sm leading-none">
      Don't have an account?
      <a href="/sign-up" class="font-semibold text-neutral-400 hover:text-[#0b383c]">Sign Up</a>
    </div>

    <Button type="submit" disabled={loading}>
      {loading ? 'Signing in...' : 'Sign in'}
    </Button>

    <div class="mt-6 flex w-full flex-wrap items-center justify-between gap-6 text-sm leading-none">
      <Label>
        <Checkbox id="remember" type="checkbox" name="rememberMe" />
        Remember me
      </Label>
      <a href="#forgot-password" class="font-semibold text-neutral-400">Forgot Password?</a>
    </div>
  </form>
</section>
