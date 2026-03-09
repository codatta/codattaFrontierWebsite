# 路由变更说明文档

> 本文档记录项目路由结构重构的完整变更，用于后续代码审查、Native 端路由跳转配置、后端 schema 字符串更新等场景的参考。

---

## 一、整体原则

| 原则              | 说明                                       |
| ----------------- | ------------------------------------------ |
| 统一 `/m` 前缀    | 所有页面路由均以 `/m` 开头，体现移动端定位 |
| 去除 `/app` 层级  | 原 `/app/...` 中间层全部移除               |
| `/dev` 隔离开发页 | 仅用于开发调试的页面统一归入 `/dev`        |

---

## 二、路由完整对照表

### 认证 / 登录

| 旧路径                     | 新路径                 | 说明                             |
| -------------------------- | ---------------------- | -------------------------------- |
| `/account/signin`          | `/dev/signin`          | 开发测试用登录页，移入 dev       |
| `/account/signin?from=...` | `/dev/signin?from=...` | 未授权重定向（`authRedirect()`） |

### Frontier 任务

| 旧路径                                            | 新路径                                              |
| ------------------------------------------------- | --------------------------------------------------- |
| `/frontier/project/:templateId/:taskId`           | `/m/frontier/project/:templateId/:taskId`           |
| `/frontier/project/:templateId/:taskId/feed/:uid` | `/m/frontier/project/:templateId/:taskId/feed/:uid` |

**受影响的 templateId：**

- `FASHION_VALIDATION`
- `FASHION_GUIDE_TO_DOWNLOAD`
- `AIRDROP_FOOD`
- `AIRDROP_FOOD_APP`
- `AIRDROP_KNOB`
- `REAL_WORLD_PHOTO_COLLECTION`
- `FATE_APP`

### Settings（设置页）

| 旧路径                                           | 新路径                                         |
| ------------------------------------------------ | ---------------------------------------------- |
| `/app/settings/data-profile/app`                 | `/m/settings/data-profile`                     |
| `/app/settings/data-profile/app/detail`          | `/m/settings/data-profile/detail`              |
| `/app/settings/data-profile/onchain-data-verify` | `/m/settings/data-profile/onchain-data-verify` |
| `/app/settings/reputation/app`                   | `/m/settings/reputation`                       |

### Quest / Submission

| 旧路径                                  | 新路径                                |
| --------------------------------------- | ------------------------------------- |
| `/app/quest/:id/challenge`              | `/m/quest/:id/challenge`              |
| `/app/submission/:submission_id/detail` | `/m/submission/:submission_id/detail` |

### Dataset

| 旧路径                       | 新路径                          |
| ---------------------------- | ------------------------------- |
| `dataset/food-science`       | `/m/dataset/food-science`       |
| `dataset/healthcare`         | `/m/dataset/healthcare`         |
| `dataset/crypto-addresses`   | `/m/dataset/crypto-addresses`   |
| `dataset/robotics`           | `/m/dataset/robotics`           |
| `dataset/kitchen-applicants` | `/m/dataset/kitchen-applicants` |
| `dataset/fashion`            | `/m/dataset/fashion`            |
| `dataset/llm-failure-cases`  | `/m/dataset/llm-failure-cases`  |

### Mobile 专属

| 旧路径                | 新路径                |
| --------------------- | --------------------- |
| `/m/referral`         | `/m/referral`（不变） |
| `/referral/app/:code` | `/m/referral/:code`   |

### Dev 工具页

| 路径               | 说明                               |
| ------------------ | ---------------------------------- |
| `/dev/signin`      | 开发登录页（原 `/account/signin`） |
| `/dev/bridge-test` | Bridge 测试页（路径不变）          |

---

## 三、代码修改位置汇总

### 路由定义文件

| 文件                                            | 变更内容                                          |
| ----------------------------------------------- | ------------------------------------------------- |
| `src/router/routes/frontier-project.routes.tsx` | 路径加 `/m` 前缀                                  |
| `src/router/routes/settings.routes.tsx`         | 去掉 `/app` 层和 `/app` 后缀，加 `/m` 前缀        |
| `src/router/routes/app.routes.tsx`              | 去掉 `/app` 层，加 `/m` 前缀                      |
| `src/router/routes/dataset.routes.tsx`          | 改为绝对路径，加 `/m` 前缀                        |
| `src/router/routes/account.routes.tsx`          | 移除 signin 路由，落地页路径改为 `/m/share/:code` |
| `src/router/routes/misc.routes.tsx`             | 新增 `/dev/signin`，`/dev` 路由合并为嵌套结构     |
| `src/router/routes/mobile.routes.tsx`           | 新增，管理 `/m/referral`                          |

