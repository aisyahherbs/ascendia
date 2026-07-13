export const ranks = [
  { name: "Member", performanceRate: 10, pairRate: 0, minAtnpv: 0, minTupoPv: 0 },
  { name: "VIP", performanceRate: 15, pairRate: 0, minAtnpv: 6000, minTupoPv: 0 },
  { name: "Royal Star", performanceRate: 18, pairRate: 12, minAtnpv: 15000, minTupoPv: 1000 },
  { name: "Crown Star", performanceRate: 22, pairRate: 13, minAtnpv: 50000, minTupoPv: 2000, requiredLegRank: "Royal Star", requiredLegs: 3 },
  { name: "Leader Ambassador", performanceRate: 26, pairRate: 14, minAtnpv: 200000, minTupoPv: 3000, requiredLegRank: "Crown Star", requiredLegs: 3 },
  { name: "Leader Majestic", performanceRate: 30, pairRate: 15, minAtnpv: 700000, minTupoPv: 3000, requiredLegRank: "Leader Ambassador", requiredLegs: 3 },
  { name: "Director", performanceRate: 30, pairRate: 15, minAtnpv: 20000000, minTupoPv: 3000, requiredLegRank: "Leader Majestic", requiredLegs: 4 },
  { name: "Executive Director", performanceRate: 30, pairRate: 15, minAtnpv: 70000000, minTupoPv: 3000, requiredLegRank: "Director", requiredLegs: 4 }
];

export const rankIndex = Object.fromEntries(ranks.map((rank, index) => [rank.name, index]));
export const rankByName = Object.fromEntries(ranks.map((rank) => [rank.name, rank]));

export const leadershipRates = [3, 1.5, 1.5, 1, 1];

export function allowedLeadershipGenerations(rankName) {
  if (rankIndex[rankName] >= rankIndex["Director"]) return 5;
  if (rankName === "Leader Majestic") return 4;
  if (rankName === "Leader Ambassador") return 2;
  if (rankName === "Crown Star") return 1;
  return 0;
}

export function allowedMentoringGenerations(rankName) {
  if (rankIndex[rankName] >= rankIndex["Leader Majestic"]) return 4;
  if (rankName === "Leader Ambassador") return 3;
  if (rankName === "Crown Star") return 2;
  if (rankName === "Royal Star") return 1;
  return 0;
}

export function rankRate(rankName, field) {
  return rankByName[rankName]?.[field] || 0;
}

export function periodFromDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date");
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = date.getUTCDate();
  const cycle = day <= 11 ? "P1" : day <= 27 ? "P2" : "NEXT";
  return `${year}-${month}-${cycle}`;
}
