<form class="flex flex-col text-3xl text-black max-md:max-w-full w-[79%] max-lg:w-full max-md:mt-[-40px]">

  <div class="flex flex-row items-start justify-between w-full mb-4 max-md:flex-col max-md:items-start">
    <div class="flex flex-col mt-8">
      <label for="currentPassword" class="text-xl font-semibold text-black">Current Password</label>
    </div>
    <div class="w-[70%] max-md:w-full">
      <input
        type="text"
        id="currentPassword"

        class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
        aria-required="true"
      />
    </div>
  </div>
  <div class="flex flex-row items-start justify-between w-full mb-4 max-md:flex-col max-md:items-start">
    <div class="flex flex-col mt-8">
      <label for="newPassword" class="text-xl font-semibold text-black">New Password</label>
    </div>
    <div class="w-[70%] max-md:w-full">
      <input
        type="text"
        id="newPassword"
        class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
        aria-required="true"
      />
    </div>
  </div>

  <div class="flex flex-row items-start justify-between w-full max-md:flex-col max-md:items-start">
    <div class="flex flex-col mt-8">
      <label for="confirmPassword" class="text-xl font-semibold text-black">Confirm Password</label>
    </div>
    <div class="w-[70%] max-md:w-full">
      <input
        type="text"
        id="confirmPassword"

        class="w-full border-2 border-lime-800 min-h-[70px] rounded-[75px] mt-2.5 px-4 max-lg:min-h-[55px] text-base"
        aria-required="true"
      />
    </div>
  </div>

    <button class="self-end px-16 py-6 mt-8 text-xl text-white whitespace-nowrap bg-lime-800 rounded-[128px] max-md:px-5 max-lg:w-[30%] max-lg:text-base max-md:w-[45%] max-lg:py-3">
      Done
    </button>
  
    <button class="gap-1 self-stretch px-10 py-7 mt-8 w-full text-xl text-white bg-teal-900 min-h-[73px] rounded-[82px] max-md:px-5 max-md:max-w-full max-lg:py-2 max-md:min-h-[53px] ">
      Delete Account
    </button>
  </form>
