<script>
  import { Toaster } from 'svelte-sonner';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let isDesktop = false;
  let prefersReducedMotion = false;

  onMount(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    isDesktop = mediaQuery.matches;
    prefersReducedMotion = motionQuery.matches;

    const handleChange = (e) => {
      isDesktop = e.matches;
    };

    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  });
</script>

<Toaster richColors position="top-right" closeButton />
<main class="bg-dashboard-black sm:-mb-16 sm:h-screen sm:overflow-hidden md:pr-0">
  <div class="flex flex-col h-full gap-0 md:flex-row md:gap-5">
    <section class="flex-shrink-0 w-full md:w-5/12">
      <div
        class="relative flex flex-col items-center justify-center gap-2.5 bg-dashboard-gray-900 pb-10 pl-0 pr-0 pt-10 md:h-full md:py-24 md:pl-12 md:pr-2"
      >
        {#if browser && isDesktop && !prefersReducedMotion}
          <div class="absolute inset-0 overflow-hidden">
            <!-- Enhanced pipeline animation -->
            <div class="pipeline-bg">
              <!-- Primary flowing dots -->
              <div class="floating-dot dot-1 primary"></div>
              <div class="floating-dot dot-2 primary"></div>
              <div class="floating-dot dot-3 primary"></div>
              <div class="floating-dot dot-4 primary"></div>
              <div class="floating-dot dot-5 primary"></div>

              <!-- Secondary accent dots -->
              <div class="floating-dot dot-6 secondary"></div>
              <div class="floating-dot dot-7 secondary"></div>
              <div class="floating-dot dot-8 secondary"></div>

              <!-- Micro dots for depth -->
              <div class="floating-dot dot-9 micro"></div>
              <div class="floating-dot dot-10 micro"></div>
              <div class="floating-dot dot-11 micro"></div>
              <div class="floating-dot dot-12 micro"></div>

              <!-- Main pipeline lines -->
              <div class="pipeline-line line-1 main"></div>
              <div class="pipeline-line line-2 main"></div>
              <div class="pipeline-line line-3 main"></div>

              <!-- Connecting lines -->
              <div class="pipeline-line line-4 connector"></div>
              <div class="pipeline-line line-5 connector"></div>

              <!-- Subtle background lines -->
              <div class="pipeline-line line-6 background"></div>
              <div class="pipeline-line line-7 background"></div>
            </div>
          </div>
        {/if}
        <div
          class="relative z-10 mx-auto flex w-full min-w-[240px] max-w-[534px] flex-col items-center"
        >
          <img
            loading="lazy"
            src="/pipeline_logo_large.svg"
            alt="Pipeline logo"
            class="aspect-[5.95] h-[48px] max-w-full object-contain"
          />
        </div>
      </div>
    </section>

    <div class="flex items-center justify-center flex-1 min-h-0 bg-white">
      <section
        class="mt-20 flex w-full max-w-[1235px] flex-col items-center justify-center pb-20 max-md:mt-10 max-md:px-5"
      >
        <slot></slot>
      </section>
    </div>
  </div>
</main>

<style>
  .pipeline-bg {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .floating-dot {
    position: absolute;
    border-radius: 50%;
    will-change: transform, opacity;
  }

  /* Primary dots - purple accent */
  .floating-dot.primary {
    width: 10px;
    height: 10px;
    background: linear-gradient(135deg, #ad89fd, #c49bff);
    box-shadow: 0 0 15px rgba(173, 137, 253, 0.6);
  }

  /* Secondary dots - lime accent */
  .floating-dot.secondary {
    width: 6px;
    height: 6px;
    background: linear-gradient(135deg, #bde35b, #caea7a);
    box-shadow: 0 0 10px rgba(189, 227, 91, 0.5);
  }

  /* Micro dots - subtle purple tint */
  .floating-dot.micro {
    width: 3px;
    height: 3px;
    background: linear-gradient(135deg, #ad89fd, #c49bff);
    box-shadow: 0 0 8px rgba(173, 137, 253, 0.4);
  }

  /* Primary dot positions and animations */
  .dot-1 {
    top: 15%;
    left: 8%;
    animation: flow-primary-1 8s ease-in-out infinite;
  }
  .dot-2 {
    top: 35%;
    left: 75%;
    animation: flow-primary-2 10s ease-in-out infinite 1s;
  }
  .dot-3 {
    top: 65%;
    left: 20%;
    animation: flow-primary-3 9s ease-in-out infinite 2s;
  }
  .dot-4 {
    top: 80%;
    left: 70%;
    animation: flow-primary-4 7s ease-in-out infinite 3s;
  }
  .dot-5 {
    top: 25%;
    left: 45%;
    animation: flow-primary-5 11s ease-in-out infinite 1.5s;
  }

  /* Secondary dot positions and animations */
  .dot-6 {
    top: 45%;
    left: 85%;
    animation: flow-secondary-1 12s ease-in-out infinite 2.5s;
  }
  .dot-7 {
    top: 75%;
    left: 15%;
    animation: flow-secondary-2 9s ease-in-out infinite 4s;
  }
  .dot-8 {
    top: 55%;
    left: 55%;
    animation: flow-secondary-3 8s ease-in-out infinite 0.5s;
  }

  /* Micro dot positions and animations */
  .dot-9 {
    top: 30%;
    left: 25%;
    animation: float-micro-1 15s ease-in-out infinite;
  }
  .dot-10 {
    top: 70%;
    left: 60%;
    animation: float-micro-2 13s ease-in-out infinite 3s;
  }
  .dot-11 {
    top: 50%;
    left: 10%;
    animation: float-micro-3 14s ease-in-out infinite 6s;
  }
  .dot-12 {
    top: 85%;
    left: 40%;
    animation: float-micro-4 16s ease-in-out infinite 2s;
  }

  .pipeline-line {
    position: absolute;
    will-change: transform, opacity;
  }

  /* Main pipeline lines */
  .pipeline-line.main {
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(173, 137, 253, 0.7),
      rgba(196, 155, 255, 0.4),
      transparent
    );
  }

  /* Connector lines */
  .pipeline-line.connector {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(189, 227, 91, 0.6), transparent);
  }

  /* Background lines */
  .pipeline-line.background {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(173, 137, 253, 0.2), transparent);
  }

  /* Main line positions and animations */
  .line-1.main {
    top: 30%;
    left: 15%;
    width: 70%;
    animation: pulse-main-1 6s ease-in-out infinite;
  }
  .line-2.main {
    top: 60%;
    left: 10%;
    width: 80%;
    animation: pulse-main-2 8s ease-in-out infinite 2s;
  }
  .line-3.main {
    top: 45%;
    left: 25%;
    width: 50%;
    animation: pulse-main-3 7s ease-in-out infinite 4s;
  }

  /* Connector line positions and animations */
  .line-4.connector {
    top: 75%;
    left: 20%;
    width: 60%;
    animation: pulse-connector-1 10s ease-in-out infinite 1s;
  }
  .line-5.connector {
    top: 20%;
    left: 30%;
    width: 45%;
    animation: pulse-connector-2 9s ease-in-out infinite 3s;
  }

  /* Background line positions and animations */
  .line-6.background {
    top: 85%;
    left: 5%;
    width: 90%;
    animation: pulse-background-1 12s ease-in-out infinite;
  }
  .line-7.background {
    top: 10%;
    left: 15%;
    width: 70%;
    animation: pulse-background-2 14s ease-in-out infinite 5s;
  }

  /* Primary dot animations - flowing movement */
  @keyframes flow-primary-1 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.8;
    }
    25% {
      transform: translate(30px, -20px) scale(1.2);
      opacity: 1;
    }
    50% {
      transform: translate(60px, 10px) scale(0.9);
      opacity: 0.9;
    }
    75% {
      transform: translate(20px, 25px) scale(1.1);
      opacity: 0.7;
    }
  }

  @keyframes flow-primary-2 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.7;
    }
    33% {
      transform: translate(-40px, -15px) scale(1.1);
      opacity: 1;
    }
    66% {
      transform: translate(-20px, 20px) scale(0.8);
      opacity: 0.8;
    }
  }

  @keyframes flow-primary-3 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.9;
    }
    40% {
      transform: translate(35px, -25px) scale(1.3);
      opacity: 1;
    }
    80% {
      transform: translate(-15px, 15px) scale(0.9);
      opacity: 0.6;
    }
  }

  @keyframes flow-primary-4 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translate(-30px, -30px) scale(1.2);
      opacity: 1;
    }
  }

  @keyframes flow-primary-5 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.8;
    }
    30% {
      transform: translate(25px, 20px) scale(0.8);
      opacity: 0.5;
    }
    70% {
      transform: translate(-25px, -10px) scale(1.2);
      opacity: 1;
    }
  }

  /* Secondary dot animations - accent movement */
  @keyframes flow-secondary-1 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.6;
    }
    50% {
      transform: translate(-20px, 15px) scale(1.1);
      opacity: 0.9;
    }
  }

  @keyframes flow-secondary-2 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.7;
    }
    33% {
      transform: translate(15px, -10px) scale(0.9);
      opacity: 0.4;
    }
    66% {
      transform: translate(30px, 5px) scale(1.2);
      opacity: 1;
    }
  }

  @keyframes flow-secondary-3 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.5;
    }
    25% {
      transform: translate(-15px, -15px) scale(1.1);
      opacity: 0.8;
    }
    75% {
      transform: translate(10px, 20px) scale(0.8);
      opacity: 0.6;
    }
  }

  /* Micro dot animations - subtle depth */
  @keyframes float-micro-1 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.4;
    }
    50% {
      transform: translate(8px, -8px) scale(1.2);
      opacity: 0.7;
    }
  }

  @keyframes float-micro-2 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.3;
    }
    33% {
      transform: translate(-5px, 5px) scale(0.8);
      opacity: 0.6;
    }
    66% {
      transform: translate(10px, -3px) scale(1.1);
      opacity: 0.5;
    }
  }

  @keyframes float-micro-3 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.5;
    }
    40% {
      transform: translate(6px, 8px) scale(1.3);
      opacity: 0.8;
    }
    80% {
      transform: translate(-4px, -6px) scale(0.9);
      opacity: 0.3;
    }
  }

  @keyframes float-micro-4 {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.4;
    }
    60% {
      transform: translate(-8px, 12px) scale(1.1);
      opacity: 0.7;
    }
  }

  /* Line animations - flowing energy */
  @keyframes pulse-main-1 {
    0%,
    100% {
      opacity: 0.4;
      transform: scaleX(0.7);
    }
    50% {
      opacity: 0.9;
      transform: scaleX(1.1);
    }
  }

  @keyframes pulse-main-2 {
    0%,
    100% {
      opacity: 0.3;
      transform: scaleX(0.8);
    }
    40% {
      opacity: 0.8;
      transform: scaleX(1);
    }
    80% {
      opacity: 0.5;
      transform: scaleX(0.9);
    }
  }

  @keyframes pulse-main-3 {
    0%,
    100% {
      opacity: 0.5;
      transform: scaleX(0.6);
    }
    30% {
      opacity: 0.9;
      transform: scaleX(1.2);
    }
    70% {
      opacity: 0.7;
      transform: scaleX(0.8);
    }
  }

  @keyframes pulse-connector-1 {
    0%,
    100% {
      opacity: 0.2;
      transform: scaleX(0.5);
    }
    50% {
      opacity: 0.6;
      transform: scaleX(1);
    }
  }

  @keyframes pulse-connector-2 {
    0%,
    100% {
      opacity: 0.3;
      transform: scaleX(0.7);
    }
    60% {
      opacity: 0.7;
      transform: scaleX(1.1);
    }
  }

  @keyframes pulse-background-1 {
    0%,
    100% {
      opacity: 0.1;
      transform: scaleX(0.9);
    }
    50% {
      opacity: 0.3;
      transform: scaleX(1);
    }
  }

  @keyframes pulse-background-2 {
    0%,
    100% {
      opacity: 0.15;
      transform: scaleX(0.8);
    }
    40% {
      opacity: 0.25;
      transform: scaleX(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .floating-dot,
    .pipeline-line {
      animation: none;
    }
  }
</style>
