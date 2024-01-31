import Head from "next/head";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import { HomeProps } from "@/types/product";
import Table from "@/components/Table";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
export default function Home({ products }: HomeProps) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  return (
    <>
      <Head>
        <title>Product Listing</title>
        <meta name="description" content="Product listing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <main className={`${styles.main}`}>
            <Table products={products} />
          </main>
        </>
      )}
    </>
  );
}

export async function getServerSideProps() {
  try {
    const apiUrl =
      process.env.PRODUCT_URL || "https://fakestoreapi.com/products";

    const response = await axios.get(apiUrl);
    const products = response.data;
    return {
      props: {
        products,
      },
    };
  } catch (error) {
    return {
      props: {
        products: [],
      },
    };
  }
}
