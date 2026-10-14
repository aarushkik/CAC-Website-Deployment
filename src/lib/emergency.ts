/**
 * Gas utility emergency lines for WA-03, checked against each utility's own
 * site (Oct 2026). Natural gas isn't available everywhere in the district;
 * homes on propane should call their propane supplier.
 */
export const GAS_UTILITIES = [
  { name: "NW Natural", area: "Clark County", phone: "800-882-3377" },
  { name: "Cascade Natural Gas", area: "Cowlitz County", phone: "888-522-1130" },
  { name: "Puget Sound Energy", area: "parts of Lewis and Thurston counties", phone: "888-225-5773" },
];
