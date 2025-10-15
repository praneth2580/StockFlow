# StockFlow - Inventory Management System

StockFlow is a modern inventory management system built with React, TypeScript, and Vite. It provides a user-friendly interface for managing products, tracking stock levels, and handling purchases and sales, all backed by Google Sheets as a database.

🌐 **Live Demo**: [https://praneth2580.github.io/StockFlow/](https://praneth2580.github.io/StockFlow/)
🎨 **UI Design**: [View UI/UX Design in Stitch](https://stitch.withgoogle.com/projects/9293421488052721907)

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
   git clone https://github.com/praneth2580/StockFlow.git
   cd StockFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Sheets Integration**

   a. **Google Apps Script Project**
   - Use our pre-configured Apps Script project:
   - [StockFlow Google Apps Script Project](https://stitch.withgoogle.com/projects/9293421488052721907)
   - Create a copy of the project for your own use
   - Deploy the script as a web app and copy the Script ID
   
   b. **Google Sheets Setup**
   - Create a new Google Sheets document
   - Set up the following sheets:
     - Products
     - Sales
     - Purchases
     - Suppliers
   - Share the sheet with the Apps Script project's service account
   
   c. **Environment Configuration**
   ```bash
   # Create a .env file and add:
   VITE_GOOGLE_SCRIPT_ID=your_script_id_here  # From the deployed Apps Script
   ```

   For detailed setup instructions, check the `/src/assets/markdowns/getting-started/` directory.

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
4. Access your site at `https://[username].github.io/StockFlow/`

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
