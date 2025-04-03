<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Button } from '$lib/components/ui/button';
</script>

<form
  class="mx-auto flex w-[79%] flex-col text-3xl text-black max-lg:w-full max-md:mt-[-40px] max-md:max-w-full"
>
  <div
    class="flex flex-row items-start justify-between w-full mb-4 max-md:flex-col max-md:items-start"
  >
    <div class="flex flex-col mt-8">
      <Label for="currentPassword" class="text-xl font-semibold text-black max-md:mb-2">Current Password</Label>
    </div>
    <div class="w-2/3 max-md:w-full">
      <Input type="text" id="currentPassword" aria-required="true" />
    </div>
  </div>
  <div
    class="flex flex-row items-start justify-between w-full mb-4 max-md:flex-col max-md:items-start"
  >
    <div class="flex flex-col mt-8">
      <Label for="newPassword" class="text-xl font-semibold text-black max-md:mb-2">New Password</Label>
    </div>
    <div class="w-2/3 max-md:w-full">
      <Input type="text" id="newPassword" aria-required="true" />
    </div>
  </div>

  <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
    <div class="flex flex-col mt-8">
      <Label for="confirmPassword" class="text-xl font-semibold text-black max-md:mb-2">Confirm Password</Label>
    </div>
    <div class="w-2/3 max-md:w-full">
      <Input type="text" id="confirmPassword" aria-required="true" />
    </div>
  </div>

  <Button
    class="mt-8 self-end whitespace-nowrap rounded-[128px] bg-lime-800 px-16 py-2 text-xl text-white max-lg:w-[30%] max-lg:py-3 max-lg:text-base max-md:w-[45%] max-md:px-5"
  >
    Done
  </Button>

  <Button>Delete Account</Button>
</form>
