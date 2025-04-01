<script>
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  export let user;
</script>

<div class="h-[80%] rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md">
  <h2 class="mb-4 text-2xl font-semibold text-black">Socials</h2>
  <div class="flex h-[80%] flex-col gap-8 bg-white p-2">
    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label for="twitter" class="text-base font-semibold">X</Label>
      <div class="w-2/3 max-md:w-full">
        <Input type="url" id="twitter" name="twitter" value={user.twitter} />
      </div>
    </div>

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label for="github" class="text-base font-semibold">Github</Label>
      <div class="w-2/3 max-md:w-full">
        <Input type="url" id="github" name="github" value={user.github} />
      </div>
    </div>

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label for="discord" class="text-base font-semibold">Discord</Label>
      <div class="w-2/3 max-md:w-full">
        <Input type="text" id="discord" name="discord" value={user.discord} />
      </div>
    </div>

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label for="linkedin" class="text-base font-semibold">LinkedIn</Label>
      <div class="w-2/3 max-md:w-full">
        <Input type="url" id="linkedin" name="linkedin" value={user.linkedin} />
      </div>
    </div>

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label for="website" class="text-base font-semibold">Website</Label>
      <div class="w-2/3 max-md:w-full">
        <Input type="url" id="website" name="web" value={user.website} />
      </div>
    </div>

    <div class="flex justify-between w-full mt-4 max-md:flex-col">
      <Label for="others" class="text-base font-semibold">Others</Label>
      <div class="w-2/3 max-md:w-full">
        <Input type="url" id="others" name="others" value={user.others} />
      </div>
    </div>
  </div>
</div>
