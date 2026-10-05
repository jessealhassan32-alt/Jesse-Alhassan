export type Category = 'All' | 'Portrait' | 'Brand' | 'Product' | 'Event';

export type CatalogCategory = 'all' | 'studio' | 'outdoor' | 'events' | 'design';

export interface CatalogItem {
  id: string;
  name: string;
  price: number | null; // null represents "ask for price"
  oldPrice?: number | null;
  category: 'studio' | 'outdoor' | 'events' | 'design';
  coverPhotoId?: string;
  photoIds: string[];
  description?: string;
}

export interface CameraEXIF {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Portrait' | 'Brand' | 'Product' | 'Event';
  src: string;
  aspect?: 'portrait' | 'landscape' | 'square';
  description?: string;
  year?: string;
  client?: string;
  exif?: CameraEXIF;
}

export interface Service {
  id: string;
  title: string;
  text: string;
  iconName: 'user' | 'box' | 'sparkles' | 'camera' | 'heart' | 'image';
  deliverables?: string[];
  timeline?: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  duration: string;
  deliverables: string[];
  turnaround: string;
  recommended?: boolean;
}

export interface HeroData {
  line1: string;
  line2: string;
  description: string;
  images: string[];
}

export interface AboutData {
  title: string;
  text: string;
  signature: string;
  image: string;
  stats?: { label: string; value: string }[];
}

export interface ContactData {
  title: string;
  email: string;
  phone: string;
  location: string;
  instagram: string;
  whatsappCatalog?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  projectType: string;
  quote: string;
}

export interface BookingInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  shootType: string;
  preferredDate: string;
  location: string;
  visionNotes: string;
  packageId?: string;
  createdAt: string;
}

export interface SiteData {
  hero: HeroData;
  portfolio: PortfolioItem[];
  services: Service[];
  packages: PricingPackage[];
  catalog?: CatalogItem[];
  about: AboutData;
  contact: ContactData;
  testimonials: Testimonial[];
}
