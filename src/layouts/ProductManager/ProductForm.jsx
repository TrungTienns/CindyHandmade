import React, { useState, useEffect, useRef, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { createProduct, updateProduct } from '../../services/productService';
import { fetchCategories } from '../../services/categoryService';
import { FiArrowLeft, FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

const ProductForm = ({ initialData, onBack, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    name_fr: initialData?.translations?.fr?.name || '',
    description: initialData?.description || '',
    description_fr: initialData?.translations?.fr?.description || '',
    price: initialData?.price ? String(initialData.price).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '',
    stock: initialData?.stock || '',
    categoryId: initialData?.categoryId || '',
    sizes: initialData?.sizes ? initialData.sizes.join(', ') : '',
  });

  // Ảnh cũ đã có trên server (URL string) — chỉ có khi Edit
  const [existingImages, setExistingImages] = useState(
    initialData?.images?.filter((img) => typeof img === 'string') || []
  );
  // Ảnh mới người dùng vừa chọn (File object)
  const [imageFiles, setImageFiles] = useState([]);

  const [isDragging, setIsDragging] = useState(false);
  const [activePreview, setActivePreview] = useState(null); // { type: 'existing'|'new', idx }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const totalImages = existingImages.length + imageFiles.length;

  const addFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length > 0) {
      setImageFiles((prev) => [...prev, ...validFiles]);
    }
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const rawValue = value.replace(/\D/g, '');
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      setFormData((prev) => ({ ...prev, price: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const inputEl = e.target;
    addFiles(inputEl.files || []);
    setTimeout(() => { inputEl.value = ''; }, 0);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeExistingImage = useCallback((idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    setActivePreview(null);
  }, []);

  const removeNewImage = useCallback((idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setActivePreview(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price.replace(/\./g, ''));
      submitData.append('stock', formData.stock);
      submitData.append('categoryId', formData.categoryId);
      if (formData.sizes.trim()) {
        submitData.append('sizes', formData.sizes);
      }

      const translations = { fr: {} };
      if (formData.name_fr) translations.fr.name = formData.name_fr;
      if (formData.description_fr) translations.fr.description = formData.description_fr;
      if (Object.keys(translations.fr).length > 0) {
        submitData.append('translations', JSON.stringify(translations));
      }

      // Gửi danh sách ảnh cũ muốn GIỮ LẠI — backend merge với ảnh mới upload
      if (existingImages.length > 0) {
        submitData.append('images', JSON.stringify(existingImages));
      }

      // Upload ảnh mới (nếu có)
      if (imageFiles && imageFiles.length > 0) {
        const options = { maxSizeMB: 5, maxWidthOrHeight: 1920, useWebWorker: true };
        for (const file of imageFiles) {
          try {
            const compressedFile = await imageCompression(file, options);
            submitData.append('images', compressedFile, compressedFile.name);
          } catch (err) {
            console.error('Lỗi nén ảnh:', err);
            submitData.append('images', file);
          }
        }
      }

      if (initialData) {
        await updateProduct(initialData.id, submitData);
      } else {
        await createProduct(submitData);
      }

      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm.');
    }
  };

  // Helper render thumbnail dùng chung cho ảnh cũ và ảnh mới
  const renderThumb = (src, label, isCover, isActive, onClickThumb, onRemove, key) => (
    <div
      key={key}
      className={`image-thumb ${isCover ? 'is-cover' : ''} ${isActive ? 'is-active' : ''}`}
      onClick={onClickThumb}
    >
      <img src={src} alt={label} />
      {isCover && <span className="cover-badge">Bìa</span>}
      <button
        type="button"
        className="btn-remove-img"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        title="Xóa ảnh này"
      >
        <FiX size={10} />
      </button>
      <div className="thumb-overlay">
        <span>{label}</span>
      </div>
    </div>
  );

  // Nguồn ảnh đang được xem to
  const getActiveSrc = () => {
    if (!activePreview) return null;
    if (activePreview.type === 'existing') return existingImages[activePreview.idx] || null;
    if (activePreview.type === 'new' && imageFiles[activePreview.idx]) {
      return URL.createObjectURL(imageFiles[activePreview.idx]);
    }
    return null;
  };
  const activeSrc = getActiveSrc();
  const activeLabel = !activePreview ? '' :
    activePreview.type === 'existing'
      ? (activePreview.idx === 0 && imageFiles.length === 0 ? '📌 Ảnh bìa (hiển thị đầu tiên)' : `Ảnh cũ ${activePreview.idx + 1}`)
      : `Ảnh mới ${activePreview.idx + 1}`;

  return (
    <div className="product-form-container">
      <div className="form-header">
        <button className="btn-back" onClick={onBack}>
          <FiArrowLeft size={20} />
        </button>
        <h2>{initialData ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Tên sản phẩm *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nhập tên sản phẩm..." />
          </div>
          <div className="form-group">
            <label>Tên sản phẩm (Tiếng Pháp)</label>
            <input type="text" name="name_fr" value={formData.name_fr} onChange={handleChange} placeholder="Nhập tên sản phẩm bằng tiếng Pháp..." />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Giá (VND) *</label>
            <input type="text" name="price" value={formData.price} onChange={handleChange} required placeholder="0" />
          </div>
          <div className="form-group">
            <label>Số lượng tồn kho (Stock) *</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Danh mục</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* ── Image Uploader ── */}
          <div className="form-group image-uploader-group">
            <label>
              Ảnh sản phẩm
              {totalImages > 0 && (
                <span className="image-count-badge">{totalImages} ảnh</span>
              )}
            </label>

            {/* Drop Zone */}
            <div
              className={`image-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <FiUploadCloud className="upload-icon" />
              <p className="drop-zone-title">Kéo &amp; thả ảnh vào đây</p>
              <p className="drop-zone-sub">hoặc <span>bấm để chọn ảnh</span> từ thiết bị</p>
              <p className="drop-zone-hint">Hỗ trợ: JPG, PNG, WEBP, HEIC · Nhiều ảnh cùng lúc</p>
            </div>

            {/* Preview Grid */}
            {totalImages > 0 && (
              <div className="image-preview-section">
                <div className="preview-header">
                  <span className="preview-title">
                    <FiImage size={14} /> Xem trước ({totalImages} ảnh)
                    {existingImages.length > 0 && imageFiles.length > 0 && (
                      <span className="badge-hint">&nbsp;· {existingImages.length} cũ + {imageFiles.length} mới</span>
                    )}
                  </span>
                  <button
                    type="button"
                    className="btn-clear-all"
                    onClick={() => { setExistingImages([]); setImageFiles([]); setActivePreview(null); }}
                  >
                    <FiX size={12} /> Xóa tất cả
                  </button>
                </div>

                <div className="image-preview-grid">
                  {/* Ảnh cũ (URL từ server) */}
                  {existingImages.map((url, idx) => {
                    const isCover = idx === 0 && imageFiles.length === 0;
                    const isActive = activePreview?.type === 'existing' && activePreview?.idx === idx;
                    return renderThumb(
                      url,
                      isCover ? '📌 Ảnh bìa' : `Ảnh cũ ${idx + 1}`,
                      isCover, isActive,
                      () => setActivePreview(isActive ? null : { type: 'existing', idx }),
                      () => removeExistingImage(idx),
                      `existing-${idx}`
                    );
                  })}
                  {/* Ảnh mới (File object) */}
                  {imageFiles.map((file, idx) => {
                    const globalIdx = existingImages.length + idx;
                    const isCover = globalIdx === 0;
                    const isActive = activePreview?.type === 'new' && activePreview?.idx === idx;
                    const url = URL.createObjectURL(file);
                    return renderThumb(
                      url,
                      isCover ? '📌 Ảnh bìa' : `Ảnh mới ${idx + 1}`,
                      isCover, isActive,
                      () => setActivePreview(isActive ? null : { type: 'new', idx }),
                      () => removeNewImage(idx),
                      `new-${idx}`
                    );
                  })}
                </div>

                {/* Lightbox preview */}
                {activeSrc && (
                  <div className="active-preview-box">
                    <img src={activeSrc} alt="preview-large" />
                    <div className="active-preview-info">
                      <span>{activeLabel}</span>
                      <button
                        type="button"
                        className="btn-remove-active"
                        onClick={() => {
                          if (activePreview.type === 'existing') removeExistingImage(activePreview.idx);
                          else removeNewImage(activePreview.idx);
                        }}
                      >
                        <FiX size={14} /> Xóa ảnh này
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ width: '100%' }}>
            <label>Kích cỡ (Sizes) - Tùy chọn</label>
            <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="Nhập các kích cỡ cách nhau bởi dấu phẩy (VD: S, M, L, XL)..." />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Mô tả chi tiết *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Nhập mô tả sản phẩm..." />
          </div>
          <div className="form-group">
            <label>Mô tả chi tiết (Tiếng Pháp)</label>
            <textarea name="description_fr" value={formData.description_fr} onChange={handleChange} placeholder="Nhập mô tả bằng tiếng Pháp..." />
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Đang tải ảnh và lưu trữ...' : (initialData ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm')}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
