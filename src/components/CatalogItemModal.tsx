import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Upload, Trash2, Check, Star, AlertTriangle } from 'lucide-react';
import { CatalogItem } from '../types';
import { CatalogPhotoViewer } from './CatalogPhotoViewer';
import { getPhotosBatch, savePhotoToDb, deletePhotoFromDb, resizeImage } from '../utils/catalogDb';

interface CatalogItemModalProps {
  item: CatalogItem | null;
  isOpen: boolean;
  isOwner: boolean;
  onClose: () => void;
  onUpdateItem: (updated: CatalogItem) => void;
  onDeleteItem: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const CatalogItemModal: React.FC<CatalogItemModalProps> = ({
  item,
  isOpen,
  isOwner,
  onClose,
  onUpdateItem,
  onDeleteItem,
  onShowToast,
}) => {
  const [photosMap, setPhotosMap] = useState<Record<string, string>>({});
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Edit fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [oldPrice, setOldPrice] = useState<string>('');
  const [category, setCategory] = useState<CatalogItem['category']>('studio');

  // Confirmation state for photo deletion: photoId -> boolean
  const [confirmDeletePhotoId, setConfirmDeletePhotoId] = useState<string | null>(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!item || !isOpen) {
      setConfirmDeletePhotoId(null);
      setConfirmDeleteItem(false);
      return;
    }

    setName(item.name);
    setPrice(item.price !== null ? String(item.price) : '');
    setOldPrice(item.oldPrice !== null && item.oldPrice !== undefined ? String(item.oldPrice) : '');
    setCategory(item.category);

    // Fetch photos from IndexedDB
    let isCancelled = false;
    setIsLoadingPhotos(true);

    getPhotosBatch(item.photoIds || []).then((loaded) => {
      if (!isCancelled) {
        setPhotosMap(loaded);
        setIsLoadingPhotos(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [item, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !viewerOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, viewerOpen, onClose]);

  if (!isOpen || !item) return null;

  // Active photos list in order
  const photoIds = item.photoIds || [];
  const photosList = photoIds.map((id) => photosMap[id]).filter(Boolean);

  // Price formatting
  const formattedPrice = item.price !== null ? `NGN ${item.price.toLocaleString()}` : 'Ask for price';
  const discountPercent =
    item.oldPrice && item.price && item.oldPrice > item.price
      ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
      : 0;

  // WhatsApp Booking URL
  const bookingMessage = `Hello Smallking Photography_001, I would like to book ${item.name} (${formattedPrice}). Please share your available dates.`;
  const whatsappUrl = `https://wa.me/2349016226828?text=${encodeURIComponent(bookingMessage)}`;

  // Handle Owner field changes
  const handleSaveChanges = () => {
    const numPrice = price.trim() === '' ? null : parseInt(price.replace(/[^0-9]/g, ''), 10);
    const numOldPrice = oldPrice.trim() === '' ? null : parseInt(oldPrice.replace(/[^0-9]/g, ''), 10);

    const updated: CatalogItem = {
      ...item,
      name: name.trim() || item.name,
      price: numPrice !== null && !isNaN(numPrice) ? numPrice : null,
      oldPrice: numOldPrice !== null && !isNaN(numOldPrice) ? numOldPrice : null,
      category,
    };
    onUpdateItem(updated);
    onShowToast('Catalog item updated');
  };

  // Add multiple photos
  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    onShowToast(`Preparing ${files.length} photo(s)...`);

    try {
      const newPhotoIds: string[] = [...(item.photoIds || [])];
      const newMap: Record<string, string> = { ...photosMap };

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await resizeImage(file, 1100);
        const photoId = `ph_${item.id}_${Date.now()}_${i}`;
        await savePhotoToDb(photoId, dataUrl);
        newPhotoIds.push(photoId);
        newMap[photoId] = dataUrl;
      }

      setPhotosMap(newMap);

      const updated: CatalogItem = {
        ...item,
        photoIds: newPhotoIds,
        coverPhotoId: item.coverPhotoId || newPhotoIds[0],
      };

      onUpdateItem(updated);
      onShowToast(`Added ${files.length} photo(s) to ${item.name}`);
    } catch (err) {
      console.error(err);
      onShowToast('Error saving photos to database');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Make cover photo
  const handleMakeCover = (photoId: string) => {
    const updated: CatalogItem = {
      ...item,
      coverPhotoId: photoId,
    };
    onUpdateItem(updated);
    onShowToast('Cover photo updated');
  };

  // Remove photo with confirmation step
  const handleRemovePhoto = async (photoId: string) => {
    if (confirmDeletePhotoId !== photoId) {
      setConfirmDeletePhotoId(photoId);
      return;
    }

    try {
      await deletePhotoFromDb(photoId);
      const newPhotoIds = (item.photoIds || []).filter((id) => id !== photoId);
      const newCover =
        item.coverPhotoId === photoId ? newPhotoIds[0] || undefined : item.coverPhotoId;

      const newMap = { ...photosMap };
      delete newMap[photoId];
      setPhotosMap(newMap);

      const updated: CatalogItem = {
        ...item,
        photoIds: newPhotoIds,
        coverPhotoId: newCover,
      };

      setConfirmDeletePhotoId(null);
      onUpdateItem(updated);
      onShowToast('Photo removed');
    } catch {
      onShowToast('Failed to remove photo');
    }
  };

  // Delete entire item
  const handleDeleteItem = () => {
    if (!confirmDeleteItem) {
      setConfirmDeleteItem(true);
      return;
    }
    // Delete all photos from IndexedDB
    (item.photoIds || []).forEach((pid) => {
      deletePhotoFromDb(pid).catch(() => {});
    });
    onDeleteItem(item.id);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#0c0b09] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} gallery`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-24">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2f2a1e]">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-[#2f2a1e] bg-[#16140f] text-[#f3eee3] hover:border-[#d6aa4f] hover:text-[#d6aa4f] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa4f]"
              aria-label="Back to catalog"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-right">
              <span className="font-semibold text-xs tracking-[0.22em] text-[#d6aa4f] uppercase block">
                SK Small King
              </span>
              <span className="text-[10px] tracking-[0.28em] text-[#a69f8c] uppercase -mt-0.5 block">
                World wide
              </span>
            </div>
          </div>

          {/* Title & Pricing Block */}
          <div className="pt-6 pb-4">
            <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal text-[#f3eee3] leading-tight mb-3 text-balance">
              {item.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-medium text-[#d6aa4f] font-mono tabular-nums">
                {formattedPrice}
              </span>

              {item.oldPrice && item.oldPrice > (item.price || 0) && (
                <span className="text-sm sm:text-base text-[#a69f8c] line-through font-mono tabular-nums">
                  NGN {item.oldPrice.toLocaleString()}
                </span>
              )}

              {discountPercent > 0 && (
                <span className="bg-[#d6aa4f] text-[#1c1506] px-2.5 py-0.5 rounded text-xs font-bold font-mono">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Action Button: Book this shoot */}
          <div className="py-4 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d6aa4f] text-[#1c1506] hover:bg-[#e4bb60] transition-all hover:scale-[1.02] shadow-lg shadow-[#d6aa4f]/15"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Book this shoot</span>
            </a>

            {isOwner && (
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-medium border border-[#2f2a1e] bg-[#16140f] text-[#f3eee3] hover:border-[#d6aa4f] hover:text-[#d6aa4f] transition-all">
                <Upload className="w-4 h-4 text-[#d6aa4f]" />
                <span>{isUploading ? 'Resizing & Saving...' : 'Add Photos'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUploadPhotos}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Owner Edit Panel */}
          {isOwner && (
            <div className="my-6 p-4 sm:p-5 rounded-xl bg-[#16140f] border border-[#d6aa4f]/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#2f2a1e]">
                <span className="text-xs uppercase tracking-wider text-[#d6aa4f] font-semibold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  <span>Owner Edit Mode</span>
                </span>
                <button
                  onClick={handleDeleteItem}
                  className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                    confirmDeleteItem
                      ? 'bg-red-950 text-red-300 border border-red-500 font-semibold'
                      : 'text-red-400 hover:text-red-300'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{confirmDeleteItem ? 'Confirm Delete Shoot?' : 'Delete Shoot'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a69f8c] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSaveChanges}
                    className="w-full px-3 py-2 rounded bg-[#0c0b09] border border-[#2f2a1e] text-xs text-[#f3eee3] focus:border-[#d6aa4f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a69f8c] mb-1">
                    Price (NGN)
                  </label>
                  <input
                    type="text"
                    value={price}
                    placeholder="e.g. 2500"
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={handleSaveChanges}
                    className="w-full px-3 py-2 rounded bg-[#0c0b09] border border-[#2f2a1e] text-xs text-[#f3eee3] focus:border-[#d6aa4f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a69f8c] mb-1">
                    Old Price (NGN)
                  </label>
                  <input
                    type="text"
                    value={oldPrice}
                    placeholder="Optional, e.g. 3000"
                    onChange={(e) => setOldPrice(e.target.value)}
                    onBlur={handleSaveChanges}
                    className="w-full px-3 py-2 rounded bg-[#0c0b09] border border-[#2f2a1e] text-xs text-[#f3eee3] focus:border-[#d6aa4f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a69f8c] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as CatalogItem['category'];
                      setCategory(newCat);
                      onUpdateItem({ ...item, category: newCat });
                    }}
                    className="w-full px-3 py-2 rounded bg-[#0c0b09] border border-[#2f2a1e] text-xs text-[#f3eee3] focus:border-[#d6aa4f] focus:outline-none"
                  >
                    <option value="studio">Studio & portraits</option>
                    <option value="outdoor">Outdoor & street</option>
                    <option value="events">Weddings & events</option>
                    <option value="design">Design</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Photos Section */}
          <div className="pt-4">
            {isLoadingPhotos ? (
              <div className="py-16 text-center text-xs text-[#a69f8c]">Loading gallery photos...</div>
            ) : photoIds.length === 0 ? (
              /* Placeholder when no photos are uploaded yet */
              <div className="py-20 px-6 rounded-2xl border border-dashed border-[#2f2a1e] bg-[#16140f]/60 text-center flex flex-col items-center justify-center gap-3">
                <span className="font-display font-medium text-4xl sm:text-5xl text-[#d6aa4f] opacity-75">
                  SK
                </span>
                <span className="text-sm text-[#a69f8c] font-medium">Photos coming soon</span>
                {isOwner && (
                  <label className="cursor-pointer mt-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#d6aa4f] text-[#1c1506] hover:bg-[#e4bb60] transition-colors">
                    Add First Photos
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleUploadPhotos}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ) : (
              /* Two-column masonry gallery on phones, 3-column on larger displays */
              <div className="columns-2 sm:columns-3 gap-2.5 sm:gap-3.5 space-y-2.5 sm:space-y-3.5">
                {photoIds.map((pid, idx) => {
                  const src = photosMap[pid];
                  if (!src) return null;
                  const isCover = item.coverPhotoId === pid || (!item.coverPhotoId && idx === 0);
                  const isConfirming = confirmDeletePhotoId === pid;

                  return (
                    <div
                      key={pid}
                      className="break-inside-avoid relative rounded-lg overflow-hidden bg-[#16140f] border border-[#2f2a1e] group"
                    >
                      <img
                        src={src}
                        alt={`${item.name} shoot photo ${idx + 1}`}
                        loading="lazy"
                        onClick={() => {
                          setViewerIndex(idx);
                          setViewerOpen(true);
                        }}
                        className="w-full h-auto object-cover cursor-zoom-in hover:brightness-105 transition-all"
                      />

                      {/* Cover Marker */}
                      {isCover && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#1c1506]/90 border border-[#d6aa4f]/50 text-[10px] font-semibold text-[#d6aa4f]">
                          Cover
                        </div>
                      )}

                      {/* Owner controls on each tile */}
                      {isOwner && (
                        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5 justify-end">
                          {!isCover && (
                            <button
                              onClick={() => handleMakeCover(pid)}
                              className="px-2 py-1 rounded bg-[#0c0b09]/85 text-[10px] text-[#f3eee3] hover:text-[#d6aa4f] border border-[#2f2a1e]"
                            >
                              Make cover
                            </button>
                          )}
                          <button
                            onClick={() => handleRemovePhoto(pid)}
                            className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                              isConfirming
                                ? 'bg-red-950 text-red-200 border-red-500 font-bold'
                                : 'bg-[#0c0b09]/85 text-[#e0705a] border-[#2f2a1e] hover:border-[#e0705a]'
                            }`}
                          >
                            {isConfirming ? 'Tap to confirm' : 'Remove'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Photo Viewer */}
      <CatalogPhotoViewer
        photos={photosList}
        currentIndex={viewerIndex}
        itemName={item.name}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNavigate={(newIdx) => setViewerIndex(newIdx)}
      />
    </>
  );
};
