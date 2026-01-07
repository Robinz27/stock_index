# Stock Index Dashboard - Project Structure

## 📁 Directory Structure

```
stock_index/
├── app/
│   ├── globals.css              # Global styles + dark theme
│   ├── layout.tsx               # Root layout with ThemeProvider
│   ├── page.tsx                 # Main dashboard page
│   └── dashboard/
│       └── data.json            # Sample data
├── components/
│   ├── app-sidebar.tsx          # Sidebar navigation
│   ├── chart-area-interactive.tsx # Stock price chart
│   ├── section-cards.tsx        # Stock cards display
│   ├── site-header.tsx          # Header with theme toggle
│   ├── theme-toggle.tsx         # Dark/Light theme button
│   ├── nav-documents.tsx        # Sidebar nav documents
│   ├── nav-main.tsx             # Main navigation
│   ├── nav-secondary.tsx        # Secondary navigation
│   ├── nav-user.tsx             # User menu
│   └── ui/                      # shadcn/ui components
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── hooks/
│   └── use-mobile.ts            # Mobile detection hook
├── lib/
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── components.json              # shadcn/ui config
├── eslint.config.mjs            # ESLint config
├── next.config.ts               # Next.js config
├── package.json                 # Dependencies
├── postcss.config.mjs           # PostCSS config
├── tsconfig.json                # TypeScript config
└── README.md                    # Project readme
```

## 🗂️ Component Usage

### Used Components ✅
- **app-sidebar.tsx** - Main navigation sidebar (imported in page.tsx)
- **chart-area-interactive.tsx** - Stock price chart (imported in page.tsx)
- **section-cards.tsx** - Stock overview cards (imported in page.tsx)
- **site-header.tsx** - Header with theme toggle (imported in page.tsx)
- **theme-toggle.tsx** - Dark/light theme switcher (imported in site-header.tsx)
- **nav-main.tsx** - Navigation main items (imported in app-sidebar.tsx)
- **nav-documents.tsx** - Documentation nav (imported in app-sidebar.tsx)
- **nav-secondary.tsx** - Secondary nav items (imported in app-sidebar.tsx)
- **nav-user.tsx** - User profile menu (imported in app-sidebar.tsx)
- **All UI components** - shadcn/ui components used throughout

### Hooks Used ✅
- **use-mobile.ts** - Responsive detection for mobile breakpoints

## 🎨 Features

- ✅ Dark/Light theme toggle
- ✅ Responsive sidebar navigation
- ✅ Stock price charts (Recharts)
- ✅ Stock overview cards
- ✅ Mobile responsive design
- ✅ Thai language support in content
- ✅ Dark theme as default

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Start production server
npm start
```

Visit `http://localhost:3000` to view the dashboard.

## 📝 Notes

- **Removed unused files:** `api/`, `scripts/`, `data-table.tsx`
- **No external Python server needed** - Use static data or API integrations as needed
- **Fully styled** with Tailwind CSS and shadcn/ui components
- **Dark theme enabled by default** with theme toggle support
