h# St. Kizito's Technical Institute - Website

A modern, responsive website for St. Kizito's Technical Institute - Madera, featuring elegant design and comprehensive information about the institute's programs, facilities, and contact details.

## Features

### Sections Included
- **Navigation Bar** - Sticky header with transparency effect, logo, menu items, and "Apply Now" button
- **Hero Section** - Full-width hero with gradient overlay, animated text, and CTAs
- **Welcome Section** - Brief introduction with animated statistics counters
- **Location Section** - Map placeholder, address, and transportation info
- **Leadership Section** - Director cards with photos, bios, and social links
- **Graduation Gallery** - Masonry grid gallery with lightbox functionality
- **Practical Training Carousel** - Auto-playing carousel with training images
- **Academic Programs** - 6 program cards with icons, descriptions, and progress bars
- **Testimonials** - Student testimonial carousel
- **Contact Section** - Form with validation, contact info, and map
- **Footer** - Quick links, social media, newsletter signup

### Special Features
- Parallax scrolling effects
- Animated counters for statistics
- Smooth scroll navigation
- Back to top button
- Dark/light mode toggle
- Image lazy loading
- Form validation
- Mobile-responsive hamburger menu
- Search functionality (demo)
- Gallery lightbox
- Auto-playing carousels with pause on hover

## Technology Stack
- HTML5
- CSS3 (Flexbox, Grid, Animations, Transitions)
- Vanilla JavaScript
- Font Awesome 6 (CDN)
- Google Fonts (Playfair Display, Inter)
- Unsplash Images (CDN)

## Getting Started

### Option 1: Open Directly
Simply open the `index.html` file in any modern web browser:
```bash
# Using Windows
start index.html

# Using macOS
open index.html

# Using Linux
xdg-open index.html
```

### Option 2: Local Development Server
For the best experience (especially for hot-reloading during development), use a local server:

#### Using Python (pre-installed on most systems)
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

#### Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server -p 8000

# Then open http://localhost:8000 in your browser
```

#### Using VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

### Option 3: Deploy to Hosting

#### Netlify
1. Create a Netlify account at netlify.com
2. Drag and drop the project folder to Netlify
3. Your site will be deployed automatically

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

#### GitHub Pages
1. Create a GitHub repository
2. Push your code
3. Go to Settings > Pages
4. Select the main branch as source

## Customization

### Colors
All colors are defined as CSS variables at the top of the style section:
```css
:root {
    --primary: #1e3a8a;      /* Deep royal blue */
    --secondary: #f59e0b;    /* Warm gold/amber */
    --accent: #ffffff;
    --light-gray: #f3f4f6;
    --text-dark: #1f2937;
    --text-light: #6b7280;
}
```

### Images
Replace the Unsplash URLs with your own images:
- Search for `images.unsplash.com/photo-...` in the HTML
- Replace with your image paths

### Content
Edit the text content directly in the HTML file to customize:
- Institute name and tagline
- Program descriptions
- Contact information
- Leadership details

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## File Structure
```
st-kizitos-web/
├── index.html    # Complete website (HTML, CSS, JS)
└── README.md     # This file
```

## Credits
- Images: [Unsplash](https://unsplash.com)
- Icons: [Font Awesome 6](https://fontawesome.com)
- Fonts: [Google Fonts](https://fonts.google.com)

## License
This project is for educational purposes.

## Contact
For questions or support, please contact the institute directly through the website's contact form.

---

# Admin Panel Documentation

## Accessing the Admin Panel

The admin panel can be accessed at `admin.html`. There are two ways to reach it:

### Method 1: Direct URL
Simply open `admin.html` in your browser:
```bash
start admin.html
```

### Method 2: From the Website
Navigate to the main website (`index.html`) and look for the admin login link in the footer or contact section.

## Logging In

1. Open `admin.html` in your browser
2. Enter your admin email address
3. Enter your password
4. Click the "Login" button

**Note:** You must have an authorized admin account to access the dashboard. Contact the system administrator to get your credentials.

## Admin Dashboard Features

Once logged in, you'll have access to:

- **Dashboard Overview** - View statistics and quick actions
- **Student Management** - Add, edit, and manage student records
- **Application Management** - Review and process admission applications
- **Settings** - Configure system preferences

## Security

- Only authorized email addresses can access the admin panel
- Unauthorized users will see an "Access denied" message
- The system automatically redirects non-admins back to the login page

## Troubleshooting

### "No account found with this email"
- Verify you're using the correct email address
- Contact the administrator to add your email to the admin list

### "Incorrect password"
- Double-check your password
- Use the "Forgot Password" feature if available

### "Access denied"
- Your email is not authorized for admin access
- Contact the system administrator to request access
