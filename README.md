# MindCivilis

A MindCivilis egy ingyenesen használható, magyar nyelvű kutatási
webalkalmazás. Önkéntes hozzájárulás után egy rövid kérdőívből három nézeti
tengelyt és egy kétdimenziós ideológiai térképet készít.

**Élő alkalmazás:** [mindcivilis.joe328.chatgpt.site](https://mindcivilis.joe328.chatgpt.site)

## Fő funkciók

- első használatkor blokkoló, visszautasítható kutatási hozzájárulás;
- nem, településtípus, ország és életkor bekérése csak hozzájárulás esetén;
- név és e-mail nélküli, álnevesített, privát szerveroldali tárolás;
- külön tároló a hozzájáruló és az elutasító ágnak;
- 12 állításból számított három nézeti tengely;
- korosztály, ország, településtípus és nem szerinti csoportátlagok, kizárólag
  legalább 10 befejezett kitöltésnél;
- saját adatok letöltése és végleges törlése;
- teljes magyar adatkezelési és kutatási tájékoztató;
- mobil- és asztali nézet.

Az eredmény tájékozódási segédlet, nem politikai diagnózis. A minta önkéntes,
ezért nem tekinthető reprezentatívnak.

## Technológia

- Next.js-kompatibilis Vinext és React
- Cloudflare Worker futtatókörnyezet
- privát Cloudflare D1-adatbázis
- Drizzle migrációk
- OpenAI Sites hosztolás

## Helyi indítás

Node.js 22.13 vagy újabb, valamint pnpm szükséges.

```bash
pnpm install
pnpm run db:generate
pnpm exec wrangler d1 migrations apply site-creator-d1 --local
pnpm dev
```

Ellenőrzések:

```bash
pnpm run typecheck
pnpm run lint
pnpm test
```

## Adatvédelmi felépítés

A böngésző egy véletlen részvételi kulcsot tárol helyben. A szerver ennek csak
SHA-256 lenyomatát menti. Az alkalmazás adatbázisába nem kerül név, e-mail,
telefonszám vagy hirdetési azonosító. Az elutasítási rekord nem tartalmaz
demográfiai vagy ideológiai adatot.

## Licenc

MIT — lásd a [LICENSE](LICENSE) fájlt.
