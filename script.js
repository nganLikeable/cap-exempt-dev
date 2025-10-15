function show(elem) {
  elem.style.display = "block";
  requestAnimationFrame(() => {
    elem.style.opacity = 1;
  });
  setTimeout(() => {
    elem.style.display = "block";
  }, 500);
}

function hide(elem) {
  elem.style.opacity = 0;
  elem.addEventListener("transitionend", function handler() {
    elem.style.display = "none";
    elem.removeEventListener("transitionend", handler);
  });
}

function readBool(id) {
  const selected = document.querySelector(`input[id="${id + "yn"}"]:checked`);
  return selected ? selected.value === "Yes" : null;
}

function readNumeric(id) {
  const selected = document.getElementById(String(id) + "num");
  return selected && selected.value !== "" ? Number(selected.value) : null;
}

function readDropdown(id) {
  const selected = document.getElementById(String(id) + "dd");
  return selected ? selected.value : null;
}

function readDropdownPerma(id) {
  const selected = document.getElementById(String(id) + "dd");
  return selected && selected.selectedIndex !== 0 ? selected.value : null;
}

var SEPP = {
  shed: [
    {
      id: 0,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.17",
      sanitised: "Section 2.17 1a of the SEPP (2008)",
      question:
        "Is the construction or installation on a heritage item, draft heritage item, or an off-shore area?",
      type: "yes/no",
      errormsg:
        "New developments <b>cannot</b> be built on any of the aformentioned sites",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 1,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.17",
      sanitised: "Section 2.17 1b of the SEPP (2008)",
      question:
        "Is it replacing an existing deck <b>higher</b> than one meter from ground level?",
      errormsg:
        "It <b>cannot</b> replace a pre-existing development higher than one meter above ground level",
      type: "yes/no",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 2,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1b of the SEPP (2008)",
      question: "What zone is your development in?",
      type: "dropdown",
      options: ["RU1", "RU2", "RU3", "RU4", "RU6", "R5", "Other"],
    },
    {
      id: 3,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1b of the SEPP (2008)",
      question: "What is the floor area of the installation (m²)?",
      type: "numeric",
      minimum: 0,
      maximum: 10000,
      errormsg:
        "The <b>maximum</b> floor area is 50m for zones RU1, RU2, RU3, RU4, RU6, and R5, and 20m for others",
      check: (id, elem, v) => {
        var zoned = readDropdown(2) !== "Other";
        if ((zoned === true && v > 50) || (zoned === false && v > 20))
          show(elem);
        else hide(elem);
        return v === null
          ? 1
          : (zoned === true && v <= 50) || (zoned === false && v <= 20)
          ? 4
          : 2;
      },
    },
    {
      id: 4,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1c of the SEPP (2008)",
      question:
        "What is the planned height <b>above</b> existing ground level (m)?",
      errormsg:
        "Developments <b>aren't</b> exempt if they're above 3 meters from ground level",
      type: "numeric",
      minimum: -10,
      maximum: 100,
      check: (id, elem, v) => {
        if (v > 3) show(elem);
        else hide(elem);
        return v === null ? 1 : v <= 3 ? 4 : 2;
      },
    },
    {
      id: 5,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1d of the SEPP (2008)",
      question: "How far is it located from the lot boundary (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 200,
      errormsg:
        "The <b>minimum</b> distance is 5m for zones RU1, RU2, RU3, RU4, RU6, and R5, and 9m for others",
      check: (id, elem, v) => {
        var zoned = readDropdown(2) !== "Other";
        if (
          v !== null &&
          ((zoned === true && v < 5) || (zoned === false && v < 9))
        )
          show(elem);
        else hide(elem);
        return v === null
          ? 1
          : (zoned === true && v >= 5) || (zoned === false && v >= 9)
          ? 4
          : 2;
      },
    },
    {
      id: 6,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1e of the SEPP (2008)",
      question: "Is it <b>behind</b> the building line or any road frontage?",
      type: "yes/no",
      error:
        "The development <b>must</b> be <b>behind</b> if its not build in one of the following zones: RU1, RU2, RU3, RU4, RU6, and R5",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        if (zoned === false && bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : zoned === true || bool === true ? 4 : 2;
      },
    },
    {
      id: 7,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1f of the SEPP (2008)",
      question: "Is the development a shipping container?",
      type: "yes/no",
      errormsg:
        "New developments <b>cannot</b> be shipping containers in specific zones",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        if (zoned === false && bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : zoned === true || bool === false ? 4 : 2;
      },
    },
    {
      id: 8,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1g of the SEPP (2008)",
      question:
        "Does roofwater get disposed of <b>without</b> disrupting adjoining owners?",
      type: "yes/no",
      errormsg:
        "Rainwater <b>must</b> be properly disposed of <b>without</b> disruption in specific zones",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        if (zoned === false && bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : zoned === true || bool === true ? 4 : 2;
      },
    },
    {
      id: 9,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1h of the SEPP (2008)",
      question:
        "Are all metal components low reflective, and factory pre-coloured?",
      type: "yes/no",
      errormsg:
        "Metal components <b>must</b> be low reflective and factory pre-coloured in specific zones",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        if (zoned === false && bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : zoned === true || bool === true ? 4 : 2;
      },
    },
    {
      id: 10,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1i of the SEPP (2008)",
      question: "Is your development built in a bush fire prone area?",
      type: "yes/no",
    },
    {
      id: 11,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1i of the SEPP (2008)",
      question:
        "Is the plan <b>less</b> than 5m from a dwelling or built from combustible material?",
      type: "yes/no",
      errormsg:
        "Fireprone buildings <b>must</b> be a <b>minimum</b> distance from other developments in specific zones",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        var fireprone = readBool(10);
        if (zoned === false && bool === true && fireprone === true) show(elem);
        else hide(elem);
        return bool === null
          ? 1
          : zoned === true || bool === false || fireprone === false
          ? 4
          : 2;
      },
    },
    {
      id: 12,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1j of the SEPP (2008)",
      question:
        "Is it being constructed or installed in a heritage or draft heritage conservation area?",
      type: "yes/no",
    },
    {
      id: 13,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1j of the SEPP (2008)",
      question: "Is it located in the 'rear yard'?",
      type: "yes/no",
      error:
        "The development <b>cannot</b> be in the front yard of a heritage site if it's in specific zones",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        var heritage = readBool(12);
        if (zoned === false && bool === false && heritage === true) show(elem);
        else hide(elem);
        return bool === null || heritage === null
          ? 1
          : zoned === true || bool === true || heritage === false
          ? 4
          : 2;
      },
    },
    {
      id: 14,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1k of the SEPP (2008)",
      question:
        "If it is adjacent to another building, does it interfere with the entry, exit, or fire safety measures of that building?",
      type: "yes/no",
      errormsg:
        "The development <b>cannot</b> interfere with neighouring buildings if it's built in specific zones",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        if (zoned === false && bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : zoned === true || bool === false ? 4 : 2;
      },
    },
    {
      id: 15,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1l of the SEPP (2008)",
      question: `Is it a <a href="https://ncc.abcb.gov.au/ncc-navigator/building-classifications#class-10-buildings">Class 10</a> building that is intended for residency?`,
      type: "yes/no",
      errormsg:
        "Class 10 buildings <b>cannot</b> be resided in, in specific zones",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        if (zoned === false && bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : zoned === true || bool === false ? 4 : 2;
      },
    },
    {
      id: 16,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1m of the SEPP (2008)",
      question:
        "How far is it from any registered easement (m)? Leave empty if there's no nearby easements.",
      type: "numeric",
      minimum: 0,
      maximum: 200,
      errormsg:
        "The development <b>must</b> be <b>at least</b> one meter from any registered easement in specific zones",
      check: (id, elem, v) => {
        var zoned = readDropdown(2) !== "Other";
        if (zoned === false && v < 1) show(elem);
        else hide(elem);
        return v === null || zoned === true || v >= 1 ? 4 : 2;
      },
    },
    {
      id: 17,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 1n of the SEPP (2008)",
      question:
        "If it is a cabana, is it connected to a water supply or sewerage service? Leave blank if it isn't a cabana.",
      type: "yes/no",
      errormsg:
        "Cabanas <b>cannot</b> be connect to water services when in specific zones",
      check: (id, elem, bool) => {
        var zoned = readDropdown(2) !== "Other";
        if (zoned === false && bool === true) show(elem);
        else hide(elem);
        return bool === null || zoned === true || bool === false ? 4 : 2;
      },
    },
    {
      id: 18,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.18 2a of the SEPP (2008)",
      question: "How many developments are already on the lot?",
      type: "numeric",
      minimum: 0,
      maximum: 20,
      errormsg:
        "You <b>cannot</b> have <b>more than</b> 2 developments on the same lot",
      check: (id, elem, v) => {
        if (v >= 2) show(elem);
        else hide(elem);
        return v === null ? 1 : v < 2 ? 4 : 2;
      },
    },
  ],
  patio: [
    {
      id: 0,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.11",
      subsection: "2.11a",
      sanitised: "Section 2.11 (a) of the SEPP (2008)",
      question:
        "Is the construction or installation on a <strong>heritage site, draft heritage site, or an foreshore area?</strong>",
      type: "yes/no", // no
      errormsg:
        "Structure <strong>cannot</strong> be constructed or installed on a heritage item or on land in a foreshore area",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 1,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.11",
      sanitised: "Section 2.11 (b) of the SEPP (2008)",
      question: "Is this a replacement of an existing deck?",
      type: "yes/no",
    },
    {
      id: 2,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.11",
      sanitised: "Section 2.11 (b) of the SEPP (2008)",
      question: "What is the height of the deck above ground level?",
      type: "numeric",
      errormsg:
        "The replacement deck <strong>must not </strong> be higher than <strong>1m</strong> above ground level",
      check: (id, elem, v) => {
        var replacementDeck = readBool(1);
        if (replacementDeck === true && v > 1) show(elem);
        else hide(elem);
        return v === null ? 1 : !replacementDeck || v <= 1 ? 4 : 2;
      },
    },
    {
      id: 3,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1b of the SEPP (2008)",
      question: "Does the development have any area of less than 25m²?",
      type: "yes/no", // no
      errormsg:
        "The development <strong>must not</strong> have an area of less than 25m²",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 4,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1c of the SEPP (2008)",
      question: "What is the size of the lot (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 100000,
    },
    {
      id: 5,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1c of the SEPP (2008)",
      question: "What is the area of the dwelling (m²)?",
      type: "numeric",
      minimum: 0,
      maximum: 10000,
    },

    {
      id: 6,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1c of the SEPP (2008)",
      question:
        "What is the total floor area of all structures on the lot (m²)?",
      type: "numeric",
      minimum: 0,
      maximum: 100000,
      errormsg:
        "The total floor area of all structures exceeds the allowed limit for your lot",
      check: (id, elem, v) => {
        const lotSize = readNumeric(4);
        const dwellingArea = readNumeric(5);
        let maxAllowed;
        if (lotSize > 300) maxAllowed = dwellingArea * 0.15;
        else maxAllowed = 25;
        if (v > maxAllowed) show(elem);
        else hide(elem);
        return lotSize === null || dwellingArea === null || v === null
          ? 1
          : v <= maxAllowed
          ? 4
          : 2;
      },
    },
    {
      id: 7,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1d of the SEPP (2008)",
      question: "Does it have an enclosing wall higher than 1.4m?",
      type: "yes/no",
      errormsg:
        "The development <strong>must not</strong> have an an enclosing wall of more than 1.4m",
      check: (id, elem, bool) => {
        if (bool === true) {
          show(elem);
        } else {
          hide(elem);
        }
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    // {
    //   id: 8,
    //   section:
    //     "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
    //   sanitised: "Section 2.12 1d of the SEPP (2008)",
    //   question:
    //     "What is the height of the enclosing wall (m)? (Leave empty if not applicable)",
    //   type: "numeric",
    //   minimum: 0,
    //   maximum: 10,
    //   errormsg:
    //     "The development <strong>must not</strong> have an an enclosing wall of more than 1.4m",
    //   check: (id, elem, v) => {
    //     var hasEnclosingWall = readBool(7);
    //     if (hasEnclosingWall === true && v > 1.4) show(elem);
    //     else hide(elem);
    //     return hasEnclosingWall === null
    //       ? 1
    //       : v === null || !hasEnclosingWall || v <= 1.4
    //       ? 4
    //       : 2;
    //   },
    // },
    {
      id: 8,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      subsection: "2.12 (1)e",
      sanitised: "Section 2.12 (1)e of the SEPP (2008)",
      question:
        "Is the development carried out in connection with farm experience premises or farm gate premises?",
      type: "yes/no",
    },
    {
      id: 9,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1e.(i) of the SEPP (2008)",
      question: "How far is the development from the nearest road (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 1000,
      errormsg:
        "If carried out in connection with farm premises, it <strong>must be</strong> more than 50m from a road",
      check: (id, elem, v) => {
        var hasFarm = readBool(8);
        if (hasFarm && v <= 50) show(elem);
        else hide(elem);
        return hasFarm === null || v === null
          ? 1
          : !hasFarm || (hasFarm && v > 50)
          ? 4
          : 2;
      },
    },
    {
      id: 10,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1e.(ii) of the SEPP (2008)",
      question:
        "Is the development located behind the building line of a road frontage?",
      type: "yes/no", // yes
      errormsg:
        "If not related to farm premises, it <strong>must be</strong> located behind the building line of a road frontage",
      check: (id, elem, bool) => {
        var hasFarm = readBool(8);
        if (!hasFarm && bool === false) show(elem);
        else hide(elem);
        return hasFarm === null || bool === null
          ? 1
          : hasFarm || (!hasFarm && bool === true)
          ? 4
          : 2;
      },
    },
    {
      id: 11,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1f of the SEPP (2008)",
      question: "What zone is your development in?",
      type: "dropdown",
      options: ["RU1", "RU2", "RU3", "RU4", "RU6", "R5", "Other"],
    },
    {
      id: 12,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.20 1f of the SEPP (2008)",
      question:
        "What is the distance from the development to the nearest lot boundary (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 10000,
      errormsg:
        "Distance from lot boundary <strong>must be 5m</strong> for RU1, RU2, RU3, RU4, R6 or R5 zones, <strong>or 90cm</strong> for other zones",
      check: (id, elem, v) => {
        var zoned = readDropdown(12) !== "Other";
        if ((zoned === true && v < 5) || (zoned === false && v < 0.9))
          show(elem);
        else hide(elem);
        return zoned === null || v === null
          ? 1
          : (zoned === true && v >= 5) || (zoned === false && v >= 0.9)
          ? 4
          : 2;
      },
    },
    {
      id: 13,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1h of the SEPP (2008)",
      question:
        "Are all metal components low reflective, and factory pre-coloured?",
      type: "yes/no", // yes
      errormsg:
        "Metal components <strong>must</strong> be low reflective and factory pre-coloured materials",
      check: (id, elem, bool) => {
        var farmBuilding = readBool(8);
        if (farmBuilding === false && bool === false) show(elem);
        else hide(elem);
        return farmBuilding === null || bool === null
          ? 1
          : bool === true || farmBuilding === true
          ? 4
          : 2;
      },
    },
    {
      id: 14,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1i of the SEPP (2008)",
      question: "What is the floor height above ground level (m)? ",
      type: "numeric", // <=1m
      minimum: 0,
      maximum: 100,
      errormsg:
        "The development <strong>must</strong> have a floor height not more than 1m above ground level",
      check: (id, elem, v) => {
        if (v > 1) show(elem);
        else hide(elem);
        return v === null ? 1 : v <= 1 ? 4 : 2;
      },
    },
    {
      id: 15,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1i,j of the SEPP (2008)",
      question: "Is the development a roofed structure? If so, what kind? ",
      type: "dropdown",
      options: [
        "Roofed structure",
        "Roofed structure attached to a dwelling",
        "Not a roofed structure",
      ],
    },
    {
      id: 16,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1i1 of the SEPP (2008)",
      question:
        "Does the roof overhang the structure by more than 60cm on each side? ",
      type: "yes/no",
      errormsg:
        "If the development has a roof, the roof <strong>must not</strong> overhang the structure by more than 60cm on each side",
      check: (id, elem, bool) => {
        var hasRoof = readDropdown(16) === "Roofed structure";
        if (hasRoof && bool === true) show(elem);
        else hide(elem);
        return hasRoof === null || bool === null
          ? 1
          : !hasRoof || (hasRoof && bool === false)
          ? 4
          : 2;
      },
    },
    {
      id: 17,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1j of the SEPP (2008)",
      question:
        "Does the development extend above the roof gutter line of the dwelling?",
      type: "yes/no",
      errormsg:
        "If the development has a roof attached to a dwelling, it <strong>must not</strong> extend the roof gutter line of the dwelling",
      check: (id, elem, bool) => {
        var hasRoofDwelling =
          readDropdown(16) === "Roofed structure attached to a dwelling";
        if (hasRoofDwelling && bool === true) show(elem);
        else hide(elem);
        return hasRoofDwelling === null || bool === null
          ? 1
          : !hasRoofDwelling || (hasRoofDwelling && bool === false)
          ? 4
          : 2;
      },
    },
    {
      id: 18,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1j1 of the SEPP (2008)",
      question:
        "What is the distance at its highest point with the ground level (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 100,
      errormsg:
        "The development <strong>must not</strong> be higher than 3m at its highest point above existing ground level",
      check: (id, elem, v) => {
        if (v > 3) show(elem);
        else hide(elem);
        return v === null ? 1 : v <= 3 ? 4 : 2;
      },
    },
    {
      id: 19,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1k of the SEPP (2008)",
      question: "Is it connected to a fascia?",
      type: "yes/no",
    },
    {
      id: 20,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1k of the SEPP (2008)",
      question:
        "If connected to a fascia, does the connection comply with a professional engineer's specifications?<br> (Choose <strong>No</strong> if not applied).",
      type: "yes/no", // yes
      errormsg:
        "The development <strong>must</strong> follow professional engineer's specifications when connected to a fascia",
      check: (id, elem, bool) => {
        var connectedFascia = readBool(19);
        if (connectedFascia && bool === false) show(elem);
        else hide(elem);
        return connectedFascia === null || bool === null
          ? 1
          : !connectedFascia || (connectedFascia && bool === true)
          ? 4
          : 2;
      },
    },
    {
      id: 21,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1l of the SEPP (2008)",
      question:
        "Will the development be constructred or installed so that roofwater is disposed of into the existing stormwater drainage system?",
      type: "yes/no", // yes
      errormsg:
        "Roofwater <strong>must</strong> be directed into the existing stormwater drainage system",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 22,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1m of the SEPP (2008)",
      question:
        "Will it interfere with the functioning of existing drainage fixures/flowpaths?",
      type: "yes/no", // no
      errormsg:
        "The development <strong>must not</strong> interfere with the functioning of existing drainage fixtures or flow paths",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 23,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.18",
      sanitised: "Section 2.12 1n of the SEPP (2008)",
      question: "Is your development built in a bush fire prone area?",
      type: "yes/no",
    },
    {
      id: 24,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 1n of the SEPP (2008)",
      question:
        "Is the plan less than 5m from a dwelling or built from combustible material?",
      type: "yes/no",
      errormsg:
        "The development <strong>must</strong> use non-combustible materials when on bushfire-prone land within <strong>5m</strong> from a dwelling",
      check: (id, elem, bool) => {
        var fireprone = readBool(23);
        if (bool === true && fireprone === true) show(elem);
        else hide(elem);
        return fireprone === null || bool === null
          ? 1
          : bool === false || fireprone === false
          ? 4
          : 2;
      },
    },
    {
      id: 25,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 2a of the SEPP (2008)",
      question:
        "Are equivalent or improved quality materials used in the development?",
      type: "yes/no", // yes
      errormsg:
        "The development <strong>must</strong> use equivalent or improved quality materials",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 26,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
      sanitised: "Section 2.12 2b of the SEPP (2008)",
      question:
        "Does the development change the size or height of the existing deck?",
      type: "yes/no", // no
      errormsg:
        "The development <strong>must not</strong> change the measurements of the existing deck",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    // {
    //   id: 27,
    //   section:
    //     "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.12",
    //   sanitised: "Section 2.12 3a of the SEPP (2008)",
    //   question:
    //     "Is the balcony connected to a building intended for the purposes of farm stay accommodation, farm gate premises or farm experience premises?",
    //   type: "yes/no",
    // },
  ],
  carport: [
    {
      id: 0,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.19",
      sanitised: "Section 2.19 of the SEPP (2008)",
      question:
        "Is the carport on a heritage item, draft heritage item, or foreshore area?",
      type: "yes/no",
      errormsg:
        "Carports <b>cannot</b> be built on heritage or foreshore areas",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 1,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1a of the SEPP (2008)",
      question:
        "Is the carport a structure for storing motor vehicles with <b>2 or more</b> open sides, and <b>more than</b> one-third of its perimeter open?",
      type: "yes/no",
      errormsg: "Carports <b>must</b> follow the legal definition of one",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 2,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1b of the SEPP (2008)",
      question: "What zone is your development in?",
      type: "dropdown",
      options: ["RU1", "RU2", "RU3", "RU4", "RU6", "R5", "Other"],
    },
    {
      id: 3,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1b of the SEPP (2008)",
      question: "Is you development in a rural area?",
      type: "yes/no",
    },
    {
      id: 4,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1b of the SEPP (2008)",
      question: "What is the size of the lot/property (m²)?",
      type: "numeric",
      minimum: 0,
      maximum: 100000,
    },
    {
      id: 5,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1b of the SEPP (2008)",
      question: "What is the floor area of the carport (m²)?",
      type: "numeric",
      errormsg:
        "Floor area <b>exceeds maximum</b> allowed for your lot and zone",
      minimum: 0,
      maximum: 10000,
      check: (id, elem, v) => {
        var zoned = readDropdown(2);
        var rural = readBool(3);
        var size = readNumeric(4);
        if (
          (size > 300 &&
            (((rural === true || zone === "R5") && v > 50) ||
              ((rural === false || zone !== "R5") && v > 25))) ||
          v > 20
        )
          show(elem);
        else hide(elem);
        return v === null || size === null || rural === null
          ? 1
          : (size > 300 &&
              (((rural === true || zone === "R5") && v <= 50) ||
                ((rural === false || zone !== "R5") && v <= 25))) ||
            v <= 20
          ? 4
          : 2;
      },
    },
    {
      id: 6,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1c of the SEPP (2008)",
      question:
        "What is the height of the carport <b>above</b> ground level (m)",
      type: "numeric",
      minimum: -10,
      maximum: 100,
      errormsg:
        "Carport <strong>must not exceed 3m</strong> in height or the roof gutter line if attached to a single-storey dwelling",
      check: (id, elem, v) => {
        if (v > 3) show(elem);
        else hide(elem);
        return v === null ? 1 : v <= 3 ? 4 : 2;
      },
    },
    {
      id: 7,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1c of the SEPP (2008)",
      question:
        "If attached to a single storey dwelling, does it exceed its gutter line?",
      type: "yes/no",
      errormsg:
        "The carport <strong>must not</strong> exceed the roof gutter if attached to an existing single storey dwelling",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 8,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1d of the SEPP (2008)",
      question:
        "Is the carport located <b>at least</b> 1m behind the building line of any road frontage?",
      type: "yes/no",
      errormsg:
        "Carport <strong>must</strong> be located <b>at least 1m behind</b> the building line of any road frontage",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 9,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1e of the SEPP (2008)",
      question: "What is the distance from the lot boundary?",
      type: "numeric",
      minimum: 0,
      maximum: 200,
      errormsg:
        "Distance from lot boundary <strong>must be 5m</strong> for RU1, RU2, RU3, RU4, R6 or R5 zones, <strong>or 900mm</strong> for other zones",
      check: (id, elem, v) => {
        var zoned = readDropdown(2) !== "Other";
        if ((zoned === true && v < 5) || (zoned === false && v < 9)) show(elem);
        else hide(elem);
        return v === null || zoned === null
          ? 1
          : (zoned === true && v >= 5) || (zoned === false && v >= 9)
          ? 4
          : 2;
      },
    },
    {
      id: 10,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1g of the SEPP (2008)",
      question:
        "If your carport is made of metal components, are they constructed of low reflective and factory pre-coloured materials?",
      type: "yes/no",
      errormsg:
        "Metal components <strong>must</strong> be low reflective and factory pre-coloured materials",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 11,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1h of the SEPP (2008)",
      question:
        "Does the construction involve a new driveway or gutter crossing? If so, has consent been obtained from relevant road authority?",
      type: "yes/no",
      errormsg:
        "You <strong>cannot</strong> construct a new driveway or gutter crossing without consent from relevant road authority under Roads Act 1993",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 12,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1i of the SEPP (2008)",
      question:
        "Will the carport be constructred or installed so that roofwater is disposed of into the existing stormwater drainage system?",
      type: "yes/no",
      errormsg:
        "Roofwater <strong>must</strong> be directed into the existing stormwater drainage system",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 13,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1e of the SEPP (2008)",
      question:
        "If connected to a fascia, does the connection comply with a professional engineer's specifications?",
      type: "yes/no",
      errormsg:
        "Carport <strong>must</strong> follow professional engineer's specifications when connected to a fascia",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 14,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1l of the SEPP (2008)",
      question:
        "If the carport is on bushfire-prone land and <b>less than</b> 5m from a dwelling, is it made of non-combustible material?",
      type: "yes/no",
      errormsg:
        "Carport <strong>must</strong> use non-combustible materials when on bushfire-prone land within 5m from a dwelling",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 15,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1m of the SEPP (2008)",
      question:
        "If the carport is in a heritage conservation area, is it located in the rear yard?",
      type: "yes/no",
      errormsg:
        "Carport installed on or in heritage item or a draft heritage item <strong>must</strong> be located in the rear yard",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === true ? 4 : 2;
      },
    },
    {
      id: 16,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 1n of the SEPP (2008)",
      question:
        "Will the carport break access, packing, or loading/unloading on the lot?",
      type: "yes/no",
      errormsg:
        "Carport <strong>must not</strong> reduce vehicular access to, parking, or loading/unloading on the lot",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 17,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 2a of the SEPP (2008)",
      question:
        "What is the minimum distance between the roof of the development and a lot boundary (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 200,
      errormsg:
        "The roof <strong>must be at least 5m</strong> from each lot boundary",
      check: (id, elem, v) => {
        if (v < 5) show(elem);
        else hide(elem);
        return v === null ? 1 : v >= 5 ? 4 : 2;
      },
    },
    {
      id: 18,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 3a of the SEPP (2008)",
      question: "How many groups occupy the lot (tenants for example)?",
      type: "numeric",
      minimum: 0,
      maximum: 200,
    },
    {
      id: 19,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.20",
      sanitised: "Section 2.20 3a of the SEPP (2008)",
      question: "How many developments are on the property?",
      type: "numeric",
      minimum: 0,
      maximum: 100,
      errormsg: "",
      check: (id, elem, v) => {
        var tenants = readNumeric(18);
        if ((tenants === null && v > 1) || (tenants !== null && v > tenants))
          show(elem);
        else hide(elem);
        return v === null || tenants === null
          ? 1
          : (tenants === null && v <= 1) || (tenants !== null && v <= tenants)
          ? 4
          : 2;
      },
    },
  ],
  retaining_wall: [
    {
      id: 0,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.29",
      sanitised: "Section 2.29 of the SEPP (2008)",
      question:
        "Is the site a heritage/draft heritage/off-shore area or an environmentally sensitive area?",
      type: "yes/no",
      errormsg:
        "Retaining walls on heritage/draft heritage/off-shore or environmentally sensitive areas are not exempt",
      check: (id, elem, v) => {
        if (v === true) show(elem);
        else hide(elem);
        return v === null ? 1 : v === true ? 2 : 4;
      },
    },
    {
      id: 1,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1a of the SEPP (2008)",
      question:
        "Maximum cut or fill depth relative to existing ground level (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 100,
      errormsg: "Cut or fill cannot exceed 6m",
      check: (id, elem, v) => {
        if (v > 6) show(elem);
        else hide(elem);
        return v === null ? 1 : v <= 6 ? 4 : 2;
      },
    },
    {
      id: 2,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1b of the SEPP (2008)",
      question: "How far is the wall from any lot boundary (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 10000,
      errormsg: "Distance from the lot boundary must be at least 1m",
      check: (id, elem, v) => {
        if (v < 1) show(elem);
        else hide(elem);
        return v === null ? 1 : v >= 1 ? 4 : 2;
      },
    },
    {
      id: 3,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1c of the SEPP (2008)",
      question:
        "Is it being constructed or installed in a heritage or draft heritage conservation area?",
      type: "yes/no",
    },
    {
      id: 4,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1c of the SEPP (2008)",
      question: "Is it located in the 'rear yard'?",
      type: "yes/no",
      errormsg:
        "Developments built on a heritage conservation area need to be built in the rear yard",
      check: (id, elem, bool) => {
        var conservation = readBool(3);
        if (conservation === true && bool === false) show(elem);
        else hide(elem);
        return conservation === null || bool === null
          ? 1
          : conservation === false || (conservation === true && bool === true)
          ? 4
          : 2;
      },
    },
    {
      id: 5,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1d of the SEPP (2008)",
      question: "Distance to the nearest natural waterbody (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 10000,
      errormsg: "Must be at least 40m from a natural waterbody",
      check: (id, elem, v) => {
        if (v < 40) show(elem);
        else hide(elem);
        return v === null ? 1 : v >= 40 ? 4 : 2;
      },
    },
    {
      id: 6,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1e of the SEPP (2008)",
      question:
        "Will it redirect surface/ground water or cause sediment to affect neighbours?",
      type: "yes/no",
      errormsg:
        "Water must not be redirected and sediment must not impact adjoining property",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null ? 1 : bool === false ? 4 : 2;
      },
    },
    {
      id: 7,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1f of the SEPP (2008)",
      question:
        "Is it a retaining wall or structural support for excavation or fill, or a combination of both?",
      type: "yes/no",
    },
    {
      id: 8,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1f1 of the SEPP (2008)",
      question:
        "How far is it from the base of the development to its uppermost portion (m)?",
      type: "numeric",
      minimum: 0,
      maximum: 100,
      errormsg:
        "Retaining wall or structural support developments cannot be taller than 6m",
      check: (id, elem, v) => {
        var wall = readBool(7);
        if (wall === true && v > 6) show(elem);
        else hide(elem);
        return wall === null || v === null
          ? 1
          : wall === false || (wall === true && v <= 6)
          ? 4
          : 2;
      },
    },
    {
      id: 9,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1f2 of the SEPP (2008)",
      question:
        "Is it at least 2 meters horizontally from other retainer walls or structural supports?",
      type: "yes/no",
      errormsg:
        "Retaining wall or structural support developments cannot be within 2 meters of other developments of this type",
      check: (id, elem, bool) => {
        var wall = readBool(7);
        if (wall === true && bool === false) show(elem);
        else hide(elem);
        return wall === null || bool === null
          ? 1
          : wall === false || (wall === true && bool === true)
          ? 4
          : 2;
      },
    },
    {
      id: 10,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1f3 of the SEPP (2008)",
      question:
        "Is it at least 1 meter from easements, sewer mains, and water mains?",
      type: "yes/no",
      errormsg:
        "Retaining wall or structural support developments must be at least 1 meter from easements, sewer mains, and water mains",
      check: (id, elem, bool) => {
        var wall = readBool(7);
        if (wall === true && bool === false) show(elem);
        else hide(elem);
        return wall === null || bool === null
          ? 1
          : wall === false || (wall === true && bool === true)
          ? 4
          : 2;
      },
    },
    {
      id: 11,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1f4 of the SEPP (2008)",
      question:
        "Does it have adequate drainage lines connected to the existing stormwater drainage system for the site?",
      type: "yes/no",
      errormsg:
        "Retaining wall or structural support developments must be properly connected to existing drainage systems",
      check: (id, elem, bool) => {
        var wall = readBool(7);
        if (wall === true && bool === false) show(elem);
        else hide(elem);
        return wall === null || bool === null
          ? 1
          : wall === false || (wall === true && bool === true)
          ? 4
          : 2;
      },
    },
    {
      id: 12,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1g of the SEPP (2008)",
      question:
        "If the fill is more than 15cm deep, does it occupy more than 25% of the area of the lot? (Leave blank if it's not a fill)",
      type: "yes/no",
      errormsg: "Cannot fill more than a quarter of the lot area",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null || bool === false ? 4 : 2;
      },
    },
    {
      id: 13,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1h of the SEPP (2008)",
      question:
        'If a fill is imported to the site, are the materials free of building and other demolition waste, and only contain virgin excavated natural material (VENM) as defined in Part 3 of Schedule 1 to the <a href="https://legislation.nsw.gov.au/view/html/inforce/current/act-1997-156">Protection of the Environment Operations Act 1997</a>? (Leave blank if it\'s not a fill)',
      type: "yes/no",
      errormsg: "The fill must use VENM materials",
      check: (id, elem, bool) => {
        if (bool === false) show(elem);
        else hide(elem);
        return bool === null || bool === true ? 4 : 2;
      },
    },
    {
      id: 14,
      section:
        "https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572#sec.2.30",
      sanitised: "Section 2.30 1i of the SEPP (2008)",
      question:
        "If the land is in a rural or conservation zone, is it a fill of more than 100 cubic metres on each lot? (Leave blank if it's not applicable)",
      type: "yes/no",
      errormsg: "The fill cannot modify more than 100 cubic metres of land",
      check: (id, elem, bool) => {
        if (bool === true) show(elem);
        else hide(elem);
        return bool === null || bool === false ? 4 : 2;
      },
    },
  ],
};

