# Project Structure — Full Source Code

> ⚠️ **Warning:** This file contains `.env` secrets (MongoDB URIs, auth secrets). Do not commit or share publicly.

---

## Backend

### `backend\.env`
```
PORT = 5000
MONGO_URI=mongodb://db_user:2441139@ac-m0qkzgq-shard-00-00.34kl52y.mongodb.net:27017,ac-m0qkzgq-shard-00-01.34kl52y.mongodb.net:27017,ac-m0qkzgq-shard-00-02.34kl52y.mongodb.net:27017/?ssl=true&replicaSet=atlas-gghf9y-shard-0&authSource=admin&appName=Database
```

### `backend\.gitignore`
```
.env
node_modules
```

### `backend\package.json`
```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongodb": "^7.5.0"
  }
}
```

### `backend\src\app.js`
```js
const express = require("express");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy and routing works!" });
});

module.exports = app;
```

### `backend\src\server.js`
```js
require("dotenv").config();
const app = require("./app.js");
const { connectDB } = require("./config/db.js");
const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
```

### `backend\src\config\db.js`
```js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

let database;

async function connectDB() {
  try {
    console.log("Attemping to connect...");
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    database = client.db("job_portal_db");
    return database;
  } catch (error) {
    console.error("Database connection failed: ", error);
    process.exit(1);
  }
}

function getDB() {
  if (!database) {
    throw new Error("Database not initialized! Call connectDB first.");
  }
  return database;
}

module.exports = { connectDB, getDB };
```

### `backend\src\controllers\jobControllers.js`
*(empty file)*

### `backend\src\routes\jobRoutes.js`
*(empty file)*

---

## Frontend

### `frontend\.env`
```
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=4UED5s8SQasOIKVAwadZ1ohDG61PyH8q
MONGO_URI=mongodb://db_user:2441139@ac-m0qkzgq-shard-00-00.34kl52y.mongodb.net:27017,ac-m0qkzgq-shard-00-01.34kl52y.mongodb.net:27017,ac-m0qkzgq-shard-00-02.34kl52y.mongodb.net:27017/?ssl=true&replicaSet=atlas-gghf9y-shard-0&authSource=admin&appName=Database
```

### `frontend\.gitignore`
```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### `frontend\package.json`
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "better-auth": "^1.6.23",
    "lucide-react": "^1.24.0",
    "mongodb": "^7.5.0",
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "tailwindcss": "^4"
  }
}
```

### `frontend\eslint.config.mjs`
```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

### `frontend\jsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### `frontend\next.config.mjs`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default nextConfig;
```

### `frontend\postcss.config.mjs`
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### `frontend\README.md`
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
```

### `frontend\src\app\layout.js`
```js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

### `frontend\src\app\page.js`
```js
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.js file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
```

### `frontend\src\app\globals.css`
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
```

### `frontend\src\app\(auth)\login\page.jsx`
```jsx
"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { email } from "better-auth";

export default function LoginPage() {
  const router = useRouter();

  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Button clicked!");

    const { data, error } = await signIn.email({
      email: formdata.email,
      password: formdata.password,
    });

    if (error) {
      console.error("Login failed: ", error.message);
      alert("Failed to Login");
    } else {
      console.log("Welcome Back!", data);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
            Welcome Back
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-black uppercase">
            Log In To Your Account
          </h1>
        </div>

        <div className="border border-gray-200 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formdata.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Password
              </label>
              <input
                name="password"
                value={formdata.password}
                onChange={handleChange}
                type="password"
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="border-gray-300 rounded" />
                Remember me
              </label>
              <span className="font-semibold text-black cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white text-sm font-bold uppercase tracking-wide rounded-md py-3 hover:bg-gray-800 transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Or
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full border border-gray-300 rounded-md py-3 flex items-center justify-center gap-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
            <LayoutGrid size={16} />
            Continue With Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don&apos;t have an account?{" "}
          <span className="font-bold text-black cursor-pointer">Sign Up</span>
        </p>
      </div>
    </div>
  );
}
```

### `frontend\src\app\(auth)\register\page.jsx`
```jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { LayoutGrid } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Ready for Better Auth Sign Up:", formData);
    // এখানেই আমরা Better Auth-এর signUp ফাংশনটা কল করব!
    const { data, error } = await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    if (error) {
      console.error("Sign up failed: ", error.message);
      alert("failed to sign up");
    } else {
      console.log("User created successfully:", data);
      alert("Registration Successful!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
            New Here?
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-black uppercase">
            Create An Account
          </h1>
        </div>

        <div className="border border-gray-200 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white text-sm font-bold uppercase tracking-wide rounded-md py-3 hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Or
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full border border-gray-300 rounded-md py-3 flex items-center justify-center gap-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
            <LayoutGrid size={16} />
            Sign Up With Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <span className="font-bold text-black cursor-pointer">Log In</span>
        </p>
      </div>
    </div>
  );
}
```

### `frontend\src\app\api\auth\[...all]\route.js`
```js
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Better Auth-কে Next.js এর বোধগম্য রাউটে কনভার্ট করা হচ্ছে
export const { GET, POST } = toNextJsHandler(auth);
```

