![wetherspenny](public/static/Logo.svg "wetherspenny")

## About

[wetherspenny](https://www.wetherspenny.com) is a simple web app that shows you the best value drinks at any Wetherspoon pub. Every drink is ranked by price per unit of alcohol, including multi-buy deals, with prices for each individual pub.

## How?

- The pub list and menus come from the API behind the Wetherspoon order & pay app (`ca.jdw-apps.net`).
- Its public client key is read from the Wetherspoon web ordering site's bundle on the server (cached for a day), so a key change doesn't break the site. Set `JDW_API_KEY` (and optionally `JDW_API_BASE_URL`) to override it.
- The API's firewall turns away server-side requests but allows browsers, the same way Wetherspoon's own web ordering site uses it, so venues and menus are fetched and ranked in the browser and cached in `localStorage`.
- Units are worked out from each drink's ABV and serving size (pint, half, single, 175ml glass, can size from the description, and so on). See [`src/lib/drinks.ts`](src/lib/drinks.ts).

## Development

```bash
pnpm install
pnpm dev
```

```bash
pnpm test        # parser and venue unit tests
pnpm typecheck
pnpm lint
```

## Tech Stack

Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, TypeScript, Vitest, deployed on Vercel.

## Notes

- Some cocktails and pitchers aren't included because Wetherspoon doesn't publish how much alcohol is in them.
- Multi-buy deals (e.g. "4 for £5") are ranked by the total units for the total price, so they mean buying several drinks. They can be switched off on each pub page.
- Not affiliated with J D Wetherspoon. Please drink responsibly.

## License

MIT @ Charlie Morris
