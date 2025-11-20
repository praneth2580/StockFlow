# Storix - Inventory Management System

Storix is a modern inventory management system built with React, TypeScript, and Vite. It provides a user-friendly interface for managing products, tracking stock levels, and handling purchases and sales, all backed by Google Sheets as a database.

🌐 **Live Demo**: [https://praneth2580.github.io/Storix/](https://praneth2580.github.io/Storix/)

## Features

- 📦 Product management (CRUD operations)
- 📊 Real-time stock tracking
- 💰 Cost and profit margin calculations
- 🔔 Low stock alerts
- 📱 Responsive design with Tailwind CSS
- 🔄 Google Sheets integration for data storage
- 📊 Sales and purchase tracking
- 🏢 Supplier management

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Google Apps Script
- **Database**: Google Sheets
- **Deployment**: GitHub Pages

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- A Google account for Sheets integration
- Git

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/praneth2580/Storix.git
   cd Storix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Sheets Integration**
   - Set up a Google Sheets document
   - Create a Google Apps Script project
   - Set the script ID in your environment:
     ```bash
     # Create a .env file and add:
     VITE_GOOGLE_SCRIPT_ID=your_script_id_here
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## Deployment

The project is configured for GitHub Pages deployment. To deploy:

1. Ensure all changes are committed
2. Run the deployment command:
   ```bash
   npm run deploy
   ```
3. The site will be automatically built and deployed to the `gh-pages` branch
4. Access your site at `https://[username].github.io/Storix/`

## Project Structure

```
src/
├── assets/          # Static assets and documentation
├── components/      # Reusable UI components
├── models/          # Data models and API calls
├── pages/          # Page components
├── types/          # TypeScript type definitions
└── App.tsx         # Root component
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- GitHub: [@praneth2580](https://github.com/praneth2580)
