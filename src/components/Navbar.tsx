


import { Text, ButtonGroup, Popover, ActionList, Icon } from '@shopify/polaris';
import React, { useState } from 'react';
import { CaretDownIcon } from '@shopify/polaris-icons';

const Navbar: React.FC = () => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = () => {
    setPopoverActive((popoverActive) => !popoverActive);
  };

  const closePopover = () => {
    setPopoverActive(false);
  };

  const popoverActivator = (
    <ButtonGroup>
      <button onClick={() => console.log('Export clicked')} style={{    padding: "10px 20px", background: 'none', border: 'none',  cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 'bold' ,fontSize:"0.9rem"}}>Export</button>
      <button onClick={() => console.log('Import clicked')} style={{marginRight: '10px', fontWeight: 'bold', background: 'none', border: 'none',   padding: "10px 20px", cursor: 'pointer', display: 'flex', alignItems: 'center' }}>Import</button>
      <button
        onClick={togglePopoverActive}
        style={{marginRight: '10px', background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <span style={{ marginRight: '4px', margin: '0', fontWeight: 'bold' }}>More Options</span>
        <Icon source={CaretDownIcon} />
      </button>
      <button className="Polaris-Button--primary" onClick={() => console.log('Add Product clicked')} style={{backgroundColor: '#008060', color: '#fff',   padding: "10px 20px", fontWeight: 'bold' ,border:'none' ,borderRadius:'4px'}}>
        <span className="polaris-Button__Content" style={{ fontWeight: '400',fontSize: '.875rem' }}>Add Product</span>
      </button>
    </ButtonGroup>
  );

  const options = [
    { content: 'Option A', onAction: () => console.log('Option A clicked') },
    { content: 'Option B', onAction: () => console.log('Option B clicked') },
  ];

  return (

    <div style={{  maxWidth: '100%', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text variant="headingLg" as="p" style={{     fontSize: '23px',fontWeight: '800',margin: '0'}}>
            Products
          </Text>
        </div>
        <div>
          <Popover active={popoverActive} activator={popoverActivator} onClose={closePopover} preferredAlignment="bottom">
            <ActionList items={options}/>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

