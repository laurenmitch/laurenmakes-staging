/* =========================================================
   THE POTTERY SHOP: piece list
   One entry per sconce. To add a piece, copy a block and edit it.
   status: "available" | "reserved" | "sold"
   (Once Stripe + the hold service are wired up, status will come
   from the server instead of this file.)
   Everything below is SAMPLE content for the staging preview.
   note: a line or two in my own words about that piece.
   pair: true = two matching sconces sold together; price is per sconce, total shows doubled.
   ========================================================= */
window.SHOP = {
  drop: {
    number: "01",
    name: "Star-shaped sconce drop",
    note: "Ten plug-in star sconces.",
    shipsTo: "US & Canada",
    holdMinutes: 10,
    // Waitlist: a Google Form with one email question. Paste its
    // "formResponse" URL and the email field's entry id here.
    // Until then the form shows the thank-you message but saves nothing.
    waitlist: { action: "", emailField: "" },
    shipping: [
      { country: "United States", code: "US", price: 18 },
      { country: "Canada", code: "CA", price: 38 }
    ]
  },

  pieces: [
    { no: "01", name: "Oatmeal star", note: "Creamy oatmeal with little brown speckles. The glaze pooled a bit thicker on one point, which I kind of love.",  clay: "#d9c7a8", glaze: "#efe6d2", drip: "#b89a6e", glazeName: "Oatmeal satin",     clayName: "speckled buff stoneware", h: 10.25, w: 10.25, d: 2.5, price: 145, status: "available" },
    { no: "02", name: "Celadon star", note: "Soft celadon green, glossy and calm. A couple of tiny pinholes near the edge, from the kiln doing its thing.",  clay: "#cbb89a", glaze: "#a9c3ad", drip: "#6f927c", glazeName: "Celadon gloss",     clayName: "white stoneware",         h: 10.25, w: 10.25, d: 2.5,   price: 145, status: "sold" },
    { no: "03", name: "Rust star", note: "Warm rusty orange that goes almost amber when it's lit. One point is a touch shorter than the others.", clay: "#b98a6a", glaze: "#b3654a", drip: "#7a3b26", glazeName: "Iron rust",         clayName: "red stoneware",           h: 10.25, w: 10.25, d: 2.5,   price: 145, status: "reserved", heldSeconds: 412 },
    { no: "04", name: "Cobalt stars", pair: true, note: "Two deep cobalt stars, glazed together in the same firing so they match. Lighter blue where the glaze broke over the edges. Great on either side of a bed.",  clay: "#d4c6b0", glaze: "#3a5bbf", drip: "#1f327a", glazeName: "Cobalt float",      clayName: "speckled buff stoneware", h: 10.25, w: 10.25, d: 2.5, price: 145, status: "available" },
    { no: "05", name: "Ash star", note: "Soft wood-ash gray with a little texture you can feel. Quiet during the day, really pretty lit up.",  clay: "#c9bba4", glaze: "#c8c3b6", drip: "#8d8677", glazeName: "Wood-ash matte",    clayName: "speckled buff stoneware", h: 10.25, w: 10.25, d: 2.5, price: 145, status: "available" },
    { no: "06", name: "Honey star", note: "Honey amber, a little drippy in the scoops between the points. Glows like a sunset.",  clay: "#cfae84", glaze: "#d9a441", drip: "#9c6a1c", glazeName: "Honey amber",       clayName: "buff stoneware",          h: 10.25, w: 10.25, d: 2.5, price: 145, status: "available" },
    { no: "07", name: "Periwinkle star", note: "Light blue, speckled sconce light. It has some surface irregularities because it's a homemade piece. I hope you love it as much as I do.", clay: "#d6cbb8", glaze: "#80a4ed", drip: "#4d6fc4", glazeName: "Periwinkle satin", clayName: "porcelain",               h: 10.25, w: 10.25, d: 2.5,   price: 145, status: "sold" },
    { no: "08", name: "Moss stars", pair: true, note: "A pair of mossy green stars with brown showing through at the tips. Made side by side so they're close twins, but not identical.",  clay: "#bfae90", glaze: "#7d8a5c", drip: "#4e5934", glazeName: "Moss shino",        clayName: "red stoneware",           h: 10.25, w: 10.25, d: 2.5, price: 145, status: "available" },
    { no: "09", name: "Plum star", note: "Moody plum that turns almost black in the corners. A few small surface bumps from glazing by hand.",  clay: "#c7b49b", glaze: "#7b4a63", drip: "#4a2a3b", glazeName: "Plum tenmoku",      clayName: "buff stoneware",          h: 10.25, w: 10.25, d: 2.5, price: 145, status: "available" },
    { no: "10", name: "Chalk star", note: "Chalky white, simple and quiet. You can see my fingerprints in one of the scoops if you look closely.",  clay: "#ddd2bf", glaze: "#f4f1ea", drip: "#cfc6b4", glazeName: "Chalk white",       clayName: "porcelain",               h: 10.25, w: 10.25, d: 2.5,   price: 145, status: "available" }
  ]
};
