<form
  class="flex w-[79%] flex-col text-3xl text-black max-lg:w-full max-md:mt-[-40px] max-md:max-w-full"
>
  <div
    class="mb-4 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
  >
    <div class="mt-8 flex flex-col">
      <label for="currentPassword" class="text-xl font-semibold text-black">Current Password</label>
    </div>
    <div class="w-[70%] max-md:w-full">
      <input
        type="text"
        id="currentPassword"
        class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 max-lg:min-h-[55px]"
        aria-required="true"
      />
    </div>
  </div>
  <div
    class="mb-4 flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start"
  >
    <div class="mt-8 flex flex-col">
      <label for="newPassword" class="text-xl font-semibold text-black">New Password</label>
    </div>
    <div class="w-[70%] max-md:w-full">
      <input
        type="text"
        id="newPassword"
        class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 max-lg:min-h-[55px]"
        aria-required="true"
      />
    </div>
  </div>

  <div class="flex w-full flex-row items-start justify-between max-md:flex-col max-md:items-start">
    <div class="mt-8 flex flex-col">
      <label for="confirmPassword" class="text-xl font-semibold text-black">Confirm Password</label>
    </div>
    <div class="w-[70%] max-md:w-full">
      <input
        type="text"
        id="confirmPassword"
        class="mt-2.5 min-h-[70px] w-full rounded-[75px] border-2 border-lime-800 px-4 max-lg:min-h-[55px]"
        aria-required="true"
      />
    </div>
  </div>

  <button
    class="mt-8 self-end whitespace-nowrap rounded-[128px] bg-lime-800 px-16 py-6 text-xl text-white max-lg:w-[30%] max-lg:py-3 max-lg:text-base max-md:w-[45%] max-md:px-5"
  >
    Done
  </button>

  <button
    class="mt-8 min-h-[73px] w-full gap-1 self-stretch rounded-[82px] bg-teal-900 px-10 py-7 text-xl text-white max-lg:py-2 max-md:min-h-[53px] max-md:max-w-full max-md:px-5"
  >
    Delete Account
  </button>
</form>
