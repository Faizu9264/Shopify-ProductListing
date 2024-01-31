export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    inventory:string|number;
    type:string;
    vendor:string;
    status:string;
    rating: {
      rate: number;
      count: number;
    };
  }
  
 export interface HomeProps {
    products: Product[];
  }