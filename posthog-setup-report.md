# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for the DevEvents project — a developer event hub listing conferences and hackathons. Client-side tracking was added to two interactive components: the homepage Explore button and the event listing cards. PostHog is initialized via `instrumentation-client.ts` (the Next.js 15.3+ pattern), with a reverse proxy configured in `next.config.ts` to route analytics traffic through `/ingest` and avoid ad blockers. Environment variables are stored in `.env.local`.

| Event name | Description | File |
|---|---|---|
| `explore_clicked` | User clicked the Explore button on the homepage to scroll to featured events. | `src/components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to navigate to the event detail page. Properties: `event_title`, `event_slug`, `event_location`, `event_date`. | `src/components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/531897/dashboard/1917030)
- **Insight**: [Explore button clicks over time (wizard)](https://us.posthog.com/project/531897/insights/POdEpNgf)
- **Insight**: [Event card clicks over time (wizard)](https://us.posthog.com/project/531897/insights/X2n8Eor4)
- **Insight**: [Explore to event click funnel (wizard)](https://us.posthog.com/project/531897/insights/cM1wVBiH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set. Required keys: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. (No auth exists yet; apply this when you add login/signup.)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
