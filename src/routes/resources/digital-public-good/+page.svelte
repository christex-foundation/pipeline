<script>
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
  import { BookOpen, Code, Database, FileText, Settings, Shield, Brain, Users, Cpu, Handshake, ChartLine, RadioTower } from 'lucide-svelte';

  const examples = [
    {
      title: "OpenAI Models",
      description: "These are artificial intelligence models developed and shared openly to advance research, innovation, and accessibility across multiple sectors. E.g. OpenAI's GPT models like ChatGPT",
      icon: Brain,
      color: "purple"
    },
    {
      title: "Open Software (Open Source Software)",
      description: "Open software refers to programs whose source code is made publicly available, allowing anyone to view, modify, and distribute it. This encourages innovation and collaboration. Example: Linux, Android",
      icon: Code,
      color: "yellow"
    },
    {
      title: "Open Data",
      description: "Open data refers to datasets that are freely available for anyone to use, modify, and share. This openness fosters transparency, innovation, and solutions to global challenges. Example: World Bank Open data",
      icon: Database,
      color: "purple"
    },
    {
      title: "Open Content",
      description: "Open content refers to materials (text, images, videos, etc.) that are freely available for anyone to use, share, and often modify. This allows for the broad dissemination of knowledge and creativity. Example: Wikipedia",
      icon: FileText,
      color: "yellow"
    },
    {
      title: "Open Standards",
      description: "Open standards refer to technical standards that are made available for anyone to use, ensuring that different systems and technologies can work together seamlessly. Example HTML & CSS",
      icon: Settings,
      color: "purple"
    }
  ];

  const importancePoints = [
    {
      title: "Promote Innovation and Creativity",
      description: "Open resources empower anyone to build upon existing tools and knowledge, fuelling innovation. Example: Open-source software like Linux allows developers to create tailored operating systems for everything from personal computers to servers, driving the evolution of cloud computing and mobile devices.",
      icon: Cpu
    },
    {
      title: "Increase Access and Inclusivity", 
      description: "Open resources break down barriers to entry, making essential tools and knowledge available to people around the world, regardless of economic or geographic constraints. Example: Open educational resources like Khan Academy provide free access to high-quality learning materials for students who may not have access to traditional education.",
      icon: Users
    },
    {
      title: "Foster Collaboration and Global Solutions",
      description: "This open exchange of ideas and resources leads to more effective and innovative solutions, especially for global challenges like climate change, public health, and poverty. Example: Open data from global health organizations enables researchers from different countries to collaborate on combating diseases, like during the COVID-19 pandemic.",
      icon: Handshake
    },
    {
      title: "Encourage Transparency and Trust",
      description: "By making information, tools, and data openly available, DPGs promote transparency and accountability in industries, governments, and organizations. Example: Open data from government sources allows citizens to monitor how public funds are used, fostering transparency and accountability.",
      icon: Shield
    },
     {
      title: "Drive Economic Growth",
      description: "Open resources lower the cost of development and innovation by eliminating licensing fees and providing access to essential tools. Example: Startups in Africa have built innovative solutions on top of open-source platforms, driving economic growth and providing tech solutions tailored to local needs.",
      icon: ChartLine
    },
     {
      title: "Ensure Interoperability and Connectivity",
      description: "Open standards are essential for ensuring that different systems, technologies, and devices can work together seamlessly. Example: HTML, an open standard, ensures that websites are accessible on all devices and browsers, contributing to the growth of the World Wide Web.",
      icon: RadioTower
    }
  ];

  const standards = [
    { title: "Relevance to SDGs", description: "The project needs a clear plan for long-term sustainability, ensuring it can continue to advance the sustainable development goals." },
    { title: "Use of Approved Open Licenses", description: "The project must use an open-source license, allowing others to freely use, modify, and distribute the solution." },
    { title: "Clear Ownership", description: "Ownership of assets that the digital public good produces must be clearly defined and documented. For example, through copyright, trademark, or other publicly available information." },
    { title: "Platform Independence", description: "There should be existence of functional, open alternatives that can be used without significant changes to the core product." },
    { title: "Documentation", description: "Any educational or informational materials should be openly licensed, making them accessible to everyone." },
    { title: "Mechanism for Extracting Data", description: "The project should share data openly, ensuring transparency and enabling others to build upon it." },
    { title: "Adherence to Privacy and Applicable Laws", description: "The project must prioritize data privacy and security, protecting users' information and ensuring ethical practices." },
    { title: "Adherence to Standards & Best Practices", description: "It must adhere to widely accepted open standards that promote interoperability and accessibility." },
    { title: "Do No Harm by Design", description: "It should be designed to avoid causing harm, ensuring the project benefits society without unintended negative consequences." }
  ];

