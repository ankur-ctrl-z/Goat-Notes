# 📝 Goat Notes – AI-Powered Note Taking App

A modern **AI-assisted note-taking platform** where users can ✍️ create notes, 📚 organize them, and 🤖 ask AI questions based on their own written content. Built for speed, clarity, and a smooth writing experience.

---

## 🚀 Tech Stack

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| **Framework**  | Next.js (App Router)          |
| **Database**   | PostgreSQL (Supabase)         |
| **ORM**        | Prisma ORM                    |
| **AI**         | Google Generative AI (Gemini) |
| **Styling**    | Tailwind CSS                  |
| **Deployment** | Render                        |

---

## 🌟 Features

* 📝 **Create, Edit, and Organize Notes**
* 🤖 **Ask AI anything based on your notes**
* 🔐 **Secure Authentication**
* 📄 **Auto-load user's newest note**
* 🔍 **Smart search & instant switching**
* 📱 **Responsive UI for mobile and desktop**
* ⚡ **Fast page loads with Next.js App Router**
* ☁️ **Auto-sync notes with Supabase (Postgres)**

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ankur-ctrl-z/Goat-Notes.git
cd Goat-Notes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Push Prisma Schema

```bash
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

---

## 📦 Deployment (Render)

* Add all required **environment variables** in Render Dashboard
* Hit **Deploy**
* Render automatically runs:

  ```bash
  npm install
  npm run build
  npm start
  ```

Your app is now live.

---

## 📁 Project Structure

```
src/
  app/            → Next.js routes
  components/     → UI components
  auth/           → Supabase SSR auth helpers
  providers/      → Theme & AI providers
  db/             → Prisma schema + client
```

---

## 🙌 Contributing

Contributions, issues, and feature requests are welcome.

---

* A **professional logo** for Goat Notes

