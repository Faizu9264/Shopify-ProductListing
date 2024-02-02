import React, { useState, useCallback } from "react";
import {
  Modal,
  AppProvider,
  FormLayout,
  TextField,
  DropZone,
  LegacyStack,
  Thumbnail,
  Spinner,
} from "@shopify/polaris";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { NoteIcon } from "@shopify/polaris-icons";
import { LegacyCard } from "@shopify/polaris";
import { XCircleIcon } from "@shopify/polaris-icons";
import { Icon } from "@shopify/polaris";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/Home.module.css";
import { Select } from "@shopify/polaris";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [newProductTitle, setNewProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [ratingRate, setRatingRate] = useState<string>("");
  const [ratingCount, setRatingCount] = useState<string>("");
  const [priceFieldValue, setPriceFieldValue] = useState("");
  const [category, setCategory] = useState<string>("");
  const [inventory, setInventory] = useState<string | number>("");
  const [type, setType] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const handleTitleChange = (value: string) => {
    setNewProductTitle(value);
  };

  const handleDescriptionChange = (value: string) => {
    setProductDescription(value);
  };

  const handleRatingRateChange = useCallback(
    (value: string) => setRatingRate(value),
    []
  );

  const handleRatingCountChange = useCallback(
    (value: string) => setRatingCount(value),
    []
  );
  const handlePriceFieldChange = useCallback(
    (value: string) => setPriceFieldValue(value),
    []
  );
  const handleCategoryChange = useCallback(
    (value: string) => setCategory(value),
    []
  );

  const handleInventoryChange = useCallback(
    (value: string) => setInventory(value),
    []
  );

  const handleTypeChange = useCallback((value: string) => setType(value), []);

  const handleVendorChange = useCallback(
    (value: string) => setVendor(value),
    []
  );
  const handleDropZoneDrop = async (
    dropFiles: File[],
    _acceptedFiles: File[],
    _rejectedFiles: File[]
  ) => {
    setLoading(true);

    const invalidFiles = dropFiles.filter(
      (file) => !validImageTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      const invalidTypes = invalidFiles.map((file) => file.type).join(", ");
      setErrorMessage(
        `Invalid file type(s): ${invalidTypes}. Please upload only images.`
      );
    } else {
      setErrorMessage(null);

      const validDropFiles = dropFiles.filter((file) =>
        validImageTypes.includes(file.type)
      );

      setFiles((files) => [...files, ...validDropFiles]);
    }

    setLoading(false);
  };

  const handleFormSubmit = () => {
    if (errorMessage) {
      console.error(errorMessage);
    } else {
      const rating = {
        rate: parseFloat(ratingRate),
        count: parseInt(ratingCount, 10),
      };

      onSubmit();
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    toast.success("Image removed successfully!");
  };

  const uploadedFiles = files.length > 0 && (
    <div className={styles.uploadedFilesContainer}>
      {files.map((file, index) => (
        <div
          className={`${styles.imageContainer} ${
            index === 0 ? styles.firstImage : styles.otherImages
          }`}
          key={index}
        >
          <div
            style={{
              width: index === 0 ? "125px" : "80px",
              height: index === 0 ? "125px" : "80px",
            }}
            className={`${styles.zoomedImage} zoomedImage`}
            onMouseOver={() => setZoomedIndex(index)}
            onMouseOut={() => setZoomedIndex(null)}
          >
            <Thumbnail
              alt={file.name}
              source={
                validImageTypes.indexOf(file.type) > -1
                  ? window.URL.createObjectURL(file)
                  : NoteIcon
              }
            />
          </div>
          <button
            className={styles.removeButton}
            type="button"
            onClick={() => handleRemoveImage(index)}
          >
            <Icon source={XCircleIcon} tone="base" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <AppProvider>
      <Modal
        open={open}
        onClose={onClose}
        title={
          <h1 style={{ fontSize: "24px", marginBottom: "0" }}>Add Product</h1>
        }
        primaryAction={{
          content: "Add Product",
          onAction: handleFormSubmit,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: onClose,
          },
        ]}
        sectioned
      >
        <FormLayout>
          <label className={styles.labelStyle}>Product Title</label>
          <TextField
            label="Product Title"
            value={newProductTitle}
            onChange={handleTitleChange}
            labelHidden
          />
          <div style={{ marginTop: "16px" }}>
            <label className={styles.labelStyle}>Product Description</label>
            <ReactQuill
              theme="snow"
              value={productDescription}
              onChange={handleDescriptionChange}
            />
          </div>
          <div style={{ marginTop: "16px" }}>
            <label className={styles.labelStyle}>Product Images</label>
            <LegacyCard sectioned>
              {uploadedFiles}
              <DropZone
                onDrop={handleDropZoneDrop}
                accept={validImageTypes.join(",")}
              >
                <div className={styles.uploadContainer}>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <div className={styles.customUploadImage}>
                      <img
                        src="images/upload.png"
                        alt="Upload Image"
                        style={{ width: "50px", height: "50px" }}
                      />
                      {!errorMessage && (
                        <div className={styles.validImageTypes}>
                          Valid Image Types: {validImageTypes.join(", ")}
                        </div>
                      )}
                      {errorMessage && (
                        <div className={styles.errorMessage}>
                          {errorMessage}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DropZone>
            </LegacyCard>
          </div>

          <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label className={styles.labelStyle}>Rating Rate</label>
              <TextField
                type="number"
                value={ratingRate}
                onChange={handleRatingRateChange}
                autoComplete="off"
              />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label className={styles.labelStyle}>Rating Count</label>
              <TextField
                type="number"
                value={ratingCount}
                onChange={handleRatingCountChange}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Category, Inventory */}
          <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label className={styles.labelStyle}>Category</label>
              <Select
                label=""
                options={[
                  { label: "Category 1", value: "category1" },
                  { label: "Category 2", value: "category2" },
                  // Add more categories as needed
                ]}
                value={category}
                onChange={handleCategoryChange}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label className={styles.labelStyle}>Inventory</label>
              <TextField
                type="number"
                value={inventory}
                onChange={handleInventoryChange}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Type, Vendor */}
          <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label className={styles.labelStyle}>Type</label>
              <Select
                label=""
                options={[
                  { label: "Type 1", value: "type1" },
                  { label: "Type 2", value: "type2" },
                  // Add more types as needed
                ]}
                value={type}
                onChange={handleTypeChange}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label className={styles.labelStyle}>Vendor</label>
              <Select
                label=""
                options={[
                  { label: "Vendor 1", value: "vendor1" },
                  { label: "Vendor 2", value: "vendor2" },
                  // Add more vendors as needed
                ]}
                value={vendor}
                onChange={handleVendorChange}
              />
            </div>
          </div>
          {/* Price */}
          <div style={{ marginTop: "16px" }}>
            <LegacyStack>
              <LegacyStack.Item fill>
                <label style={{ fontWeight: "600", fontSize: "15px" }}>
                  Product Price :
                </label>
              </LegacyStack.Item>

              <TextField
                label="Price"
                labelHidden
                value={priceFieldValue}
                onChange={handlePriceFieldChange}
                autoComplete="off"
                align="right"
              />
            </LegacyStack>
          </div>
        </FormLayout>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} />
    </AppProvider>
  );
};

export default AddProductModal;
