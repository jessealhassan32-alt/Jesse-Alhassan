import React, { useState } from 'react';
import {
  X,
  Upload,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Download,
  RotateCcw,
  Save,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from 'lucide-react';
import { SiteData, PortfolioItem } from '../types';

interface SiteEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: SiteData;
  onUpdateSiteData: (newData: SiteData) => void;
  onResetToDefaults: () => void;
  onShowToast: (msg: string) => void;
}

export const SiteEditorDrawer: React.FC<SiteEditorDrawerProps> = ({
  isOpen,
  onClose,
  siteData,
  onUpdateSiteData,
  onResetToDefaults,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'portfolio' | 'services' | 'packages' | 'about' | 'contact'>(
    'hero'
  );
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  if (!isOpen) return null;

  // Process and downscale client-uploaded image to avoid memory bloat
  const processImageFile = (file: File, maxDim = 1920): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Failed to decode image'));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(img.src);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Add photos to hero
  const handleHeroImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const newImages = [...siteData.hero.images];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await processImageFile(files[i]);
        newImages.push(dataUrl);
      }
      onUpdateSiteData({
        ...siteData,
        hero: {
          ...siteData.hero,
          images: newImages,
        },
      });
      onShowToast(`Added ${files.length} home photo(s)`);
    } catch {
      onShowToast('Error processing photos');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  // Add new portfolio item
  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsProcessingImage(true);
    try {
      const newItems: PortfolioItem[] = [...siteData.portfolio];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await processImageFile(file);
        const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'New Frame';
        newItems.push({
          id: `p-${Date.now()}-${i}`,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          category: 'Portrait',
          src: dataUrl,
          year: new Date().getFullYear().toString(),
          aspect: 'portrait',
        });
      }
      onUpdateSiteData({
        ...siteData,
        portfolio: newItems,
      });
      onShowToast(`Added ${files.length} portfolio item(s)`);
    } catch {
      onShowToast('Error adding portfolio items');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  // Replace single portfolio image
  const handleReplacePortfolioPhoto = async (index: number, file: File) => {
    setIsProcessingImage(true);
    try {
      const dataUrl = await processImageFile(file);
      const updated = [...siteData.portfolio];
      updated[index] = { ...updated[index], src: dataUrl };
      onUpdateSiteData({ ...siteData, portfolio: updated });
      onShowToast('Photo updated');
    } catch {
      onShowToast('Error replacing photo');
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Reorder portfolio
  const movePortfolioItem = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= siteData.portfolio.length) return;
    const items = [...siteData.portfolio];
    const temp = items[index];
    items[index] = items[newIdx];
    items[newIdx] = temp;
    onUpdateSiteData({ ...siteData, portfolio: items });
  };

  // Remove portfolio item
  const removePortfolioItem = (index: number) => {
    const items = siteData.portfolio.filter((_, i) => i !== index);
    onUpdateSiteData({ ...siteData, portfolio: items });
    onShowToast('Photo removed from portfolio');
  };

  // Replace about photo
  const handleAboutPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingImage(true);
    try {
      const dataUrl = await processImageFile(file);
      onUpdateSiteData({
        ...siteData,
        about: { ...siteData.about, image: dataUrl },
      });
      onShowToast('Photographer studio photo updated');
    } catch {
      onShowToast('Error updating about photo');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  // Export full standalone single-page HTML
  const handleExportHtml = () => {
    const htmlString = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Small King Photography</title>
  <meta name="description" content="Small King Photography creates professional portraits, product photography, event photography and visual stories.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet">
  <style>
    :root { --bg: #090909; --card: #141414; --accent: #d7b98e; --accent-light: #ead5b4; --text: #f5f3ef; --muted: #99958e; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    h1, h2, h3 { font-family: 'Playfair Display', serif; }
    .hero { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .hero h1 { font-size: 4rem; line-height: 1.1; margin-bottom: 20px; }
    .hero h1 em { color: var(--accent-light); font-style: italic; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 30px; }
    .card { background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; padding: 16px; }
    .card img { width: 100%; height: 280px; object-fit: cover; border-radius: 8px; }
    .btn { display: inline-block; background: var(--accent); color: #111; padding: 12px 24px; border-radius: 30px; text-decoration: none; font-weight: 600; margin-top: 20px; }
    .contact-box { background: var(--card); border: 1px solid rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; margin-top: 60px; }
  </style>
</head>
<body>
  <div class="container hero">
    <div style="color:var(--accent);letter-spacing:3px;font-size:12px;margin-bottom:16px;">SMALL KING PHOTOGRAPHY</div>
    <h1>${siteData.hero.line1} <em>${siteData.hero.line2}</em></h1>
    <p style="max-width:600px;color:var(--muted);font-size:1.1rem;">${siteData.hero.description}</p>
    <div><a href="#contact" class="btn">Book a Shoot</a></div>
  </div>
  <div class="container">
    <h2>Selected Work</h2>
    <div class="grid">
      ${siteData.portfolio
        .map(
          (p) => `<div class="card">
            <img src="${p.src}" alt="${p.title}" loading="lazy">
            <div style="margin-top:12px;">
              <small style="color:var(--accent);text-transform:uppercase;">${p.category}</small>
              <h3 style="margin-top:4px;">${p.title}</h3>
            </div>
          </div>`
        )
        .join('')}
    </div>
  </div>
  <div class="container" style="margin-top:40px;">
    <h2>Session Packages (Naira)</h2>
    <div class="grid">
      ${siteData.packages
        .map(
          (pkg) => `<div class="card">
            <h3 style="color:var(--accent-light);">${pkg.name}</h3>
            <p style="font-size:1.5rem;font-weight:600;margin:10px 0;color:var(--text);">${pkg.price}</p>
            <p style="color:var(--muted);font-size:0.9rem;">${pkg.subtitle} · ${pkg.duration}</p>
            <ul style="margin-top:12px;padding-left:18px;color:var(--text);font-size:0.85rem;">
              ${pkg.deliverables.map((d) => `<li>${d}</li>`).join('')}
            </ul>
          </div>`
        )
        .join('')}
    </div>
  </div>
  <div class="container contact-box" id="contact">
    <h2>${siteData.contact.title.replace(/\*/g, '')}</h2>
    <p style="margin: 16px 0; color:var(--muted)">Email: <a href="mailto:${siteData.contact.email}" style="color:var(--accent)">${siteData.contact.email}</a></p>
    <p style="margin: 8px 0; color:var(--muted)">Phone: ${siteData.contact.phone}</p>
    <p style="margin: 8px 0; color:var(--muted)">Location: ${siteData.contact.location}</p>
    <p style="margin: 8px 0; color:var(--muted)">Instagram: ${siteData.contact.instagram}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'small-king-photography.html';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Standalone HTML website downloaded!');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Website Manager"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#141414] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-[#f5f3ef] font-medium">Website Manager</h2>
            <p className="text-xs text-[#99958e] mt-0.5">Live customize site content & photos</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#d7b98e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-4 bg-[#101010] overflow-x-auto">
          {(['hero', 'portfolio', 'services', 'packages', 'about', 'contact'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#ead5b4] border-b-2 border-[#d7b98e]'
                  : 'text-[#99958e] hover:text-[#f5f3ef]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isProcessingImage && (
            <div className="p-3 bg-[#d7b98e]/10 border border-[#d7b98e]/30 rounded-xl text-xs text-[#ead5b4] flex items-center gap-2">
              <Upload className="w-4 h-4 animate-bounce" />
              <span>Optimizing and processing image...</span>
            </div>
          )}

          {/* TAB: HERO */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Headline Line 1
                </label>
                <input
                  type="text"
                  value={siteData.hero.line1}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      hero: { ...siteData.hero, line1: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Headline Line 2 (Italic Accent)
                </label>
                <input
                  type="text"
                  value={siteData.hero.line2}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      hero: { ...siteData.hero, line2: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={siteData.hero.description}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      hero: { ...siteData.hero, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e] resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider text-[#99958e] font-medium">
                    Hero Slideshow Photos ({siteData.hero.images.length})
                  </label>
                  <label className="cursor-pointer text-[11px] uppercase tracking-wider font-semibold text-[#d7b98e] hover:text-[#ead5b4] flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleHeroImagesUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {siteData.hero.images.map((src, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg overflow-hidden aspect-video bg-black/40 border border-white/10 group"
                    >
                      <img src={src} alt="Hero slide" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          const updated = siteData.hero.images.filter((_, idx) => idx !== i);
                          onUpdateSiteData({
                            ...siteData,
                            hero: { ...siteData.hero, images: updated },
                          });
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-950/80 text-red-200 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs text-[#99958e]">
                  {siteData.portfolio.length} Total Photographs
                </span>
                <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#d7b98e] text-[#111] hover:bg-[#ead5b4] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePortfolioUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-3">
                {siteData.portfolio.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#0d0d0d] border border-white/10 rounded-xl space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded-lg bg-black/50 border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...siteData.portfolio];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            onUpdateSiteData({ ...siteData, portfolio: updated });
                          }}
                          className="w-full bg-transparent text-xs font-semibold text-[#f5f3ef] border-b border-transparent focus:border-[#d7b98e] focus:outline-none"
                        />
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const updated = [...siteData.portfolio];
                            updated[idx] = {
                              ...updated[idx],
                              category: e.target.value as PortfolioItem['category'],
                            };
                            onUpdateSiteData({ ...siteData, portfolio: updated });
                          }}
                          className="mt-1 bg-black/40 text-[11px] text-[#ead5b4] rounded px-1.5 py-0.5 border border-white/10 focus:outline-none"
                        >
                          <option value="Portrait">Portrait</option>
                          <option value="Brand">Brand</option>
                          <option value="Product">Product</option>
                          <option value="Event">Event</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => movePortfolioItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-[#99958e] hover:text-[#f5f3ef] disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => movePortfolioItem(idx, 'down')}
                          disabled={idx === siteData.portfolio.length - 1}
                          className="p-1 text-[#99958e] hover:text-[#f5f3ef] disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removePortfolioItem(idx)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#99958e] hover:text-[#d7b98e] cursor-pointer">
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleReplacePortfolioPhoto(idx, f);
                          }}
                        />
                      </label>
                      <span className="text-[10px] text-[#555] font-mono">#{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {siteData.services.map((svc, i) => (
                <div key={svc.id || i} className="p-3 bg-[#0d0d0d] border border-white/10 rounded-xl space-y-2">
                  <label className="block text-[10px] uppercase tracking-wider text-[#d7b98e] font-semibold">
                    Service 0{i + 1} Title
                  </label>
                  <input
                    type="text"
                    value={svc.title}
                    onChange={(e) => {
                      const updated = [...siteData.services];
                      updated[i] = { ...updated[i], title: e.target.value };
                      onUpdateSiteData({ ...siteData, services: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                  />
                  <textarea
                    rows={2}
                    value={svc.text}
                    onChange={(e) => {
                      const updated = [...siteData.services];
                      updated[i] = { ...updated[i], text: e.target.value };
                      onUpdateSiteData({ ...siteData, services: updated });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e] resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB: PACKAGES (NAIRA PRICING) */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#d7b98e]/10 border border-[#d7b98e]/20 rounded-xl text-xs text-[#ead5b4]">
                Pricing is displayed in Nigerian Naira (₦). You can adjust package rates and session details below.
              </div>

              {siteData.packages.map((pkg, i) => (
                <div key={pkg.id || i} className="p-3 bg-[#0d0d0d] border border-white/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f5f3ef]">{pkg.name}</span>
                    <span className="text-xs font-mono text-[#d7b98e]">{pkg.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#99958e] mb-1">
                        Price (in ₦)
                      </label>
                      <input
                        type="text"
                        value={pkg.price}
                        placeholder="₦..."
                        onChange={(e) => {
                          const updated = [...siteData.packages];
                          updated[i] = { ...updated[i], price: e.target.value };
                          onUpdateSiteData({ ...siteData, packages: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#99958e] mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={pkg.duration}
                        onChange={(e) => {
                          const updated = [...siteData.packages];
                          updated[i] = { ...updated[i], duration: e.target.value };
                          onUpdateSiteData({ ...siteData, packages: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#99958e] mb-1">
                      Target Audience / Subtitle
                    </label>
                    <input
                      type="text"
                      value={pkg.subtitle}
                      onChange={(e) => {
                        const updated = [...siteData.packages];
                        updated[i] = { ...updated[i], subtitle: e.target.value };
                        onUpdateSiteData({ ...siteData, packages: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#99958e] mb-1">
                      Delivery Turnaround
                    </label>
                    <input
                      type="text"
                      value={pkg.turnaround}
                      onChange={(e) => {
                        const updated = [...siteData.packages];
                        updated[i] = { ...updated[i], turnaround: e.target.value };
                        onUpdateSiteData({ ...siteData, packages: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  About Section Title (Use *word* for accent)
                </label>
                <input
                  type="text"
                  value={siteData.about.title}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      about: { ...siteData.about, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Narrative Bio
                </label>
                <textarea
                  rows={4}
                  value={siteData.about.text}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      about: { ...siteData.about, text: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Signature Line
                </label>
                <input
                  type="text"
                  value={siteData.about.signature}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      about: { ...siteData.about, signature: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Photographer Studio Photo
                </label>
                <div className="flex items-center gap-3">
                  {siteData.about.image && (
                    <img
                      src={siteData.about.image}
                      alt="About"
                      className="w-16 h-16 object-cover rounded-lg border border-white/10"
                    />
                  )}
                  <label className="cursor-pointer px-4 py-2 rounded-lg text-xs font-medium border border-white/15 bg-white/5 text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#ead5b4] flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAboutPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Contact Heading
                </label>
                <input
                  type="text"
                  value={siteData.contact.title}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      contact: { ...siteData.contact, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={siteData.contact.email}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      contact: { ...siteData.contact, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={siteData.contact.phone}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      contact: { ...siteData.contact, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Location
                </label>
                <input
                  type="text"
                  value={siteData.contact.location}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      contact: { ...siteData.contact, location: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={siteData.contact.instagram}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      contact: { ...siteData.contact, instagram: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#99958e] mb-1 font-medium">
                  WhatsApp Catalog URL
                </label>
                <input
                  type="text"
                  placeholder="https://wa.me/c/..."
                  value={siteData.contact.whatsappCatalog || ''}
                  onChange={(e) =>
                    onUpdateSiteData({
                      ...siteData,
                      contact: { ...siteData.contact, whatsappCatalog: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/10 text-sm text-[#f5f3ef] focus:outline-none focus:border-[#d7b98e]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#101010] space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportHtml}
              className="flex-1 py-2.5 rounded-lg text-xs font-medium border border-white/15 text-[#f5f3ef] hover:border-[#d7b98e] hover:text-[#ead5b4] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export HTML File</span>
            </button>

            <button
              onClick={onResetToDefaults}
              className="px-3 py-2.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-500/20 flex items-center gap-1 transition-colors"
              title="Reset all modifications back to original settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <button
            onClick={() => {
              onShowToast('Changes saved to your browser session!');
              onClose();
            }}
            className="w-full py-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
