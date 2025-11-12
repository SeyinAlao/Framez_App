
````markdown
# 📸 Framez

**Framez** is a mobile social application built with **React Native** and **Firebase**.  
It’s an Instagram-inspired app where users can sign up, share photo and text posts, and browse a real-time feed of content from all users.

This project demonstrates a **modern, scalable, and clean mobile app architecture**, including full authentication, real-time database listeners, and third-party image hosting.

---

## 🔴 Live Demo (Appetize.io)
👉 [View the live demo here](#)  
*(Replace `#` with your Appetize.io demo link)*

---

## 🎬 Video Walkthrough
🎥 [Watch the demo video here](#)  
*(Replace `#` with your 2–3 minute video link)*

---

## ✨ Core Features

- ✅ **Full Authentication** – Secure sign-up (with display name), login, and logout using Firebase Auth.  
- ✅ **Persistent Sessions** – Users stay logged in even after closing the app.  
- ✅ **Create Posts** – Upload photo or text-based posts.  
- ✅ **Cloud Image Uploads** – Images are uploaded to Cloudinary; only URLs are stored in Firestore for efficiency.  
- ✅ **Real-Time Home Feed** – Displays all user posts in chronological order.  
  - Instantly updates without refresh via Firestore `onSnapshot` listeners.  
- ✅ **User Profile Screen** – Displays user info (name, email) and a list of their posts.  
- ✅ **Instagram-Inspired UI** –  
  - Toggle between feed and grid view  
  - Relative timestamps (e.g., “5 minutes ago”)  
- ✅ **Post Interactions (Bonus)** –  
  - Like and unlike posts (real-time count updates)  
  - Delete your own posts (hidden delete icon for others)

---

## 🧱 Architecture & Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | React Native (via Expo) |
| **Authentication** | Firebase Auth |
| **Database** | Firestore (Real-time NoSQL) |
| **Image Hosting** | Cloudinary |
| **Navigation** | React Navigation (Stack + Tabs) |
| **Date Formatting** | date-fns |
| **Safe Area Handling** | react-native-safe-area-context |

> 🧠 *Design Decision:* Cloudinary is used for image storage to reduce Firebase Storage costs and leverage global image optimization/CDN delivery.

---

## 🚀 Getting Started

Follow these steps to set up and run **Framez** locally.

### 1️⃣ Prerequisites
Ensure you have:
- Node.js (v18+)
- NPM or Yarn
- Expo Go app (on iOS or Android)

---

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/[YOUR_USERNAME]/[YOUR_REPO_NAME].git
cd [YOUR_REPO_NAME]
````

---

### 3️⃣ Install Dependencies

```bash
npm install
```

---

### 4️⃣ Set Up Environment Keys

#### 🔹 Firebase

1. Create a new project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication → Email/Password**.
3. Enable **Firestore Database** (start in test mode).
4. Copy your `firebaseConfig` object and paste it into:

   ```ts
   src/firebase/config.ts
   ```

#### 🔹 Cloudinary

1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Find your **Cloud Name** on the dashboard.
3. Go to **Settings → Upload → Upload Presets**.
4. Create a preset (e.g., `framez_uploads`) with **Unsigned** mode.
5. Open:

   ```
   src/screens/CreateScreen.tsx
   ```

   and paste your:

   ```ts
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_UPLOAD_PRESET
   ```

#### 🔹 Firebase Index (for Profile Screen)

When you first open the Profile tab, Firebase may show an index error in the terminal:

* Click the provided URL → it opens Firebase Console with the correct index query.
* Click **Create** and wait for it to become **Enabled**.

---

### 5️⃣ Run the App

```bash
npx expo start
```

Scan the QR code with your **Expo Go** app to preview the project on your phone.

---

## 🧑‍💻 Author

**Alao Oluwaseyin Emmanuel**
Software Engineering Student – Babcock University

📍 [GitHub](https://github.com/YOUR_USERNAME) • [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

### ⭐ If you like this project, consider giving it a star on GitHub!

```

---

Would you like me to add **badges and screenshots** (like “Built with React Native”, “Firebase Powered”, and a sample image preview section) to make it more visually appealing for your portfolio?
```
