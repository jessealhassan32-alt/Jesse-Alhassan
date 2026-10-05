import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Lightbox } from './components/Lightbox';
import { Services } from './components/Services';
import { Catalog } from './components/Catalog';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { BookingModal } from './components/BookingModal';
import { SiteEditorDrawer } from './components/SiteEditorDrawer';
import { Footer } from './components/Footer';
import { INITIAL_DATA, INITIAL_CATALOG_ITEMS } from './data/initialData';
import { SiteData, PortfolioItem, PricingPackage, CatalogItem } from './types';
import { SlidersHorizontal } from 'lucide-react';

const STORAGE_KEY = 'small_king_photography_site_data_v3';
const CATALOG_STORAGE_KEY = 'smallking_catalog_items_v1';

// Map legacy or un-renamed image paths to the new professional descriptive names
const migrateImagePath = (src: string): string => {
  if (!src) return src;
  if (src.includes('hero_cinematic_portrait') || src.includes('screenshot_1')) {
    return '/src/assets/images/cinematic-hero-portrait.jpg';
  }
  if (src.includes('portfolio_editorial_portrait') || src.includes('screenshot_2')) {
    return '/src/assets/images/portrait-session.jpg';
  }
  if (src.includes('portfolio_brand_commercial') || src.includes('screenshot_3')) {
    return '/src/assets/images/commercial-brand-photography.jpg';
  }
  if (src.includes('portfolio_product_minimalist') || src.includes('screenshot_4')) {
    return '/src/assets/images/product-photography.jpg';
  }
  if (src.includes('portfolio_event_celebration') || src.includes('screenshot_5')) {
    return '/src/assets/images/event-coverage.jpg';
  }
  if (src.includes('about_photographer_studio') || src.includes('screenshot_6')) {
    return '/src/assets/images/photographer-studio-session.jpg';
  }
  return src;
};

