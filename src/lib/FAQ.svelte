<script>
  import FAQItem from './FAQItem.svelte';
  const faqItems = [
    {
      question: 'What is Pipeline?',
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/885a0a3d657ee775c81b61a9ff9de6317a670673f099abb6ab47bc79663f7b6f?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
      answer:
        'Pipeline is a platform where creators can submit their digital public good projects to get support, collaborate with others, and bring their ideas to life. It connects creators, donors, and contributors to build impactful, open-source solutions.',
    },
    {
      question: 'Who is Pipeline for?',
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/dc0869fd271c126fd9af57414c750d482a47bbecbf1c20273ae79a09209b263d?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
      answer:
        'Pipeline is for anyone with a passion for creating or supporting digital public goods. Whether you’re a developer, donor, designer, or volunteer, Pipeline helps you contribute to open-source projects that make a difference.',
    },
    {
      question: 'Why Open source?',
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/6283cfa2c3b70cee3a1f912c9ed2fd6c3a41a5263141141422b73b0e7bb1f5e7?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
      answer:
        'Open source allows anyone to freely use, modify, and improve a project. It fosters collaboration, innovation, and ensures that solutions are accessible to everyone, making a bigger impact globally.',
    },
    {
      question: 'How can I contribute?',
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/b3313976087d6b6e12186e56d58268206a0e3dd70048f40acbff8b0bc8dc339d?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
      answer:
        'You can contribute by donating funds, offering your skills (like coding, design, or research), or providing resources to help creators move their projects forward. Everyone can make a difference!',
    },
    {
      question: 'What is DPG Registry?',
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/5de8ddeca1ad321b10d531e6dbfd6be9cff811c2a7eea1a3d538f5101aec0713?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
      answer:
        'The 9 DPG requirements ensure projects are open, ethical, and sustainable. They include open-source code, open standards, open data, privacy, and inclusivity to create lasting, positive impacts.',
    },
    {
      question: 'How can I complete it?',
      imageSrc:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/de7c92ed0cfa1582baa01984d8f24183e3cf990005570e4d665b76acf6834876?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8',
      answer:
        'Submit your project on Pipeline, follow the steps to meet the DPG requirements, engage with the community, and track your progress. Once you’ve met all the criteria, your project can be recognized as an official Digital Public Good!',
    },
  ];
</script>

<section
  class="container mx-auto mt-16 px-4 py-16 text-center font-semibold sm:mt-32 sm:px-6 sm:py-24 lg:px-8"
>
  <div
    class="mx-auto max-w-[1276px] rounded-3xl border-2 border-solid border-teal-950 p-6 sm:rounded-[57px] sm:p-10"
  >
    <h1 class="mb-8 text-4xl text-emerald-950 sm:mb-12 sm:text-5xl lg:text-7xl">FAQ</h1>
    <div class="space-y-6 sm:space-y-8">
      {#each faqItems as item}
        <FAQItem question={item.question} imageSrc={item.imageSrc} answer={item.answer} />
      {/each}
    </div>
  </div>
</section>
