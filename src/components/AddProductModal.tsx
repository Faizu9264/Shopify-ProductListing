import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Modal,
  AppProvider,
  FormLayout,
  TextField,
  DropZone,
  LegacyStack,
  Thumbnail,
  Spinner,
  Icon,
} from "@shopify/polaris";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { NoteIcon } from "@shopify/polaris-icons";
import { LegacyCard } from "@shopify/polaris";
import { XCircleIcon } from "@shopify/polaris-icons";
import { ToastContainer, toast } from "react-toastify";
import DOMPurify from "dompurify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/Home.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Checkbox } from "@shopify/polaris";
import { Product } from "@/types/product";
import { useDispatch } from "react-redux";
import { addProduct } from "@/redux/productSlice";
import uploadFileProgress from "@/firebase/uploadFileProgress";
import { Autocomplete } from "@shopify/polaris";
import { Magnifier, GlassMagnifier } from "react-image-magnifiers";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

type AutocompleteOption = {
  title: string;
  options: {
    value: string;
    label: string;
  }[];
};

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const dispatch = useDispatch();

  const categories = useSelector(
    (state: RootState) => state.products.categories
  );
  const vendors = useSelector((state: RootState) => state.products.vendors);
  const inventoryList = useSelector(
    (state: RootState) => state.products.inventory
  );
  const [status, setStatus] = useState<string>("active");
  const types = useSelector((state: RootState) => state.products.Types);
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
  const [defaultCategory] = categories;
  const [defaultInventory] = inventoryList;
  const [defaultType] = types;
  const [defaultVendor] = vendors;
  useEffect(() => {
    setCategory(defaultCategory);
    setInventory(defaultInventory);
    setType(defaultType);
    setVendor(defaultVendor);
  }, [defaultCategory, defaultInventory, defaultType, defaultVendor]);

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
  const handleStatusChange = (status: string) => {
    setStatus(status);
  };

  const handleImageZoom = (index: number) => {
    setZoomedIndex(index);
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
            className={styles.zoomedImage}
            onMouseOver={() => handleImageZoom(index)}
            onMouseOut={() => setZoomedIndex(null)}
          >
            <div style={{ width: "50px", height: "50px" }}></div>
            <Magnifier
              imageSrc={window.URL.createObjectURL(file)}
              // alt={file.name}
              // width={120}
              // height={120}
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

  const handleFormSubmit = async () => {
    if (!newProductTitle) {
      return toast.error("Please enter a product title");
    }

    if (!productDescription) {
      return toast.error("Please enter a product description");
    }

    if (files.length === 0) {
      return toast.error("Please upload at least one image");
    }

    if (!ratingRate) {
      toast.error("Please enter a rating rate");
      return;
    }

    if (!ratingCount) {
      toast.error("Please enter a rating count");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!inventory) {
      toast.error("Please select an inventory");
      return;
    }

    if (!type) {
      toast.error("Please select a type");
      return;
    }

    if (!vendor) {
      toast.error("Please select a vendor");
      return;
    }

    if (!priceFieldValue) {
      toast.error("Please enter a product price");
      return;
    }

    const rating = {
      rate: parseFloat(ratingRate),
      count: parseInt(ratingCount, 10),
    };

    try {
      const uploadedImageUrls = await Promise.all(
        files.map(async (file, index) => {
          const imageUrl = await uploadFileProgress(
            file,
            "products",
            `${Date.now()}_${index}_${file.name}`,
            (progress) => {
              // setProgress(progress);
            }
          );
          return imageUrl;
        })
      );
      const sanitizedDescription = DOMPurify.sanitize(productDescription);

      const cleanedDescription = sanitizedDescription.replace(
        /<\/?[^>]+(>|$)/g,
        ""
      );
      const product: Product = {
        id: Date.now(),
        title: newProductTitle,
        price: parseFloat(priceFieldValue),
        description: cleanedDescription,
        category,
        image: uploadedImageUrls,
        inventory,
        type,
        vendor,
        status,
        rating,
      };

      onSubmit(product);
      setNewProductTitle("");
      setProductDescription("");
      setFiles([]);
      setRatingRate("");
      setRatingCount("");
      setPriceFieldValue("");
      setCategory("");
      setInventory("");
      setType("");
      setVendor("");
      setStatus("active");

      dispatch(addProduct(product));
      setTimeout(() => {
        toast.success("Product added successfully!");
      }, 100);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error adding product. Please try again.");
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    toast.success("Image removed successfully!");
  };

  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
  }));

  const inventoryOptions = inventoryList.map((inventory) => ({
    value: inventory,
    label: inventory,
  }));

  const typeOptions = types.map((type) => ({
    value: type,
    label: type,
  }));

  const vendorOptions = vendors.map((vendor) => ({
    value: vendor,
    label: vendor,
  }));

  const autoCompleteOptions: AutocompleteOption[] = [
    {
      title: "Categories",
      options: categoryOptions,
    },
    {
      title: "Inventory",
      options: inventoryOptions,
    },
    {
      title: "Types",
      options: typeOptions,
    },
    {
      title: "Vendors",
      options: vendorOptions,
    },
  ];

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
          <LegacyCard sectioned>
            <div style={{ marginTop: "16px" }}>
              <label className={styles.labelStyle}>Product Description</label>
              {typeof window !== "undefined" && (
                <ReactQuill
                  theme="snow"
                  value={productDescription}
                  onChange={handleDescriptionChange}
                />
              )}
            </div>
          </LegacyCard>
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
          <LegacyCard sectioned>
            <label className={styles.labelStyle}>Status</label>
            <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
              <Checkbox
                label="Active"
                checked={status === "active"}
                onChange={() => handleStatusChange("active")}
              />
              <Checkbox
                label="Draft"
                checked={status === "draft"}
                onChange={() => handleStatusChange("draft")}
              />
              <Checkbox
                label="Archived"
                checked={status === "archived"}
                onChange={() => handleStatusChange("archived")}
              />
            </div>
          </LegacyCard>
          <LegacyCard sectioned>
            <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <label className={styles.labelStyle}>Rating Rate</label>
                <TextField
                  type="number"
                  value={ratingRate}
                  onChange={handleRatingRateChange}
                  autoComplete="off"
                />
              </div>

              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <label className={styles.labelStyle}>Rating Count</label>
                <TextField
                  type="number"
                  value={ratingCount}
                  onChange={handleRatingCountChange}
                  autoComplete="off"
                />
              </div>
            </div>
          </LegacyCard>
          {/* Category, Inventory */}
          <LegacyCard sectioned>
            <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <label className={styles.labelStyle}>Category</label>
                <Autocomplete
                  options={
                    autoCompleteOptions.find(
                      (option) => option.title === "Categories"
                    )?.options || []
                  }
                  selected={category}
                  onSelect={(selected: string[]) =>
                    setCategory(selected[0] || "")
                  }
                  textField={
                    <TextField
                      label=""
                      value={category}
                      onChange={handleCategoryChange}
                    />
                  }
                />
              </div>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <label className={styles.labelStyle}>Inventory</label>
                <Autocomplete
                  options={
                    autoCompleteOptions.find(
                      (option) => option.title === "Inventory"
                    )?.options || []
                  }
                  selected={inventory}
                  onSelect={(selected: string[]) =>
                    setInventory(selected[0] || "")
                  }
                  textField={
                    <TextField
                      label=""
                      value={inventory as string}
                      onChange={handleInventoryChange}
                    />
                  }
                />
              </div>
            </div>
          </LegacyCard>
          {/* Type, Vendor */}
          <LegacyCard sectioned>
            <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <label className={styles.labelStyle}>Type</label>
                <Autocomplete
                  options={
                    autoCompleteOptions.find(
                      (option) => option.title === "Types"
                    )?.options || []
                  }
                  selected={type}
                  onSelect={(selected: string[]) => setType(selected[0] || "")}
                  textField={
                    <TextField
                      label=""
                      value={type}
                      onChange={handleTypeChange}
                    />
                  }
                />
              </div>
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <label className={styles.labelStyle}>Vendor</label>
                <Autocomplete
                  options={
                    autoCompleteOptions.find(
                      (option) => option.title === "Vendors"
                    )?.options || []
                  }
                  selected={vendor}
                  onSelect={(selected: string[]) =>
                    setVendor(selected[0] || "")
                  }
                  textField={
                    <TextField
                      label=""
                      value={vendor}
                      onChange={handleVendorChange}
                    />
                  }
                />
              </div>
            </div>
          </LegacyCard>
          {/* Price */}
          <div style={{ marginTop: "16px" }}>
            <LegacyStack>
              <LegacyStack.Item fill>
                <label style={{ fontWeight: "600", fontSize: "15px" }}>
                  Product Price :
                </label>
              </LegacyStack.Item>
              <LegacyCard sectioned>
                <TextField
                  label="Price"
                  labelHidden
                  value={priceFieldValue}
                  onChange={handlePriceFieldChange}
                  autoComplete="off"
                  align="right"
                />
              </LegacyCard>
            </LegacyStack>
          </div>
        </FormLayout>
      </Modal>
      <ToastContainer position="top-right" autoClose={3000} />
    </AppProvider>
  );
};

export default AddProductModal;
