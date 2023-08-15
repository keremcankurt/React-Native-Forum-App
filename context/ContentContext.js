import React, { createContext, useContext, useState } from 'react';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [contents, setContents] = useState(null);

  return (
    <ContentContext.Provider value={{ contents, setContents }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContents = () => {
  return useContext(ContentContext);
};
