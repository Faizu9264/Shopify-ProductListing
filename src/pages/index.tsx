import Head from "next/head";
import styles from "@/styles/Home.module.css";
import axios from "axios"
import Navbar from '../components/Navbar';
import { Product,HomeProps } from "@/types/product";



export default function Home({products}:HomeProps) {
  return (
    <>
      <Head>
        <title>Product Listing</title>
        <meta name="description" content="Product listing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <main className={`${styles.main}`}>
      {/* <h1>Product listing</h1>
      <ul className={styles.productList}>
          {products.map((product:Product) => (
            <li key={product.id} className={styles.productItem}>
              <img src={product.image} alt={product.title} className={styles.productImage} />
              <div className={styles.productInfo}>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Price: ${product.price}</p>
                <p>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>
              </div>
            </li>
          ))}
        </ul> */}
      </main>
    </>
  );
}


export async function getServerSideProps(){
  try {
    const respons = await axios.get('https://fakestoreapi.com/products')
    const products = respons.data
    console.log(products);
    
    return {
      props:{
        products,
      },
    };
  } catch (error) {
    console.log('Error fetching data',error)
    return {
      props:{
        products:[],
      },
    };
  }
}