var selectedForm;

function addQuestion(rule, num) {
  const elem = document.createElement("div");
  let options = ``;
  switch (rule.type) {
    case "numeric":
      options += `<input type="number" id="${String(rule.id) + "num"}" min="${
        rule.minimum ?? 0
      }" max="${rule.maximum ?? 100}"><br>`;
      break;
    case "yes/no":
      options += `<label><input type="radio" id="${
        String(rule.id) + "yn"
      }" name="${String(rule.id)}" value="Yes">Yes</label><br>
				<label><input type="radio" id="${String(rule.id) + "yn"}" name="${String(
        rule.id
      )}" value="No">No</label><br>
				<input type="button" id="${
          String(rule.id) + "ync"
        }" value="Clear" style="height: 24px; margin-top: 10px; line-height: 24px; padding: 0 10px; display: none"/>`;
      break;
    case "dropdown":
      options += `<select id="${String(rule.id) + "dd"}">
				${rule.options.map((x) => `<option value="${x}">${x}</option>`)}
			</select>`;
      break;
  }
  elem.classList.add("question");
  elem.innerHTML =
    `
		<p class="question-title">` +
    num +
    ". " +
    rule.question +
    `</p>` +
    options +
    `
		<p class="question-section" id="${String(rule.id) + "e"}">` +
    (rule.errormsg ??
      "That development doesn't qualify for exempt development") +
    ", please check <a href=" +
    rule.section +
    ` target="_blank">` +
    rule.sanitised +
    `</a> for more information.</p>
	`;
  selectedForm.appendChild(elem);
  if (rule.type === "yes/no") {
    const radios = document.getElementsByName(String(rule.id));
    const clear = document.getElementById(String(rule.id) + "ync");
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        clear.style.display = Array.from(radios).some((r) => r.checked)
          ? "inline-block"
          : "none";
      });
    });

    clear.addEventListener("click", () => {
      radios.forEach((radio) => (radio.checked = false));
      clear.style.display = "none";
    });
  }
}

