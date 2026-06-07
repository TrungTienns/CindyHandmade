import { useTranslation } from 'react-i18next';

const EXCHANGE_RATE_VND_TO_USD = 25400;

export const useCurrency = () => {
  const { i18n } = useTranslation();

  const formatPrice = vndPrice => {
    if (vndPrice === undefined || vndPrice === null) return '';

    // Convert to number in case it's a string
    const price = Number(vndPrice);

    if (i18n.language === 'fr') {
      // Tiếng Pháp -> Đổi sang USD
      const usdPrice = price / EXCHANGE_RATE_VND_TO_USD;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usdPrice);
    } else {
      // Tiếng Anh (mặc định) -> Hiển thị VNĐ
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    }
  };

  return { formatPrice };
};
