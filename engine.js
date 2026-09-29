/* PuckMath engine - hockey stat math: save %, GAA, shot share, PDO (the luck meter), points pace.
   Pure math, no DOM. Shared by app.html and the node test suite. */
(function (root) {
  'use strict';

  function safe(n) { return (typeof n === 'number' && isFinite(n)) ? n : null; }

  // Goaltending.
  function savePct(saves, shotsAgainst) {
    return shotsAgainst > 0 ? safe(saves / shotsAgainst) : null;
  }
  function gaa(goalsAgainst, minutesPlayed) {
    return minutesPlayed > 0 ? safe(60 * goalsAgainst / minutesPlayed) : null;
  }

  // Shooting.
  function shootingPct(goals, shots) {
    return shots > 0 ? safe(goals / shots) : null;
  }

  // Shot share (possession proxy): attempts = shots + missed + blocked.
  // Corsi counts everything; Fenwick drops blocked shots.
  function corsiPct(ownAttempts, againstAttempts) {
    var t = ownAttempts + againstAttempts;
    return t > 0 ? safe(100 * ownAttempts / t) : null;
  }
  function fenwickPct(ownUnblocked, againstUnblocked) {
    var t = ownUnblocked + againstUnblocked;
    return t > 0 ? safe(100 * ownUnblocked / t) : null;
  }

  // PDO: team shooting % plus team save %, on a 100 scale. The league's gravity
  // pulls every team back toward 100 - PDO is the luck meter, not a skill score.
  function pdo(teamShootingPct, teamSavePct) {
    if (teamShootingPct === null || teamSavePct === null) return null;
    return safe(100 * teamShootingPct + 100 * teamSavePct);
  }
  function pdoBand(p) {
    if (!(p > 0)) return null;
    if (p < 97.5) return 'snakebitten - the goals are coming if the process is real';
    if (p < 98.5) return 'a touch unlucky';
    if (p <= 101.5) return 'normal water - this is probably real';
    if (p <= 102.5) return 'running a little hot';
    return 'riding the wave - gravity collects, it always collects';
  }

  // Standings: NHL gives 2 points for a win, 1 for an overtime/shootout loss.
  function pointsPct(points, gamesPlayed) {
    return gamesPlayed > 0 ? safe(points / (2 * gamesPlayed)) : null;
  }
  // Season pace: points per game scaled to an 82-game season.
  function pointsPace(points, gamesPlayed, seasonGames) {
    var season = seasonGames || 82;
    return gamesPlayed > 0 ? safe(points * season / gamesPlayed) : null;
  }

  // Rate stats per 60 minutes.
  function per60(count, minutesPlayed) {
    return minutesPlayed > 0 ? safe(60 * count / minutesPlayed) : null;
  }

  function saveBand(s) {
    if (!(s > 0)) return null;
    if (s < 0.895) return 'in trouble - the backup is stretching';
    if (s < 0.905) return 'below the line - starter questions';
    if (s < 0.915) return 'league-average goaltending';
    if (s < 0.925) return 'quality starter';
    return 'Vezina conversation - stealing games';
  }
  function corsiBand(c) {
    if (!(c > 0)) return null;
    if (c < 45) return 'pinned - playing without the puck all night';
    if (c < 48) return 'underwater - chasing the game';
    if (c < 52) return 'break-even territory';
    if (c < 55) return 'controlling play';
    return 'dominant puck possession - the shot clock agrees';
  }

  function fmtPct3(x) { return x === null || !isFinite(x) ? '-' : (x * 100).toFixed(1).replace(/^\d+\./, function (m) { return m; }) + '%'; }
  function fmtSv(x) { // hockey writes .912, not 91.2%
    if (x === null || !isFinite(x)) return '-';
    var s = (x).toFixed(3);
    return x < 1 ? s.slice(1) : s;
  }
  function fmt2(x) { return x === null || !isFinite(x) ? '-' : x.toFixed(2); }
  function fmt1(x) { return x === null || !isFinite(x) ? '-' : x.toFixed(1); }

  var api = {
    savePct: savePct,
    gaa: gaa,
    shootingPct: shootingPct,
    corsiPct: corsiPct,
    fenwickPct: fenwickPct,
    pdo: pdo,
    pdoBand: pdoBand,
    pointsPct: pointsPct,
    pointsPace: pointsPace,
    per60: per60,
    saveBand: saveBand,
    corsiBand: corsiBand,
    fmtSv: fmtSv,
    fmt2: fmt2,
    fmt1: fmt1
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PuckMath = api;
})(typeof window !== 'undefined' ? window : globalThis);
