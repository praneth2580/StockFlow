// 📦 Product / Inventory Item
export interface IProduct {
  id: string; // Unique ID
  name: string;
  category: string;
  description?: string;
  sku?: string; // Stock Keeping Unit
  barcode?: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplierId?: string;
  lowStockThreshold?: number;
  createdAt: string;
  updatedAt: string;
}

// 🧾 Sale Transaction
export interface ISale {
  id: string;
  productId: string;
  quantity: number;
  sellingPrice: number;
  total: number;
  date: string;
  customerName?: string;
  paymentMethod?: "cash" | "card" | "upi" | "other";
}

// 📥 Purchase / Stock-In
export interface IPurchase {
  id: string;
  productId: string;
  supplierId?: string;
  quantity: number;
  costPrice: number;
  total: number;
  date: string;
  invoiceNumber?: string;
}

// 🏢 Supplier
export interface ISupplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 📊 Reports (generic summary structure)
export interface IReportSummary {
  totalProducts: number;
  totalStockValue: number;
  totalSales: number;
  totalPurchases: number;
  topSellingProducts: IProduct[];
  lowStockItems: IProduct[];
}

// ⚙️ Settings
export interface ISettings {
  shopName: string;
  currency: string;
  lowStockGlobalThreshold: number;
  googleSheetId: string;
  theme?: "light" | "dark";
  offlineMode?: boolean;
  updatedAt: string;
}

// 📝 Base class utilities (Optional)
export class Product implements IProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplierId?: string;
  lowStockThreshold?: number;
  createdAt: string;
  updatedAt: string;

  constructor(data: IProduct) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.description = data.description;
    this.sku = data.sku;
    this.barcode = data.barcode;
    this.quantity = data.quantity;
    this.costPrice = data.costPrice;
    this.sellingPrice = data.sellingPrice;
    this.supplierId = data.supplierId;
    this.lowStockThreshold = data.lowStockThreshold;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  get profitMargin(): number {
    return this.sellingPrice - this.costPrice;
  }

  isLowStock(): boolean {
    return this.quantity <= (this.lowStockThreshold ?? 0);
  }
}
