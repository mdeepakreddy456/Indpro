# TaskManager 

A clean, highly responsive MERN stack Kanban board designed to help users organize workflows and track tasks. It features secure email signups with 6-digit OTP verification, official Google OAuth 2.0 integration, native drag-and-drop mechanics, and a smooth, togglable light/dark theme.

### Live Deployments
- **Live Demo (Frontend)**: [https://indpro-psi.vercel.app](https://indpro-psi.vercel.app)
- **API Server (Backend)**: [https://indpro-backend-ybc0.onrender.com](https://indpro-backend-ybc0.onrender.com)

---

## Key Features

- **Authentication & Security**:
  - Standard signup with username, email, and password.
  - 6-digit OTP email verification code sent directly to your inbox via the Brevo HTTP API.
  - Quick "Continue with Google" sign-in using the official `@react-oauth/google` SDK.
  - Safe backend validation of Google ID tokens using the `google-auth-library` to verify account authenticity.
  - JWT token-based session persistence stored securely.
- **Interactive Kanban Board**:
  - Standard three-column layout (To Do, In Progress, Completed) with native HTML5 drag-and-drop.
  - Visual cues during drags (cards dim slightly and column borders highlight on hover).
  - Accessibility-first quick-move buttons on card headers for mobile and touch-screen devices.
- **Task Management (CRUD)**:
  - Add, edit, and delete tasks with title, description, priority (Low, Medium, High), and due dates.
  - Due dates automatically highlight in red if a task is overdue.
- **Premium UI/UX**:
  - Toggle between clean Light and Dark modes with a button in the navbar.
  - Instant theme application before rendering to prevent any white-screen flicker.
  - Live task counters at the top of the dashboard tracking workspace statistics.
  - Search bar to filter tasks by text, with dropdowns to filter by priority and sort by date or alphabetical order.

---

## Technical Stack

- **Frontend**: React (Vite), React Router (HashRouter), Lucide React (Icons), Vanilla CSS (using variables/design tokens for seamless theme transitions).
- **Backend**: Node.js, Express, MongoDB with Mongoose ORM, JSON Web Tokens (JWT), Bcrypt.js (password hashing).
- **Email Delivery**: Brevo REST API (integrates over HTTPS for firewall-free delivery).

---

## Local Setup

### 1. Clone the project
```bash
git clone https://github.com/mdeepakreddy456/Indpro.git
cd Indpro
```

### 2. Install all packages
From the root workspace directory, run:
```bash
npm run install-all
```
*(This automatically runs `npm install` inside both the `/backend` and `/frontend` directories)*

### 3. Setup environment variables
Create a `.env` file in the **`backend`** folder:
```env
PORT=5050
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
GMAIL_USER=your_verified_sender_email
BREVO_API_KEY=your_brevo_api_key
GOOGLE_CLIENT_ID=63867326181-4qit0d1l8ar9t94ptpaft3ltlq92pnqq.apps.googleusercontent.com
```

Create a `.env` file in the **`frontend`** folder:
```env
VITE_API_URL=http://localhost:5050/api
VITE_GOOGLE_CLIENT_ID=63867326181-4qit0d1l8ar9t94ptpaft3ltlq92pnqq.apps.googleusercontent.com
```

### 4. Run locally
Start the backend development server (runs on `http://localhost:5050`):
```bash
npm run backend
```

In a new terminal window, start the frontend server (runs on `http://localhost:5174`):
```bash
npm run frontend
```

---

## Architectural & Design Choices

1. **HashRouter over BrowserRouter**: 
   Standard routing (`BrowserRouter`) regularly runs into 404 errors on cloud hosting platforms (like Vercel or Netlify) when a user refreshes a subpage like `/register` because the hosting server tries to find a physical folder. Using `HashRouter` adds a clean hash fallback (`/#/register`) which works out-of-the-box on every deployment platform without complex rewrite rules.
2. **HTTP REST API for Emails (Brevo)**: 
   Free-tier hosting providers (like Render) block outgoing SMTP traffic on standard ports (25, 465, 587) to prevent spam. To bypass this, I integrated Brevo’s HTTP-based API. Because it connects over HTTPS (port 443), Render never blocks the traffic and your verification codes are delivered instantly.
3. **Backend Google ID Token Verification**: 
   Many web apps trust client-side Google login and just pass user data to the database. To make this fully secure, the frontend passes only the signed `credential` payload (ID Token) to the backend. The backend then verifies the signature directly against Google's OAuth servers using `google-auth-library` before authorizing or registering the user.
4. **CSS Variables & Transitions**: 
   Instead of using heavy utility frameworks like Tailwind which can look generic, all components are styled using custom Vanilla CSS variables. This makes theme transitions extremely fast, light, and easy to maintain.
