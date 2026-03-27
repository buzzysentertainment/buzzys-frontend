import { useState } from "react";
import InflatableCard from "../components/InflatableCard";
import { PRICES } from "../data/prices";
import "./Catalog.css";

export default function Catalog({ addToCart }) {
  const inventory = [
    {
      id: "volcano19",
      title: "19' Volcano Slide",
      dry: PRICES.volcano19.dry,
      wet: PRICES.volcano19.wet,
      filename: "19-ft-Volcano.png",
      category: "Slides",
      description: "Feel the heat with our massive 19ft Volcano Slide! Features a steep drop and a splash landing."
    },
	{
      id: "dolphin16",
      title: "16' Dolphin Slide",
      dry: PRICES.dolphin16.dry,
      wet: PRICES.dolphin16.wet,
      filename: "16-ft-Dolphin.png",
      category: "Slides",
      description: "Make a splash with our 16ft Dolphin Slide! Perfect for kids and families, with a fun aquatic theme."
    },

    {
      id: "rainbowRush18",
      title: "18' Rainbow Rush Slide",
      dry: PRICES.rainbowRush18.dry,
      wet: PRICES.rainbowRush18.wet,
      filename: "18ft-Rainbow-Rush.png",
      category: "Slides",
      description: "A vibrant, colorful slide that brings the wow factor to any event."
    },
    {
      id: "funSplash15",
      title: "15' Fun Splash Slide",
      dry: PRICES.funSplash15.dry,
      wet: PRICES.funSplash15.wet,
      filename: "15ftCoolBlue.png",
      category: "Slides",
      description: "The perfect size for smaller yards without sacrificing the big slide fun."
    },
    {
      id: "doubleJumbo",
      title: "Double Jumbo Combo",
      dry: PRICES.doubleJumbo.dry,
      wet: PRICES.doubleJumbo.wet,
      filename: "Double-Jumbo-Combo.png",
      category: "Combos",
      description: "Twice the fun! Features a large bounce area and a double-lane slide."
    },
    {
      id: "primaryCombo",
      title: "Primary Combo",
      dry: PRICES.primaryCombo.dry,
      wet: PRICES.primaryCombo.wet,
      filename: "PrimaryCombo1.png",
      category: "Combos",
      description: "The classic bounce-and-slide experience in bright primary colors."
    },
    {
      id: "princessCombo",
      title: "Princess Combo",
      dry: PRICES.princessCombo.dry,
      wet: PRICES.princessCombo.wet,
      filename: "PrincessCombo.png",
      category: "Combos",
      description: "A royal treat for your little princess, featuring a spacious bounce area."
    },
    {
      id: "whitePrincess",
      title: "White Castle",
      dry: PRICES.whitePrincess.dry,
      wet: PRICES.whitePrincess.wet,
      filename: "WhiteCastle1.png",
      category: "Bounce Houses",
      description: "Elegant and aesthetic. Perfect for weddings or modern birthday looks."
    },
    {
      id: "primaryBounce",
      title: "Primary Bounce House",
      dry: PRICES.primaryBounce.dry,
      wet: PRICES.primaryBounce.wet,
      filename: "PrimaryBounceHouse1.png",
      category: "Bounce Houses",
      description: "The standard for backyard fun! Deep bounce area and safety netting."
    },
    {
      id: "funRunObstacle",
      title: "Fun Run Obstacle Course",
      dry: PRICES.funRunObstacle.dry,
      wet: PRICES.funRunObstacle.wet,
      filename: "Fun-Run-Obstacle-Course.png",
      category: "Obstacle Courses",
      description: "Challenge your friends! Crawl, climb, and slide through this course."
    },
    {
      id: "softPlay",
      title: "Soft Play Setup",
      dry: PRICES.softPlay.price,
      wet: null,
      filename: "SoftPlay1.png",
      category: "Soft Play",
      description: "A safe, gated play zone for the tiniest busy bees. Includes foam blocks and ball pits."
    },
    {
      id: "foamBlaster",
      title: "Foam Party Experience",
      dry: PRICES.foamBlaster.price,
      wet: null,
      filename: "foamblaster1.png",
      category: "Foam Parties",
      description: "Professional-grade foam cannon! Safe, non-toxic, and biodegradable foam."
    },
    {
      id: "snoCone",
      title: "Snow Cone Machine",
      dry: 75,
      wet: null,
      filename: "snocone.png",
      category: "Concessions",
      description: "Keep cool with refreshing shaved ice! Includes syrup and cups."
    },
    {
      id: "birthdayPackage",
      title: "The Buzzy Birthday Package",
      dry: 450,
      wet: null,
      filename: "BirthdayBundle.png",
      category: "Packages",
      description: "The Ultimate Hive Celebration! Includes: 1 Inflatable, 1 Sno Cone Machine, and more."
    }
  ];

  const categories = [
    "All",
    "Slides",
    "Combos",
    "Bounce Houses",
    "Obstacle Courses",
    "Foam Parties",
    "Soft Play",
    "Concessions",
    "Packages",
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="catalog-page">
      <section className="inflatables" style={{ padding: "60px 20px" }}>
        <div className="catalog-header-container">
          <h2>Our Full Inventory</h2>
          <p>Built for Kids. Inspired by Family.</p>
        </div>

        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="card-container">
          {inventory
            .filter((item) =>
              activeCategory === "All" ? true : item.category === activeCategory
            )
            .map((item) => (
              <InflatableCard
                key={item.id}
                item={item}
                onBook={(selection) =>
                  addToCart({
                    ...item,
                    title: item.title,
                    price: selection.price,
                    mode: selection.mode,
                    image: `/images/${item.filename}`,
                    selectedColor: selection.selectedColor,
                    extraHour: selection.extraHour
                  })
                }
              />
            ))}
        </div>
      </section>
    </div>
  );
}