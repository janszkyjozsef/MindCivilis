# MindCivilis

MindCivilis is a privacy-first civic identity atlas. It turns questionnaire responses into an evolving, multidimensional profile without assigning a party, diagnosis or fixed personality label.

## What is included

- 23 questionnaires and 497 items, including nested 20/40/80-item political banks and 20/45-item personality banks
- complete English, Hungarian and German interfaces and questionnaire text
- three switchable result views: Constellation, Fieldbook and Identity Map
- local autosave, questionnaire history and reusable answers across nested banks
- profile capsule export/import and comparison over shared dimensions
- optional age band and broad regional metadata
- equal first-run choices for private exploration or explicit research participation
- consent-only collection of gender, settlement type, country and age in a private D1 database
- pseudonymous storage: the device keeps a random participation token while the server stores only its SHA-256 hash
- self-service export and permanent deletion of the participant's server record
- privacy-safe group maps by age band, country, settlement type or gender, hidden until a cohort has at least 10 completed participants
- an in-app research notice in English, Hungarian and German

## Privacy model

There is no account or third-party analytics service. In private mode, drafts, settings and results stay in the browser's local storage unless the user deliberately exports a file. Refusing research participation does not remove any application feature.

In research mode, the participant explicitly submits four demographic fields and the app stores derived atlas scores after each completed questionnaire. Raw item answers, names, email addresses, precise locations and imported comparison profiles are not sent to the research database. Public cohort endpoints return aggregates only when at least 10 completed participants share the selected group. The participant token stored in the browser authorizes export and deletion of that participant's server record.

## Links

- [Live MindCivilis application](https://mindcivilis-atlas.joe328.chatgpt.site)
- [József Janszky research portfolio](https://jozsef-janszky-portfolio.joe328.chatgpt.site/#applications)
- [GitHub-hosted research profile](https://janszkyjozsef.github.io/Ifj.-Janszky-J-zsef-Profil/#applications)

The questionnaires are an interpretive self-reflection prototype, not a clinical instrument, voting recommendation or expert assessment. Public-domain IPIP-style logic is identified where used; exploratory modules are labelled as non-clinically validated.

## Development

```bash
npm ci
npm test
npm run dev
```

Create a production build with:

```bash
npm run build
```

## License

MIT. See `LICENSE`.
