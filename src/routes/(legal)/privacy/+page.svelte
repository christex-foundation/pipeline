<script>
  import Icon from '@iconify/svelte';
</script>

<svelte:head>
  <title>Privacy Policy - Pipeline</title>
  <meta name="description" content="Privacy policy for DPG Pipeline platform. Learn how we protect your data and comply with GDPR." />
</svelte:head>

<div class="min-h-screen bg-dashboard-black py-12">
  <div class="container mx-auto max-w-4xl px-6">
    <h1 class="mb-4 text-heading-2xl font-bold text-white">Privacy Policy</h1>
    <p class="mb-12 text-body-lg text-gray-400">Last updated: March 2026</p>

    <nav class="mb-12 rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
      <h2 class="mb-4 text-heading-lg font-semibold text-white">Contents</h2>
      <ul class="space-y-2">
        <li><a href="#controller" class="text-dashboard-purple-400 hover:underline">1. Data Controller</a></li>
        <li><a href="#collected" class="text-dashboard-purple-400 hover:underline">2. Data We Collect</a></li>
        <li><a href="#usage" class="text-dashboard-purple-400 hover:underline">3. How We Use Your Data</a></li>
        <li><a href="#legal-basis" class="text-dashboard-purple-400 hover:underline">4. Legal Basis</a></li>
        <li><a href="#rights" class="text-dashboard-purple-400 hover:underline">5. Your Rights</a></li>
        <li><a href="#retention" class="text-dashboard-purple-400 hover:underline">6. Data Retention</a></li>
        <li><a href="#security" class="text-dashboard-purple-400 hover:underline">7. Data Security</a></li>
        <li><a href="#processors" class="text-dashboard-purple-400 hover:underline">8. Third-Party Processors</a></li>
        <li><a href="#contact" class="text-dashboard-purple-400 hover:underline">9. Contact</a></li>
      </ul>
    </nav>

    <section id="controller" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:shield-account" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">1. Data Controller</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          Pipeline is operated by <strong class="text-white">Christex Foundation</strong>, a registered nonprofit organization dedicated to advancing digital public goods and sustainable development.
        </p>
        <p class="mt-4 text-body-lg text-gray-300">
          <strong class="text-white">Christex Foundation</strong><br />
          Freetown, Sierra Leone<br />
          Email: privacy@christexfoundation.org
        </p>
      </div>
    </section>

    <section id="collected" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:database" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">2. Data We Collect</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <h3 class="mb-4 text-heading-lg font-semibold text-white">Account Information</h3>
        <ul class="list-disc space-y-2 pl-6 text-gray-300">
          <li>Name and email address</li>
          <li>Profile information (bio, avatar)</li>
          <li>Social links (GitHub, Discord, Twitter, LinkedIn - optional)</li>
        </ul>
      </div>
      <div class="mt-6 rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <h3 class="mb-4 text-heading-lg font-semibold text-white">Project Data</h3>
        <ul class="list-disc space-y-2 pl-6 text-gray-300">
          <li>Projects you create or contribute to</li>
          <li>Bookmarked projects</li>
          <li>Comments and interactions</li>
        </ul>
      </div>
      <div class="mt-6 rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <h3 class="mb-4 text-heading-lg font-semibold text-white">Usage Data</h3>
        <ul class="list-disc space-y-2 pl-6 text-gray-300">
          <li>Device and browser information</li>
          <li>IP address (for security and analytics)</li>
          <li>Pages visited and features used</li>
        </ul>
      </div>
    </section>

    <section id="usage" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:cog" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">3. How We Use Your Data</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <ul class="list-disc space-y-2 pl-6 text-gray-300">
          <li>To provide and maintain the Pipeline platform</li>
          <li>To process your registrations and contributions</li>
          <li>To communicate with you about updates and support</li>
          <li>To improve our services and user experience</li>
          <li>To comply with legal obligations</li>
          <li>To enforce our Terms of Service</li>
        </ul>
      </div>
    </section>

    <section id="legal-basis" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:scale-balance" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">4. Legal Basis</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          We process your personal data under the following legal bases:
        </p>
        <ul class="mt-4 list-disc space-y-2 pl-6 text-gray-300">
          <li><strong class="text-white">Consent:</strong> For optional data (social links, analytics cookies)</li>
          <li><strong class="text-white">Contract:</strong> To provide services you request (account creation, project hosting)</li>
          <li><strong class="text-white">Legitimate Interest:</strong> For security, fraud prevention, and service improvement</li>
          <li><strong class="text-white">Legal Obligation:</strong> For compliance with applicable laws</li>
        </ul>
      </div>
    </section>

    <section id="rights" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:account-rights" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">5. Your Rights</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="mb-4 text-body-lg text-gray-300">
          Under GDPR and other privacy regulations, you have the following rights:
        </p>
        <ul class="list-disc space-y-2 pl-6 text-gray-300">
          <li><strong class="text-white">Right to Access:</strong> Request a copy of your personal data</li>
          <li><strong class="text-white">Right to Rectification:</strong> Request correction of inaccurate data</li>
          <li><strong class="text-white">Right to Erasure:</strong> Request deletion of your account and data</li>
          <li><strong class="text-white">Right to Data Portability:</strong> Request your data in a portable format</li>
          <li><strong class="text-white">Right to Object:</strong> Object to processing of your data</li>
          <li><strong class="text-white">Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
        </ul>
        <p class="mt-6 text-body-lg text-gray-300">
          To exercise these rights, visit your <a href="/profile/edit" class="text-dashboard-purple-400 hover:underline">profile settings</a> or contact us at <strong class="text-white">privacy@christexfoundation.org</strong>.
        </p>
      </div>
    </section>

    <section id="retention" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:clock-outline" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">6. Data Retention</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <ul class="list-disc space-y-2 pl-6 text-gray-300">
          <li><strong class="text-white">Account Data:</strong> Retained while your account is active</li>
          <li><strong class="text-white">After Deletion:</strong> Data removed within 30 days of account deletion</li>
          <li><strong class="text-white">Financial Records:</strong> Retained for 7 years for tax/legal purposes</li>
          <li><strong class="text-white">Logs:</strong> Retained for 12 months for security purposes</li>
        </ul>
      </div>
    </section>

    <section id="security" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:lock" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">7. Data Security</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          We implement appropriate technical and organizational measures to protect your data:
        </p>
        <ul class="mt-4 list-disc space-y-2 pl-6 text-gray-300">
          <li>Encryption of data in transit and at rest</li>
          <li>Access controls and authentication</li>
          <li>Regular security audits</li>
          <li>Secure hosting infrastructure</li>
          <li>Incident response procedures</li>
        </ul>
        <p class="mt-4 text-body-lg text-gray-300">
          However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
        </p>
      </div>
    </section>

    <section id="processors" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:server-network" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">8. Third-Party Processors</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="mb-4 text-body-lg text-gray-300">
          We use the following third-party services to provide and improve our platform:
        </p>
        <div class="space-y-4">
          <div>
            <h3 class="text-heading-md font-semibold text-white">Supabase</h3>
            <p class="text-gray-300">Database, authentication, and backend services. Located in AWS US/EU regions.</p>
          </div>
          <div>
            <h3 class="text-heading-md font-semibold text-white">Vercel</h3>
            <p class="text-gray-300">Web hosting and edge network. Privacy policy: vercel.com/legal/privacy-policy</p>
          </div>
          <div>
            <h3 class="text-heading-md font-semibold text-white">Sentry</h3>
            <p class="text-gray-300">Error tracking and performance monitoring. Used for debugging purposes only.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="contact" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:email" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">9. Contact</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          If you have any questions about this Privacy Policy or want to exercise your rights, contact us:
        </p>
        <ul class="mt-4 space-y-2 text-gray-300">
          <li><strong class="text-white">Email:</strong> privacy@christexfoundation.org</li>
          <li><strong class="text-white">General:</strong> hello@christex.foundation</li>
        </ul>
      </div>
    </section>

    <section class="rounded-xl border border-dashboard-purple-500/30 bg-dashboard-purple-500/10 p-6">
      <h3 class="mb-4 text-heading-lg font-semibold text-white">Questions?</h3>
      <p class="text-body-lg text-gray-300">
        If you have any questions about this Privacy Policy, please contact us at <strong class="text-white">privacy@christexfoundation.org</strong>.
      </p>
    </section>
  </div>
</div>
