// products.js — catalog data
// Each product has an `image` field pointing to /assets/<sku>.jpg — drop your own
// product photos into the assets/ folder using these exact filenames, and the site
// will pick them up automatically. app.js falls back to the line-art icon if a
// file is missing, so nothing breaks while you're still photographing stock.

const PRODUCTS = [
  {
    sku: "RC-CAR-001",
    name: "Ridgeback 4WD Off-Road Truggy",
    category: "rc-cars",
    categoryLabel: "RC Cars",
    price: 149.99,
    scale: "1:10",
    stock: "in-stock",
    badge: "BEST SELLER",
    image: "assets/RC-CAR-001.jpg",
    specs: ["4WD electric drivetrain", "35+ km/h top speed", "2.4GHz radio, 2 channel", "Waterproof electronics"],
    description: "A shelf favorite for backyard and trail runs. Brushed motor, all-terrain tires, and a tub chassis that shrugs off jumps."
  },
  {
    sku: "RC-CAR-002",
    image: "assets/RC-CAR-002.jpg",
    name: "Vantage GT Drift Series",
    category: "rc-cars",
    categoryLabel: "RC Cars",
    price: 89.99,
    scale: "1:10",
    stock: "in-stock",
    badge: "",
    specs: ["RWD drift-tuned suspension", "Low-grip drift tires included", "Adjustable steering angle", "LED underglow"],
    description: "Tuned for smooth, controllable slides on smooth pavement or a drift mat. Steering geometry adjusted for max drift angle."
  },
  {
    sku: "RC-CAR-003",
    image: "assets/RC-CAR-003.jpg",
    name: "Micro Crawler Pocket Rig",
    category: "rc-cars",
    categoryLabel: "RC Cars",
    price: 34.99,
    scale: "1:24",
    stock: "low-stock",
    badge: "",
    specs: ["Fits in one hand", "Proportional steering", "45 min runtime", "USB-C charging"],
    description: "Desk-sized rock crawler for tight indoor courses. Surprisingly capable articulation for its size."
  },
  {
    sku: "RC-DRN-001",
    image: "assets/RC-DRN-001.jpg",
    name: "Falcon-X FPV Racing Drone Kit",
    category: "rc-drones",
    categoryLabel: "RC Drones",
    price: 219.00,
    scale: "5-inch class",
    stock: "in-stock",
    badge: "NEW",
    specs: ["Analog FPV goggles included", "5-inch prop, racing frame", "GPS return-to-home", "~8 min flight time"],
    description: "Everything needed to start FPV racing in one box: frame, goggles, controller, and two battery packs."
  },
  {
    sku: "RC-DRN-002",
    image: "assets/RC-DRN-002.jpg",
    name: "Hoverline Mini Indoor Drone",
    category: "rc-drones",
    categoryLabel: "RC Drones",
    price: 24.99,
    scale: "Palm-size",
    stock: "in-stock",
    badge: "",
    specs: ["Prop guards included", "One-touch takeoff/land", "Altitude hold", "Beginner-friendly"],
    description: "Safe, stable, and light enough to fly indoors without redecorating the living room."
  },
  {
    sku: "RC-DRN-003",
    image: "assets/RC-DRN-003.jpg",
    name: "Skyline Pro Camera Drone",
    category: "rc-drones",
    categoryLabel: "RC Drones",
    price: 349.00,
    scale: "Foldable",
    stock: "low-stock",
    badge: "",
    specs: ["4K stabilized camera", "25 min flight time", "Obstacle sensing", "Foldable arms, travel case"],
    description: "A capable photography drone for travel and scenic footage, with enough smarts to stay out of trouble."
  },
  {
    sku: "DC-CAR-001",
    image: "assets/DC-CAR-001.jpg",
    name: "'67 Coupe — Classic Diecast",
    category: "diecast-cars",
    categoryLabel: "Diecast Cars",
    price: 12.99,
    scale: "1:64",
    stock: "in-stock",
    badge: "",
    specs: ["Die-cast metal body", "Free-rolling wheels", "Opening hood detail", "Display base included"],
    description: "A pocket-scale classic with real weight in the hand. Part of the ongoing garage-series collection."
  },
  {
    sku: "DC-CAR-002",
    image: "assets/DC-CAR-002.jpg",
    name: "Rally Legend — Group B Livery",
    category: "diecast-cars",
    categoryLabel: "Diecast Cars",
    price: 22.50,
    scale: "1:43",
    stock: "in-stock",
    badge: "COLLECTOR PICK",
    specs: ["Numbered limited livery", "Diecast body + plastic trim", "Rally spec lights molded", "Display case included"],
    description: "Tribute livery from the golden age of rally. Comes case-ready straight out of the pack."
  },
  {
    sku: "DC-CAR-003",
    image: "assets/DC-CAR-003.jpg",
    name: "Street Series Muscle Set (3-pack)",
    category: "diecast-cars",
    categoryLabel: "Diecast Cars",
    price: 29.99,
    scale: "1:64",
    stock: "out-of-stock",
    badge: "",
    specs: ["3 vehicles per set", "Mixed matte and gloss finishes", "Individually blister-packed", "Collector card included"],
    description: "Three classic muscle silhouettes bundled at a set price. Great starter bundle for a new shelf."
  },
  {
    sku: "DC-PLN-001",
    image: "assets/DC-PLN-001.jpg",
    name: "Warbird Squadron — P-51 Replica",
    category: "diecast-planes",
    categoryLabel: "Diecast Planes",
    price: 44.99,
    scale: "1:72",
    stock: "in-stock",
    badge: "",
    specs: ["Diecast metal + plastic parts", "Rotating propeller", "Retractable landing gear", "Display stand included"],
    description: "Detailed livery and panel lining on a metal airframe, stable enough for a desk or shelf display."
  },
  {
    sku: "DC-PLN-002",
    image: "assets/DC-PLN-002.jpg",
    name: "Jetliner Classic — Commercial Series",
    category: "diecast-planes",
    categoryLabel: "Diecast Planes",
    price: 38.00,
    scale: "1:200",
    stock: "in-stock",
    badge: "",
    specs: ["Metal fuselage", "Printed livery detail", "Snap-in display stand", "Collector box packaging"],
    description: "A clean commercial-airline replica sized for a bookshelf row without dominating the space."
  },
  {
    sku: "DC-PLN-003",
    image: "assets/DC-PLN-003.jpg",
    name: "Vintage Biplane — Barnstormer Edition",
    category: "diecast-planes",
    categoryLabel: "Diecast Planes",
    price: 27.50,
    scale: "1:48",
    stock: "low-stock",
    badge: "",
    specs: ["Fabric-texture wing molding", "Diecast engine block", "Hand-painted accents", "Wooden display base"],
    description: "Early-aviation styling with a hand-finished paint pass on the cowling and struts."
  }
];
