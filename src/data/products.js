import { PRICES } from "./prices";

export const PRODUCTS = [
  // --- SLIDES ---
  {
    id: "volcano19",
    name: "19ft Volcano",
    filename: "19-ft-Volcano.png",
    category: "slide",
    type: "water_slide",
    heightFt: 19,
    minAge: 7,
    maxAge: 15,
    idealGuests: "up to 10–12 kids at a time",
    dryPrice: PRICES.volcano19.dry,
    wetPrice: PRICES.volcano19.wet,
    dimensions: "35ft L x 13ft W x 19ft H",
    spaceNeeded: "40ft L x 17ft W (flat, clear space)",
    description: "A huge, fiery slide for thrill seekers. Great for older kids, school events, and big backyards.",
    bestFor: ["older kids", "thrill-seekers", "large backyards", "summer parties"],
    tags: ["volcano", "tall", "water", "dry", "big yard", "high energy"]
  },
  {
    id: "funSplash15",
    name: "15ft Fun Splash",
    filename: "15ftCoolBlue.png",
    category: "slide",
    type: "water_slide",
    heightFt: 15,
    minAge: 4,
    maxAge: 12,
    idealGuests: "up to 8 kids at a time",
    dryPrice: PRICES.funSplash15.dry,
    wetPrice: PRICES.funSplash15.wet,
    dimensions: "28ft L x 11ft W x 15ft H",
    spaceNeeded: "32ft L x 15ft W (flat, clear space)",
    description: "A friendly-size slide that’s perfect for younger kids and medium backyards.",
    bestFor: ["younger kids", "birthday parties", "medium backyards"],
    tags: ["fun", "splash", "water", "younger kids", "medium yard"]
  },
  {
    id: "rainbowRush18",
    name: "18ft Rainbow Rush",
    filename: "18ft-Rainbow-Rush.png",
    category: "slide",
    type: "water_slide",
    heightFt: 18,
    minAge: 6,
    maxAge: 14,
    dryPrice: PRICES.rainbowRush18.dry,
    wetPrice: PRICES.rainbowRush18.wet,
    dimensions: "32ft L x 12ft W x 18ft H",
    description: "A bright, colorful slide that’s a total hit at any party.",
    bestFor: ["mixed ages", "birthday parties", "summer events"],
    tags: ["rainbow", "water", "colorful", "big kids"]
  },

  // --- COMBOS ---
  {
    id: "doubleJumbo",
    name: "Double Jumbo Combo",
    filename: "Double-Jumbo-Combo.png",
    category: "combo",
    type: "bounce_combo",
    minAge: 4,
    maxAge: 13,
    dryPrice: PRICES.doubleJumbo.dry,
    wetPrice: PRICES.doubleJumbo.wet,
    dimensions: "28ft L x 13ft W x 15ft H",
    description: "A big combo unit with bounce + slide fun.",
    tags: ["combo", "bounce", "slide", "versatile"]
  },
  {
    id: "primaryCombo",
    name: "Primary Combo",
    filename: "PrimaryCombo1.png",
    category: "combo",
    type: "bounce_combo",
    minAge: 3,
    maxAge: 11,
    dryPrice: PRICES.primaryCombo.dry,
    wetPrice: PRICES.primaryCombo.wet,
    description: "Classic primary colors with a bounce area and slide.",
    tags: ["combo", "primary colors", "bounce", "slide"]
  },
  {
    id: "princessCombo",
    name: "Princess Combo",
    filename: "PrincessCombo.png",
    category: "combo",
    type: "bounce_combo",
    minAge: 3,
    maxAge: 11,
    dryPrice: PRICES.princessCombo.dry,
    wetPrice: PRICES.princessCombo.wet,
    description: "A cute princess-themed combo with bounce + slide.",
    tags: ["princess", "combo", "themed", "bounce", "slide"]
  },
  {
    id: "whitePrincess",
    name: "White Princess Castle",
    filename: "WhiteCastle1.png",
    category: "combo",
    type: "bounce_combo",
    minAge: 3,
    maxAge: 11,
    dryPrice: PRICES.whitePrincess.dry,
    wetPrice: PRICES.whitePrincess.wet,
    description: "A modern white princess-style inflatable that looks amazing in photos.",
    tags: ["white", "princess", "aesthetic", "combo"]
  },

  // --- BOUNCE HOUSES ---
  {
    id: "primaryBounce",
    name: "Primary Bounce House",
    filename: "PrimaryBounceHouse1.png",
    category: "bounce_house",
    type: "bounce",
    minAge: 3,
    maxAge: 11,
    dryPrice: PRICES.primaryBounce.dry,
    wetPrice: PRICES.primaryBounce.wet,
    description: "A classic primary-color bounce house. Simple and fun.",
    tags: ["bounce house", "primary colors", "simple"]
  },

  // --- OBSTACLE COURSE ---
  {
    id: "funRunObstacle",
    name: "Fun Run Obstacle Course",
    filename: "Fun-Run-Obstacle-Course.png",
    category: "obstacle",
    type: "obstacle_course",
    minAge: 6,
    maxAge: 15,
    dryPrice: PRICES.funRunObstacle.dry,
    wetPrice: PRICES.funRunObstacle.wet,
    description: "A lively obstacle course where kids can race and climb.",
    tags: ["obstacle", "race", "high energy"]
  },

  // --- ADD-ONS ---
  {
    id: "softPlay",
    name: "Soft Play Package",
    filename: "SoftPlay1.png",
    category: "addon",
    type: "soft_play",
    price: PRICES.softPlay.price,
    description: "A safe, squishy play area perfect for toddlers.",
    tags: ["toddler", "soft play"]
  },
  {
    id: "foamBlaster",
    name: "Foam Blaster",
    filename: "foamblaster.png",
    category: "addon",
    type: "foam",
    price: PRICES.foamBlaster.price,
    description: "A wild foam party add-on that turns your yard into a bubbly wonderland.",
    tags: ["foam", "party", "summer"]
  },
  {
    id: "snowCone",
    name: "Snow Cone Machine",
    filename: "snowcone1.png",
    category: "addon",
    type: "concession",
    price: PRICES.snowCone.price,
    description: "Keep everyone cool and happy with classic snow cones.",
    tags: ["snow cones", "concession", "treat"]
  }
];