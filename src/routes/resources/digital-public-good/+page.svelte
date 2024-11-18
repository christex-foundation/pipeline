<script>
  import Nav from '../../../lib/Nav.svelte';
  import Journey from '../../../lib/Journey.svelte';
  import Footer from '../../../lib/Footer.svelte';

  import { onMount } from 'svelte';

  let imageLoaded = false;

  onMount(() => {
    const img = new Image();
    img.src =
      'https://cdn.builder.io/api/v1/image/assets/TEMP/2e79f9f0f0676cc1340e4648692e7dd2c076c54bc6408583026e9461be5dccd4?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8';
    img.onload = () => {
      imageLoaded = true;
    };
  });
</script>

<section class="relative min-h-[417px] flex flex-col justify-center items-center">
  {#if imageLoaded}
    <img
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e79f9f0f0676cc1340e4648692e7dd2c076c54bc6408583026e9461be5dccd4?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      alt=""
      class="absolute inset-0 object-cover w-full h-full"
      aria-hidden="true"
    />
  {/if}
  <div
    class="relative z-10 flex flex-col items-center self-stretch my-auto min-w-[240px] max-w-full"
  >
    <h1
      class="text-8xl font-semibold text-center text-black leading-[99px] max-md:text-4xl max-md:leading-[49px]"
    >
      <slot></slot>
    </h1>
  </div>

  <img
    src="https://s3-alpha-sig.figma.com/img/f7f4/7999/74709a5d690ece6b2d8e0fbee98a787a?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=E2R3CiXJIjn2rAVeMIETSpzE7BntJ~MuC7dHH5dj-7Z06svc~icmbBG2eACWP1az6FFZLjIkI9u8MMuyKVwI4R54UiS4LbDe574SV7QTWOa8cUWr1inS-3mJ3I0xv4qLkgg3Jush0j-a2TlIftJfQvQSkBUtATyUjtmUiuNINTmM7RgVvAH2p9dqQ3OYRIj5Rs9bZwcwJ4TOhzib1Bdnc0InSsbhSHxT7xWia5xBa44vCfmvTntMmCo9EsokwGrnYxKAQspwc4pfn8qHZ4oiS-hUTKifXKcdGNZEYPYbpRXFFl~a~gXbHIYcM1Zu6sRPYPpmUv8ZdEboIWl1DA8DFw__"
    alt="Digital Public Goods Background"
    class="absolute inset-0 w-full h-full object-cover z-[-1] opacity-50"
  />
</section>

<div class="max-w-[1076px] px-4 py-8 mx-auto text-start">
  <h1 class="mb-4 text-[43.06px] font-semibold text-gray-800 max-sm:text-3xl">What are DPGs?</h1>
  <p
    class="text-black text-[22.78px] font-normal font-['PP Mori'] leading-[45.89px] max-sm:text-lg max-sm:leading-normal"
  >
    Digital public goods are the resources, data sheets, AI models, and software available to all
    citizens for free contributing to sustainable development. These are non-excludable which means
    no one is excluded from using these resources and services and non-rivalrous which means they
    are available and accessible to all communities and one person's use will not diminish their
    availability for other people in the communities.
  </p>

  <div class="my-8 border-t border-black"></div>

  <h2 class="mb-6 text-[43.06px] font-semibold text-gray-800 max-sm:text-2xl">Examples of DPGs</h2>
  <div class="space-y-6 text-left">
    <div>
      <h3 class="mb-2 text-[32px] font-semibold text-gray-800 max-sm:text-xl">OpenAI Models:</h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        These are artificial intelligence models developed and shared openly to advance research,
        innovation, and accessibility across multiple sectors. E.g. OpenAI's GPT models like ChatGPT
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-[32px] font-semibold text-gray-800 max-sm:text-xl">
        Open Software (Open Source Software):
      </h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        Open software refers to programs whose source code is made publicly available, allowing
        anyone to view, modify, and distribute it. This encourages innovation and collaboration.
        Example: Linux, Android
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-[32px] font-semibold text-gray-800 max-sm:text-xl">Open Data:</h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        Open data refers to datasets that are freely available for anyone to use, modify, and share.
        This openness fosters transparency, innovation, and solutions to global challenges. Example:
        World Bank Open data
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-[32px] font-semibold text-gray-800 max-sm:text-xl">Open Content:</h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        Open content refers to materials (text, images, videos, etc.) that are freely available for
        anyone to use, share, and often modify. This allows for the broad dissemination of knowledge
        and creativity. Example: Wikipedia
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-[32px] font-semibold text-gray-800 max-sm:text-xl">Open Standards:</h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        Open standards refer to technical standards that are made available for anyone to use,
        ensuring that different systems and technologies can work together seamlessly. Example HTML
        & CSS
      </p>
    </div>
  </div>

  <div class="my-8 border-t border-gray-300"></div>

  <h2 class="mb-6 text-[43.06px] font-semibold text-gray-800 max-sm:text-2xl">
    Why are DPGs important?
  </h2>
  <p class="mb-6 text-xl text-gray-700 max-sm:text-base">
    Digital Public Goods (DPGs) like OpenAI models, open software, open data, open content, and open
    standards are incredibly important because they foster innovation, inclusivity, and
    collaboration on a global scale. Here's why they matter:
  </p>
  <div class="space-y-6 text-left">
    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-lg">
        1. Promote Innovation and Creativity
      </h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        Open resources empower anyone to build upon existing tools and knowledge, fuelling
        innovation.<br />Example: Open-source software like Linux allows developers to create
        tailored operating systems for everything from personal computers to servers, driving the
        evolution of cloud computing and mobile devices.
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-lg">
        2. Increase Access and Inclusivity
      </h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        Open resources break down barriers to entry, making essential tools and knowledge available
        to people around the world, regardless of economic or geographic constraints.<br />Example:
        Open educational resources like Khan Academy provide free access to high-quality learning
        materials for students who may not have access to traditional education.
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-lg">
        3. Foster Collaboration and Global Solutions
      </h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        This open exchange of ideas and resources leads to more effective and innovative solutions,
        especially for global challenges like climate change, public health, and poverty.<br
        />Example: Open data from global health organizations enables researchers from different
        countries to collaborate on combating diseases, like during the COVID-19 pandemic.
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-lg">
        4. Encourage Transparency and Trust
      </h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        By making information, tools, and data openly available, DPGs promote transparency and
        accountability in industries, governments, and organizations.<br />Example: Open data from
        government sources allows citizens to monitor how public funds are used, fostering
        transparency and accountability.
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-lg">
        5. Drive Economic Growth
      </h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        Open resources lower the cost of development and innovation by eliminating licensing fees
        and providing access to essential tools.<br />Example: Startups in Africa have built
        innovative solutions on top of open-source platforms, driving economic growth and providing
        tech solutions tailored to local needs.
      </p>
    </div>
    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-lg">
        6. Ensure Interoperability and Connectivity
      </h3>
      <p class="text-lg text-gray-700 max-sm:text-base">
        Open standards are essential for ensuring that different systems, technologies, and devices
        can work together seamlessly.<br />Example: HTML, an open standard, ensures that websites
        are accessible on all devices and browsers, contributing to the growth of the World Wide
        Web.
      </p>
    </div>
  </div>

  <div class="my-8 border-t border-gray-300"></div>

  <h2 class="mb-6 text-[43.06px] font-semibold text-gray-800 max-sm:text-2xl">
    Digital Public Goods Standard
  </h2>
  <p class="mb-8 text-[22px] text-gray-700 max-sm:text-base">
    The Digital Public Goods Standard is a set of specifications and guidelines designed to maximise
    consensus about whether a digital solution conforms to the definition of a digital public good.
    According to the UN Secretary General's Roadmap for Digital Cooperation, digital public goods
    are open-source software, open standards, open data, open AI systems, and open content
    collections that adhere to privacy and other applicable best practices, do no harm, and are of
    high relevance for attainment of the United Nations 2030 Sustainable Development Goals (SDGs).
  </p>

  <h2 class="mb-6 text-[43.06px] font-semibold text-gray-800 max-sm:text-2xl">
    Requirements to be a DPG
  </h2>
  <p class="text-[25px] text-gray-700 max-sm:text-base">
    Below are the 9 indicators and requirements that determine if nominated software, data, AI
    systems, and/or content collections can be considered a DPG.
  </p>
</div>

<div class="max-w-[1076px] px-4 py-8 mx-auto">
  <div class="space-y-8">
    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">1. Relevance to SDGs</h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        The project needs a clear plan for long-term sustainability, ensuring it can continue to
        advance the sustainable development goals.
      </p>
    </div>

    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">
        2. Use of Approved Open Licenses
      </h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        The project must use an open-source license, allowing others to freely use, modify, and
        distribute the solution.
      </p>
    </div>

    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">3. Clear Ownership</h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        Ownership of assets that the digital public good produces must be clearly defined and
        documented. For example, through copyright, trademark, or other publicly available
        information.
      </p>
    </div>

    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">
        4. Platform Independence
      </h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        There should be existence of functional, open alternatives that can be used without
        significant changes to the core product.
      </p>
    </div>

    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">5. Documentation</h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        Any educational or informational materials should be openly licensed, making them accessible
        to everyone.
      </p>
    </div>

    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">
        6. Mechanism for Extracting Data
      </h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        The project should share data openly, ensuring transparency and enabling others to build
        upon it.
      </p>
    </div>

    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">
        7. Adherence to Privacy and Applicable Laws
      </h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        The project must prioritize data privacy and security, protecting users' information and
        ensuring ethical practices.
      </p>
    </div>

    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">
        8. Adherence to Standards & Best Practices
      </h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        It must adhere to widely accepted open standards that promote interoperability and
        accessibility.
      </p>
    </div>

    <div>
      <h3 class="mb-2 text-2xl font-semibold text-gray-800 max-sm:text-xl">
        9. Do No Harm by Design
      </h3>
      <p class="text-xl text-gray-700 max-sm:text-lg">
        It should be designed to avoid causing harm, ensuring the project benefits society without
        unintended negative consequences.
      </p>
    </div>
  </div>
</div>

<div class="w-full max-w-[1076px] mx-auto mt-16">
  <Journey />
</div>
