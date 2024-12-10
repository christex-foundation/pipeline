<script>
  export let user;
</script>
  <div class="flex flex-col w-[80%] h-full text-[30.91px] font-normal font-['Inter'] leading-[34px] max-lg:w-full p-4 border shadow-md bg-neutral-50 border-neutral-200 rounded-xl">
    <span class="mb-10 font-semibold max-lg:mt-20 max-lg:ml-[0]">Socials</span>
    <div class="flex flex-col gap-[47px] w-full self-center max-lg:w-full bg-white p-6 rounded-lg shadow-md">
      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="twitter" class="text-xl font-semibold text-black">X</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="twitter"
            name="twitter"
            value="{user.twitter}"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
            aria-required="true"
          />
        </div>
      </div>
      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="github" class="text-xl font-semibold text-black">Github</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="github"
            name="github"
            value="{user.github}"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
            aria-required="true"
          />
        </div>
      </div>
      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="discord" class="text-xl font-semibold text-black">Discord</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="discord"
            name="discord"
            value="{user.discord}"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
            aria-required="true"
          />
        </div>
      </div>
      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="linkedin" class="text-xl font-semibold text-black">Linkedin</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="linkedin"
            value="{user.linkedin}"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
            aria-required="true"
          />
        </div>
      </div>
      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="website" class="text-xl font-semibold text-black">Website</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="website"
            name="web"
            value="{user.website}"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
            aria-required="true"
          />
        </div>
      </div>
      <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
        <div class="flex flex-col mt-8">
          <label for="others" class="text-xl font-semibold text-black">Others</label>
        </div>
        <div class="w-[70%] max-md:w-full">
          <input
            type="text"
            id="others"
            name="others"
            value="{user.others}"
            class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
            aria-required="true"
          />
        </div>
      </div>
    </div>
  </div>
  