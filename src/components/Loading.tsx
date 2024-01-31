import { Frame, Loading } from "@shopify/polaris";
import React from "react";

function InitialLoading() {
  return (
    <div style={{ height: "100px" }}>
      <Frame>
        <Loading />
      </Frame>
    </div>
  );
}

export default InitialLoading;