### `frontend\src\app\jobs\page.jsx`
```jsx
"use client";

import JobCard from "@/components/JobCard";

const DUMMY_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions BD",
    location: "Dhaka",
    salary: "60k",
  },
  {
    id: 2,
    title: "React Developer",
    company: "AppX",
    location: "Remote",
    salary: "80k",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Mirpur",
    salary: "50k",
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-black uppercase mb-8">
          Available Jobs
        </h1>

        <div className="space-y-4">
          {DUMMY_JOBS.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### `frontend\src\app\jobs\[id]\page.jsx`
```jsx
import Link from "next/link";

// একটু বড় ডামি ডাটার অ্যারে (ডেসক্রিপশনসহ)
const DUMMY_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions BD",
    location: "Dhaka",
    salary: "60k",
    description:
      "We are looking for a passionate Frontend Developer to join our team. You will be responsible for building the user interface of our web applications.",
    requirements: ["React", "Next.js", "Tailwind CSS", "JavaScript"],
  },
  {
    id: 2,
    title: "React Developer",
    company: "AppX",
    location: "Remote",
    salary: "80k",
    description:
      "Join our remote team to build scaleable React applications. Strong state management knowledge is highly required.",
    requirements: ["React", "Redux Toolkit", "Axios", "Git"],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Mirpur",
    salary: "50k",
    description:
      "Looking for a UI/UX designer who can create beautiful and intuitive user experiences for mobile and web platforms.",
    requirements: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
  },
];

export default async function JobDetailsPage({ params }) {
  const { id } = await params;
  // টাস্ক ১: DUMMY_JOBS অ্যারে থেকে .find() ব্যবহার করে সঠিক জবটি খুঁজে বের করো
  // হিন্ট: params.id কে নাম্বার বানিয়ে ম্যাচ করবে
  const job = DUMMY_JOBS.find((j) => j.id.toString() === id.toString());

  // টাস্ক ২: যদি জব খুঁজে না পাওয়া যায় (null/undefined হয়), তবে একটি মেসেজ দেখাও
  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Job Not Found!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-sm border border-gray-200">
        {/* ব্যাক বাটন */}
        <Link
          href="/jobs"
          className="text-sm font-bold text-gray-500 hover:text-black mb-6 inline-block"
        >
          ← Back to Jobs
        </Link>

        {/* জবের মূল হেডার */}
        <h1 className="text-3xl font-extrabold text-black uppercase mb-2">
          {job.title}
        </h1>
        <p className="text-lg text-gray-600 font-medium mb-4">
          {job.company} • {job.location}
        </p>

        <div className="inline-block bg-gray-100 px-4 py-1.5 text-sm font-bold text-gray-700 mb-8">
          Salary: {job.salary}
        </div>

        {/* জব ডেসক্রিপশন সেকশন */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-black uppercase mb-3">
            Job Description
          </h3>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        {/* রিকোয়ারমেন্টস সেকশন (লুপ চালিয়ে দেখাতে হবে) */}
        <div>
          <h3 className="text-lg font-bold text-black uppercase mb-3">
            Requirements
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Apply Button */}
        <button className="w-full bg-black text-white font-bold uppercase tracking-wide py-3 mt-10 hover:bg-gray-800 transition-colors">
          Apply For This Job
        </button>
      </div>
    </div>
  );
}
```

### `frontend\src\components\JobCard.jsx`
```jsx
import Link from "next/link";

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
      <p className="text-gray-600 font-medium">
        {job.company} • {job.location}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1">
          Salary: {job.salary}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-bold text-black border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
```

### `frontend\src\components\Navbar.jsx`
```jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const { data: session, isPending } = useSession();
  console.log("Current Session:", session);

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-black uppercase"
        >
          Job Portal
        </Link>

        {/* Right Side: Navigation & Auth Buttons */}
        <div className="flex items-center gap-6">
          {/* Find Jobs সবার জন্য ওপেন, তাই কন্ডিশনের বাইরে */}
          <Link
            href="/jobs"
            className="text-sm font-semibold text-gray-700 hover:text-black transition-colors"
          >
            Find Jobs
          </Link>

          {/* 3-Step Conditional Rendering */}
          {isPending ? (
            <span className="text-sm text-gray-500 animate-pulse">
              Loading...
            </span>
          ) : session ? (
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-gray-800">
                Welcome, {session.user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 text-sm font-bold px-4 py-2 hover:bg-red-100 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-black text-white text-sm font-bold px-4 py-2 hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
```

### `frontend\src\lib\auth.js`
```js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { clientPromise } from "./mongodb";

// clientPromise theke database instance ta ber kore nicchi
const client = await clientPromise;
const db = client.db("job_portal");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db), // Better Auth ekhon native driver diye kaj korbe!
  emailAndPassword: {
    enabled: true,
  },
});
```

### `frontend\src\lib\auth-client.js`
```js
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // আমাদের Next.js সার্ভারের অ্যাড্রেস
});

// এখান থেকে আমরা আমাদের প্রয়োজনীয় ফাংশনগুলো এক্সপোর্ট করে নিচ্ছি
export const { signIn, signUp, signOut, useSession } = authClient;
```

### `frontend\src\lib\mongodb.js`
```js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("Please add your MONGO_URI to .env file");
}

const client = new MongoClient(uri);

// Database-e connect kore client promise-ta export korchi
export const clientPromise = client.connect();
```
