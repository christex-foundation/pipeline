<script>
  import WhyCard from './WhyCard.svelte';
</script>

<section class="mt-72 flex w-full max-w-[1076px] flex-col max-md:mt-10 max-md:max-w-full">
  <h2
    class="w-[516px] self-center text-center text-6xl font-semibold leading-[65px] text-black max-md:max-w-full max-md:text-4xl max-md:leading-[49px]"
  >
    <span class="text-6xl">Why</span><br />
    <span class="text-7xl">Join Pipeline</span>
  </h2>
  <div class="mt-10 flex w-full flex-wrap items-start gap-11 max-md:max-w-full">
    <WhyCard
      iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/6a77f676782fe66b7a80cb870402b85d423749d1d46197bf618c2c8f547d7e83?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      title="Creators"
      description="Share your digital public good ideas and turn your vision into reality."
    />
    <WhyCard
      iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/807f1ada1a74c77c2047ff1778fa42614a0c11fe29797a9f8508d7c183944153?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      title="Donors"
      description="Support open-source projects and see your contributions in action."
    />
    <WhyCard
      iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/67d5425f762082f2c4e1e13ac77f2d91150a46ffd042c78fd4057a0220600339?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      title="Contributors"
      description="Develop valuable skills, join exciting projects, and connect with passionate changemakers."
    />
    <WhyCard
      iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/588c81605e1770d221d25e4f6b62ddf8c4179e92ae739414b5169ec7d15d1031?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
      title="DPG Registry"
      description="Pipeline help track progress & assist towards meeting the 9 DPG requirements."
    />
  </div>
</section>
