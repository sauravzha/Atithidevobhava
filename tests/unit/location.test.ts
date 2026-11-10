import { describe, it, expect } from "vitest";
import {
  OFFICIAL_STATES,
  OFFICIAL_DISTRICTS,
  OFFICIAL_CATEGORIES,
  getStateById,
  getStateBySlug,
  getDistricts,
  getDistrictById,
  getDistrictBySlug,
  searchLocations,
  slugify,
} from "@/lib/location/data";
import { PILOT_LOCALS, getPilotLocals } from "@/lib/data/pilot-locals";
import { PILOT_EXPERIENCES, getPilotExperiences } from "@/lib/data/pilot-experiences";

describe("Geography & Location Data Engine", () => {
  it("defines all 28 states and 8 union territories", () => {
    const states = OFFICIAL_STATES.filter((s) => s.kind === "state");
    const unionTerritories = OFFICIAL_STATES.filter((s) => s.kind === "union_territory");

    expect(states.length).toBe(28);
    expect(unionTerritories.length).toBe(8);
    expect(OFFICIAL_STATES.length).toBe(36);
    expect(OFFICIAL_DISTRICTS.length).toBeGreaterThanOrEqual(6);
  });

  it("accurately indexes the Bihar pilot state with Darbhanga and Madhubani", () => {
    const bihar = getStateById("st-br");
    expect(bihar).toBeDefined();
    expect(bihar?.name).toBe("Bihar");
    expect(bihar?.nameHi).toBe("बिहार");

    const districts = getDistricts("st-br");
    const districtIds = districts.map((d) => d.id);
    expect(districtIds).toContain("dst-darbhanga");
    expect(districtIds).toContain("dst-madhubani");

    const darbhanga = getDistrictById("dst-darbhanga");
    expect(darbhanga?.centroidLat).toBeCloseTo(26.1522, 2);
    expect(darbhanga?.centroidLng).toBeCloseTo(85.8971, 2);
  });

  it("handles slugification and slug lookups consistently", () => {
    expect(slugify("Bihar")).toBe("bihar");
    expect(slugify("Andaman and Nicobar Islands")).toBe("andaman-and-nicobar-islands");
    expect(slugify("Ernakulam (Kochi)")).toBe("ernakulam-kochi");

    const bihar = getStateBySlug("bihar");
    expect(bihar?.id).toBe("st-br");

    const darbhanga = getDistrictBySlug("darbhanga", "st-br");
    expect(darbhanga?.id).toBe("dst-darbhanga");

    const madhubani = getDistrictBySlug("madhubani");
    expect(madhubani?.id).toBe("dst-madhubani");
  });

  it("searches locations across states, districts, and municipalities", () => {
    const results = searchLocations("darbhanga");
    expect(results.length).toBeGreaterThan(0);
    const districtResult = results.find((r) => r.type === "district");
    expect(districtResult?.title).toBe("Darbhanga");

    const hindiResults = searchLocations("बिहार");
    expect(hindiResults.length).toBeGreaterThan(0);
    expect(hindiResults[0]?.titleHi).toBe("बिहार");
  });

  it("indexes all 12 cultural experience categories", () => {
    expect(OFFICIAL_CATEGORIES.length).toBe(12);
    const categorySlugs = OFFICIAL_CATEGORIES.map((c) => c.slug);
    expect(categorySlugs).toContain("art-and-handicrafts");
    expect(categorySlugs).toContain("indian-food-and-cooking");
    expect(categorySlugs).toContain("music-and-dance");
  });
});

describe("Pilot Region Datasets", () => {
  it("indexes verified residents in Darbhanga and Madhubani", () => {
    expect(PILOT_LOCALS.length).toBeGreaterThanOrEqual(5);

    const darbhangaLocals = getPilotLocals("dst-darbhanga");
    expect(darbhangaLocals.length).toBeGreaterThan(0);

    const madhubaniLocals = getPilotLocals("dst-madhubani");
    expect(madhubaniLocals.length).toBeGreaterThan(0);

    for (const local of PILOT_LOCALS) {
      expect(local.displayName).toBeTruthy();
      expect(local.displayNameHi).toBeTruthy();
      expect(local.preferredPublicSpotEn).toBeTruthy();
      expect(local.preferredPublicSpotHi).toBeTruthy();
      expect(local.verified).toBe(true);
    }
  });

  it("indexes cultural experiences as enquiry-only listings in pilot districts", () => {
    expect(PILOT_EXPERIENCES.length).toBeGreaterThanOrEqual(4);

    const artExperiences = getPilotExperiences("art-and-handicrafts");
    expect(artExperiences.length).toBeGreaterThan(0);

    for (const exp of PILOT_EXPERIENCES) {
      expect(exp.titleEn).toBeTruthy();
      expect(exp.titleHi).toBeTruthy();
      expect(exp.generalAreaEn).toBeTruthy();
      expect(exp.durationEn).toBeTruthy();
    }
  });
});
