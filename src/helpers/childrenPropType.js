import React from 'react';

module.exports = function childrenPropTypes(props, propName) {
  let error;
  let tabsCount = 0;
  let panelsCount = 0;
  const children = props[propName];

  React.Children.forEach(children, (child) => {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/rackt/react-tabs/issues/37
    if (child === null) {
      return;
    }

    if (child.type.displayName === 'TabList') {
      React.Children.forEach(child.props.children, (c) => {
        // null happens when conditionally rendering TabPanel/Tab
        // see https://github.com/rackt/react-tabs/issues/37
        if (c === null) {
          return;
        }

        if (c.type.displayName === 'Tab') {
          tabsCount++;
        } else {
          error = new Error(
            `Expected 'Tab' but found '${c.type.displayName || c.type}'`
          );
        }
      });
    } else if (child.type.displayName === 'TabPanel') {
      panelsCount++;
    } else {
      error = new Error(
        `Expected 'TabList' or 'TabPanel' but found '${child.type.displayName || child.type}'`
      );
    }
  });

  if (tabsCount !== panelsCount) {
    error = new Error(
      "There should be an equal number of 'Tabs' and 'TabPanels'." +
      `Received ${tabsCount} 'Tabs' and ${panelsCount} 'TabPanels'.`
    );
  }

  return error;
};
