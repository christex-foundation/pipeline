<script>
  import Journey from '../../../lib/Journey.svelte';
  import Step from '../../../lib/Step.svelte';
  import { User, Upload, Heart, Users, CheckSquare, Award, Trophy } from 'lucide-svelte';

  const steps = [
  {
      id: 1,
      title: "Create Account",
      description: "Join the platform by creating an account to begin your journey as a creator, donor, or contributor. This is your gateway to submitting projects, tracking progress, and engaging with the community.",
      icon: User,
      color: "purple",
    },
    {
      id: 2,
      title: "Submit project",
      description: "Submit your project idea through our easy-to-use interface. Share your vision, goals, and how it aligns with the DPG mission to get it in front of potential donors and contributors.",
      icon: Upload,
      color: "yellow",
    },
    {
      id: 3,
      title: "Receive funding or Contribution",
      description: "Once your project is live, you can receive funding from donors or contributions from experts in areas like design, engineering, or research to help you grow and succeed.",
      icon: Heart,
      color: "purple",
    },
    {
      id: 4,
      title: "Engage Community",
      description: "Collaborate with a global network of creators, contributors, and supporters. Keep everyone engaged with regular updates and discussions to strengthen your project",
      icon: Users,
      color: "yellow",
    },
    {
      id: 5,
      title: "Track Milestones and the 9 DPG Standards Checklist",
      description: "Monitor your progress and ensure your project meets the 9 key standards of a Digital Public Good. Easily track milestones and keep your community informed.",
      icon: CheckSquare,
      color: "purple",
    },
    {
      id: 6,
      title: "Project Meets Requirements and Qualifies as a DPG",
      description: "Once your project meets all the necessary requirements, it will officially be recognized as a Digital Public Good, opening doors for even more support and impact.",
      icon: Award,
      color: "yellow",
    },
    {
      id: 7,
      title: "Project completes",
      description: "Your project has reached completion! With the backing of the community and compliance with DPG standards, your project can now make a lasting, global impact.",
      icon: Trophy,
      color: "purple",
    }
  ];
</script>

<div class="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-14 md:py-20">
  <div class="mb-12 text-center md:mb-16">
    <h1 class="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl animate-fade-in">
      How Pipeline Works
    </h1>
    <p class="max-w-3xl mx-auto text-base text-gray-300 sm:text-lg md:text-xl animate-fade-in">
      Transform your innovative ideas into impactful Digital Public Goods. Follow our comprehensive 7-step process to create solutions that benefit communities worldwide.
    </p>
  </div>

  <div class="flex flex-wrap justify-center gap-4">
    <a href="/project/create" class="inline-flex items-center gap-2 rounded-full bg-dashboard-yellow-400 px-10 py-5 font-semibold text-dashboard-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-dashboard-yellow-500 hover:shadow-[0_10px_25px_rgba(250,204,21,0.3)]">
      Start Your Journey
    </a>
  </div>
</div>

<main class="flex items-center justify-center w-full overflow-hidden">
  <img src="/how_pipeline_works.png" alt="How Pipeline Works" class="object-cover w-full h-full" />
</main>

<section class="flex items-center justify-center w-full py-4 text-black px-7 max-md:px-5">
  <div class="flex w-full max-w-[1101px] flex-col items-center space-y-6">
   {#each steps as step}
    <Step
      number={step.id}
      title={step.title}
      description={step.description}
      icon={step.icon}
      color={step.color}
    />
  {/each}
  </div>
</section>

<style>
  :global(body),
  :global(html) {
    margin: 0;
    padding: 0;
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-in-out;
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

</style>
