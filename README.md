# 🌐 DPG Pipeline

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.12.0-brightgreen)](https://nodejs.org/)
[![Svelte](https://img.shields.io/badge/Svelte-%23ff3e00.svg?style=flat&logo=svelte&logoColor=white)](https://svelte.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

**DPG Pipeline** is a comprehensive web-based platform designed to accelerate the development, funding, and sustainability of Digital Public Goods (DPGs). Built with modern web technologies and powered by a robust backend, it serves as a central hub for connecting contributors, funders, and DPG projects while ensuring compliance with the Digital Public Goods Standard.

> 🚧 **Status**: Currently in active development. We welcome contributions and feedback from the community!

## 🌟 Features

### 📈 **Project Management & Tracking**
- **Comprehensive Project Profiles**: Detailed project pages with descriptions, goals, team information, and progress tracking
- **Real-time Updates**: Live project updates with commenting system for transparent communication
- **Member Management**: Team collaboration tools with role-based permissions
- **Interactive Pipeline Visualization**: Animated pipeline showing project progression through DPG compliance stages

### 💰 **Funding & Contributions**
- **Multi-type Contributions**: Support for both financial and non-financial resource contributions
- **Crowdsourced Funding**: Community-driven funding mechanisms for sustainable project development
- **Resource Tracking**: Detailed tracking of all contributions and resource allocation
- **Contributor Recognition**: Public acknowledgment and profiling of project supporters

### ✅ **DPG Standard Compliance**
- **Automated Evaluation Process**: Streamlined assessment against Digital Public Goods Standard criteria
- **Compliance Tracking**: Real-time monitoring of project compliance status
- **Documentation Support**: Guided documentation creation for DPG certification
- **Expert Review System**: Community and expert review processes for validation

### 🔍 **Discovery & Exploration**
- **Advanced Search & Filtering**: Powerful search capabilities with category-based filtering
- **Project Categories**: Organized project classification system
- **Recommendation Engine**: AI-powered project recommendations based on user interests
- **Leaderboards**: Community recognition and project popularity tracking

### 👤 **User Experience**
- **Personalized Profiles**: Comprehensive user profiles with contribution history and interests
- **Bookmarking System**: Save and organize favorite projects
- **Activity Feeds**: Stay updated with project developments and community activity
- **Mobile-Responsive Design**: Seamless experience across all devices

### 📤 **Data Portability**
- **One-Click Data Download**: Users can download their account data directly from profile
- **Multiple Export Formats**: Exports are available in JSON (default) and CSV formats
- **Secure Export Access**: Project exports are restricted to project owners and project team members
- **Export Safeguards**: Per-user rate limiting and record caps protect performance and prevent abuse

### 🔐 **Security & Authentication**
- **Secure Authentication**: Supabase-powered authentication with social login options
- **Content Security Policy**: Comprehensive CSP implementation for enhanced security
- **Data Protection**: Encrypted data transmission and secure storage
- **CSRF Protection**: Built-in protection against cross-site request forgery

## 🏗️ Architecture & Technology Stack

### **Frontend Technologies**
- **[SvelteKit](https://kit.svelte.dev/)**: Modern, reactive web framework with server-side rendering
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development with enhanced code quality
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework with custom design system
- **[Shadcn/ui](https://ui.shadcn.com/)**: Modern UI component library adapted for Svelte
- **[Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)**: Primary typography with modern geometric design

### **Backend & Infrastructure**
- **[Supabase](https://supabase.com/)**: Backend-as-a-Service providing database, authentication, and real-time features
- **[PostgreSQL](https://www.postgresql.org/)**: Robust relational database for data persistence
- **[Node.js](https://nodejs.org/)**: Server-side JavaScript runtime environment
- **[Vite](https://vitejs.dev/)**: Next-generation frontend build tool for fast development

### **Development & Quality Assurance**
- **[Vitest](https://vitest.dev/)**: Unit testing framework with TypeScript support
- **[Prettier](https://prettier.io/)**: Code formatting for consistent style
- **[ESLint](https://eslint.org/)**: Code linting for quality assurance
- **[GitHub Actions](https://github.com/features/actions)**: Continuous integration and deployment

### **External Integrations**
- **[GitHub API](https://docs.github.com/en/rest)**: Repository integration and automated project tracking
- **[OpenAI API](https://openai.com/api/)**: AI-powered features and content generation
- **[Sentry](https://sentry.io/)**: Error tracking and performance monitoring
- **[Vercel](https://vercel.com/)**: Deployment and hosting platform

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js** (v20.12.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** as package manager
- **Git** for version control
- **Vercel CLI** (optional, for deployment) - [Install Guide](https://vercel.com/cli)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/christex-foundation/pipeline.git
   cd pipeline
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Choose one of the following methods:
   
   **Option A: Pull from Vercel (Recommended for team members)**
   ```bash
   npx vercel env pull
   ```
   
   **Option B: Manual Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Then configure your `.env` file with the following variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   PRIVATE_SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   
   # Optional: Third-party Services
   OPENAI_API_KEY=your_openai_api_key
   SENTRY_DSN=your_sentry_dsn
   ```

4. **Database Setup**
   
   Follow our comprehensive [Database Setup Guide](./docs/DB_SETUP.md) to configure your Supabase database with the required schema.

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Your application will be available at `http://localhost:5173`

### Development Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Type checking
npm run check

# Type checking with watch mode
npm run check:watch

# Architecture boundary linting
npm run lint

# Code formatting
npm run format
```

## 📁 Project Structure

```
pipeline/
├── src/
│   ├── lib/                    # Reusable Svelte components
│   │   ├── components/         # UI components (shadcn/ui)
│   │   ├── server/            # Server-side utilities
│   │   │   ├── repo/          # Database repository layer
│   │   │   ├── service/       # Business logic services
│   │   │   └── validator/     # Input validation schemas
│   │   ├── stores/            # Svelte stores for state management
│   │   └── utils/             # Utility functions
│   ├── routes/                # SvelteKit file-based routing
│   │   ├── (auth)/           # Authentication routes
│   │   ├── api/              # API endpoints
│   │   ├── explore/          # Project discovery pages
│   │   ├── profile/          # User profile management
│   │   ├── project/          # Project-specific pages
│   │   └── resources/        # Educational content
│   ├── app.html              # HTML template
│   ├── app.css               # Global styles
│   └── service-worker.js     # PWA service worker
├── static/                   # Static assets
├── docs/                     # Documentation
│   ├── DB_SETUP.md          # Database configuration guide
│   ├── STYLE_GUIDE.md       # Design system documentation
│   └── dpg-evaluation-process.md
├── db/                       # Database schema and migrations
├── tailwind.config.js        # Tailwind CSS configuration
├── svelte.config.js          # SvelteKit configuration
└── package.json              # Project dependencies and scripts
```

## 🎨 Design System

Our application follows a comprehensive design system built on TailwindCSS with custom configurations:

### Color Palette
- **Primary Accent**: Purple (`#ad89fd`) - Used for primary actions and brand elements
- **Secondary Accent**: Lime (`#bde35b`) - Used for highlights and positive interactions
- **Dashboard Theme**: Dark theme with carefully crafted gray scale for optimal readability

### Typography
- **Primary Font**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - Modern geometric sans-serif
- **Type Scale**: Comprehensive scale from display (hero text) to labels (UI elements)

For detailed design guidelines, see our [Style Guide](./docs/STYLE_GUIDE.md).

## 🔧 Configuration & Customization

### Tailwind Configuration

Our custom Tailwind configuration includes:
- **Dashboard Color System**: Comprehensive color palette for dark theme
- **Typography Scale**: Professional typography system with consistent sizing
- **Component Patterns**: Reusable utility combinations for common components

### SvelteKit Configuration

Key configurations include:
- **Security**: Content Security Policy (CSP) and CSRF protection
- **Performance**: Service worker, prerendering, and optimization settings
- **Aliases**: Path aliases for cleaner imports

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `PRIVATE_SUPABASE_SERVICE_KEY` | Supabase service role key | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for AI features | ❌ |
| `SENTRY_DSN` | Sentry DSN for error tracking | ❌ |

## 🤝 Contributing

We welcome contributions from developers, designers, and DPG enthusiasts! Here's how you can get involved:

### Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following our coding conventions
5. **Test your changes** thoroughly
6. **Submit a pull request** with a clear description

### Development Guidelines
- Follow the existing code style and conventions
- Write meaningful commit messages
- Include tests for new features
- Update documentation when necessary
- Keep PRs focused and manageable in size

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Code of Conduct
We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our Code of Conduct.

## 🔄 Webhook Integration

To enable real-time GitHub integration and automated project updates:

1. Navigate to your project's **Settings** on GitHub
2. Go to **Webhooks** → **Add webhook**
3. Set **Payload URL** to: `https://pipeline-tau.vercel.app/api/github/webhook`
4. Choose **Content type**: `application/json`
5. Select **Send me everything** for events
6. Click **Add webhook**

This enables automatic synchronization of project data with GitHub repositories.

## 📚 Documentation

- **[Database Setup Guide](./docs/DB_SETUP.md)**: Complete database configuration instructions
- **[Style Guide](./docs/STYLE_GUIDE.md)**: Design system and component patterns
- **[Contributing Guide](./CONTRIBUTING.md)**: How to contribute to the project
- **[DPG Evaluation Process](./docs/dpg-evaluation-process.md)**: Understanding DPG compliance evaluation

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** with each push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to your preferred hosting platform
npm run preview  # Test the build locally first
```

## 📊 Performance & Monitoring

- **Service Worker**: Enabled for offline functionality and faster loading
- **Prerendering**: Static pages are pre-rendered for better SEO and performance
- **Error Tracking**: Sentry integration for comprehensive error monitoring
- **Performance Monitoring**: Built-in analytics and performance tracking

## 🔒 Security

- **Content Security Policy**: Comprehensive CSP headers for XSS protection
- **CSRF Protection**: Built-in CSRF token validation
- **Secure Headers**: Additional security headers for enhanced protection
- **Input Validation**: Server-side validation using Zod schemas
- **Authentication**: Secure authentication flow with Supabase

## 🌍 Community & Support

### Get Help
- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/christex-foundation/pipeline/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/christex-foundation/pipeline/discussions)
- **Documentation**: Comprehensive guides in the `/docs` directory

### Stay Updated
- **Watch** the repository for updates
- **Star** the project if you find it useful
- **Follow** [@ChristexFoundation](https://github.com/christex-foundation) for announcements

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Digital Public Goods Alliance** for establishing the DPG Standard
- **Christex Foundation** for project sponsorship and support
- **Open Source Community** for the amazing tools and libraries that make this project possible
- **Contributors** who help improve and maintain this platform

---

<div align="center">

**[🌐 Visit DPG Pipeline](https://pipeline-tau.vercel.app)** • **[📖 Documentation](./docs/)** • **[🤝 Contribute](./CONTRIBUTING.md)** • **[🐛 Report Issues](https://github.com/christex-foundation/pipeline/issues)**

Made with ❤️ by the [Christex Foundation](https://github.com/christex-foundation) team

</div>
