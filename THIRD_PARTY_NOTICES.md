# Third-Party Notices

This project is original work built for DeepSeek Harness, with selected implementation patterns adapted from MIT-licensed projects. The notices below preserve the relevant copyright and permission notices.

## DeepSeek Harness

Source: https://github.com/deepseek-ai/deepseek-harness

Revision inspected: `47f943859bef60e4160492346772ded9b24f765a`

Used or adapted for:

- DSH bundle/profile manifest and Cordis lifecycle conventions
- Web client module envelope and Settings slot integration
- Loader inventory and `FiberState` projection pattern
- Host WebServer route contracts and DSH theme primitives

MIT License

Copyright (c) 2026 DeepSeek

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## DSH Plugin Marketplace

Source: https://github.com/w2112515/dsh-plugin-marketplace

Revision inspected: `1d610b6cfae7da81df3d3d6ee636360b3f3d0872`

Used or adapted for:

- The dual Host/client out-of-tree bundle structure
- The package-private same-origin API pattern
- Reviewed short-lived operation plans and profile recovery design
- The `tsdown` lazy-client envelope and deterministic CSS-module bundling plugin; `tsdown.config.ts` is a direct adaptation

MIT License

Copyright (c) 2026 DSH Plugin Marketplace contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Design References

The following MIT-licensed projects were inspected for product behavior and ecosystem conventions. No source files from these projects were directly incorporated into this repository:

- `dshmarket` — https://github.com/dsh-market/dsh-market — revision `805d1a716aaa3ea09d111b150645fd88b3e8b51d` — Copyright (c) 2026 fkysly and dsh-market contributors
- `dsh-plugin-store` / Plugin Hub — https://github.com/yunhuantian/dsh-plugin-store — revision `5ccf801a41279cd065ed431d8d34f449a5e1ccef` — Copyright (c) 2026 dsh-plugin-store contributors

These design references informed feature comparison only: installed-plugin views, update/remove workflows, restart-state communication, community catalog presentation, and diagnostics expectations.

## Runtime Dependencies

Runtime and development dependencies retain their own licenses and copyright notices in their distributed packages. Their exact versions are recorded in `pnpm-lock.yaml`.
