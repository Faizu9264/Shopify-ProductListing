import React, { useState, useEffect } from "react";
import { Modal, Button, AppProvider } from "@shopify/polaris";
import { Product } from "@/types/product";
import styles from "@/styles/Home.module.css";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  product,
}) => {
  const [modalActive, setModalActive] = useState(open);

  useEffect(() => {
    setModalActive(open);
  }, [open]);

  const closeModal = () => {
    setModalActive(false);
    onClose();
  };

  const handleButtonClick = () => {
    setModalActive(true);
  };

  return (
    <AppProvider>
      <Button onClick={handleButtonClick}>Open Modal</Button>
      <Modal open={modalActive} onClose={closeModal} title={product?.title}>
        <div className={styles["product-section"]}>
          <Modal.Section>
          <section className={styles["product-section"]}>
              {product?.image.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${product?.title}-image-${index}`}
                  className={styles["product-image"]}
                />
              ))}
            </section>
          </Modal.Section>
          <Modal.Section>
            <section className={styles["product-section"]}>
              <h3 className={styles["product-description-title"]}>
                A Description:
              </h3>
              <div className={styles["product-description-content"]}>
                {product?.description}
              </div>
            </section>
          </Modal.Section>
          <Modal.Section>
            <section className={styles["product-section-last"]}>
              <h3 className={styles["product-rating-title"]}>Rating:</h3>
              <div className={styles["product-rating"]}>
                <span className={styles["product-rating-content"]}>
                  Rating:{" "}
                </span>
                {`${product?.rating?.rate}`}
              </div>
              <span className={styles["product-rating-content"]}>
                {" "}
                Rated by:
              </span>
              <span>{`${product?.rating?.count} customers`}</span>
            </section>
          </Modal.Section>
        </div>
      </Modal>
    </AppProvider>
  );
};

export default ProductModal;
