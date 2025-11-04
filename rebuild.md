# 代码清理计划

## 📋 背景说明

考虑到币安活动已经结束，同时我们下线了以下历史遗留服务：

- **老的 Crypto 服务**：包含 submission、validation、bounty hunting 等历史数据提交服务
- **老的 Robotics 服务**：包含上千个 GIF 的标注任务

这些历史遗留页面在前端占用了较大的代码量，需要进行清理。

---

## 🗑️ 待清理路由列表

### 1️⃣ Food 相关路由

| 路由模板        | 路径                                                 |
| --------------- | ---------------------------------------------------- |
| FOOD_TPL_000002 | `/frontier/project/FOOD_TPL_000002/:taskId/:questId` |
| FOOD_TPL_000003 | `/frontier/project/FOOD_TPL_000003/:taskId`          |
| FOOD_TPL_000003 | `/frontier/project/FOOD_TPL_000003/:taskId/:questId` |
| FOOD_TPL_000004 | `/frontier/project/FOOD_TPL_000004/:taskId/:questId` |
| FOOD_TPL_000005 | `/frontier/project/FOOD_TPL_000005/:taskId/:questId` |
| FOOD_TPL_M2_W1  | `/frontier/project/FOOD_TPL_M2_W1/:taskId`           |
| FOOD_TPL_W6     | `/frontier/project/FOOD_TPL_W6/:taskId`              |
| FOOD_TPL_W7     | `/frontier/project/FOOD_TPL_W7/:taskId`              |
| FOOD_TPL_W8     | `/frontier/project/FOOD_TPL_W8/:taskId`              |
| FOOD_TPL_W9     | `/frontier/project/FOOD_TPL_W9/:taskId/:questId`     |
| FOOD_TPL_W10    | `/frontier/project/FOOD_TPL_W10/:taskId/:questId`    |
| FOOD_TPL_W11    | `/frontier/project/FOOD_TPL_W11/:taskId/:questId`    |
| FOOD_TPL_W12    | `/frontier/project/FOOD_TPL_W12/:taskId/:questId`    |

### 2️⃣ Robotics 相关路由

| 路由模板         | 路径                                                  |
| ---------------- | ----------------------------------------------------- |
| ROBOTICS_TPL_W5  | `/frontier/project/ROBOTICS_TPL_W5/:taskId/:questId`  |
| ROBOTICS_TPL_W6  | `/frontier/project/ROBOTICS_TPL_W6/:taskId/:questId`  |
| ROBOTICS_TPL_W7  | `/frontier/project/ROBOTICS_TPL_W7/:taskId/:questId`  |
| ROBOTICS_TPL_W8  | `/frontier/project/ROBOTICS_TPL_W8/:taskId/:questId`  |
| ROBOTICS_TPL_W9  | `/frontier/project/ROBOTICS_TPL_W9/:taskId/:questId`  |
| ROBOTICS_TPL_W10 | `/frontier/project/ROBOTICS_TPL_W10/:taskId/:questId` |
| ROBOTICS_TPL_W11 | `/frontier/project/ROBOTICS_TPL_W11/:taskId/:questId` |
| ROBOTICS_TPL_W12 | `/frontier/project/ROBOTICS_TPL_W12/:taskId/:questId` |

### 3️⃣ CEX 数据提交相关路由

#### Withdraw 路由

- `/frontier/project/CRYPTO_TPL_WITHDRAW/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W7/:taskId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W7/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W8/:taskId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W8/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W9/:taskId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W9/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W10/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W11/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_WITHDRAW_W12/:taskId/:questId`

#### Deposit 路由

- `/frontier/project/CRYPTO_TPL_DEPOSIT/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W7/:taskId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W7/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W8/:taskId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W8/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W9/:taskId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W9/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W10/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W11/:taskId/:questId`
- `/frontier/project/CRYPTO_TPL_DEPOSIT_W12/:taskId/:questId`

### 4️⃣ 厨房旋钮相关路由

- `/frontier/project/KITCHEN_TPL_W9/:taskId`
- `/frontier/project/KITCHEN_TPL_W9/:taskId/:questId`
- `/frontier/project/KITCHEN_TPL_W10/:taskId`
- `/frontier/project/KITCHEN_TPL_W10/:taskId/:questId`
- `/frontier/project/KITCHEN_TPL_W11/:taskId/:questId`

### 5️⃣ 链上数据验证路由

- `/frontier/project/HIGH_QUALITY_USER_TASK2/:taskId/:questId`
- keep ANNOTATOR_INFO_SURVEY_BASIC、ANNOTATOR_INFO_SURVEY_QUIZ、HIGH_QUALITY_USER、HIGH_QUALITY_USER_TASK2、HIGH_QUALITY_USER_TASK1、HIGH_QUALITY_USER_TASK3
<!-- - `/frontier/project/ONCHAIN_VERIFY_TPL_0001/:taskId`
- `/frontier/project/ONCHAIN_VERIFY_TPL_0001/:taskId/:questId`
- `/frontier/project/ONCHAIN_VERIFY_TPL_0002/:taskId`
- `/frontier/project/ONCHAIN_VERIFY_TPL_0002/:taskId/:questId` -->

<!-- ### 6️⃣ 币安期间的问答任务路由

- `/app/booster/:week/read`
- `/app/booster/:week/quiz` -->

<!-- ### 7️⃣ Favie App 导流任务路由

- `/frontier/project/FASHION_GENSMO/:taskId`
- `/frontier/project/FASHION_GENSMO/:taskId/:questId` -->

<!-- ### 8️⃣ 老的 Crypto 相关路由

#### Validation & Submission

- `/app/crypto/validation/list`
- `/app/crypto/submission/submit`
- `/app/crypto/submission/history`

#### Bounty Hunting

- `/app/crypto/bounty`
- `/app/crypto/bounty/:id/detail`
- `/app/crypto/bounty/:id/submit`
- `/app/crypto/bounty/list` -->

#### Journey

- `/app/journey`

---

## 📊 统计信息

| 类别           | 路由数量 |
| -------------- | -------- |
| Food 相关      | 13       |
| Robotics 相关  | 8        |
| CEX 数据提交   | 20       |
| 厨房旋钮       | 5        |
| 链上数据验证   | 5        |
| 币安问答任务   | 2        |
| Favie App 导流 | 2        |
| 老的 Crypto    | 8        |
| **总计**       | **63**   |

---

## ✅ 清理步骤

1. **备份代码**：在清理前创建代码备份分支
2. **删除路由配置**：移除路由定义文件中的相关配置
3. **删除组件文件**：删除对应的页面组件和相关资源文件
4. **清理 API 调用**：移除相关的 API 接口调用代码
5. **更新导航**：移除导航菜单中的相关入口
6. **测试验证**：确保删除后不影响现有功能
7. **代码审查**：提交 PR 进行代码审查
