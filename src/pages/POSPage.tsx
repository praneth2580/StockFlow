
// import { useState } from 'react';

// interface posItem {
//     id: string;
//     name: string;
//     category: string;
//     description?: string;

//     barcode?: string;
//     hasVariants: boolean,

//     // NEW — product inventory type
//     type: "simple" | "measured" | "variant";

//     // For measured products only (kg, g, L, ml …)
//     baseUnit?: string;

//     // Default prices (variant can override)
//     defaultCostPrice: number;
//     defaultSellingPrice: number;

//     quanity: number;

//     createdAt: string;
//     updatedAt: string;
// }

const POSPage = () => {
    // const [posItems, setPOSItems] = useState<posItem[]>([]);

    return <div className='p-4'>
        <div className='px-10'>
            <div className='bg-[url(pos-banner.png)] h-12 w-35 bg-cover bg-center rounded'/>
        </div>
    </div>
};

export default POSPage;
