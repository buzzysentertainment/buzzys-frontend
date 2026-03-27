// src/components/BuzzyBot/buzzyBrain.js
import { PRODUCTS } from "../../data/products";

// Map product IDs to actual image filenames in /public/images
const PRODUCT_IMAGES = {
  volcano19: "/images/19-ft-Volcano.png",
  funSplash15: "/images/15ftCoolBlue.png",
  rainbowRush18: "/images/18ft-Rainbow-Rush.png",
  doubleJumbo: "/images/Double-Jumbo-Combo.png",
  princessCombo: "/images/PrincessCombo.png",
  whitePrincess: "/images/whitecastle.png",
  funRunObstacle: "/images/Fun-Run-Obstacle-Course.png",
  softPlay: "/images/softplay.png",
  snowCone: "/images/snowcone1.png",
  // If you add more images later, just extend this map
};

function getUserMessages(history) {
  return history.filter((m) => m.from === "user");
}

function filterProductsByKeywords(keywords) {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  return PRODUCTS.filter((product) => {
    const name = product.name?.toLowerCase?.() || "";
    const category = product.category?.toLowerCase?.() || "";
    const tags = (product.tags || []).join(" ").toLowerCase();
    const haystack = `${name} ${category} ${tags}`;
    return lowerKeywords.some((k) => haystack.includes(k));
  });
}

function getProductImage(p) {
  return PRODUCT_IMAGES[p.id] || "";
}

function buildGalleryMessage(products, fallbackText) {
  if (!products || products.length === 0) {
    return {
      from: "buzzy",
      type: "text",
      text: fallbackText,
    };
  }

  return {
    from: "buzzy",
    type: "gallery",
    text: "Here are some great options for you!",
    items: products.slice(0, 6).map((p) => ({
      label: p.name,
      src: getProductImage(p),
    })),
    followup: {
      type: "options",
      text: "Want to see anything else?",
      options: ["View full catalog", "Start over"],
    },
  };
}

