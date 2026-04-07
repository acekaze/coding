# Wiki Log

Use this file as an append-only timeline.

## [2026-04-06] setup | workspace scaffold

- initialized the wiki workspace structure
- created schema, templates, prompt starters, and base wiki files

## [2026-04-06] ingest | karpathy llm wiki gist notes

- added raw source notes for the Karpathy `LLM Wiki` gist
- created the initial source page, entity page, and two concept pages
- updated the overview and index to reflect the seed pattern

## [2026-04-06] ingest | current workstreams seed

- added five raw source notes for 공개과정, 청소년을 위한 말처방, 제안서, 교육설계, 전종목
- created five linked source pages, five entity pages, four concept pages, and one synthesis analysis page
- updated the overview and index so the wiki now maps the current Jeon Jong-mok-centered workstream ecosystem
- preserved known uncertainty, including the current 2-day vs 3-day public-course planning drift

## [2026-04-06] ingest | wiki operating loop

- added an operating guide and morning/weekly prompt starters for using the wiki as an internal control tower
- added raw source notes and an analysis page describing the internal wiki operations loop
- updated the index so the usage guidance is discoverable from inside the wiki itself

## [2026-04-06] ingest | first-launch wiki routine

- added a new raw note and source page capturing the decision to run the wiki loop at first launch instead of a fixed 09:00 schedule
- updated the operating guide, prompt starter, and operations analysis to reflect the first-launch ritual
- removed the GitHub Pages workflow because the current private repository state is not eligible for Pages hosting

## [2026-04-06] ingest | automated codex wiki sync

- added scripts and prompt guidance for using one Windows machine as the automatic Codex sync host
- documented the shared-use rule that only one device should auto-publish while other devices consume the pushed state
- updated the operating guide and operations analysis to connect automatic sync with GitHub-backed cross-device use

## [2026-04-06] ingest | codex host wake timer

- added a wake-timer script and updated the host setup script to wake the PC at 08:50 and open Codex at 08:55
- documented that this pattern targets sleep or hibernate wake-up, not guaranteed full power-on from complete shutdown
- updated the operating guide and index so the morning host timing is explicit inside the wiki

## [2026-04-07] ingest | windows-led codex refresh

- captured the first morning run result where wake and launch succeeded but the Codex automation did not fire
- changed the 08:55 Windows task to restart Codex if it is already open so the 09:00 automation gets a fresh app state
- updated the operating guide, index, and operations analysis to reflect the refreshed Windows-led morning flow

## [2026-04-07] ingest | public launch and proposal expansion

- added raw notes and source pages for the 공개과정 public launch stack and the Samsung REFRAME jobcrafting proposal
- updated the public-course and ai-education-proposal-portfolio entities so the latest launch and proposal-factory signals are visible from the main graph
- updated the overview and portfolio-map analysis to reflect that the public course is now materially 2-day at the public layer and that the proposal workspace is expanding beyond AI-only packaging
- scanned 청소년을 위한 말처방, 교육설계, and 전종목 again but did not ingest new pages for this round because no equally material new source layer was found

## [2026-04-07] access | cross-device quick start

- created a new Vercel preview deployment for shared browser access
- added GitHub clone and local-viewer steps to the README and operating guide for non-host devices
- kept the automation rule explicit that only one host machine should run the morning auto-sync

## [2026-04-07] access | source-basis portability policy

- added a tracked-project access registry showing which source projects are local-only, local git, or GitHub-backed
- added a reusable analysis page explaining how to interpret `Original workspace basis` safely on other devices
- kept the rule explicit that `raw/sources/` is the portable minimum evidence layer when source folders are not shared

## [2026-04-07] access | requested source handoff pattern

- added a standard workflow for answering cross-device requests for original text from local-only tracked projects
- added a prompt starter and linked source/analysis pages so source handoffs become reusable repository artifacts
- made the rule explicit that requested source text should be written into `raw/sources/` instead of being left only in chat
