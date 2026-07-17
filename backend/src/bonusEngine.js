import {
  allowedLeadershipGenerations,
  allowedMentoringGenerations,
  leadershipRates,
  rankByName,
  rankIndex,
  rankRate
} from "./mlmRules.js";

const MAX_COMPANY_PAYOUT_RATE = 0.55;
const MAX_MEMBER_PAIR_BV = 250000;
const MENTORING_RATES = [5, 3, 2, 2];
const SHARING_POOL_RATE = 0.03;

function number(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function bool(value) {
  return value === true || value === "true";
}

function memberRank(member) {
  return member.rankName || "Member";
}

function higherRankName(currentRank = "Member", metricRank = "Member") {
  return (rankIndex[metricRank] || 0) > (rankIndex[currentRank] || 0) ? metricRank : currentRank;
}

function requiredTupoPv(rankName) {
  return rankByName[rankName]?.minTupoPv || 0;
}

function tupoQualified(member) {
  const required = requiredTupoPv(memberRank(member));
  if (required <= 0) return true;
  if (member.tupoBlocked) return false;
  return member.tupoDone || number(member.ppv) >= required;
}

function bonusDisabled(member, key) {
  return bool(member.disabledBonuses?.[key]);
}

function companyTnpv(members) {
  const ids = new Set(members.map((member) => member.id));
  const roots = members.filter((member) => !member.sponsorId || !ids.has(member.sponsorId));
  const rootTnpv = roots.reduce((sum, member) => sum + number(member.tnpv), 0);
  return rootTnpv || members.reduce((sum, member) => sum + number(member.ppv), 0);
}

function generationLevels(rootId, childrenBySponsor, depth) {
  const levels = [];
  let cursor = [rootId];
  const seen = new Set(cursor);
  for (let index = 0; index < depth; index += 1) {
    const next = cursor
      .flatMap((id) => childrenBySponsor.get(id) || [])
      .filter((member) => !seen.has(member.id));
    levels.push(next);
    cursor = next.map((member) => member.id);
    cursor.forEach((id) => seen.add(id));
    if (!cursor.length) break;
  }
  return levels;
}

function buildContext(rows, settingsRows) {
  const settings = {
    performance: true,
    pair: true,
    leadership: true,
    mentoring: true,
    sharing: true
  };
  settingsRows.forEach((row) => {
    settings[row.bonus_type] = Boolean(row.active);
  });

  const members = rows.map((row) => ({
    id: row.id,
    name: row.name,
    sponsorId: row.sponsor_id || "",
    placementParentId: row.placement_parent_id || "",
    rankName: higherRankName(row.rank_name || "Member", row.metric_rank_name || "Member"),
    tupoDone: Boolean(row.tupo_done),
    tupoBlocked: Boolean(row.tupo_blocked),
    disabledBonuses: {
      performance: Boolean(row.disable_bonus_performance),
      pair: Boolean(row.disable_bonus_pair),
      leadership: Boolean(row.disable_bonus_leadership),
      mentoring: Boolean(row.disable_bonus_mentoring),
      sharing: Boolean(row.disable_bonus_sharing)
    },
    stockistFeeRate: number(row.fee_rate),
    ppv: number(row.ppv),
    appv: number(row.appv),
    tnpv: number(row.tnpv),
    atnpv: number(row.atnpv),
    gpv: number(row.gpv),
    leftPv: number(row.left_pv),
    rightPv: number(row.right_pv)
  }));
  const byId = new Map(members.map((member) => [member.id, member]));
  const childrenBySponsor = new Map();
  members.forEach((member) => {
    if (!childrenBySponsor.has(member.sponsorId)) childrenBySponsor.set(member.sponsorId, []);
    childrenBySponsor.get(member.sponsorId).push(member);
  });
  return { members, byId, childrenBySponsor, settings };
}

function addLedger(ledger, memberId, type, bv, sourceMemberId = null, generation = null, note = "") {
  const amount = Math.round(number(bv));
  if (amount <= 0) return;
  ledger.push({
    memberId,
    bonusType: type,
    sourceMemberId,
    generation,
    bv: amount,
    note
  });
}

function performanceLedger(context) {
  const ledger = [];
  if (!context.settings.performance) return ledger;
  const { members, byId } = context;

  members.forEach((member) => {
    if (!tupoQualified(member) || bonusDisabled(member, "performance")) return;
    const rate = rankRate(memberRank(member), "performanceRate");
    addLedger(ledger, member.id, "performance", number(member.ppv) * rate / 100, member.id, 0, `PPV pribadi ${rate}%`);
  });

  members.forEach((source) => {
    const sourcePpv = number(source.ppv);
    if (!sourcePpv) return;
    let highestRate = rankRate(memberRank(source), "performanceRate");
    let sponsorId = source.sponsorId;
    const visited = new Set([source.id]);
    while (sponsorId) {
      const upline = byId.get(sponsorId);
      if (!upline || visited.has(upline.id)) break;
      visited.add(upline.id);
      const uplineRate = rankRate(memberRank(upline), "performanceRate");
      if (uplineRate > highestRate) {
        if (tupoQualified(upline) && !bonusDisabled(upline, "performance")) {
          const diffRate = uplineRate - highestRate;
          addLedger(ledger, upline.id, "performance", sourcePpv * diffRate / 100, source.id, null, `Selisih peringkat ${diffRate}% dari PPV downline`);
        }
        highestRate = uplineRate;
        if (highestRate >= 30) break;
      }
      sponsorId = upline.sponsorId;
    }
  });

  return ledger;
}

function rawPairMap(context) {
  const result = new Map();
  if (!context.settings.pair) return result;
  context.members.forEach((member) => {
    if (!tupoQualified(member) || bonusDisabled(member, "pair")) {
      result.set(member.id, 0);
      return;
    }
    const rate = rankRate(memberRank(member), "pairRate");
    const pairedPv = Math.min(number(member.leftPv), number(member.rightPv));
    result.set(member.id, Math.min(Math.round(pairedPv * rate / 100), MAX_MEMBER_PAIR_BV));
  });
  return result;
}

function leadershipLedger(context) {
  const ledger = [];
  if (!context.settings.leadership) return ledger;
  context.members.forEach((member) => {
    if (!tupoQualified(member) || bonusDisabled(member, "leadership")) return;
    const depth = allowedLeadershipGenerations(memberRank(member));
    if (!depth) return;
    generationLevels(member.id, context.childrenBySponsor, depth).forEach((level, index) => {
      level
        .filter((downline) => memberRank(downline) === memberRank(member))
        .forEach((downline) => {
          addLedger(
            ledger,
            member.id,
            "leadership",
            number(downline.gpv) * leadershipRates[index] / 100,
            downline.id,
            index + 1,
            `G${index + 1} peringkat sama ${leadershipRates[index]}% dari GPV`
          );
        });
    });
  });
  return ledger;
}

function sharingLedger(context) {
  const ledger = [];
  if (!context.settings.sharing) return ledger;
  const participants = context.members
    .filter((member) => tupoQualified(member) && !bonusDisabled(member, "sharing"))
    .map((member) => ({
      member,
      weight: memberRank(member) === "Director" ? 2 : memberRank(member) === "Executive Director" ? 1 : 0
    }))
    .filter((item) => item.weight > 0);
  const totalWeight = participants.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return ledger;
  const pool = Math.round(companyTnpv(context.members) * SHARING_POOL_RATE);
  participants.forEach((participant) => {
    addLedger(
      ledger,
      participant.member.id,
      "sharing_profit",
      pool * participant.weight / totalWeight,
      null,
      null,
      `Pool sharing 3%, bobot ${participant.weight}/${totalWeight}`
    );
  });
  return ledger;
}

function mentoringLedger(context, pairBonusByMember) {
  const ledger = [];
  if (!context.settings.mentoring || !context.settings.pair) return ledger;
  context.members.forEach((member) => {
    if (!tupoQualified(member) || bonusDisabled(member, "mentoring")) return;
    const depth = allowedMentoringGenerations(memberRank(member));
    if (!depth) return;
    generationLevels(member.id, context.childrenBySponsor, depth).forEach((level, index) => {
      level.forEach((downline) => {
        const downlinePairBonus = pairBonusByMember.get(downline.id) || 0;
        addLedger(
          ledger,
          member.id,
          "mentoring",
          downlinePairBonus * MENTORING_RATES[index] / 100,
          downline.id,
          index + 1,
          `G${index + 1} ${MENTORING_RATES[index]}% dari Bonus Pasangan downline`
        );
      });
    });
  });
  return ledger;
}

function sumLedger(ledger) {
  return ledger.reduce((sum, row) => sum + number(row.bv), 0);
}

export async function runBonusCalculation(client, periodKey, actorId) {
  const [membersResult, settingsResult] = await Promise.all([
    client.query(
      `
        select m.id, m.name, m.sponsor_id, m.placement_parent_id, m.rank_name,
               m.tupo_done, m.tupo_blocked,
               m.disable_bonus_performance, m.disable_bonus_pair, m.disable_bonus_leadership,
               m.disable_bonus_mentoring, m.disable_bonus_sharing,
               s.fee_rate,
               pm.ppv, pm.appv, pm.tnpv, pm.atnpv, pm.gpv, pm.left_pv, pm.right_pv, pm.rank_name as metric_rank_name
        from members m
        left join stockists s on s.id = m.stockist_id
        left join member_period_metrics pm on pm.member_id = m.id and pm.period_key = $1
        where m.active = true
        order by m.id
      `,
      [periodKey]
    ),
    client.query("select bonus_type, active from bonus_settings")
  ]);
  const context = buildContext(membersResult.rows, settingsResult.rows);

  const fixedLedger = [
    ...performanceLedger(context),
    ...leadershipLedger(context),
    ...sharingLedger(context)
  ];
  const rawPair = rawPairMap(context);
  const stockistFeeBv = context.members.reduce((sum, member) => sum + Math.round(number(member.ppv) * number(member.stockistFeeRate) / 100), 0);
  const maxPayoutBv = Math.round(companyTnpv(context.members) * MAX_COMPANY_PAYOUT_RATE);
  const pairFactor = 1;

  const pairBonus = new Map();
  const pairLedger = [];
  context.members.forEach((member) => {
    const finalAmount = rawPair.get(member.id) || 0;
    const rate = rankRate(memberRank(member), "pairRate");
    const leftPv = number(member.leftPv);
    const rightPv = number(member.rightPv);
    const pairedPv = Math.min(leftPv, rightPv);
    pairBonus.set(member.id, finalAmount);
    addLedger(
      pairLedger,
      member.id,
      "pair",
      finalAmount,
      null,
      null,
      `Bonus Pasangan ${rate}% dari kaki terlemah ${pairedPv} PV (kiri ${leftPv} PV, kanan ${rightPv} PV)`
    );
  });

  const ledger = [
    ...fixedLedger,
    ...pairLedger,
    ...mentoringLedger(context, pairBonus)
  ];

  await client.query("delete from bonus_ledger where period_key = $1", [periodKey]);
  for (const row of ledger) {
    await client.query(
      `
        insert into bonus_ledger (period_key, member_id, bonus_type, source_member_id, generation, bv, note)
        values ($1, $2, $3, $4, $5, $6, $7)
      `,
      [periodKey, row.memberId, row.bonusType, row.sourceMemberId, row.generation, row.bv, row.note]
    );
  }
  await client.query(
    "insert into audit_logs (actor_id, action, entity_type, entity_id, payload) values ($1, $2, $3, $4, $5)",
    [actorId, "bonus.run", "bonus_period", periodKey, { ledgerRows: ledger.length, pairFactor }]
  );

  const totals = ledger.reduce((result, row) => {
    result[row.bonusType] = (result[row.bonusType] || 0) + row.bv;
    return result;
  }, {});

  return {
    periodKey,
    memberCount: context.members.length,
    ledgerRows: ledger.length,
    companyTnpv: companyTnpv(context.members),
    maxPayoutBv,
    stockistFeeBv,
    pairFactor,
    totals
  };
}
