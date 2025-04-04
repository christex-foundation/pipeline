<script>
  import Journey from '../../../lib/Journey.svelte';
  import Step from '../../../lib/Step.svelte';

  const steps = [
    {
      number: 1,
      title: 'Create Account',
      description:
        'Join the platform by creating an account to begin your journey as a creator, donor, or contributor. This is your gateway to submitting projects, tracking progress, and engaging with the community.',
    },
    {
      number: 2,
      title: 'Submit project',
      description:
        'Submit your project idea through our easy-to-use interface. Share your vision, goals, and how it aligns with the DPG mission to get it in front of potential donors and contributors.',
    },
    {
      number: 3,
      title: 'Receive funding or Contribution',
      description:
        'Once your project is live, you can receive funding from donors or contributions from experts in areas like design, engineering, or research to help you grow and succeed.',
    },
    {
      number: 4,
      title: 'Engage Community',
      description:
        'Collaborate with a global network of creators, contributors, and supporters. Keep everyone engaged with regular updates and discussions to strengthen your project',
    },
    {
      number: 5,
      title: 'Track Milestones and the 9 DPG Standards Checklist',
      description:
        'Monitor your progress and ensure your project meets the 9 key standards of a Digital Public Good. Easily track milestones and keep your community informed.',
    },
    {
      number: 6,
      title: 'Project Meets Requirements and Qualifies as a DPG',
      description:
        'Once your project meets all the necessary requirements, it will officially be recognized as a Digital Public Good, opening doors for even more support and impact.',
    },
    {
      number: 7,
      title: 'Project completes',
      description:
        'Your project has reached completion! With the backing of the community and compliance with DPG standards, your project can now make a lasting, global impact.',
    },
  ];
</script>

<div
  class="relative z-0 mb-20 flex h-[417px] w-full items-center justify-center max-sm:h-[200px]"
  style="background-image: url('https://s3-alpha-sig.figma.com/img/f7f4/7999/74709a5d690ece6b2d8e0fbee98a787a?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VfTXvDJj1skdr1Z5aGJlVyu9I1sG~SJUBaa4WUh4yJg6lC0r1f8SYOKmgCRQ6LMZejsFjUMIXvZ7i~Er0kckUkLIHZ~b9fL6wjXnX6Tih1Cu7KSqlIYUXK9DiU~36arhFVXllX-Fr12qi1llpQoKd5~DW45WaKvpsSotQayYPSWchGGq-b~Dc0NreyAasTrYxUjD4usnTVnw1hadbD~Pb8lNSpn46mFZMhRrV5lqIU2XjLjRqOJHX~Kq2jnYcXkzBD1nYRIPfJlydUxP47KqMSRWEU3wRLY-PVaalaEnZmMOLaLO4nAtIlTpjB6jm4FyfahmuD0-cYMjbzseeVNxjA__');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;"
>
  <div class="absolute inset-0 bg-[#d1ea9a]/90"></div>
  <div class="z-10 inline-flex flex-col items-center justify-start">
    <div
      class="text-center font-['Inter'] text-[89.62px] font-medium leading-[0.9] text-black max-sm:text-[50px] max-sm:leading-[1]"
    >
      How Pipeline Works
    </div>
  </div>
</div>

<main class="flex w-full items-center justify-center overflow-hidden">
  <img src="/how_pipeline_works.png" alt="How Pipeline Works" class="h-full w-full object-cover" />
</main>

<section class="flex w-full items-center justify-center px-7 text-black max-md:px-5">
  <div class="flex w-full max-w-[1101px] flex-col items-center">
    {#each steps as step}
      <Step number={step.number} title={step.title} description={step.description} />
    {/each}
  </div>
</section>

<style>
  :global(body),
  :global(html) {
    margin: 0;
    padding: 0;
  }
</style>
