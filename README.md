# DPG Pipeline (🚧 Work in Progress)
DPG Pipeline is a web-based platform designed to support the development, funding, and sustainability of Digital Public Goods (DPGs). Built with SvelteKit and Node.js, and powered by Supabase, it enables users to contribute both financial and non-financial resources to DPG projects while helping them meet the Digital Public Goods Standard.
> 🚀 This project is currently in active development. Contributions and feedback are welcome!

## 🌟 Features
* **📢 Crowdsourced Contributions** – Users can provide funding and other resources to DPG projects.
* **✅ DPG Standard Compliance** – Projects receive support to meet the Digital Public Goods Standard.
* **🔐 Secure Authentication** – Integrated authentication using Supabase.
* **📊 Project Tracking** – Monitor project progress and impact.

## 🛠 Prerequisites
Before running the project locally, ensure you have:

* [Node.js](https://nodejs.org/en) (v20.12.X or higher)
* [Vercel CLI](https://vercel.com/) (for local development)
* [Supabase](https://supabase.com/) (for database and authentication)

## 🚀 Getting Started
* Clone the repository
    ```
     git clone https://github.com/christex-foundation/pipeline.git
     cd pipeline
    ```
* Install dependencies
    ```
    npm install
    ```
* Set up environment variables
Choose one of the following methods:
    * Option 1: Pull from Vercel
         ```
         npx vercel env pull
         ```
    * Option 2: Manually create a .env file
        Copy .env.example and configure it accordingly.
 
* Set up Supabase
    * Follow the [Supabase setup guide](https://supabase.com/docs/guides/getting-started) to create your project.
    * Refer to [DB_SETUP.md](https://github.com/christex-foundation/pipeline/blob/main/docs/DB_SETUP.md) for database schema setup instructions.

* Start the development server
    ```
    npm run dev
    ```
## 🔔 Webhook Setup

To enable automatic updates and integrations, set up a webhook by following these steps:

* Navigate to your project's settings in **GitHub**.
* Go to **Webhooks** and click **Add webhook**.
* Set the **Payload URL** to: (https://pipeline-tau.vercel.app/api/github/webhook)  
* Choose 'application/json' as the **content type**.
* Under **Which events would you like to trigger this webhook?**, select **Send me everything**.
* Click Add webhook to save your changes.

For more details, refer to [GitHub's webhook documentation](https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks).
    
## 🤝 Contributing
We welcome contributions to improve this project! To get started:

* Check out the [CONTRIBUTING.md](https://github.com/christex-foundation/pipeline/blob/main/CONTRIBUTING.md).
* Fork the repository and create a new branch for your changes.
* Submit a pull request for review.