### 硬编码路径（组件 / 工具）

| 文件                                         | 旧路径                                           | 新路径                                         |
| -------------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| `src/utils/auth.ts`                          | `/account/signin?from=...`                       | `/dev/signin?from=...`                         |
| `src/views/settings/data-profile.tsx`        | `/app/settings/data-profile/app/detail`          | `/m/settings/data-profile/detail`              |
| `src/views/settings/data-profile-detail.tsx` | `/app/settings/data-profile/onchain-data-verify` | `/m/settings/data-profile/onchain-data-verify` |
| `src/components/app/app-user.tsx`            | `/app/settings`                                  | `/m/settings`                                  |
| `src/components/settings/to-stake-modal.tsx` | `/app/settings/reputation`                       | `/m/settings/reputation`                       |
| `src/views/mobile/referral.tsx`              | `/referral/:code`（shareLink）                   | `/m/share/:code`                               |
| `src/views/mobile/referral.tsx`              | tab paths: `/app`, `/app/frontier`, `/dataset`   | `/m`, `/m/frontier`, `/m/dataset`              |
| `src/views/account/app-share-landing.tsx`    | `navigate('/app')` fallback                      | 移除（code 为空直接 return）                   |

---

## 四、暂不修改项（需后端配合）

以下位置使用了 `app://` schema 协议转换，路径由后端数据下发，前端逻辑**不应单独修改**，需与后端协商统一更新 schema 字符串：

| 文件                                  | 代码                                | 说明                       |
| ------------------------------------- | ----------------------------------- | -------------------------- |
| `src/utils/schema.ts`                 | `schema.replace('app://', '/app/')` | 后端 schema → 前端路由转换 |
| `src/components/task/task-action.tsx` | `schema.replace('app://', '/app/')` | 任务跳转 schema 解析       |

**后端 schema 字符串示例（需同步更新）：**

| 旧 schema                                 | 新 schema                                                  |
| ----------------------------------------- | ---------------------------------------------------------- |
| `app://frontier/project/AIRDROP_FOOD/...` | `app://m/frontier/project/AIRDROP_FOOD/...` 或调整转换逻辑 |

> 建议：将 `schema.replace('app://', '/app/')` 改为 `schema.replace('app://', '/m/')` 并同步告知后端不再需要 `/app` 前缀，**或**保持转换逻辑不变、后端 schema 不包含 `/app/` 段。

---

## 五、文件结构变更

### `src/views/` 目录

| 旧位置                                                | 新位置                                           |
| ----------------------------------------------------- | ------------------------------------------------ |
| `views/frontiers/`                                    | `views/frontier/`                                |
| `views/frontiers/airdrop_knob_app.tsx`                | `views/frontier/airdrop-knob.tsx`                |
| `views/frontiers/fashion_validation_app.tsx`          | `views/frontier/fashion-validation.tsx`          |
| `views/frontiers/fashion_guide_to_download_app.tsx`   | `views/frontier/fashion-guide-to-download.tsx`   |
| `views/frontiers/real_world_photo_collection_app.tsx` | `views/frontier/real-world-photo-collection.tsx` |
| `views/frontiers/fate-app.tsx`                        | `views/frontier/fate.tsx`                        |
| `views/frontiers/food-annotation-app.tsx`             | `views/frontier/food-annotation.tsx`             |
| `views/userinfo/app-data-profile.tsx`                 | `views/settings/data-profile.tsx`                |
| `views/userinfo/app-data-profile-detail.tsx`          | `views/settings/data-profile-detail.tsx`         |
| `views/userinfo/reputation-app.tsx`                   | `views/settings/reputation.tsx`                  |
| `views/on-chain/onchain-data-verify.tsx`              | `views/settings/onchain-data-verify.tsx`         |
| `views/referral-app.tsx`                              | `views/mobile/referral.tsx`                      |
| `views/quest/quest-challenge.tsx`                     | `views/quest/challenge.tsx`                      |
| `views/account/signin.tsx`                            | `views/dev/signin.tsx`                           |
