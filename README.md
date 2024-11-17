<div align="center">

# 🌟 ELIZA'S LIST

> A curated discovery platform for developer projects, built with Next.js 14

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

[Demo](https://elizas-list.vercel.app) · [Report Bug](https://github.com/yourusername/elizas-list/issues) · [Request Feature](https://github.com/yourusername/elizas-list/issues)

</div>

---

## ✨ Features

- 🎨 Modern UI with Tailwind CSS and Geist Font
- 🔒 Authentication with NextAuth.js
- 📊 Real-time Analytics
- 🔍 Advanced Search & Discovery
- 🤖 ML-powered Project Recommendations
- 📱 Fully Responsive Design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Redis
- PostgreSQL
- GitHub OAuth credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/elizas-list.git
cd elizas-list
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎯 Adding Your Project

### Image Guidelines
- 📐 Dimensions: 1200x630px (16:9)
- 📦 Max size: 500KB
- 🖼️ Format: PNG
- 📝 Filename: `project-name.png`

### Steps
1. Fork this repository
2. Add your project image to `/public/project-images/`
3. Add project details to `src/data/projects.json`:

```json
{
  "name": "Your Project",
  "description": "A brief description",
  "image": "/project-images/your-project.png",
  "tags": ["nextjs", "typescript", "tailwind"],
  "github": "https://github.com/yourusername/project",
  "demo": "https://your-project.com"
}
```

4. Create a Pull Request

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Redis](https://redis.io/) - Caching & Real-time
- [Chart.js](https://www.chartjs.org/) - Analytics Visualization

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Deployment Guide](https://nextjs.org/docs/deployment)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Acknowledgments

- [Vercel](https://vercel.com) for hosting
- [Next.js](https://nextjs.org) team for the amazing framework
- All our [contributors](https://github.com/yourusername/elizas-list/graphs/contributors)

---

<div align="center">

Made with ❤️ by [Your Name](https://github.com/yourusername)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/elizas-list)

</div>
