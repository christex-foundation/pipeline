<!-- <script>
  export let user;
</script>

<div
  class="flex h-full w-[80%] flex-col rounded-xl border border-neutral-200 bg-neutral-50 p-4 font-['Inter'] text-[30.91px] font-normal leading-[34px] shadow-md max-lg:w-full"
>
  <span class="mb-10 font-semibold max-lg:ml-[0] max-lg:mt-20">Socials</span>
  <div
    class="flex w-full flex-col gap-[47px] self-center rounded-lg bg-white p-6 shadow-md max-lg:w-full"
  >
    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="twitter" class="text-xl font-semibold text-black">X</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="twitter"
          name="twitter"
          value={user.twitter}
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 text-base max-lg:min-h-[55px]"
          aria-required="true"
        />
      </div>
    </div>
    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="github" class="text-xl font-semibold text-black">Github</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="github"
          name="github"
          value={user.github}
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 text-base max-lg:min-h-[55px]"
          aria-required="true"
        />
      </div>
    </div>
    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="discord" class="text-xl font-semibold text-black">Discord</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="discord"
          name="discord"
          value={user.discord}
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 text-base max-lg:min-h-[55px]"
          aria-required="true"
        />
      </div>
    </div>
    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="linkedin" class="text-xl font-semibold text-black">Linkedin</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="linkedin"
          value={user.linkedin}
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 text-base max-lg:min-h-[55px]"
          aria-required="true"
        />
      </div>
    </div>
    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="website" class="text-xl font-semibold text-black">Website</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="website"
          name="web"
          value={user.website}
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 text-base max-lg:min-h-[55px]"
          aria-required="true"
        />
      </div>
    </div>
    <div
      class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
    >
      <div class="mt-8 flex flex-col">
        <label for="others" class="text-xl font-semibold text-black">Others</label>
      </div>
      <div class="w-[70%] max-md:w-full">
        <input
          type="text"
          id="others"
          name="others"
          value={user.others}
          class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 text-base max-lg:min-h-[55px]"
          aria-required="true"
        />
      </div>
    </div>
  </div>
</div> -->


<script>
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  export let user;
</script>

<div class="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-md h-[80%]">
  <h2 class="mb-4 text-2xl font-semibold text-black">Socials</h2>
  <div class="flex flex-col gap-8 bg-white p-2 h-[80%]">
    <div class="mt-4 flex justify-between max-md:flex-col w-full">
      <Label
        for="twitter"
        class="text-base font-semibold"
      >
        X
      </Label>
      <div class="w-2/3 max-md:w-full">
        <Input
          type="url"
          id="twitter"
          name="twitter"
          value={user.twitter}
        />
      </div>
    </div>

    <div class="mt-4 flex justify-between max-md:flex-col w-full">
      <Label
        for="github"
        class="text-base font-semibold"
      >
        Github
      </Label>
      <div class="w-2/3 max-md:w-full">
        <Input
          type="url"
          id="github"
          name="github"
          value={user.github}
        />
      </div>
    </div>

    <div class="mt-4 flex justify-between max-md:flex-col w-full">
      <Label
        for="discord"
        class="text-base font-semibold"
      >
        Discord
      </Label>
      <div class="w-2/3 max-md:w-full">
        <Input
          type="text"
          id="discord"
          name="discord"
          value={user.discord}
        />
      </div>
    </div>

    <div class="mt-4 flex justify-between max-md:flex-col w-full">
      <Label
        for="linkedin"
        class="text-base font-semibold"
      >
        LinkedIn
      </Label>
      <div class="w-2/3 max-md:w-full">
        <Input
          type="url"
          id="linkedin"
          name="linkedin"
          value={user.linkedin}
        />
      </div>
    </div>

    <div class="mt-4 flex justify-between max-md:flex-col w-full">
      <Label
        for="website"
        class="text-base font-semibold"
      >
        Website
      </Label>
      <div class="w-2/3 max-md:w-full">
        <Input
          type="url"
          id="website"
          name="web"
          value={user.website}
        />
      </div>
    </div>

    <div class="mt-4 flex justify-between max-md:flex-col w-full">
      <Label
        for="others"
        class="text-base font-semibold"
      >
        Others
      </Label>
      <div class="w-2/3 max-md:w-full">
        <Input
          type="url"
          id="others"
          name="others"
          value={user.others}
        />
      </div>
    </div>
  </div>
</div>