function setClipboard(str) {
  if (!navigator.clipboard) {
    const textarea = document.createElement("textarea");
    textarea.value = str;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Fallback: Could not copy text", err);
    }
    document.body.removeChild(textarea);
    return;
  }

  navigator.clipboard
    .writeText(str)
    .then(() => {
      alert("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

function getLink(str) {
  const urlParams = new URLSearchParams();
  Object.keys(SEPP[str]).forEach((key) => {
    let res;
    if (SEPP[str][key].type === "yes/no")
      (res = readBool(SEPP[str][key].id)),
        (res = res === true ? "t" : res === false ? "f" : null);
    else if (SEPP[str][key].type === "numeric")
      res = readNumeric(SEPP[str][key].id);
    else if (SEPP[str][key].type === "dropdown")
      res = readDropdownPerma(SEPP[str][key].id);
    if (res !== null)
      urlParams.append(
        String(SEPP[str][key].id + 1).trim(),
        String(res).trim()
      );
  });
  const subUrl = urlParams.toString();
  const baseUrl = window.location.origin + window.location.pathname;
  return (subUrl ? baseUrl + "?" + subUrl : baseUrl) + window.location.hash;
}

function loadSection(str) {
  str = String(str).substring(1);
  document.querySelectorAll(".tab-form").forEach((form) => {
    form.classList.add("d-none");
  });

  selectedForm = document.getElementById(str);
  if (selectedForm) {
    while (selectedForm.firstChild)
      selectedForm.removeChild(selectedForm.firstChild);
    selectedForm.classList.remove("d-none");
    const title = document.createElement("h2");
    title.textContent = selectedForm.getAttribute("name");
    title.style.textAlign = "center";
    selectedForm.appendChild(title);
    if (SEPP[str])
      for (
        let i = 0;
        i < SEPP[str].length;
        addQuestion(SEPP[str][i], i + 1), i++
      );
    let offset = Math.max(
      ...Array.from(document.getElementsByClassName("navbar")).map(
        (h) => h.offsetHeight
      )
    );
    window.scrollTo({
      top:
        selectedForm.getBoundingClientRect().top + window.scrollY - offset + 30,
      behavior: "smooth",
    });
    const notes = document.createElement("p");
    notes.innerHTML = `<i>*SEPP refers to the <a href="https://legislation.nsw.gov.au/view/html/inforce/current/epi-2008-0572" target="_blank">State Environmental Planning Policy</a> (2008)</i>`;
    notes.style.textAlign = "left";
    const check = document.createElement("button");
    check.type = "button";
    check.textContent = "Check";
    check.id = "questionnaireCheck";
    check.style.margin = "5px";
    check.onclick = () => {
      // let offset = Math.max(...Array.from(document.getElementsByClassName("navbar")).map(h => h.offsetHeight));
      // window.scrollTo({top: selectedForm.getBoundingClientRect().top + window.scrollY - offset + 30, behavior: "smooth"});
      let good = 0;
      let unknown = [];
      let allAnswers = {}; // Collect all answers for logging
      let referenceNumbers = []; // Collect applicable reference numbers

      Object.keys(SEPP[str]).forEach((key) => {
        const question = SEPP[str][key];
        const questionNumber = Number(key) + 1;

        // Collect answers for logging
        let answer = null;
        if (question.type === "yes/no") {
          answer = readBool(question.id);
          allAnswers[`q${questionNumber}`] = answer === true ? "yes" : answer === false ? "no" : null;
        } else if (question.type === "numeric") {
          answer = readNumeric(question.id);
          allAnswers[`q${questionNumber}`] = answer;
        } else if (question.type === "dropdown") {
          answer = readDropdownPerma(question.id);
          allAnswers[`q${questionNumber}`] = answer;
        }

        // Collect reference numbers for answered questions
        if (answer !== null && question.sanitised) {
          referenceNumbers.push(question.sanitised);
        }

        // Check if question has a check function
        if (question.check) {
          const elem = document.getElementById(String(question.id) + "e");
          let res = question.check(question.id, elem, answer);

          if (res === 1) unknown.push(questionNumber);
          good |= res;
        } else {
          // For questions without check functions, validate if they're answered
          let isAnswered = answer !== null;

          if (!isAnswered) {
            unknown.push(questionNumber);
            good |= 1; // Mark as having unanswered questions
          } else {
            good |= 4; // Mark as having valid answers
          }
        }
      });

      // Determine exemption status
      let exemptionStatus = '';
      let shouldLogSubmission = false;

      // Display results based on validation
      if (good & 2) {
        // Has validation failures
        hide(resultPass);
        show(resultFail);
        hide(resultUnfinished);
        exemptionStatus = 'not_exempt';
        shouldLogSubmission = true;
      } else if (good & 1) {
        // Has unanswered questions
        hide(resultPass);
        hide(resultFail);
        resultUnfinished.innerText =
          "⚠ Please finish the unanswered questions ⚠\n(" +
          unknown.join(", ") +
          ")";
        show(resultUnfinished);
        exemptionStatus = 'incomplete';
        // Don't log incomplete submissions
      } else if (good & 4) {
        // All questions answered and valid
        show(resultPass);
        hide(resultFail);
        hide(resultUnfinished);
        exemptionStatus = 'exempt';
        shouldLogSubmission = true;
      } else {
        // Fallback case
        hide(resultPass);
        hide(resultFail);
        resultUnfinished.innerText = "⚠ Please answer all questions ⚠";
        show(resultUnfinished);
        exemptionStatus = 'incomplete';
        // Don't log incomplete submissions
      }

      // Log the submission if it's complete
      if (shouldLogSubmission) {
        // Add exemption status and metadata to answers
        allAnswers['exemption_status'] = exemptionStatus;
        allAnswers['completion_time'] = new Date().toISOString();
        allAnswers['development_type'] = str; // Store the raw development type (shed, carport, etc.)
        
        // Get development type from the current hash
        const devType = str.charAt(0).toUpperCase() + str.slice(1); // Capitalize first letter
        
        // Use a generic property address since it's not part of the SEPP questions
        const propertyAddress = 'Address not specified in SEPP form';
        
        // Log what data we're capturing for debugging
        console.log('📊 SEPP Form Data to be logged:', {
          developmentType: devType,
          propertyAddress: propertyAddress,
          formAnswers: allAnswers,
          seppReferences: referenceNumbers,
          exemptionResult: exemptionStatus
        });
        
        // Submit to database silently in the background
        submitLog(devType, propertyAddress, allAnswers, referenceNumbers.join('; '))
          .then(() => {
            console.log('✅ Exemption check logged successfully');
          })
          .catch(error => {
            console.error('❌ Failed to log exemption check:', error);
          });
      }
    };
    const permalink = document.createElement("button");
    permalink.type = "button";
    permalink.id = "questionnairePermalink";
    permalink.style.margin = "5px";
    permalink.innerHTML = `<span title="Copies a permanent link to this completed form.">Copy Perma-link</span>`;
    permalink.onclick = () => setClipboard(getLink(str));
    const results = document.createElement("div");
    results.style.display = "flex";
    results.style.justifyContent = "horizontal";
    const resultPass = document.createElement("p");
    resultPass.style.marginTop = "15px";
    resultPass.style.left = "50%";
    resultPass.style.transform = "translate(-50%, 0)";
    resultPass.style.fontWeight = "bold";
    resultPass.style.position = "absolute";
    resultPass.innerText = "✔ Your development is exempt ✔";
    const resultFail = document.createElement("p");
    resultFail.style.marginTop = "15px";
    resultFail.style.left = "50%";
    resultFail.style.transform = "translate(-50%, 0)";
    resultFail.style.fontWeight = "bold";
    resultFail.style.position = "absolute";
    resultFail.innerText = "❌ Your development isn't exempt ❌";
    const resultUnfinished = document.createElement("p");
    resultUnfinished.style.marginTop = "15px";
    resultUnfinished.style.left = "50%";
    resultUnfinished.style.transform = "translate(-50%, 0)";
    resultUnfinished.style.fontWeight = "bold";
    resultUnfinished.style.position = "absolute";
    resultUnfinished.innerText = "⚠ Please finish the unanswered questions ⚠";
    selectedForm.appendChild(notes);
    selectedForm.appendChild(check);
    selectedForm.appendChild(permalink);
    results.appendChild(resultPass);
    results.appendChild(resultFail);
    results.appendChild(resultUnfinished);
    selectedForm.appendChild(results);
    hide(resultPass);
    hide(resultFail);
    hide(resultUnfinished);
  } else document.getElementById("examples").classList.remove("d-none");
}

window.addEventListener("hashchange", () => {
  loadSection(window.location.hash);
});

loadSection(window.location.hash);
const params = new URLSearchParams(window.location.search);
if (selectedForm) {
  const rules = SEPP[String(window.location.hash).substring(1)];
  params.forEach((value, key) => {
    const id = Number(key) - 1;
    const rule = Object.entries(rules).find(([_, value]) => value.id === id)[1];
    if (rule.type === "numeric")
      document.getElementById(String(id) + "num").value = Number(value);
    else if (rule.type === "yes/no") {
      const selected = document.querySelectorAll(`input[id="${id + "yn"}"]`);
      selected.forEach((radio) => {
        radio.checked = radio.value === (value === "t" ? "Yes" : "No");
        const event = new Event("change", { bubbles: true });
        radio.dispatchEvent(event);
      });
    } else if (rule.type === "dropdown")
      document.getElementById(String(id) + "dd").value = value;
  });
}

// Scroll up button
// ref: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
let myBtn = document.getElementById("scrollUpBtn");

// when user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    myBtn.style.display = "block";
  } else {
    myBtn.style.display = "none";
  }
}

// when clicked, scroll to the top
function topFunction() {
  document.body.scrollTop = 0; // for safari
  document.documentElement.scrollTop = 0; // for other browsers
}

async function submitLog(devType, propertyAddress, answers, referenceNumbers) {
  try {
    const payload = {
      development_type: devType,
      property_address: propertyAddress,
      answers: answers,
      reference_number: referenceNumbers,
    };

    const res = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("✅ Log stored:", data);
    
    // Show a very subtle notification to the user (optional)
    // showNotification("Form submission logged successfully!", "success");
    
    return data;
  } catch (error) {
    console.error("❌ Failed to submit log:", error);
    // Silent logging - don't show error notifications to users
    // showNotification("Failed to log form submission", "error");
    throw error;
  }
}

// Function to show notifications to users
function showNotification(message, type = "info") {
  // Remove any existing notifications
  const existingNotification = document.getElementById('exemption-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'exemption-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    transition: opacity 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;
  
  // Set color based on type
  if (type === "success") {
    notification.style.backgroundColor = "#28a745";
  } else if (type === "error") {
    notification.style.backgroundColor = "#dc3545";
  } else {
    notification.style.backgroundColor = "#17a2b8";
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}
