# DSH Plugin Console

[![CI](https://github.com/AlexYin-Tongji/dsh-plugin-console/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AlexYin-Tongji/dsh-plugin-console/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/dsh-plugin-console.svg)](https://www.npmjs.com/package/dsh-plugin-console)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

`dsh-plugin-console` 是一个可安装到 DeepSeek Harness Web profile 的插件管理器：它把社区目录、当前 profile 的包清单和 Loader 运行态放在 Settings 的一级“插件管理”页面里，并通过官方 `dsh plugin` 命令完成安装、更新和删除。

## 已实现

- **插件商店**：默认同步 [awesome-dsh-plugin](https://awesome-dsh-plugin.com/plugins.json)，支持搜索、分类、分页和本地 last-known-good 缓存。
- **安装前验证**：npm 包检查合法 SemVer、repository、HTTPS tarball、SHA-512 integrity、`dsh.bundle.patch` 和生命周期脚本；GitHub 包固定到 40 位 commit，并确认 `package.json` 与声明的 patch 文件存在。
- **已安装清单**：读取当前 profile 的 direct dependencies、bundle 顺序、解析后的 package manifest、Loader entry/Fiber phase 和 Web client 能力。
- **使用说明**：读取 Markdown、MDX、RST、TXT 和无扩展名 README；Markdown 使用 README 专用的 GFM + 安全 HTML renderer，支持常见段落、链接、徽章和相对图片，所有文档都可切换到保留原文的源码视图。
- **快捷更新**：不会自动安装或更新。发现新版本后只显示更新按钮；用户点击后仍需复核目标版本和来源、勾选确认并再次点击“确认执行”。社区目录中的包按已验证 artifact 更新；目录外 npm 包只有在同名、同 repository、合法升级版本和 integrity 都成立时才可更新，并在确认页单独警告。
- **快捷删除**：只允许删除 direct dependency，系统 bundle 受保护；删除会同时清理 `dsh.profile.bundles` 中的对应层，确保下次启动不再加载已删除插件；删除包不会擅自删除包创建的数据。
- **暂停使用**：保留已安装依赖，通过 profile 的结构化 Loader patch 持久化 `disabled` 状态；可随时恢复，管理器自身不会允许自暂停。
- **隔离试运行**：安装或更新后，在临时 `DSH_HOME`、随机本地端口和隔离 HOME/TMP 中启动完整 Web profile；已安装的其他第三方 bundle 也会一起启动，因此插件间、插件与 DSH/Cordis 的初始化冲突会在新版本写入前被发现。目标 bundle 的 Loader 条目、精确包版本、客户端 bundle 的语法／执行／唯一包名注册／模块依赖和 HTTP 资源全部通过后才保留新版，否则自动恢复旧版本。浏览器内 UI 交互仍由用户在重启刷新后人工确认。
- **变更确认**：所有写操作先生成 5 分钟有效的 plan；执行前重新校验 profile 指纹、当前包状态和 artifact integrity，同一时间只允许一个变更。元数据实际变化后才按恢复后的 lockfile 做 frozen reinstall，不会先删除整个 `node_modules`；供应链策略在命令开始前拒绝时不会破坏现有依赖。
- **重启提示**：变更由 pnpm/profile manifest 持久化，当前 Loader 不会被伪装成已更新，页面会明确显示隔离试运行结果和重启后生效状态。
- **DSH 一键更新**：左侧边栏底部新增 Harness 更新入口，图标常显当前版本，有更新时显示待更新版本角标；点开面板可查看运行中/已安装/最新版本与更新通道（`latest`/`next` 全部通道取最高版本，如 rc 系列中 `latest` 落后于 `next` 时会直接显示 `next` 的更新），并可强制「重新检查」绕过缓存、一键更新 DeepSeek Harness 本体。更新只支持 npm 全局安装（自动解析运行中 dsh 可执行文件所属的 npm prefix）；执行时先精确校验新旧版本，再用新 Harness 在隔离副本中启动**完整 profile**——所有已安装插件的 Loader 条目、激活状态、client bundle 图与 HTTP 表面全部通过才接受，任何插件初始化失败都会自动重装旧版 Harness 并再次隔离验证；更新成功后运行中的 Host 保持旧版本，重启 DSH 后生效。

## 安装与更新

在 DSH 安装所在环境运行：

```sh
# npm 发布版（显式 @latest，重复执行即可升级到最新版）
dsh plugin --profile web add dsh-plugin-console@latest

# 本地源码检出目录
dsh plugin --profile web add .
```

### 升级到新版本

已安装旧版时，重新执行不带版本号的 `add <包名>` **不会升级**：pnpm 会保留 profile 中已有的 `^x.y.z` 版本范围并报告 "Already up to date"。升级方式任选其一：

```sh
# 方式一：显式 @latest 重新解析最新版
dsh plugin --profile web add dsh-plugin-console@latest
```

方式二：在插件管理页面一键自更新（0.2.2 起内置）——Settings → 插件管理 → 已安装 → dsh-plugin-console → 更新。

无论哪种方式，更新完成后都需要重启 `dsh web` 并刷新浏览器：Web client module roster 在进程启动时扫描 profile 包，运行中的 Host 与已打开的页面仍持有旧的启动模块图。

### 没有拿到最新版？

1. 确认 registry 上的最新版本，并与 [GitHub Releases](https://github.com/AlexYin-Tongji/dsh-plugin-console/releases) 对比：
   `npm view dsh-plugin-console version`
   若输出落后于 Releases，通常是镜像源同步延迟或本地缓存——检查 `npm config get registry` / `pnpm config get registry`（官方源为 `https://registry.npmjs.org/`），或稍后重试。
2. 确认 profile 实际安装的版本：查看 `$DSH_HOME/profiles/web/package.json` 的依赖声明与 `$DSH_HOME/profiles/web/node_modules/dsh-plugin-console/package.json` 的 `version` 字段。
3. 若版本已是最新但界面仍是旧版，重启 `dsh web` 后强制刷新浏览器。

验证 bundle 层：

```sh
dsh --profile web --dump-config
```

## 配置

bundle 默认配置位于 `cordis.patch.yml`。可在 profile 的 `cordis.patch.yml` 中覆盖完整行配置，注意 DSH patch 对 `config` 是整段替换：

```yaml
- id: plugin-console
  config:
    catalogUrl: https://awesome-dsh-plugin.com/plugins.json
    cacheMaxAgeMs: 172800000
    requestTimeoutMs: 15000
    maxCatalogBytes: 5000000
    maxReadmeBytes: 262144
    operationTimeoutMs: 300000
    canaryTimeoutMs: 60000
    dshBin: dsh
    npmBin: npm
```

也支持环境变量：

- `DSH_PLUGIN_CONSOLE_CATALOG_URL`
- `DSH_PLUGIN_CONSOLE_DSH_BIN`
- `DSH_PLUGIN_CONSOLE_NPM_BIN`

目录缓存写入 `$DSH_HOME/cache/plugin-console/catalog.json`。上游不可用时保留最后一次有效目录，不会用空响应覆盖缓存。`catalogUrl` 必须是绝对 HTTPS URL。`dshBin` / `DSH_PLUGIN_CONSOLE_DSH_BIN` 与 `npmBin` / `DSH_PLUGIN_CONSOLE_NPM_BIN` 是管理员级配置，会被作为本机可执行文件启动，不应接受不可信输入。

Harness 更新版本来自 `@deepseek-ai/dsh` 的**全部 npm dist-tag**（`latest`/`next` 等），面板显示版本所在的通道，并总是取各通道中的最高合法 SemVer；「重新检查」会绕过 5 分钟缓存强制重新拉取 dist-tags。

## 安全边界

DSH 插件是 Host 进程中的受信任代码，不是隔离的浏览器扩展。这个管理器遵循以下边界：

1. 社区 feed 只用于发现，不执行 feed 中的 `install` 字符串。
2. 浏览器 API 只有 typed `install`、`update`、`remove`、`pause`、`resume`，没有任意 pnpm argv 或 shell 接口。
3. 子进程使用参数数组和 `shell: false` 调用 `dsh plugin`。
4. 安装、更新固定传 `--ignore-scripts`；需要构建脚本的包不会被静默放行。
5. GitHub 来源必须固定到 commit；npm 来源使用精确版本，并在安装后核对 lockfile integrity。
6. pnpm 成功后还会运行 composition 校验与隔离启动 canary；完整 profile 的启动、精确版本、bundle、integrity、目标 Loader entry、客户端 bundle 协议或 HTTP 任一不匹配都视为失败并进入恢复。
7. canary 会实际执行新版及其现有依赖的第三方代码以发现初始化崩溃；临时 DSH/HOME/TMP 隔离常规数据路径，但不是操作系统安全沙箱，插件仍属于受信任代码边界。
8. API 仅接受同源 POST；变更请求还必须来自 loopback。profile 路径从 Loader `baseUrl` 推导并限制在 `$DSH_HOME/profiles` 下。
9. README 使用独立的不可信内容 renderer；raw HTML 只允许安全标签和协议，事件属性、脚本、iframe、危险 URL 会被清理，非 Markdown 和源码模式只展示纯文本。
10. 删除只改变 package-manager/profile 状态，不清理未知的插件数据目录；清理 Bundle 配置或组合失败会恢复删除前的 profile。
11. Harness 更新只作用于解析出的 npm 全局安装（POSIX `<prefix>/lib/node_modules` 或 Windows `<prefix>/node_modules` 布局，且 prefix 的 bin 面存在）；其他安装方式只展示状态，不提供更新按钮。更新目标固定为 `@deepseek-ai/dsh` 的精确 npm 版本，命令参数数组固定、`shell: false`。
12. Harness 更新在写入前用 `--dump-config` 快照完整组合（含 `!!js` 表达式的本地求值），写入后校验精确版本与 CLI 输出，再以新二进制运行全 profile 隔离 canary；失败自动重装旧版并再次验证。更新的是 Harness 本体，属于执行新一版受信任代码，确认页明确警告。

“已验证”只表示 manifest 和 artifact 结构符合 DSH 安装约定，不表示作者或代码经过安全背书。

## 开发

要求 Node.js 22.19+ 或 24+、pnpm 10+。Host/Client peer contract 固定到已验证的 DSH `0.1.0-rc.6`：

```sh
pnpm install
pnpm run typecheck
pnpm run test
pnpm run build
```

如果本机 pnpm 因 `approve-builds` 阻止开发依赖的安装脚本，可以直接运行已安装的工具：

```sh
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vitest/vitest.mjs run
node node_modules/tsdown/dist/run.mjs -c tsdown.config.ts
```

包结构：

```text
src/catalog.ts                         社区 feed、缓存、npm/GitHub 验证
src/profile.ts                         profile manifest、包清单、Loader 运行态
src/operations.ts                      plan、串行 dsh CLI 变更、失败恢复
src/harness.ts                         DSH 安装解析（npm global prefix）与更新状态
src/harness-operations.ts              Harness 更新 plan/execute、版本校验、回滚
src/canary.ts                          插件隔离 canary + 全 profile Harness canary
src/index.ts                           Host API /api/plugin-console
src/client/index.ts                    Web Settings slot + 侧边栏入口注册
src/client/PluginManageSettingsTab.tsx 商店、已安装、详情和确认 UI
src/client/HarnessUpdateAction.tsx     侧边栏 DSH 更新入口与确认面板
src/client/*.module.css                主题变量和响应式布局
tests/                                 目录、profile、事务、canary、Harness 更新与构建契约测试
```

贡献、安全与发布说明：

- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`SECURITY.md`](SECURITY.md)
- [`CHANGELOG.md`](CHANGELOG.md)
- [`docs/RELEASING.md`](docs/RELEASING.md)

## DSH 插件开发原则

这个包遵循 DSH 官方的 Cordis 方式：插件通过 `apply(ctx)` 注册能力，依赖通过 `inject` 声明，外部资源通过 `ctx.effect()` 回收；持久化 profile 由 `dsh plugin` / pnpm 负责，Loader 只负责当前进程生命周期。

官方参考：

- [DeepSeek Harness architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)
- [First plugin tutorial](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md)
- [Package and install a plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)
- [Extension cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cookbook/extension-cookbook.md)

## 参考与致谢

本项目的主体业务实现为独立编写，但使用或改写了以下 MIT 项目的接口与实现模式：

- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)：bundle/profile、Cordis 生命周期、Loader/Fiber 投影、Web client module 与 Settings slot 契约。
- [DSH Plugin Marketplace](https://github.com/w2112515/dsh-plugin-marketplace)：双端外部 bundle、同源私有 API、短时 review plan / recovery 架构，以及 `tsdown.config.ts` 的 client envelope 与 CSS-module bundler。构建配置是直接改写，不只是产品灵感。

以下项目仅作为产品和交互行为参考，没有直接并入其源码：

- [dshmarket](https://github.com/dsh-market/dsh-market)
- [dsh-plugin-store / Plugin Hub](https://github.com/yunhuantian/dsh-plugin-store)

完整版权、revision 和 MIT notice 见 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。

## 关于 AI 摘要

目录同步和 artifact 验证使用结构化 metadata，不把 AI 输出当成安装依据。后续可以增加一个只读的 AI 摘要层，用于从已验证 README 生成“能做什么 / 怎么用 / 注意事项”，但摘要必须标注为模型生成，安装目标、版本和风险仍以 Host 的 manifest 验证为准。

## License

MIT