export default function App() {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('small_king_photography_site_data_v2') ||
        localStorage.getItem('small_king_photography_site_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);

        // Ensure packages are updated to the corrected reasonable rates
        const packages = INITIAL_DATA.packages.map((initialPkg) => {
          const matched = parsed.packages?.find((p: PricingPackage) => p.id === initialPkg.id);
          if (matched) {
            // If the saved price is still in the old millions/hundreds of thousands or dollars, update to new price
            if (matched.price && (matched.price.includes('$') || matched.price.includes('00,000') || matched.price.includes('50,000'))) {
              return { ...matched, price: initialPkg.price };
            }
            return matched;
          }
          return initialPkg;
        });

        // Migrate image paths
        const heroImages = (parsed.hero?.images || INITIAL_DATA.hero.images).map(migrateImagePath);
        const portfolio = (parsed.portfolio || INITIAL_DATA.portfolio).map((item: PortfolioItem) => ({
          ...item,
          src: migrateImagePath(item.src),
        }));
        const aboutImage = migrateImagePath(parsed.about?.image || INITIAL_DATA.about.image);

        return {
          ...INITIAL_DATA,
          ...parsed,
          packages,
          hero: {
            ...INITIAL_DATA.hero,
            ...parsed.hero,
            images: heroImages,
          },
          portfolio,
          about: {
            ...INITIAL_DATA.about,
            ...parsed.about,
            image: aboutImage,
          },
          contact: { ...INITIAL_DATA.contact, ...parsed.contact },
        };
      }
    } catch {
      // Fallback on error
    }
    return INITIAL_DATA;
  });

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Booking Modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);

  // Catalog items state stored in localStorage (photos are in IndexedDB)
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem(CATALOG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CATALOG_ITEMS;
  });

  // Owner Mode State
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('smallking_owner_active') === 'true';
    } catch {
      return false;
    }
  });
  const [ownerLoginOpen, setOwnerLoginOpen] = useState(false);

  // Editor Drawer state
  const [editorOpen, setEditorOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist catalogItems changes
  const handleUpdateCatalog = (updated: CatalogItem[]) => {
    setCatalogItems(updated);
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOwnerLoginSuccess = () => {
    setIsOwner(true);
    try {
      sessionStorage.setItem('smallking_owner_active', 'true');
    } catch {}
  };

  const handleLogoutOwner = () => {
    setIsOwner(false);
    try {
      sessionStorage.removeItem('smallking_owner_active');
    } catch {}
    showToast('Owner mode exited');
  };

  // Persist siteData changes
  const handleUpdateSiteData = (newData: SiteData) => {
    setSiteData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch {
      // Ignore quota error if base64 images are very large
    }
  };

  const handleResetToDefaults = () => {
    setSiteData(INITIAL_DATA);
    setCatalogItems(INITIAL_CATALOG_ITEMS);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CATALOG_STORAGE_KEY);
    } catch {}
    showToast('Reset all content back to original defaults.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleSelectPortfolioItem = (_item: PortfolioItem, index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenBooking = () => {
    setSelectedPackage(null);
    setBookingModalOpen(true);
  };

  const handleBookService = (serviceName: string) => {
    // Scroll directly to catalog or open booking
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedPackage(null);
      setBookingModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#f5f3ef] selection:bg-[#d6aa4f] selection:text-[#090909]">
      {/* Navigation Header */}
      <Header
        onOpenBooking={handleOpenBooking}
        onOpenEditor={() => setEditorOpen(true)}
      />

      {/* Main Sections */}
      <main>
        <Hero
          data={siteData.hero}
          onOpenBooking={handleOpenBooking}
          onOpenEditor={() => setEditorOpen(true)}
        />

        <Portfolio
          items={siteData.portfolio}
          onSelectItem={handleSelectPortfolioItem}
        />

        <Services
          services={siteData.services}
          onBookService={handleBookService}
        />

        {/* Replaced Packaging and Investment with the complete Catalog section */}
        <Catalog
          items={catalogItems}
          isOwner={isOwner}
          onUpdateCatalog={handleUpdateCatalog}
          onOpenOwnerLogin={() => setOwnerLoginOpen(true)}
          onLogoutOwner={handleLogoutOwner}
          onShowToast={showToast}
        />

        <About data={siteData.about} />

        <Testimonials testimonials={siteData.testimonials} />

        <ContactSection
          data={siteData.contact}
          onOpenBooking={handleOpenBooking}
          onShowToast={showToast}
        />
      </main>

      {/* Footer */}
      <Footer
        contact={siteData.contact}
        onOpenBooking={handleOpenBooking}
        onOpenEditor={() => setEditorOpen(true)}
        onOpenOwnerLogin={() => setOwnerLoginOpen(true)}
        isOwner={isOwner}
      />

      {/* Owner Login PIN Modal */}
      <OwnerLoginModal
        isOpen={ownerLoginOpen}
        onClose={() => setOwnerLoginOpen(false)}
        onSuccess={handleOwnerLoginSuccess}
        onShowToast={showToast}
      />

      {/* Lightbox Modal */}
      <Lightbox
        items={siteData.portfolio}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      {/* Booking Inquiry Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedPackage(null);
        }}
        selectedPackage={selectedPackage}
        packages={siteData.packages}
        contactEmail={siteData.contact.email}
        onShowToast={showToast}
      />

      {/* Website Manager / Content Customizer Drawer */}
      <SiteEditorDrawer
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        siteData={siteData}
        onUpdateSiteData={handleUpdateSiteData}
        onResetToDefaults={handleResetToDefaults}
        onShowToast={showToast}
      />

      {/* Floating Manager Button on bottom right (as in the original artifact) */}
      <button
        onClick={() => setEditorOpen(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d7b98e] text-[#111111] hover:bg-[#ead5b4] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/80"
        title="Open website manager to edit photos and copy"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Customize Site</span>
      </button>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#f5f3ef] text-[#111111] text-xs font-medium tracking-wide shadow-2xl border border-white/20 animate-fade-in flex items-center gap-2 max-w-sm text-center"
        >
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
