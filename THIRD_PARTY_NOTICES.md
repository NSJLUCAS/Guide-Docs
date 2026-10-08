# Guide documentation site — third-party notices

This site adapts the architecture, styles and UI of
[monitor-probe/monitor-document](https://github.com/monitor-probe/monitor-document),
source revision `a947822d790d5b7be4f2ee19474009e9415afbec`.

Upstream: MIT License, Copyright (c) 2026 stqfdyr. The complete original license
is retained unchanged in this directory's LICENSE and distributed as LICENSE.txt.
Guide replaces product prose, navigation and branding and adds static delivery
checks, SEO and Guide configuration. Upstream copyright is not replaced.

The UI foundations include components based on shadcn/ui (MIT, Copyright (c)
2023 shadcn). Its original license is retained in licenses/shadcn-ui.txt and
included in the static dependency notices. Lucide icon notices include both its
ISC and upstream Feather MIT sections. Inter font has its SIL Open Font License.

Builds collect the original license/notice files from the exact installed npm
packages included in the browser bundle (plus the bundled font). These texts are
distributed in DEPENDENCY_LICENSES.txt; build tooling is not part of the browser
runtime. Missing license text for a bundled package stops the build.

The independent document package pins source-map-js to the patched version
through its lockfile. Native HTML dialog replaces the Radix dialog wrapper while
retaining its visual layout, avoiding distribution of react-remove-scroll-bar
2.3.8 without its exact copyright text. Only the MIT-licensed Radix Slot remains.
This does not modify Guide's backend or admin dependencies.

Guide product provenance and existing disclosures remain in the repository's
THIRD_PARTY_NOTICES.md. Third-party icon catalogs or favicons selected by Guide
administrators are not bundled with this documentation site or re-licensed by it.
