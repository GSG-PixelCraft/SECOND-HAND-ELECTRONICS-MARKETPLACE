# Project Name
SECOND-HAND ELECTRONICS
MARKETPLACE

---

## Tech Stack

### Framework/Library
[React](https://reactjs.org) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vitejs.dev/)  

### Data Fetching & Caching
[TanStack Query (React Query)](https://tanstack.com/query/latest)  

### Global State Management
[Zustand](https://zustand-demo.pmnd.rs/)  

### Forms
[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) 

### UI & Design System
[shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) [class-variance-authority (CVA)](https://cva.style/) + [clsx](https://github.com/lukeed/clsx)  

### Routing 
[React Router v6](https://reactrouter.com/en/main)  

### Testing & Storybook
[Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) + [Storybook](https://storybook.js.org/) + [Vitest](https://vitest.dev/) 

### Realtime Communication:
[Socket.io Client](https://socket.io/)  

### Map View
[react-leaflet](https://react-leaflet.js.org/)  

### Image Handling
[React Dropzone](https://react-dropzone.js.org/) 

### Notifications
[React Hot Toast](https://react-hot-toast.com/) 

### Charts / Analytics
[Recharts](https://recharts.org/) 

### Security
 JWT + Cookies + Protected Routes 

### Multi-Language Support 
[i18n](https://www.i18next.com/)  

### Linting & Formatting
[ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)


---

## Requirements

Before running this project, make sure you have the following installed:

- **Node.js** >= 18.x  
- **npm** >= 9.x  
- **Git**  
- Modern web browser (Chrome, Firefox, Edge)  
- Optional: IDE like **VSCode** for development  

---

## User Stories

- As a user, I can register and log in to the platform.  
- As a user, I can view interactive maps and charts.  
- As a user, I can upload images and manage my profile.  
...

---

## System & Architecture Guidelines

### System Design Tokens
- Define design tokens (colors, typography, spacing, etc.) in CSS and Tailwind config files.

### Define DTOs (Data Transfer Objects)
- Standardize the shape of data exchanged between frontend and backend.

### Define API Endpoints File
- List all API endpoints in a single file.  
- *Note:* Currently using fake data for development.

### Components Building
- Build reusable React components based on the design system.

---

## Git & Collaboration Rules

- No direct push to `main`.  
- No merge without a Pull Request (PR).  
- PR requires approval from at least 2 different team members.  
- Any new commit invalidates previous approvals.  
- No force push allowed.  
- No branch deletion without team agreement.