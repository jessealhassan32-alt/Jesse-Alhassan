import { SiteData, CatalogItem } from '../types';

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = [
  { id: "cat-1", name: "VIP Shoots", price: 2500, oldPrice: 3000, category: "studio", photoIds: [] },
  { id: "cat-2", name: "Kannywood Actress Model", price: null, oldPrice: null, category: "studio", photoIds: [] },
  { id: "cat-3", name: "Zoo Garden Shoots", price: 23000, oldPrice: 25000, category: "outdoor", photoIds: [] },
  { id: "cat-4", name: "Street Shoots", price: 25000, oldPrice: 30000, category: "outdoor", photoIds: [] },
  { id: "cat-5", name: "Night Street Shoots", price: 25000, oldPrice: 30000, category: "outdoor", photoIds: [] },
  { id: "cat-6", name: "CEO", price: null, oldPrice: null, category: "studio", photoIds: [] },
  { id: "cat-7", name: "Outdoor Shoots", price: 2500, oldPrice: 3000, category: "outdoor", photoIds: [] },
  { id: "cat-8", name: "Bride Shoots", price: 40000, oldPrice: 45000, category: "events", photoIds: [] },
  { id: "cat-9", name: "Outdoor Shoots (2)", price: 2500, oldPrice: 3000, category: "outdoor", photoIds: [] },
  { id: "cat-10", name: "Home Services, 1 Hour Session", price: 35000, oldPrice: 40000, category: "events", photoIds: [] },
  { id: "cat-11", name: "Home Service", price: 28000, oldPrice: 30000, category: "events", photoIds: [] },
  { id: "cat-12", name: "Kamu Shoots", price: 40000, oldPrice: 45000, category: "events", photoIds: [] },
  { id: "cat-13", name: "Naming Ceremony", price: 30000, oldPrice: 35000, category: "events", photoIds: [] },
  { id: "cat-14", name: "Fashion Beauty Shoots", price: 2500, oldPrice: 3000, category: "studio", photoIds: [] },
  { id: "cat-15", name: "Classic Pack", price: 10000, oldPrice: 14000, category: "studio", photoIds: [] },
  { id: "cat-16", name: "Kamu", price: 45000, oldPrice: 50000, category: "events", photoIds: [] },
  { id: "cat-17", name: "Cocktail Party", price: 40000, oldPrice: 45000, category: "events", photoIds: [] },
  { id: "cat-18", name: "Flyer Design", price: 500, oldPrice: null, category: "design", photoIds: [] },
  { id: "cat-19", name: "Ramadan Shoots", price: 1, oldPrice: null, category: "studio", photoIds: [] },
  { id: "cat-20", name: "Hijab Shoots", price: 2000, oldPrice: 2500, category: "studio", photoIds: [] },
  { id: "cat-21", name: "VIP Shoots (1,800)", price: 1800, oldPrice: 2000, category: "studio", photoIds: [] },
  { id: "cat-22", name: "VIP Shoots (1,800 B)", price: 1800, oldPrice: 2000, category: "studio", photoIds: [] },
  { id: "cat-23", name: "Studio Model's Shoots", price: 2500, oldPrice: 3000, category: "studio", photoIds: [] },
  { id: "cat-24", name: "Cultural Clothes Shoots", price: 1500, oldPrice: 2000, category: "studio", photoIds: [] },
  { id: "cat-25", name: "VIP Shoots (2,000)", price: 2000, oldPrice: 2500, category: "studio", photoIds: [] },
  { id: "cat-26", name: "Graduation Shoots", price: 2000, oldPrice: null, category: "studio", photoIds: [] },
  { id: "cat-27", name: "Studio Portrait", price: 2000, oldPrice: null, category: "studio", photoIds: [] },
  { id: "cat-28", name: "Studio Shoots", price: 1500, oldPrice: 2000, category: "studio", photoIds: [] },
  { id: "cat-29", name: "Event Shoots", price: 45000, oldPrice: 50000, category: "events", photoIds: [] },
  { id: "cat-30", name: "Logo Designs", price: 500, oldPrice: null, category: "design", photoIds: [] }
];

