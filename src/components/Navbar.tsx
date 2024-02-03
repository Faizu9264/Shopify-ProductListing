import { Text, ButtonGroup, Popover, ActionList, Icon } from "@shopify/polaris";
import React, { useState } from "react";
import { CaretDownIcon } from "@shopify/polaris-icons";
import styles from "@/styles/Home.module.css";
import AddProductModal from "./AddProductModal";
import { ToastContainer, toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [popoverActive, setPopoverActive] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);

  const togglePopoverActive = () => {
    setTimeout(() => {
      setPopoverActive((popoverActive) => !popoverActive);
    }, 0);
  };

  const closePopover = () => {
    setPopoverActive(false);
  };
  const handleAddProductClick = () => {
    setAddProductModalOpen(true);
  };

  const handleAddProductModalClose = () => {
    setAddProductModalOpen(false);
  };
  const popoverActivator = (
    <ButtonGroup>
      <button
        onClick={() => console.log("Export clicked")}
        className={styles.exportButton}
      >
        Export
      </button>
      <button
        onClick={() => console.log("Import clicked")}
        className={styles.importButton}
      >
        Import
      </button>
      <button
        onClick={togglePopoverActive}
        className={styles.moreOptionsButton}
      >
        <span style={{ marginRight: "4px", margin: "0", fontWeight: "bold" }}>
          More Options
        </span>
        <Icon source={CaretDownIcon} />
      </button>
      <button
        className={`${styles.addProductButton} Polaris-Button--primary`}
        onClick={handleAddProductClick}
      >
        <span
          className="polaris-Button__Content"
          style={{ fontWeight: "400", fontSize: ".875rem" }}
        >
          Add Product
        </span>
      </button>
    </ButtonGroup>
  );

  const options = [
    { content: "Option A", onAction: () => console.log("Option A clicked") },
    { content: "Option B", onAction: () => console.log("Option B clicked") },
  ];

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbarContent}>
        <div>
          <Text variant="headingLg" as="p" className={styles.headingText}>
            Products
          </Text>
        </div>
        <div>
          <Popover
            active={popoverActive}
            activator={popoverActivator}
            onClose={closePopover}
            preferredAlignment="bottom"
          >
            <ActionList items={options} />
          </Popover>
        </div>
      </div>
      {addProductModalOpen && (
        <AddProductModal
          open={addProductModalOpen}
          onClose={handleAddProductModalClose}
          onSubmit={() => {
            handleAddProductModalClose();
          }}
        />
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Navbar;
