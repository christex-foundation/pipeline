<script>
  import Icon from '@iconify/svelte';
</script>

<svelte:head>
  <title>Data Processing Agreement - Pipeline</title>
  <meta name="description" content="Data Processing Agreement for DPG Pipeline enterprise users." />
</svelte:head>

<div class="min-h-screen bg-dashboard-black py-12">
  <div class="container mx-auto max-w-4xl px-6">
    <h1 class="text-heading-2xl mb-4 font-bold text-white">Data Processing Agreement</h1>
    <p class="mb-12 text-body-lg text-gray-400">Last updated: March 2026</p>

    <nav class="mb-12 rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
      <h2 class="mb-4 text-heading-lg font-semibold text-white">Contents</h2>
      <ul class="space-y-2">
        <li><a href="#scope" class="text-dashboard-purple-400 hover:underline">1. Scope</a></li>
        <li>
          <a href="#definitions" class="text-dashboard-purple-400 hover:underline">2. Definitions</a
          >
        </li>
        <li>
          <a href="#processor" class="text-dashboard-purple-400 hover:underline"
            >3. Processor Obligations</a
          >
        </li>
        <li>
          <a href="#subprocessors" class="text-dashboard-purple-400 hover:underline"
            >4. Sub-Processors</a
          >
        </li>
        <li>
          <a href="#data-security" class="text-dashboard-purple-400 hover:underline"
            >5. Data Security</a
          >
        </li>
        <li>
          <a href="#data-transfers" class="text-dashboard-purple-400 hover:underline"
            >6. Data Transfers</a
          >
        </li>
        <li><a href="#audits" class="text-dashboard-purple-400 hover:underline">7. Audits</a></li>
        <li>
          <a href="#incidents" class="text-dashboard-purple-400 hover:underline">8. Data Breaches</a
          >
        </li>
        <li>
          <a href="#termination" class="text-dashboard-purple-400 hover:underline">9. Termination</a
          >
        </li>
        <li>
          <a href="#contact" class="text-dashboard-purple-400 hover:underline">10. Contact</a>
        </li>
      </ul>
    </nav>

    <section id="scope" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:file-document" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">1. Scope</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          This Data Processing Agreement ("DPA") applies to Enterprise users of Pipeline who require
          enhanced data processing terms beyond our standard Privacy Policy. This DPA supplements
          and is incorporated into our Terms of Service.
        </p>
        <p class="mt-4 text-body-lg text-gray-300">
          This DPA applies when Pipeline processes Personal Data on behalf of Enterprise customers
          in connection with the provision of our services.
        </p>
      </div>
    </section>

    <section id="definitions" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:book-open-page-variant" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">2. Definitions</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <ul class="list-disc space-y-4 pl-6 text-gray-300">
          <li>
            <strong class="text-white">"Personal Data":</strong> Any information relating to an identified
            or identifiable natural person, as defined under GDPR and other applicable data protection
            laws.
          </li>
          <li>
            <strong class="text-white">"Processing":</strong> Any operation performed on Personal Data,
            including collection, storage, use, transmission, or deletion.
          </li>
          <li>
            <strong class="text-white">"Controller":</strong> The Enterprise user who determines the
            purposes and means of processing Personal Data.
          </li>
          <li>
            <strong class="text-white">"Processor":</strong> Christex Foundation (Pipeline) who processes
            Personal Data on behalf of the Controller.
          </li>
          <li>
            <strong class="text-white">"Sub-processor":</strong> Third parties engaged by the Processor
            to process Personal Data.
          </li>
          <li>
            <strong class="text-white">"Data Protection Laws":</strong> GDPR, CCPA, PIPEDA, and other
            applicable data protection regulations.
          </li>
        </ul>
      </div>
    </section>

    <section id="processor" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:account-check" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">3. Processor Obligations</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="mb-4 text-body-lg text-gray-300">The Processor shall:</p>
        <ul class="list-disc space-y-2 pl-6 text-gray-300">
          <li>Process Personal Data only on documented instructions from the Controller</li>
          <li>
            Ensure personnel processing Personal Data are subject to confidentiality obligations
          </li>
          <li>Implement appropriate technical and organizational security measures</li>
          <li>Assist the Controller in responding to data subject requests</li>
          <li>Delete or return all Personal Data upon termination of the agreement</li>
          <li>Make available information necessary to demonstrate compliance</li>
        </ul>
      </div>
    </section>

    <section id="subprocessors" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:server-network" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">4. Sub-Processors</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          We use the following sub-processors to provide and improve our services:
        </p>

        <div class="mt-6 space-y-4">
          <div>
            <h3 class="text-heading-md font-semibold text-white">Supabase</h3>
            <p class="text-gray-300">
              Database and authentication services. Data stored in AWS US/EU regions.
            </p>
            <p class="mt-1 text-sm text-gray-400">Privacy: supabase.com/privacy</p>
          </div>
          <div>
            <h3 class="text-heading-md font-semibold text-white">Vercel</h3>
            <p class="text-gray-300">Web hosting and edge network distribution.</p>
            <p class="mt-1 text-sm text-gray-400">Privacy: vercel.com/legal/privacy-policy</p>
          </div>
          <div>
            <h3 class="text-heading-md font-semibold text-white">Sentry</h3>
            <p class="text-gray-300">
              Error tracking and performance monitoring. No personal data processing.
            </p>
            <p class="mt-1 text-sm text-gray-400">Privacy: sentry.io/privacy</p>
          </div>
        </div>

        <p class="mt-6 text-body-lg text-gray-300">
          We will notify Enterprise customers of any changes to sub-processors. Enterprise customers
          may object to changes within 30 days.
        </p>
      </div>
    </section>

    <section id="data-security" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:lock" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">5. Data Security</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          We implement appropriate technical and organizational measures to ensure security
          appropriate to the risk:
        </p>

        <div class="mt-6 space-y-4">
          <div>
            <h3 class="text-heading-md font-semibold text-white">Encryption</h3>
            <p class="text-gray-300">Data encrypted in transit (TLS 1.3) and at rest (AES-256).</p>
          </div>
          <div>
            <h3 class="text-heading-md font-semibold text-white">Access Controls</h3>
            <p class="text-gray-300">Role-based access control, principle of least privilege.</p>
          </div>
          <div>
            <h3 class="text-heading-md font-semibold text-white">Network Security</h3>
            <p class="text-gray-300">Firewall protection, intrusion detection, DDoS mitigation.</p>
          </div>
          <div>
            <h3 class="text-heading-md font-semibold text-white">Backup & Recovery</h3>
            <p class="text-gray-300">Automated backups with encrypted offsite storage.</p>
          </div>
          <div>
            <h3 class="text-heading-md font-semibold text-white">Monitoring</h3>
            <p class="text-gray-300">24/7 security monitoring and alerting.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="data-transfers" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:transfer" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">6. Data Transfers</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          Personal Data may be transferred to and processed in countries outside the European
          Economic Area (EEA).
        </p>
        <p class="mt-4 text-body-lg text-gray-300">
          For transfers outside the EEA, we ensure appropriate safeguards through:
        </p>
        <ul class="mt-4 list-disc space-y-2 pl-6 text-gray-300">
          <li>Standard Contractual Clauses approved by the European Commission</li>
          <li>Adequacy decisions where available</li>
          <li>Binding Corporate Rules for intra-group transfers</li>
        </ul>
        <p class="mt-4 text-body-lg text-gray-300">
          Enterprise users may request information about specific transfer mechanisms in place.
        </p>
      </div>
    </section>

    <section id="audits" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:clipboard-check" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">7. Audits</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          Enterprise customers have the right to audit our compliance with this DPA. We provide:
        </p>
        <ul class="mt-4 list-disc space-y-2 pl-6 text-gray-300">
          <li>Annual SOC 2 Type II audit reports</li>
          <li>ISO 27001 certification</li>
          <li>GDPR compliance documentation</li>
        </ul>
        <p class="mt-4 text-body-lg text-gray-300">
          Enterprise customers may request additional audits at their own expense, with reasonable
          notice (minimum 30 days).
        </p>
      </div>
    </section>

    <section id="incidents" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:alert-circle" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">8. Data Breaches</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">In the event of a Personal Data breach, we shall:</p>
        <ul class="mt-4 list-disc space-y-2 pl-6 text-gray-300">
          <li>Notify the Controller without undue delay, and within 72 hours of becoming aware</li>
          <li>Provide details of the nature of the breach</li>
          <li>Describe likely consequences</li>
          <li>Describe measures taken to address the breach</li>
          <li>Cooperate with the Controller in responding to the breach</li>
        </ul>
      </div>
    </section>

    <section id="termination" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:close-circle" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">9. Termination</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <ul class="list-disc space-y-2 pl-6 text-gray-300">
          <li>
            <strong class="text-white">Termination:</strong> Either party may terminate this DPA with
            30 days written notice
          </li>
          <li>
            <strong class="text-white">Effect:</strong> Upon termination, we will delete or return all
            Personal Data within 30 days
          </li>
          <li>
            <strong class="text-white">Retention:</strong> We may retain Personal Data as required by
            law, with documentation
          </li>
          <li>
            <strong class="text-white">Survival:</strong> Confidentiality and security obligations survive
            termination
          </li>
        </ul>
      </div>
    </section>

    <section id="contact" class="mb-16 scroll-mt-8">
      <div class="mb-6 flex items-center gap-3">
        <Icon icon="mdi:email" class="h-8 w-8 text-dashboard-purple-400" />
        <h2 class="text-heading-xl font-bold text-white">10. Contact</h2>
      </div>
      <div class="rounded-xl border border-dashboard-gray-700 bg-dashboard-gray-900 p-6">
        <p class="text-body-lg text-gray-300">
          For questions about this DPA or to request a custom agreement, contact us:
        </p>
        <ul class="mt-4 space-y-2 text-gray-300">
          <li><strong class="text-white">Email:</strong> hello@christex.foundation</li>
          <li><strong class="text-white">General:</strong> hello@christex.foundation</li>
        </ul>
      </div>
    </section>

    <section
      class="rounded-xl border border-dashboard-purple-500/30 bg-dashboard-purple-500/10 p-6"
    >
      <h3 class="mb-4 text-heading-lg font-semibold text-white">Questions?</h3>
      <p class="text-body-lg text-gray-300">
        If you have any questions about this Data Processing Agreement, please contact us at <strong
          class="text-white">hello@christex.foundation</strong
        >.
      </p>
    </section>
  </div>
</div>
