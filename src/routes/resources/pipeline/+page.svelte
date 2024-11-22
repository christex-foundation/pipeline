<script>
  import { steps } from './pipelineSteps.js';
  import illustration from './how.png';
  import Journey from '$lib/Journey.svelte';
</script>

<div
  class="relative h-[60dvh] flex justify-center items-center mb-20 max-sm:h-[200px]"
  style="background-image: url('https://s3-alpha-sig.figma.com/img/f7f4/7999/74709a5d690ece6b2d8e0fbee98a787a?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VfTXvDJj1skdr1Z5aGJlVyu9I1sG~SJUBaa4WUh4yJg6lC0r1f8SYOKmgCRQ6LMZejsFjUMIXvZ7i~Er0kckUkLIHZ~b9fL6wjXnX6Tih1Cu7KSqlIYUXK9DiU~36arhFVXllX-Fr12qi1llpQoKd5~DW45WaKvpsSotQayYPSWchGGq-b~Dc0NreyAasTrYxUjD4usnTVnw1hadbD~Pb8lNSpn46mFZMhRrV5lqIU2XjLjRqOJHX~Kq2jnYcXkzBD1nYRIPfJlydUxP47KqMSRWEU3wRLY-PVaalaEnZmMOLaLO4nAtIlTpjB6jm4FyfahmuD0-cYMjbzseeVNxjA__');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;"
>
  <div class="absolute inset-0 bg-[#d1ea9a]/90"></div>
  <h1 class="z-10 text-center text-8xl font-medium font-[Inter] max-sm:text-[50px]">
    How Pipeline Works
  </h1>
</div>

<main>
  <img src={illustration} alt="How Pipeline Works Illustations" class="object-cover" />

  <section class="grid max-w-4xl mx-auto px-4 md:px-10">
    {#each steps as step}
      <article class="gap-3 md:gap-5 mt-24 flex items-center justify-center">
        <span
          class="text-sm self-start w-28 h-7 font-semibold bg-lime-300 rounded-full border-lime-800 border-2 md:h-10 md:w-20 grid place-content-center"
        >
          {step.number}
        </span>

        <div class="grid gap-2">
          <h2 class="text-2xl min-w-fit font-semibold max-md:-mt-1">{step.title}</h2>
          <p class="text-lg font-light leading-7">{step.description}</p>
        </div>
      </article>
    {/each}
  </section>

  <Journey />
</main>
