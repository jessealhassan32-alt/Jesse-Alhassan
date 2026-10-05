import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  Download,
  Upload,
  LogOut,
  X,
  MessageCircle,
  Sparkles,
  Camera,
  Layers,
} from 'lucide-react';
import { CatalogItem, CatalogCategory } from '../types';
import { CatalogItemModal } from './CatalogItemModal';
import {
  getPhotosBatch,
  getAllPhotosFromDb,
  importPhotosToDb,
} from '../utils/catalogDb';

interface CatalogProps {
  items: CatalogItem[];
  isOwner: boolean;
  onUpdateCatalog: (items: CatalogItem[]) => void;
  onOpenOwnerLogin: () => void;
  onLogoutOwner: () => void;
  onShowToast: (msg: string) => void;
}

const CATEGORIES: { id: CatalogCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'studio', label: 'Studio & portraits' },
  { id: 'outdoor', label: 'Outdoor & street' },
  { id: 'events', label: 'Weddings & events' },
  { id: 'design', label: 'Design' },
];

export const Catalog: React.FC<CatalogProps> = ({
  items,
  isOwner,
  onUpdateCatalog,
  onOpenOwnerLogin,
  onLogoutOwner,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [coversMap, setCoversMap] = useState<Record<string, string>>({});
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemOldPrice, setNewItemOldPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CatalogItem['category']>('studio');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load cover photos from IndexedDB
  useEffect(() => {
    const coverIds: string[] = [];
    items.forEach((item) => {
      const coverId = item.coverPhotoId || (item.photoIds && item.photoIds[0]);
      if (coverId) coverIds.push(coverId);
    });

    if (coverIds.length === 0) {
      setCoversMap({});
      return;
    }

    getPhotosBatch(coverIds).then((loaded) => {
      setCoversMap(loaded);
    });
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = items.filter((i) => i.category === cat.id).length;
      }
    });
    return counts;
  }, [items]);

  // Update item callback
  const handleUpdateItem = (updated: CatalogItem) => {
    const newItems = items.map((i) => (i.id === updated.id ? updated : i));
    onUpdateCatalog(newItems);
    setSelectedItem(updated);
  };

  // Delete item callback
  const handleDeleteItem = (id: string) => {
    const newItems = items.filter((i) => i.id !== id);
    onUpdateCatalog(newItems);
    setSelectedItem(null);
    onShowToast('Catalog shoot removed');
  };

  // Add new item submit
  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const numPrice = newItemPrice.trim() === '' ? null : parseInt(newItemPrice.replace(/[^0-9]/g, ''), 10);
    const numOldPrice = newItemOldPrice.trim() === '' ? null : parseInt(newItemOldPrice.replace(/[^0-9]/g, ''), 10);

    const newItem: CatalogItem = {
      id: `cat-${Date.now()}`,
      name: newItemName.trim(),
      price: numPrice !== null && !isNaN(numPrice) ? numPrice : null,
      oldPrice: numOldPrice !== null && !isNaN(numOldPrice) ? numOldPrice : null,
      category: newItemCategory,
      photoIds: [],
    };

    onUpdateCatalog([newItem, ...items]);
    setNewItemModalOpen(false);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemOldPrice('');
    onShowToast(`Created new shoot: ${newItem.name}`);
    setSelectedItem(newItem);
  };

  // Export full catalog backup (JSON containing metadata + all IndexedDB photos)
  const handleExportBackup = async () => {
    onShowToast('Generating catalog backup package...');
    try {
      const allPhotos = await getAllPhotosFromDb();
      const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        brand: 'Smallking Photography_001',
        items,
        photos: allPhotos,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smallking-catalog-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('Backup file successfully downloaded!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to export catalog backup');
    }
  };

  // Import catalog backup JSON
  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onShowToast('Reading and importing backup...');
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid backup file structure');
      }

      if (data.photos && typeof data.photos === 'object') {
        await importPhotosToDb(data.photos);
      }

      onUpdateCatalog(data.items);
      onShowToast(`Restored catalog with ${data.items.length} items!`);
    } catch (err) {
      console.error(err);
      onShowToast('Error importing backup. Please verify JSON file format.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <section id="catalog" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#0c0b09] border-t border-[#2f2a1e]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#d6aa4f] mb-3 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" />
              <span>PHOTOGRAPHY &amp; DESIGN CATALOG</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#f3eee3] font-normal tracking-tight text-balance">
              The Catalog
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#a69f8c] max-w-md font-normal leading-relaxed">
            World wide shoots, studio portraiture, weddings, outdoor sessions and graphic designs.
            Tap any shoot to view its photo collection or reserve dates on WhatsApp.
          </p>
        </div>

        {/* Owner Toolbar (when in Owner Mode) */}
        {isOwner && (
          <div className="mb-8 p-4 rounded-2xl bg-[#16140f] border border-[#d6aa4f]/50 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d6aa4f]/20 border border-[#d6aa4f] flex items-center justify-center text-[#d6aa4f]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#f3eee3] tracking-wider uppercase block">
                  Owner Edit Mode Active
                </span>
                <span className="text-[11px] text-[#a69f8c]">
                  Tap any shoot card to upload, remove or make cover photos.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setNewItemModalOpen(true)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#d6aa4f] text-[#1c1506] hover:bg-[#e4bb60] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Shoot</span>
              </button>

              <button
                onClick={handleExportBackup}
                className="px-3 py-2 rounded-lg text-xs font-medium border border-[#2f2a1e] bg-[#0c0b09] text-[#f3eee3] hover:border-[#d6aa4f] hover:text-[#d6aa4f] transition-colors flex items-center gap-1.5"
                title="Export catalog data and photos as a single JSON backup"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup</span>
              </button>

              <label className="cursor-pointer px-3 py-2 rounded-lg text-xs font-medium border border-[#2f2a1e] bg-[#0c0b09] text-[#f3eee3] hover:border-[#d6aa4f] hover:text-[#d6aa4f] transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  ref={fileInputRef}
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>

              <button
                onClick={onLogoutOwner}
                className="px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                title="Exit owner mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        )}

        {/* Search Box & Category Filters */}
        <div className="space-y-4 mb-10">
          {/* Search Box */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a69f8c]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shoots and designs..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#16140f] border border-[#2f2a1e] text-xs sm:text-sm text-[#f3eee3] placeholder-[#a69f8c] focus:outline-none focus:border-[#d6aa4f] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a69f8c] hover:text-[#f3eee3]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#d6aa4f] text-[#1c1506] font-semibold shadow-md shadow-[#d6aa4f]/15'
                      : 'bg-[#16140f] border border-[#2f2a1e] text-[#a69f8c] hover:text-[#f3eee3] hover:border-[#d6aa4f]/40'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-[#1c1506]/20 text-[#1c1506]' : 'bg-black/30 text-[#a69f8c]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 30-Item Responsive Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-[#2f2a1e] p-8 text-[#a69f8c]">
            <p className="text-sm">Nothing matches that search.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs uppercase tracking-wider text-[#d6aa4f] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {filteredItems.map((item) => {
              const coverId = item.coverPhotoId || (item.photoIds && item.photoIds[0]);
              const coverSrc = coverId ? coversMap[coverId] : null;
              const photoCount = item.photoIds ? item.photoIds.length : 0;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group flex flex-col text-left rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa4f]"
                  aria-label={`View ${item.name}`}
                >
                  {/* Cover Photo Container (Aspect 4/5) */}
                  <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#16140f] border border-[#2f2a1e] group-hover:border-[#d6aa4f]/50 transition-colors flex items-center justify-center">
                    {coverSrc ? (
                      <img
                        src={coverSrc}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      /* Gold SK Placeholder */
                      <div className="p-4 text-center flex flex-col items-center justify-center gap-1.5 select-none">
                        <span className="font-display font-medium text-3xl sm:text-4xl text-[#d6aa4f] opacity-75">
                          SK
                        </span>
                        <span className="text-[11px] text-[#a69f8c] font-normal leading-tight">
                          {isOwner ? 'Tap to add photos' : 'Photos coming soon'}
                        </span>
                      </div>
                    )}

                    {/* Photo count badge */}
                    {photoCount > 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-[#f3eee3] tabular-nums">
                        {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
                      </span>
                    )}
                  </div>

                  {/* Name and Pricing details */}
                  <div className="pt-2.5 px-0.5">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#f3eee3] line-clamp-2 group-hover:text-[#d6aa4f] transition-colors leading-snug">
                      {item.name}
                    </h3>

                    <div className="flex flex-wrap items-baseline gap-1.5 mt-1 font-mono tabular-nums text-xs">
                      {item.price !== null ? (
                        <span className="text-[#d6aa4f] font-medium">
                          NGN {item.price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[#a69f8c] text-[11px]">Ask for price</span>
                      )}

                      {item.oldPrice && item.oldPrice > (item.price || 0) && (
                        <span className="text-[#a69f8c] line-through text-[10px]">
                          NGN {item.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Catalog Footer Note */}
        <div className="mt-16 pt-8 border-t border-[#2f2a1e] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a69f8c] text-center sm:text-left">
          <p>
            Looking for something else?{' '}
            <a
              href="https://wa.me/2349016226828?text=Hello%20Smallking%20Photography_001,%20I%20have%20a%20custom%20shoot%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d6aa4f] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Message Smallking Photography_001</span>
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </p>

          {!isOwner && (
            <button
              onClick={onOpenOwnerLogin}
              className="text-[11px] text-[#a69f8c] hover:text-[#d6aa4f] transition-colors underline underline-offset-4"
            >
              Owner login
            </button>
          )}
        </div>
      </div>

      {/* Full-screen Item Gallery Modal */}
      {selectedItem && (
        <CatalogItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          isOwner={isOwner}
          onClose={() => setSelectedItem(null)}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onShowToast={onShowToast}
        />
      )}

      {/* Add New Shoot Modal */}
      {newItemModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add new shoot"
          onClick={(e) => {
            if (e.target === e.currentTarget) setNewItemModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-[#16140f] border border-[#d6aa4f]/40 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setNewItemModalOpen(false)}
              className="absolute top-4 right-4 text-[#a69f8c] hover:text-[#f3eee3]"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display text-xl text-[#f3eee3] font-medium mb-1">
              Add New Catalog Shoot
            </h3>
            <p className="text-xs text-[#a69f8c] mb-5">
              Create a new offering. You can immediately upload photos after creating it.
            </p>

            <form onSubmit={handleCreateNewItem} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a69f8c] mb-1">
                  Shoot Name *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Traditional Wedding Ceremony"
                  className="w-full px-3 py-2 rounded bg-[#0c0b09] border border-[#2f2a1e] text-xs text-[#f3eee3] focus:border-[#d6aa4f] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a69f8c] mb-1">
                    Price (NGN)
                  </label>
                  <input
                    type="text"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="e.g. 35000 (leave empty to ask)"
                    className="w-full px-3 py-2 rounded bg-[#0c0b09] border border-[#2f2a1e] text-xs text-[#f3eee3] focus:border-[#d6aa4f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a69f8c] mb-1">
                    Old Price (NGN)
                  </label>
                  <input
                    type="text"
                    value={newItemOldPrice}
                    onChange={(e) => setNewItemOldPrice(e.target.value)}
                    placeholder="Optional, e.g. 40000"
                    className="w-full px-3 py-2 rounded bg-[#0c0b09] border border-[#2f2a1e] text-xs text-[#f3eee3] focus:border-[#d6aa4f] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a69f8c] mb-1">
                  Category
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) =>
                    setNewItemCategory(e.target.value as CatalogItem['category'])
                  }
                  className="w-full px-3 py-2 rounded bg-[#0c0b09] border border-[#2f2a1e] text-xs text-[#f3eee3] focus:border-[#d6aa4f] focus:outline-none"
                >
                  <option value="studio">Studio & portraits</option>
                  <option value="outdoor">Outdoor & street</option>
                  <option value="events">Weddings & events</option>
                  <option value="design">Design</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewItemModalOpen(false)}
                  className="px-4 py-2 rounded text-xs text-[#a69f8c] hover:text-[#f3eee3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#d6aa4f] text-[#1c1506] text-xs font-semibold uppercase tracking-wider hover:bg-[#e4bb60]"
                >
                  Create Shoot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
