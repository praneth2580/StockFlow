import DashboardPage from "./pages/DashboardPage";
import ProductPage from "./pages/ProductPage";
import StockPage from "./pages/StockPage";
import SalesPage from "./pages/SalesPage";
import PurchasesPage from "./pages/PurchasesPage";
import SuppliersPage from "./pages/SuppliersPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import AboutPage from "./pages/AboutPage";

export interface RouteItem {
  path: string;
  name: string;
  icon: string;
  component: React.ComponentType;
}

export const routeConfig: RouteItem[] = [
  {
    path: '/',
    name: 'Dashboard',
    icon: '/vite.svg',
    component: DashboardPage,
  },
  {
    path: '/product',
    name: 'Product',
    icon: '/vite.svg',
    component: ProductPage,
  },
  {
    path: '/stock',
    name: 'Stock',
    icon: '/vite.svg',
    component: StockPage,
  },
  {
    path: '/sales',
    name: 'Sales',
    icon: '/vite.svg',
    component: SalesPage,
  },
  {
    path: '/purchases',
    name: 'Purchases',
    icon: '/vite.svg',
    component: PurchasesPage,
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    icon: '/vite.svg',
    component: SuppliersPage,
  },
  {
    path: '/reports',
    name: 'Reports',
    icon: '/vite.svg',
    component: ReportsPage,
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: '/vite.svg',
    component: SettingsPage,
  },
  {
    path: '/help',
    name: 'Help',
    icon: '/vite.svg',
    component: HelpPage,
  },
  {
    path: '/about',
    name: 'About',
    icon: '/vite.svg',
    component: AboutPage,
  },
];
