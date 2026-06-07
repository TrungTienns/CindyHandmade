import { useTranslation } from 'react-i18next';

export const useProductTranslation = () => {
  const { i18n } = useTranslation();

  const getTranslatedProduct = (product) => {
    if (!product) return null;

    const currentLang = i18n.language; // e.g., 'en' or 'fr'
    const translations = product.translations || {};
    const langData = translations[currentLang] || {};

    return {
      ...product,
      name: langData.name || product.name,
      description: langData.description || product.description,
    };
  };

  return { getTranslatedProduct };
};
