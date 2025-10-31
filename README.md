# Personal Portfolio Website

A modern, minimal personal portfolio website built with Next.js, React, and Tailwind CSS.

## Features

- ✨ Modern, clean design with purple accent color
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Smooth animations with Framer Motion
- 📧 Functional email contact form
- 🎯 SEO optimized
- ⚡ Fast loading with Next.js

## Tech Stack

- **Frontend:** Next.js 14, React 18
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Add your hero image:
   - Place your professional photo as `hero-image.png` in the `public/` folder
   - Recommended size: 400x500px or similar aspect ratio
   - Supported formats: PNG, JPG, WebP

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Colorsimage.pngimage.pngimage.png
The color palette can be customized in `tailwind.config.js`:
- Primary: `#6C63FF` (purple accent)
- Text: `#1F1F1F` (dark gray)
- Muted: `#9CA3AF` (light gray)

### Content
Update the following files to customize your content:
- `components/Hero.jsx` - Main heading, subtext, and contact form
- `components/Navbar.jsx` - Navigation menu items and social links

### Images
Replace `public/hero-image.png` with your professional photo.

## Deployment

The site is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

## Project Structure

```
├── components/
│   ├── Navbar.jsx      # Navigation component
│   └── Hero.jsx        # Hero section component
├── pages/
│   ├── _app.js         # App wrapper with global styles
│   └── index.js        # Main page
├── public/
│   └── hero-image.png  # Your professional photo
├── styles/
│   └── globals.css     # Global styles and Tailwind imports
└── package.json
```

## License

This project is open source and available under the [MIT License](LICENSE).
