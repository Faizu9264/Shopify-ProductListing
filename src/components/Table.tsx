import {
  ChoiceList,
  LegacyCard,
  LegacyFilters,
  LegacyTabs,
  Badge,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { Product } from "@/types/product";
import EmptyTable from "./EmptyTable";
import { IndexTable } from "@shopify/polaris";
import { Text } from "@shopify/polaris";
import ProductModal from "./ProductModal";

interface ProductIndexTableProps {
  products: Product[];
}
const Table: React.FC<ProductIndexTableProps> = ({ products }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const [vendor, setVendor] = useState<string[] | undefined>(undefined);
  const handleVendorRemove = useCallback(() => setVendor(undefined), []);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [availability, setAvailability] = useState<string[] | undefined>(
    undefined
  );
  const [productType, setProductType] = useState<string[] | undefined>(
    undefined
  );

  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);

  const handleAvailabilityChange = useCallback(
    (value: string[]) => setAvailability(value),
    []
  );
  const handleProductTypeChange = useCallback(
    (value: string[]) => setProductType(value),
    []
  );
  const handleVendorChange = useCallback(
    (value: string[]) => setVendor(value),
    []
  );
  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelectedTab(selectedTabIndex);
  }, []);
  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  );
  const handleAvailabilityRemove = useCallback(
    () => setAvailability(undefined),
    []
  );
  const handleProductTypeRemove = useCallback(
    () => setProductType(undefined),
    []
  );

  const handleQueryValueRemove = useCallback(
    () => setQueryValue(undefined),
    []
  );
  const handleFiltersClearAll = useCallback(() => {
    handleAvailabilityRemove();
    handleVendorRemove();
    handleProductTypeRemove();
    handleQueryValueRemove();
  }, [
    handleAvailabilityRemove,
    handleQueryValueRemove,
    handleProductTypeRemove,
    handleVendorRemove,
  ]);

  const handleProductClick = useCallback((product: Product) => {
    console.log("clicked");
    setSelectedProduct(product);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log("Closing modal");
    setModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const getFilteredProducts = (): Product[] => {
    const filteredByTab = (() => {
      switch (selectedTab) {
        case 0:
          return products;
        case 1:
          return products.filter((product) => product.status === "Active");
        case 2:
          return products.filter((product) => product.status === "Draft");
        case 3:
          return products.filter((product) => product.status === "Archived");
        default:
          return products;
      }
    })();

    const applyFilters = (
      filteredData: Product[],
      filters: string[] | undefined,
      key: keyof Product
    ) => {
      if (filters && filters.length > 0) {
        return filteredData.filter((product) =>
          filters.includes(product[key] as string)
        );
      }
      return filteredData;
    };

    let filteredData = applyFilters(
      filteredByTab,
      availability,
      "availability" as keyof Product
    );
    filteredData = applyFilters(
      filteredData,
      productType,
      "type" as keyof Product
    );
    filteredData = applyFilters(
      filteredData,
      vendor,
      "vendor" as keyof Product
    );

    if (queryValue) {
      filteredData = filteredData.filter((product) =>
        product.title.toLowerCase().includes(queryValue.toLowerCase())
      );
    }

    return filteredData;
  };

  const filteredProducts = getFilteredProducts();

  const filters = [
    {
      key: "availability",
      label: "Purchase Availability",
      filter: (
        <ChoiceList
          title="Availability"
          titleHidden
          choices={[
            { label: "Online Store", value: "Online Store" },
            { label: "Point of Sale", value: "Point of Sale" },
            { label: "Buy Button", value: "Buy Button" },
          ]}
          selected={availability || []}
          onChange={handleAvailabilityChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];
  const filters2 = [
    {
      key: "Product Type",
      label: "Product Type",
      filter: (
        <ChoiceList
          title="Product Type"
          titleHidden
          choices={[
            { label: "T-Shirt", value: "T-Shirt" },
            { label: "Accessory", value: "Accessory" },
            { label: "Gift Card", value: "Gift Card" },
          ]}
          selected={productType || []}
          onChange={handleProductTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  const filters3 = [
    {
      key: "Vendor",
      label: "Vendor",
      filter: (
        <ChoiceList
          title="Vendor"
          titleHidden
          choices={[
            { label: "Company 123", value: "Company 123" },
            { label: "Boring Rock", value: "Boring Rock" },
            { label: "Rustic LTD", value: "Rustic LTD" },
            { label: "partners-demo", value: "partners-demo" },
          ]}
          selected={vendor || []}
          onChange={handleVendorChange}
          allowMultiple
        />
      ),
    },
  ];

  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  const appliedFilters = [];
  if (availability && !isEmpty(availability)) {
    const key = "availability";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, availability),
      onRemove: handleAvailabilityRemove,
    });
  }
  if (productType && !isEmpty(productType)) {
    const key = "Product Type";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, productType),
      onRemove: handleProductTypeRemove,
    });
  }
  if (vendor && !isEmpty(vendor)) {
    const key = "Vendor";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, vendor),
      onRemove: handleVendorRemove,
    });
  }

  const rowMarkup = filteredProducts.map((product, index) => (
    <IndexTable.Row
      key={product.id}
      id={product.id.toString()}
      position={index}
      style={{ padding: "8px 16px", cursor: "pointer" }}
    >
      <IndexTable.Cell>
        <div onClick={() => handleProductClick(product)}>
          <img
            src={product.image}
            alt={product.title}
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div onClick={() => handleProductClick(product)}>
          <Text fontWeight="bold" as="span">
            {truncateText(product.title, 10)}
          </Text>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div onClick={() => handleProductClick(product)}>
          <Badge tone="info">{product.status}</Badge>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell
        spacing="loose"
        style={{ color: "var(--p-text-critical)" }}
      >
        <div onClick={() => handleProductClick(product)}>
          <span
            style={{
              color:
                typeof product.inventory === "number" && product.inventory < 0
                  ? "red"
                  : typeof product.inventory === "string" &&
                    product.inventory === "Inventory not tracked"
                  ? "gray"
                  : "black",
            }}
          >
            {product.inventory}
          </span>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div onClick={() => handleProductClick(product)}>{product.type}</div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div onClick={() => handleProductClick(product)}>{product.vendor}</div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const combinedFilters = [...filters, ...filters2, ...filters3];
  return (
    <div style={{ height: "568px" }}>
      <LegacyCard>
        <LegacyTabs
          tabs={[
            { id: "all-products", content: "All" },
            { id: "active-products", content: "Active" },
            { id: "draft-products", content: "Draft" },
            { id: "archived-products", content: "Archived" },
          ]}
          selected={selectedTab}
          onSelect={handleTabChange}
        >
          <LegacyCard.Section>
            <LegacyFilters
              queryValue={queryValue}
              filters={combinedFilters}
              appliedFilters={appliedFilters}
              onQueryChange={handleFiltersQueryChange}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleFiltersClearAll}
            />
          </LegacyCard.Section>
        </LegacyTabs>

        <LegacyCard.Section>
          {filteredProducts.length > 0 ? (
            <IndexTable
              resourceName={{ singular: "product", plural: "products" }}
              itemCount={filteredProducts.length}
              headings={[
                { title: "" },
                { title: "Product" },
                { title: "Status" },
                { title: "Inventory" },
                { title: "Type" },
                { title: "Vendor" },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
          ) : (
            <EmptyTable />
          )}
        </LegacyCard.Section>
      </LegacyCard>
      {selectedProduct && (
        <ProductModal
          open={modalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </div>
  );

  function disambiguateLabel(key: string, value: string[]): string {
    switch (key) {
      case "availability":
        return value.map((val) => `Available on ${val}`).join(", ");
      case "productType":
        return value.join(", ");
      default:
        return value.toString();
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
};

export default Table;
