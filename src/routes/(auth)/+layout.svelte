<script>
  import SignInForm from '$lib/SignInForm.svelte';
  import SignUp from '$lib/SignUp.svelte';
  import LottieHandLoader from '$lib/LottieHandLoader.svelte';

  let loading = false;
  let name = '';
  let email = '';
  let password = '';
  let isSignUp = false;

  const toggleForm = () => {
    isSignUp = !isSignUp;
  };

  const handleSignIn = async (event) => {
    const { email, password } = event.detail;
    loading = true;

    try {
      console.log({ email, password });

      const response = await fetch('/api/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        window.location.href = result.redirectTo || '/explore';
      } else {
        alert(`Sign-in error: ${result.error}`);
      }
    } catch (error) {
      alert(`Sign-in failed: ${error.message}`);
    } finally {
      loading = false;
    }
  };

  const handleSignUp = async (event) => {
    const { name, email, password } = event.detail;
    loading = true;

    try {
      console.log({ name, email, password });

      const response = await fetch('/api/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Sign-up successful!');
      } else {
        alert(`Sign-up error: ${result.error}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loading = false;
    }
  };
</script>

<!-- -mb-16 is used to clear the margin used by the footer, causing funny white space  -->
<main class="h-screen -mb-16 overflow-hidden bg-white md:pr-0 ">
  {#if loading}
    <LottieHandLoader />
  {/if}
  <div class="flex flex-col h-full gap-5 md:flex-row">
    <section class="w-full h-full md:w-5/12 basis-full max-md:hidden">
      <div
        class="flex items-center h-full gap-2.5 py-10 pr-2 pl-5 grow bg-cyan-950 md:py-24 md:pl-12"
      >
        <div
          class="flex flex-col self-stretch w-full my-auto min-w-[240px] max-w-[534px] items-center"
        >
          <a href="/">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/ad49722deb9607c50bec0aa4159ff15d8108741c5e49ac832886fb785b83c09b?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
              alt="Pipeline logo"
              class="object-contain max-w-full aspect-[5.95] h-[48px] ml-36 md:ml-8"
            />
          </a>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f2c87d36d522646afc65e2334ae141b78ca66fc63c07d8edf349286480639e46?placeholderIfAbsent=true&apiKey=567aaefef2da4f73a3149c6bc21f1ea8"
            alt=""
            class="object-contain w-full mt-10 aspect-[1.34] md:mt-48"
          />
        </div>
      </div>
    </section>

    <slot class="flex-grow h-full"></slot>
  </div>
</main>
