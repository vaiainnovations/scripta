<template>
  <div class="bg-background-alt flex flex-col w-full gap-y-5 lg:flex-row lg:h-full lg:overflow-hidden">
    <!-- Mobile Hidden -->
    <div class="flex-col gap-y-14 lg:gap-y-0 lg:justify-evenly lg:w-1/3 py-14 lg:h-full hidden md:flex">
      <ProfileUser :read-only="true" />
      <ProfileBalance />
    </div>

    <div class="flex flex-col gap-y-7 lg:w-2/3 lg:bg-background lg:overflow-y-auto lg:px-32 lg:py-16 fixed md:relative">
      <div class="flex pt-8 md:pt-3">
        <div class="flex-1 my-auto">
          <NuxtLink to="/profile">
            <div class="flex">
              <img :src="'/icons/bold/arrow-left.svg'">
              <p class="text-gray-dark">
                Back
              </p>
            </div>
          </NuxtLink>
        </div>
        <div class="flex-grow">
          <h1 class="font-bold text-2xl">
            Settings
          </h1>
        </div>
      </div>

      <div class="py-4">
        <h1 class="font-semibold text-gray-dark">
          Privacy
        </h1>
        <div class="mt-2">
          <SettingsToggle class="py-4 mb-4 bg-background-alt rounded-xl">
            <h1 class="font-bold text-xl">
              Privacy & Terms
            </h1>
            <p class="font-light">
              Agree with privacy and terms of the Scripta platform.
            </p>
          </SettingsToggle>
          <SettingsToggle class="py-4 mb-4 bg-background-alt rounded-xl">
            <h1 class="font-bold text-xl">
              Advertisement
            </h1>
            <p class="font-light">
              Agree with advertisement policy of the Scripta platform.
            </p>
          </SettingsToggle>
          <SettingsToggle class="py-4 mb-4 bg-background-alt rounded-xl">
            <h1 class="font-bold text-xl">
              Cookies
            </h1>
            <p class="font-light">
              Agree with cookies policy of the Scripta platform.
            </p>
          </SettingsToggle>
        </div>
      </div>

      <div class="py-4">
        <h1 class="font-semibold text-gray-dark">
          Web3
        </h1>
        <div class="mt-2">
          <SettingsToggle class="py-4 mb-4 bg-background-alt rounded-xl">
            <h1 class="font-bold text-xl">
              Grant Authorization
            </h1>
            <div class="font-light">
              Authorize Scripta to sign new posts/comments/reactions on your behalf, you'll <b class="font-semibold">always</b> be the author of that content.
              In this way you will not have to sign every action, but only the authorization that you can revoke whenever you want.
            </div>
          </SettingsToggle>
        </div>
      </div>
    </div>
  </div>
</template>
