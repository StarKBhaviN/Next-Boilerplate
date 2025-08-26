# ⚡ Next.js Boilerplate

A ready-to-use **Next.js starter template** with all the essential tools pre-configured so you can jump straight into building apps without wasting time on setup.

---

> ⚠️ This is a template repo.  
> Please click **"Use this template"** on GitHub or change the remote after cloning:
>
> ```bash
> git remote remove origin
> git remote add origin https://github.com/your-username/your-new-project.git
> ```


## 🚀 Tech Stack

- [**Next.js**](https://nextjs.org/) – React framework for production  
- [**TanStack Query**](https://tanstack.com/query) – Data fetching & caching  
- [**Jotai**](https://jotai.org/) – Simple & flexible state management  
- [**NextAuth.js**](https://next-auth.js.org/) – Authentication for Next.js apps  
- [**Tailwind CSS**](https://tailwindcss.com/) – Utility-first CSS framework  
- [**Zod**](https://zod.dev/) – Type-safe schema validation  

---

---

## ⚙️ Features Pre-Configured

- ✅ NextAuth – Authentication with JWT & Providers
- ✅ TanStack Query – Pre-configured QueryClientProvider
- ✅ Jotai – Atoms ready for state management
- ✅ Zod – Input validation & schema setup
- ✅ Tailwind – Styling with dark mode ready
- ✅ Strict TypeScript – Type safety enforced

---

## 📦 Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/StarKBhaviN/Next-Boilerplate.git
cd nextjs-boilerplate
```

### Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Environment Variables
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

MONGODB_URI=mongodb://localhost:27017/<your-db-name>

JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE_TIME=7d
REFRESH_TOKEN_EXPIRE_TIME=30d
```