export function buzzyBrain(message, history = []) {
  const msg = message.toLowerCase().trim();

  // ---------------------------------------------------------
  // ⭐ GREETING / FIRST CONTACT
  // ---------------------------------------------------------
  if (msg.includes("hello") || msg.includes("hi") || msg === "hey") {
    return {
      from: "buzzy",
      type: "options",
      text: "Hey there! I’m Buzzy. What would you like help with?",
      options: [
        "Help me choose an inflatable",
        "Slides",
        "Bounce Houses",
        "Combos",
        "Soft Play",
        "Show wet slides",
        "Show add-ons",
        "Safety Rules",
        "FAQ",
        "Contact Us",
      ],
    };
  }

  // ---------------------------------------------------------
  // ⭐ THANK YOU
  // ---------------------------------------------------------
  if (msg.includes("thank")) {
    return {
      from: "buzzy",
      type: "options",
      text: "Happy to help! Want to see anything else?",
      options: ["Slides", "Bounce Houses", "Combos", "Soft Play", "View full catalog"],
    };
  }

  // ---------------------------------------------------------
  // ⭐ HELP / RECOMMENDATIONS
  // ---------------------------------------------------------
  if (msg.includes("help") || msg.includes("recommend")) {
    return {
      from: "buzzy",
      type: "options",
      text: "Awesome! What type of inflatable are you thinking about?",
      options: ["Slides", "Bounce Houses", "Combos", "Soft Play"],
    };
  }

  // ---------------------------------------------------------
  // ⭐ SAFETY RULES
  // ---------------------------------------------------------
  if (
    msg.includes("safety") ||
    msg.includes("rules") ||
    msg.includes("safety rules") ||
    msg.includes("safe") ||
    msg.includes("requirements")
  ) {
    return {
      from: "buzzy",
      type: "nav",
      text: "Here are our safety rules!",
      button: "View Safety Rules",
      to: "/safety",
    };
  }

  // ---------------------------------------------------------
  // ⭐ FAQ
  // ---------------------------------------------------------
  if (
    msg.includes("faq") ||
    msg.includes("questions") ||
    msg.includes("policies") ||
    msg.includes("how does it work") ||
    msg.includes("what do i need")
  ) {
    return {
      from: "buzzy",
      type: "nav",
      text: "Here’s our FAQ page — it covers everything you need.",
      button: "Open FAQ",
      to: "/faq",
    };
  }

  // ---------------------------------------------------------
  // ⭐ SOCIAL MEDIA + KIDS IMAGE
  // ---------------------------------------------------------
  if (
    msg.includes("facebook") ||
    msg.includes("instagram") ||
    msg.includes("social") ||
    msg.includes("follow")
  ) {
    return {
      from: "buzzy",
      type: "gallery",
      text: "Come hang out with us on social media!",
      items: [
        { label: "Facebook", src: "/images/social/facebook.png" },
        { label: "Instagram", src: "/images/social/instagram.png" },
        { label: "Our happy jumpers!", src: "/images/kids/kids-playing.jpg" },
      ],
      followup: {
        type: "options",
        text: "Want to see anything else?",
        options: ["Slides", "Bounce Houses", "Combos", "Soft Play"],
      },
    };
  }

  // ---------------------------------------------------------
  // ⭐ KIDS IMAGE TRIGGER
  // ---------------------------------------------------------
  if (msg.includes("kids") || msg.includes("children")) {
    return {
      from: "buzzy",
      type: "image",
      src: "/images/kids/kids-playing.jpg",
      label: "Our happy jumpers!",
    };
  }

  // ---------------------------------------------------------
  // ⭐ CONTACT US
  // ---------------------------------------------------------
  if (msg.includes("contact") || msg.includes("call") || msg.includes("text")) {
    return {
      from: "buzzy",
      type: "nav",
      text: "You can reach us anytime!",
      button: "Contact Us",
      to: "/contact",
    };
  }

  // ---------------------------------------------------------
  // ⭐ SILVER CREEK SPELLING FIX
  // ---------------------------------------------------------
  if (msg.includes("silver greek") || msg.includes("silver creak")) {
    return {
      from: "buzzy",
      type: "text",
      text: "Just a heads up — it's spelled *Silver Creek*!",
    };
  }

  // ---------------------------------------------------------
  // ⭐ CATEGORY HANDLERS
  // ---------------------------------------------------------
  if (msg === "slides") {
    const slides = filterProductsByKeywords(["slide"]);
    return buildGalleryMessage(slides, "I couldn’t find any slides, sorry!");
  }

  if (msg === "bounce houses" || msg === "bounce house") {
    const bouncers = filterProductsByKeywords(["bounce"]);
    return buildGalleryMessage(bouncers, "No bounce houses found!");
  }

  if (msg === "combos") {
    const combos = filterProductsByKeywords(["combo"]);
    return buildGalleryMessage(combos, "No combo units found!");
  }

  if (msg === "soft play") {
    const soft = filterProductsByKeywords(["soft play"]);
    return buildGalleryMessage(soft, "No soft play sets found!");
  }

  // ---------------------------------------------------------
  // ⭐ CATALOG NAVIGATION
  // ---------------------------------------------------------
  if (msg === "view full catalog") {
    return {
      from: "buzzy",
      type: "nav",
      text: "Taking you to the full catalog!",
      button: "Go now",
      to: "/catalog",
    };
  }

  // ---------------------------------------------------------
  // ⭐ WET / DRY PREFERENCES
  // ---------------------------------------------------------
  if (msg.includes("show wet slides") || msg.includes("wet") || msg.includes("water")) {
    const wetSlides = filterProductsByKeywords(["wet", "water", "slide"]);
    return buildGalleryMessage(
      wetSlides,
      "Wet slides and combos are perfect for hot days!"
    );
  }

  if (msg.includes("dry") || msg.includes("indoor")) {
    const dryOptions = filterProductsByKeywords(["dry", "bounce"]);
    return buildGalleryMessage(
      dryOptions,
      "Dry bounce houses and combos are great for indoor or cooler days!"
    );
  }

  // ---------------------------------------------------------
  // ⭐ UNIT-SPECIFIC DEEP LINKS (NAME / FIRST WORD)
  // ---------------------------------------------------------
  for (const product of PRODUCTS) {
    const lowerName = product.name?.toLowerCase?.() || "";
    const firstWord = lowerName.split(" ")[0];
    const slug = product.id; // using id as slug

    if (lowerName && msg.includes(lowerName)) {
      return {
        from: "buzzy",
        type: "nav",
        text: `Here it is:\n${product.name}`,
        button: "View Details",
        to: `/catalog/${slug}`,
      };
    }

    if (firstWord && msg.includes(firstWord)) {
      return {
        from: "buzzy",
        type: "nav",
        text: `Got it! You're looking for ${product.name}.`,
        button: "View Details",
        to: `/catalog/${slug}`,
      };
    }
  }

  // ---------------------------------------------------------
  // ⭐ POPULAR / MORE OPTIONS
  // ---------------------------------------------------------
  if (msg.includes("popular") || msg.includes("more options") || msg.includes("show more")) {
    const popular = filterProductsByKeywords(["slide", "combo", "castle"]);
    return buildGalleryMessage(
      popular,
      "Here are some of our most popular inflatables!"
    );
  }

  // ---------------------------------------------------------
  // ⭐ ADD-ONS
  // ---------------------------------------------------------
  if (
    msg.includes("extra") ||
    msg.includes("add on") ||
    msg.includes("addon") ||
    msg.includes("add-ons") ||
    msg.includes("concession")
  ) {
    return {
      from: "buzzy",
      type: "options",
      text: "Here are some fun add-ons!",
      options: ["Foam Blaster", "Snow Cone Machine", "Soft Play Setup"],
    };
  }

  if (msg.includes("foam blaster")) {
    return {
      from: "buzzy",
      type: "text",
      text: "Our Foam Blaster is perfect for high-energy outdoor fun!",
    };
  }

  if (msg.includes("snow cone")) {
    return {
      from: "buzzy",
      type: "text",
      text: "Snow Cone Machine = instant hero status.",
    };
  }

  if (msg.includes("soft play")) {
    const softPlay = filterProductsByKeywords(["soft play"]);
    return buildGalleryMessage(
      softPlay,
      "Soft play is perfect for littles who need a safe, contained play area."
    );
  }

  // ---------------------------------------------------------
  // ⭐ FALLBACK
  // ---------------------------------------------------------
  return {
    from: "buzzy",
    type: "options",
    text:
      "I can help you find the perfect inflatable!\n" +
      "Tell me what you're looking for, or choose an option below:",
    options: [
      "Slides",
      "Bounce Houses",
      "Combos",
      "Soft Play",
      "Show wet slides",
      "Show add-ons",
      "View full catalog",
      "Safety Rules",
      "FAQ",
      "Contact Us",
    ],
  };
}
