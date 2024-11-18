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
  class="w-[100%] h-[417px] bg-[#d1ea9a]/70 justify-center items-center gap-2.5 inline-flex mb-20"
>
  <div class="flex-col justify-start items-center gap-[14.67px] inline-flex">
    <div
      class="text-center text-black text-[89.62px] font-semibold font-['PP Mori'] leading-[98.58px]"
    >
      How Pipeline Works
    </div>
  </div>
</div>

<main class="flex items-center justify-center w-full overflow-hidden">
  <img src="/how.png" alt="Description of the image" class="object-cover w-full h-full" />
</main>

<section class="flex items-center justify-center w-full text-black px-7 max-md:px-5">
  <div class="flex flex-col items-center w-full max-w-[1101px]">
    {#each steps as step}
      <Step number={step.number} title={step.title} description={step.description} />
    {/each}
  </div>
</section>

<div class="w-full max-w-[1076px] mx-auto mt-16">
  <Journey />
</div>

<style>
  :global(body),
  :global(html) {
    margin: 0;
    padding: 0;
  }
</style>