export const INITIAL_DATA: SiteData = {
  hero: {
    line1: "YOUR STORY.",
    line2: "FRAMED.",
    description:
      "Professional photography for people, brands, products and moments worth remembering. Clean visuals. Natural emotion. Timeless frames.",
    images: [
      "/src/assets/images/cinematic-hero-portrait.jpg",
      "/src/assets/images/portrait-session.jpg",
      "/src/assets/images/commercial-brand-photography.jpg"
    ]
  },
  portfolio: [
    {
      id: "p1",
      title: "Human Stories",
      category: "Portrait",
      src: "/src/assets/images/portrait-session.jpg",
      description:
        "Studio portraiture exploring raw facial expression, character, and dramatic soft window key lighting.",
      year: "2026",
      client: "Editorial Series",
      aspect: "portrait",
      exif: {
        camera: "Sony A7R V",
        lens: "85mm f/1.4 GM",
        aperture: "f/1.8",
        shutter: "1/250s",
        iso: "100"
      }
    },
    {
      id: "p2",
      title: "Built to Be Seen",
      category: "Brand",
      src: "/src/assets/images/commercial-brand-photography.jpg",
      description:
        "Visual identity and contemporary apparel campaign crafted for high-end lookbooks and digital storefronts.",
      year: "2026",
      client: "Aura Studio",
      aspect: "portrait",
      exif: {
        camera: "Sony A7R V",
        lens: "50mm f/1.2 GM",
        aperture: "f/2.0",
        shutter: "1/400s",
        iso: "125"
      }
    },
    {
      id: "p3",
      title: "Details Matter",
      category: "Product",
      src: "/src/assets/images/product-photography.jpg",
      description:
        "Minimalist luxury product stills capturing glass refraction, natural botanicals, and textured stone surfaces.",
      year: "2026",
      client: "L’Aroma Botanicals",
      aspect: "portrait",
      exif: {
        camera: "Canon EOS R5",
        lens: "100mm f/2.8L Macro",
        aperture: "f/5.6",
        shutter: "1/160s",
        iso: "100"
      }
    },
    {
      id: "p4",
      title: "Moments That Stay",
      category: "Event",
      src: "/src/assets/images/event-coverage.jpg",
      description:
        "Unfiltered documentary wedding and celebration frames with cinematic ambient lighting and pure joy.",
      year: "2026",
      client: "Private Celebration",
      aspect: "portrait",
      exif: {
        camera: "Leica SL2",
        lens: "35mm f/1.4 Summilux",
        aperture: "f/1.4",
        shutter: "1/500s",
        iso: "400"
      }
    },
    {
      id: "p5",
      title: "Silhouette & Shadow",
      category: "Portrait",
      src: "/src/assets/images/cinematic-hero-portrait.jpg",
      description:
        "High-contrast editorial silhouette study emphasizing form, contemplative posture, and subtle rim illumination.",
      year: "2026",
      client: "Studio Monograph",
      aspect: "landscape",
      exif: {
        camera: "Sony A7R V",
        lens: "85mm f/1.4 GM",
        aperture: "f/1.4",
        shutter: "1/320s",
        iso: "160"
      }
    },
    {
      id: "p6",
      title: "The Craft in Motion",
      category: "Brand",
      src: "/src/assets/images/photographer-studio-session.jpg",
      description:
        "Behind-the-lens documentary storytelling of artisans, makers, and creative visionaries at work.",
      year: "2026",
      client: "Atelier Series",
      aspect: "portrait",
      exif: {
        camera: "Fujifilm GFX 100 II",
        lens: "63mm f/2.8",
        aperture: "f/2.8",
        shutter: "1/200s",
        iso: "200"
      }
    }
  ],
  services: [
    {
      id: "s1",
      title: "Portraits",
      text: "Personal portraits, professional headshots, creative sessions and lifestyle photography that keeps you looking like yourself.",
      iconName: "user",
      timeline: "2-4 days turnaround",
      deliverables: ["High-res retouched stills", "Multiple lighting setups", "Print release"]
    },
    {
      id: "s2",
      title: "Products",
      text: "Clean, detailed product photography designed for brands, businesses, social media and online stores.",
      iconName: "box",
      timeline: "3-5 days turnaround",
      deliverables: ["Macro texture detail", "E-commerce white/color backdrops", "Hero lifestyle staging"]
    },
    {
      id: "s3",
      title: "Events",
      text: "Weddings, celebrations, launches and special occasions captured naturally so the important moments do not disappear.",
      iconName: "camera",
      timeline: "5-7 days turnaround",
      deliverables: ["Documentary candid coverage", "Full digital gallery", "Same-week sneak peeks"]
    }
  ],
  packages: [
    {
      id: "pkg-portrait",
      name: "The Signature Portrait",
      subtitle: "For individuals, creatives & executive personal branding",
      price: "₦3,000",
      duration: "90 Minutes",
      deliverables: [
        "20 high-resolution editorial retouched images",
        "Up to 2 outfit changes & backdrops",
        "Private password-protected digital gallery",
        "Commercial & social media license included",
        "4 business days digital delivery"
      ],
      turnaround: "4 Days"
    },
    {
      id: "pkg-commercial",
      name: "Brand & Commercial Visuals",
      subtitle: "For product lines, fashion lookbooks & digital marketing campaigns",
      price: "₦2,500",
      duration: "Half-Day Session (4 hrs)",
      deliverables: [
        "50+ curated & color-graded campaign assets",
        "Creative art direction & moodboard consultation",
        "Product styling & environmental props",
        "Social media formats (1:1, 4:5, 9:16 vertical cuts)",
        "Priority 72-hour turnaround"
      ],
      turnaround: "3 Days",
      recommended: true
    },
    {
      id: "pkg-event",
      name: "Events & Narrative",
      subtitle: "For weddings, galas, cultural celebrations & brand launches",
      price: "₦3,000",
      duration: "Full-Day Coverage (8 hrs)",
      deliverables: [
        "Comprehensive documentary event coverage",
        "350+ fully color-graded images",
        "24-hour sneak peek preview (15 photos)",
        "High-resolution print archive + online portal",
        "Dedicated primary photographer & assistant"
      ],
      turnaround: "7 Days"
    }
  ],
  catalog: INITIAL_CATALOG_ITEMS,
  about: {
    title: "More than *just* a photograph.",
    text: "Small King Photography is built around a simple idea: great photography should feel real.\n\nEvery session is guided, relaxed and focused on honest, timeless images that stand the test of time.\n\nWhether capturing an intimate portrait, launching an artisanal brand line, or documenting once-in-a-lifetime events, our lens is tuned to character, atmosphere, and clean intentional composition.",
    signature: "Aliyu Idris · Founder & Principal Photographer",
    image: "/src/assets/images/photographer-studio-session.jpg",
    stats: [
      { label: "Curated Shoots", value: "350+" },
      { label: "Commercial Campaigns", value: "48+" },
      { label: "Client Satisfaction", value: "100%" },
      { label: "Delivery Standard", value: "48-72h" }
    ]
  },
  contact: {
    title: "Let's create *something* together.",
    email: "aliyuidris6505@gmail.com",
    phone: "+234901 622 6828",
    location: "Abuja / Lagos, Nigeria & Worldwide on Assignment",
    instagram: "@smallkingphotography001",
    whatsappCatalog: "https://wa.me/c/2349016226828"
  },
  testimonials: [
    {
      id: "t1",
      clientName: "Amina Bello",
      role: "Creative Director",
      projectType: "Brand Campaign",
      quote:
        "Working with Small King was seamless. The portraits captured something authentic and dignified that our company leadership had never achieved before. Incredible eye for natural light."
    },
    {
      id: "t2",
      clientName: "David O.",
      role: "Founder, Botanica Organics",
      projectType: "Product Visuals",
      quote:
        "Our digital storefront conversion jumped noticeably after refreshing our product stills with Small King's photography. The glass reflections and organic texture were immaculate."
    },
    {
      id: "t3",
      clientName: "Zainab & Tunde",
      role: "Couple",
      projectType: "Wedding Celebration",
      quote:
        "He captured our wedding without ever feeling intrusive. Looking through the gallery feels like reliving every candid laugh and tear. Truly unforgettable frames."
    }
  ]
};
