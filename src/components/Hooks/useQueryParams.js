import React, { useState } from 'react';

const getQuery = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

export const getQueryStringValue = (key) => {
  return getQuery().get(key);
};

function useQueryParams(key, defaultVal) {
  const [query1, setQuery] = useState(getQueryStringValue(key) || defaultVal);

  const updateUrl = (newVal) => {
    setQuery(newVal);

    const query = getQuery();

    if (newVal.trim() !== '') {
      query.set(key, newVal);
    } else {
      query.delete(key);
    }

    if (typeof window !== 'undefined') {
      const { protocol, pathname, host } = window.location;
      const newUrl = `${protocol}//${host}${pathname}?${query.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  return [query1, updateUrl];
}

export default useQueryParams;