</script>
<div class="min-h-screen bg-dashboard-black">
  <div class="container px-4 pt-20 pb-8 mx-auto max-w-7xl sm:px-8">
    <div class="px-2 mb-16 text-center sm:px-0">
      <h1 class="mb-6 font-bold leading-tight tracking-tight text-white text-display-lg sm:text-display-xl animate-fade-in">
        What are<br />Digital Public Goods
      </h1>
      <div class="max-w-4xl p-8 mx-auto rounded-2xl sm:p-8 bg-gradient-to-r from-dashboard-yellow-400 to-dashboard-yellow-500 text-dashboard-black">
        <p class="leading-relaxed text-body-lg sm:text-body-xl">
         Digital public goods are the resources, data sheets, AI models, and software available to all citizens for free contributing to sustainable development. These are non-excludable which means no one is excluded from using these resources and services and non-rivalrous which means they are available and accessible to all communities and one person's use will not diminish their availability for other people in the communities.
        </p>
      </div>
    </div>
<Tabs defaultValue="examples" class="w-full">
  <TabsList class="flex flex-wrap justify-center w-full gap-3 px-0 mb-20 bg-transparent sm:mb-10 sm:gap-4 lg:gap-6">
    <TabsTrigger
      value="examples"
      class="text-base sm:text-lg lg:text-xl whitespace-nowrap px-4 py-2 text-white hover:bg-gradient-to-br from-dashboard-purple-500 to-dashboard-purple-600 data-[state=active]:bg-purple-500 data-[state=active]:text-white font-medium rounded-lg transition-colors"
      aria-label="Examples of Digital Public Goods"
    >
      Examples of DPGs
    </TabsTrigger>
    <TabsTrigger
      value="importance"
      class="text-base sm:text-lg lg:text-xl whitespace-nowrap px-4 py-2 text-white hover:bg-gradient-to-br from-dashboard-purple-500 to-dashboard-purple-600 data-[state=active]:bg-purple-500 data-[state=active]:text-white font-medium rounded-lg transition-colors"
      aria-label="Importance of Digital Public Goods"
    >
      Why are DPGs important?
    </TabsTrigger>
    <TabsTrigger
      value="standards"
      class="text-base sm:text-lg lg:text-xl whitespace-nowrap px-4 py-2 text-white hover:bg-gradient-to-br from-dashboard-purple-500 to-dashboard-purple-600 data-[state=active]:bg-purple-500 data-[state=active]:text-white font-medium rounded-lg transition-colors"
      aria-label="Digital Public Goods Standards"
    >
      DPG Standards
    </TabsTrigger>
  </TabsList>

      <TabsContent value="examples" class="space-y-6">
        {#each examples as example}
          <div
            class="rounded-2xl border border-dashboard-gray-700/50 bg-dashboard-gray-800/50 p-8 backdrop-blur-xl hover:-translate-y-0.5 hover:shadow-card transition-all duration-300"
          >
            <div class="p-4 sm:p-6">
              <div class="flex flex-col items-start gap-4 sm:flex-row">
                <div class={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                  example.color === "purple" 
                    ? `bg-gradient-to-br from-dashboard-purple-500 to-dashboard-purple-600` 
                    : `bg-dashboard-yellow-500`
                }`}>
                  <svelte:component this={example.icon} class={`w-6 h-6 sm:w-8 sm:h-8 ${
                    example.color === "purple" ? 'text-white' : 'text-dashboard-black'
                  }`} />
                </div>
                <div class="flex-1">
                  <h3 class="mb-3 text-white text-heading-lg sm:text-heading-xl">{example.title}</h3>
                  <p class="text-gray-300 text-body-md sm:text-body-lg">
                    {example.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </TabsContent>

      <TabsContent value="importance" class="space-y-6">
        <div class="max-w-4xl p-6 mx-auto mb-8 bg-white rounded-2xl sm:p-8 text-dashboard-black">
          <h2 class="mb-4 font-bold text-heading-xl">Why are DPGs important?</h2>
          <p class="leading-relaxed text-body-lg">
            Digital Public Goods (DPGs) like OpenAI models, open software, open data, open content, and open standards are incredibly important because they foster innovation, inclusivity, and collaboration on a global scale. Here's why they matter:
          </p>
        </div>

        {#each importancePoints as point}
          <div
            class="rounded-2xl border border-dashboard-gray-700/50 bg-dashboard-gray-800/50 p-8 backdrop-blur-xl hover:-translate-y-0.5 hover:shadow-card transition-all duration-300 max-w-4xl mx-auto"
          >
            <div class="p-4 sm:p-6">
              <div class="flex flex-col items-start gap-4 sm:flex-row">
                <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 transition-all duration-300 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-dashboard-purple-500 to-dashboard-purple-600">
                  <svelte:component this={point.icon} class="w-6 h-6 text-white sm:w-8 sm:h-8" />
                </div>
                <div class="flex-1">
                  <h3 class="mb-3 text-white text-heading-lg sm:text-heading-xl">{point.title}</h3>
                  <p class="text-gray-300 text-body-md sm:text-body-lg">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </TabsContent>

      <TabsContent value="standards" class="space-y-6">
        <div class="max-w-4xl p-6 mx-auto mb-8 bg-white rounded-2xl sm:p-8 text-dashboard-black">
          <h2 class="mb-4 font-bold text-heading-xl">Digital Public Goods Standard</h2>
          <p class="mb-4 leading-relaxed text-body-lg">
            The Digital Public Goods Standard is a set of specifications and guidelines designed to maximise consensus about whether a digital solution conforms to the definition of a digital public good. According to the UN Secretary General's Roadmap for Digital Cooperation, digital public goods are open-source software, open standards, open data, open AI systems, and open content collections that adhere to privacy and other applicable best practices, do no harm, and are of high relevance for attainment of the United Nations 2030 Sustainable Development Goals (SDGs).
          </p>
          <p class="leading-relaxed text-body-lg">
           Below are the 9 indicators and requirements that determine if nominated software, data, AI systems, and/or content collections can be considered a DPG.
          </p>
        </div>

        {#each standards as standard, i}
          <div
            class="rounded-2xl border border-dashboard-gray-700/50 bg-dashboard-gray-800/50 p-8 backdrop-blur-xl hover:-translate-y-0.5 hover:shadow-card transition-all duration-300 max-w-4xl mx-auto"
          >
            <div class="p-4 sm:p-6">
              <div class="flex flex-col items-start gap-4 sm:flex-row">
                <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 transition-all duration-300 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-dashboard-yellow-500">
                  <span class="font-bold text-dashboard-black text-heading-md sm:text-heading-lg">
                    {i+ 1}
                  </span>
                </div>
                <div class="flex-1">
                  <h3 class="mb-3 text-white text-heading-lg sm:text-heading-xl">{standard.title}</h3>
                  <p class="text-gray-300 text-body-md sm:text-body-lg">
                    {standard.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </TabsContent>
    </Tabs>

    <div class="px-4 mt-16 text-center sm:px-0">
      <div class="max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-dashboard-purple-600 via-dashboard-purple-700 to-dashboard-purple-800 p-8 text-white shadow-[0_20px_60px_rgba(139,92,246,0.3)] sm:p-8">
        <BookOpen class="w-8 h-8 mx-auto mb-4" />
        <h3 class="mb-4 text-heading-lg sm:text-heading-xl">Ready to Create a Digital Public Good?</h3>
        <p class="mb-6 text-body-md sm:text-body-lg opacity-90">
          Join the movement to build technology that serves everyone and contributes to sustainable development
        </p>
        <a href="/project/create" class="inline-flex items-center gap-2 rounded-full bg-dashboard-yellow-400 px-10 py-5 font-semibold text-dashboard-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-dashboard-yellow-500 hover:shadow-[0_10px_25px_rgba(250,204,21,0.3)]">
          Start Your DPG Project
        </a>
      </div>
    </div>
  </div>
</div>