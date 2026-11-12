/* =========================================================
   THE POTTERY SHOP: piece list
   One entry per sconce. To add a piece, copy a block and edit it.
   status: "available" | "reserved" | "sold"
   (Once Stripe + the hold service are wired up, status will come
   from the server instead of this file.)
   Everything below is SAMPLE content for the staging preview.
   ========================================================= */
window.SHOP = {
  drop: {
    number: "01",
    name: "First firing",
    note: "Ten wall sconces, glazed and fired this fall.",
    shipsTo: "US & Canada",
    holdMinutes: 10,
    shipping: [
      { country: "United States", code: "US", price: 18 },
      { country: "Canada", code: "CA", price: 38 }
    ]
  },

  pieces: [
    { no: "01", name: "Arch, oatmeal",   shape: "arch",  clay: "#d9c7a8", glaze: "#efe6d2", drip: "#b89a6e", glazeName: "Oatmeal satin",     clayName: "speckled buff stoneware", h: 11,   w: 6.5, price: 185, status: "available" },
    { no: "02", name: "Moon, celadon",   shape: "moon",  clay: "#cbb89a", glaze: "#a9c3ad", drip: "#6f927c", glazeName: "Celadon gloss",     clayName: "white stoneware",         h: 9,    w: 9,   price: 210, status: "sold" },
    { no: "03", name: "Shell, rust",     shape: "shell", clay: "#b98a6a", glaze: "#b3654a", drip: "#7a3b26", glazeName: "Iron rust",         clayName: "red stoneware",           h: 10,   w: 8,   price: 220, status: "reserved", heldSeconds: 412 },
    { no: "04", name: "Tall, cobalt",    shape: "tall",  clay: "#d4c6b0", glaze: "#3a5bbf", drip: "#1f327a", glazeName: "Cobalt float",      clayName: "speckled buff stoneware", h: 13,   w: 5.5, price: 240, status: "available" },
    { no: "05", name: "Arch, ash",       shape: "arch",  clay: "#c9bba4", glaze: "#c8c3b6", drip: "#8d8677", glazeName: "Wood-ash matte",    clayName: "speckled buff stoneware", h: 11.5, w: 6.5, price: 195, status: "available" },
    { no: "06", name: "Moon, honey",     shape: "moon",  clay: "#cfae84", glaze: "#d9a441", drip: "#9c6a1c", glazeName: "Honey amber",       clayName: "buff stoneware",          h: 8.5,  w: 8.5, price: 200, status: "available" },
    { no: "07", name: "Shell, periwinkle", shape: "shell", clay: "#d6cbb8", glaze: "#80a4ed", drip: "#4d6fc4", glazeName: "Periwinkle satin", clayName: "porcelain",               h: 9.5,  w: 8,   price: 260, status: "sold" },
    { no: "08", name: "Tall, moss",      shape: "tall",  clay: "#bfae90", glaze: "#7d8a5c", drip: "#4e5934", glazeName: "Moss shino",        clayName: "red stoneware",           h: 12.5, w: 5.5, price: 230, status: "available" },
    { no: "09", name: "Arch, plum",      shape: "arch",  clay: "#c7b49b", glaze: "#7b4a63", drip: "#4a2a3b", glazeName: "Plum tenmoku",      clayName: "buff stoneware",          h: 11,   w: 6.5, price: 210, status: "available" },
    { no: "10", name: "Moon, chalk",     shape: "moon",  clay: "#ddd2bf", glaze: "#f4f1ea", drip: "#cfc6b4", glazeName: "Chalk white",       clayName: "porcelain",               h: 9,    w: 9,   price: 225, status: "available" }
  ]
};
