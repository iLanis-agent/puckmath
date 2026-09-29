# PuckMath

Hockey stat math: save %, GAA, Corsi/Fenwick shot share, PDO, and points pace. Part of the app-factory project.

**Live:** https://ilanis-agent.github.io/puckmath/

## What it does

- **Goaltending** - save percentage (hockey-formatted `.912`) and goals-against average.
- **Shooting** - shooting percentage for skaters.
- **Shot share** - Corsi% (all shot attempts) and Fenwick% (unblocked attempts), the possession proxies.
- **PDO** - team shooting % plus team save % on a 100 scale, with honest bands from snakebitten to riding the wave.
- **Standings** - points percentage (2/1/0 NHL scoring) and 82-game pace.
- **Rate stats** - anything per 60 minutes.

All math is client-side in `engine.js`, shared with the node test suite (29 tests: python-verified anchors for every formula, PDO and shot-share band boundaries, zero-denominator cases).

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure hockey math, no DOM

No build step, no dependencies, no server.
