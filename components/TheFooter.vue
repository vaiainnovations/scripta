<script lang="ts" setup>
import { useConfigStore } from "~~/core/store/ConfigStore";
</script>
<template>
  <section>
    <footer class="bg-white">
      <div class="px-4 py-16 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
        <!-- Links -->
        <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- About -->
          <div class="text-center sm:text-left">
            <p class="text-lg font-medium text-gray-900">
              Scripta
            </p>

            <nav class="mt-8">
              <ul class="text-sm space-y-4">
                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="/"
                  >
                    Home
                  </a>
                </li>

                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="https://beta.scripta.network/@scripta"
                  >
                    Blog
                  </a>
                </li>

                <li>
                  <a
                    class="flex group justify-center gap-1.5 sm:justify-start"
                    href="/"
                  >
                    <span class="text-gray-dark transition group-hover:text-gray-dark/75">
                      Status
                    </span>
                  </a>
                </li>

                <!-- <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="/"
                  >
                    Careers
                  </a>
                </li> -->
              </ul>
            </nav>
          </div>

          <!-- Features -->
          <div class="text-center sm:text-left">
            <p class="text-lg font-medium text-gray-900">
              Features
            </p>

            <nav class="mt-8">
              <ul class="text-sm space-y-4">
                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="/#features"
                  >
                    Create
                  </a>
                </li>

                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="/#explore"
                  >
                    Explore
                  </a>
                </li>

                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="/#privacy"
                  >
                    Privacy
                  </a>
                </li>

                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="/#decentralized"
                  >
                    Decentralized
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Resources -->
          <div class="text-center sm:text-left">
            <p class="text-lg font-medium text-gray-900">
              Resources
            </p>

            <nav class="mt-8">
              <ul class="text-sm space-y-4">
                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="https://desmos.network"
                  >
                    Desmos ($DSM)
                  </a>
                </li>
                <!-- <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="/"
                  >
                    Wallet Guides
                  </a>
                </li> -->

                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="https://keplr.app/"
                  >
                    Keplr
                  </a>
                </li>

                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="https://dpm.desmos.network/"
                  >
                    DPM
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Links -->
          <div class="text-center sm:text-left">
            <p class="text-lg font-medium text-gray-900">
              Helpful Links
            </p>

            <nav class="mt-8">
              <ul class="text-sm space-y-4">
                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="/"
                  >
                    FAQs
                  </a>
                </li>

                <li>
                  <a
                    class="text-gray-dark transition hover:text-gray-dark/75"
                    href="mailto:support@scripta.network"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <!-- Logo & Motto-->
        <div class="lg:items-center lg:justify-between lg:flex mt-16">
          <div class="flex justify-center  sm:justify-start">
            <img
              class="h-10"
              src="/logo/logo_lettering.svg"
            >
            <span class="font-serif">
              beta
            </span>
          </div>

          <p class="max-w-md mx-auto mt-4 leading-relaxed text-center text-gray-500 sm:ml-0 lg:mr-0 sm:text-left lg:mt-0 font-serif tracking-wide italic">
            ~ Verba Volant, Scripta Manent.
          </p>
        </div>

        <!-- Copyright & Socials -->
        <div class="pt-6 mt-6 border-t border-gray-100 sm:justify-between sm:items-center sm:flex">
          <p class="text-sm text-center text-gray-500 sm:text-left">
            Copyright &copy; 2023. All rights reserved.<br>
            <span class="text-xs">Built by Vaia Innovations</span>
          </p>

          <SocialsRow />
        </div>
      </div>
    </footer>
  </section>
</template>
