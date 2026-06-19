import { useTranslation } from 'react-i18next';

export const useCategoryTranslation = () => {
  const { t, i18n } = useTranslation();

  const getTranslatedCategory = (category) => {
    if (!category) return null;

    const currentLang = i18n.language; // e.g., 'en' or 'fr'
    
    // Use backend translation if available (nameFr), otherwise try i18n translation file, fallback to original name
    let translatedName = t(`categories.${category.name}`, category.name);
    if (currentLang === 'fr' && category.nameFr) {
      translatedName = category.nameFr;
    }

    return {
      ...category,
      name: translatedName,
      description: category.description,
    };
  };

  return { getTranslatedCategory };
};
