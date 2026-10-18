// Landing pages for each Appleton battery part number, served at /parts/appleton-<part>-battery.
// Prices, stock and specs come from MoverBattery's catalog at build time (src/lib/products.js);
// this file only holds the copy. A page is generated only if MoverBattery has a product for that part.
// Keep wording as "replacement for" / "compatible with" Appleton part #. Never imply an Appleton or OEM product.

export const APPLETON_BATTERY_PAGES = {
  '139082': {
    equipment: 'Appleton Roll Mover',
    titleSuffix: '36V RollMover™',
    heading: 'Replacement Battery for Appleton Mfg. #139082 (36V RollMover™ Roll Pusher)',
    metaDescription: (from) =>
      `Replacement for Appleton Mfg. part #139082, the 36V RollMover™ roll pusher battery. NiCd from ${from} or upgrade to NiMH for 67% more capacity. Ships UPS Ground.`,
    intro:
      'Is your roll mover dying mid-shift? If the pack in your unit is labeled Appleton 139082, these 36V packs are built to replace it.',
    bestFor: {
      NiCd: 'Like-for-like swap, cold rooms and unheated warehouses',
      NiMH: 'Longer runtime per charge, fewer mid-shift swaps',
    },
    chooser:
      'Choose NiCd if you want the same chemistry as the original. Choose NiMH if your operators run out of charge before the shift ends.',
    signs: [
      'The mover slows or stalls under a full roll',
      'Runtime has dropped to a fraction of a shift',
      "The pack won't hold a charge overnight",
    ],
    faq: [
      {
        q: 'Is this an Appleton battery?',
        a: "No. It's a compatible replacement built to the same voltage as Appleton part #139082.",
      },
      {
        q: "What's the difference between NiCd and NiMH?",
        a: 'NiCd is the proven original chemistry and handles cold well. NiMH stores more energy at the same voltage, so you get longer runtime between charges.',
      },
      { q: 'How does it ship?', a: 'In-stock packs ship UPS Ground from MoverBattery, our battery store.' },
    ],
  },

  '137819': {
    equipment: 'Appleton Cart Mover',
    titleSuffix: '24V CartMover™',
    heading: 'Replacement Battery for Appleton Mfg. #137819 (24V CartMover™ Cart Tugger)',
    metaDescription: (from) =>
      `24V NiCd replacement for Appleton Mfg. part #137819 CartMover™ cart tugger batteries. ${from}, ships UPS Ground. Purchase orders and multi-pack quotes available.`,
    intro: "If your cart mover's pack is labeled Appleton 137819, this 24V NiCd pack is built to replace it.",
    why: {
      title: 'Why NiCd for cart movers',
      text: 'It holds up in cold storage, unheated docks and other harsh areas. It also handles the stop-start work of tugging carts all day.',
    },
    signs: [
      'The mover struggles to start a loaded cart',
      'It needs a recharge before the shift ends',
      'The charger shows full, but the mover dies quickly',
    ],
    fleet: true,
    faq: [
      {
        q: 'Is this an Appleton battery?',
        a: "No. It's a compatible replacement matched to Appleton part #137819.",
      },
      { q: 'How does it ship?', a: 'In-stock packs ship UPS Ground from MoverBattery, our battery store.' },
    ],
  },

  '143242': {
    equipment: 'Appleton Cart Mover',
    titleSuffix: '24V NiMH CartMover™',
    heading: 'Replacement Battery for Appleton Mfg. #143242 (24V CartMover™ Cart Tugger)',
    metaDescription: (from) =>
      `High-capacity 24V 9000mAh NiMH replacement for Appleton Mfg. part #143242 CartMover™ cart tugger packs. ${from}, ships UPS Ground. Purchase orders accepted.`,
    intro:
      "If your cart mover runs a pack labeled Appleton 143242, this 24V 9000mAh NiMH pack is built to replace it. It's made for long shifts and heavy carts.",
    why: {
      title: 'Why this pack',
      text: "At 9000mAh, it holds three times the energy of a 3000mAh cart mover pack. That's more cart pulls per charge.",
    },
    signs: [
      'Runtime has dropped well below a full shift',
      'The mover slows on ramps or with full carts',
      "The pack won't hold a charge overnight",
    ],
    faq: [
      {
        q: 'Is this an Appleton battery?',
        a: "No. It's a compatible replacement matched to Appleton part #143242.",
      },
      { q: 'How does it ship?', a: 'In-stock packs ship UPS Ground from MoverBattery, our battery store.' },
    ],
  },
};

export const appletonBatteryPagePath = (part) => `/parts/appleton-${part}-battery`;
