# GitHub Actions 配置说明

## 概述

本项目包含以下GitHub Actions工作流：

1. **release.yml** - 完整的发布流程，包含编译、OSS部署、Docker镜像构建和推送

## 触发方式

### 手动触发

- 在GitHub Actions页面手动运行，可以指定分支和环境
- 版本号会自动使用当前时间（格式：YYYY-MM-DD-HH-MM-SS）

## 必需的GitHub Secrets

### OSS相关配置

#### Repository Variables（公开可见）

```
OSS_ENDPOINT               # OSS端点（如：oss-cn-hangzhou.aliyuncs.com）
OSS_BASE_PATH              # OSS基础路径（如：frontier）
```

#### Repository Secrets（加密隐藏）

```
OSS_ACCESS_KEY_ID          # 阿里云OSS访问密钥ID
OSS_ACCESS_KEY_SECRET      # 阿里云OSS访问密钥Secret
PROD_OSS_BUCKET            # 生产环境OSS存储桶名称
PROD_OSS_REGION            # 生产环境OSS区域（如：cn-hangzhou）
TEST_OSS_BUCKET            # 测试环境OSS存储桶名称
TEST_OSS_REGION            # 测试环境OSS区域（如：cn-hangzhou）
```

### API配置

```
PROD_API_BASE_URL          # 生产环境API基础URL
TEST_API_BASE_URL          # 测试环境API基础URL
```

### 应用配置（按环境区分）

```
PROD_CDN_ASSETS_PATH       # 生产环境CDN资源路径
PROD_VITE_TG_BOT_ID       # 生产环境Telegram Bot ID
PROD_VITE_GA_TRACKING_ID  # 生产环境Google Analytics跟踪ID
TEST_CDN_ASSETS_PATH       # 测试环境CDN资源路径
TEST_VITE_TG_BOT_ID       # 测试环境Telegram Bot ID
TEST_VITE_GA_TRACKING_ID  # 测试环境Google Analytics跟踪ID
```

### 阿里云镜像仓库配置

```
ALIYUN_REGISTRY_USERNAME  # 阿里云镜像仓库用户名
ALIYUN_REGISTRY_PASSWORD  # 阿里云镜像仓库密码
```

## 工作流程说明

### 1. 编译阶段 (build)

- 设置Node.js环境
- 安装依赖
- 根据环境选择不同的配置（API URL、OSS Bucket等）
- 创建.env文件并注入环境变量
- 执行构建命令
- 上传构建产物

### 2. OSS部署阶段 (deploy-to-oss)

- 下载构建产物
- 根据环境选择对应的OSS配置
- 配置阿里云OSS工具
- 上传文件到指定OSS路径

### 3. Docker镜像构建 (build-docker)

- 设置Docker Buildx
- 登录到阿里云镜像仓库
- 构建并推送Docker镜像

## 环境变量说明

构建时会根据选择的环境自动注入不同的环境变量到`.env`文件：

### 生产环境 (production)

```
VITE_APP_ENV              # 部署环境（production）
VITE_APP_VERSION          # 版本号（时间格式：YYYY-MM-DD-HH-MM-SS）
VITE_APP_BUILD_TIME      # 构建时间
VITE_APP_COMMIT_SHA      # Git提交SHA
VITE_APP_BRANCH          # Git分支名
VITE_API_BASE_URL        # 生产环境API基础URL
VITE_OSS_BUCKET          # 生产环境OSS存储桶
VITE_OSS_REGION          # 生产环境OSS区域
VITE_OSS_ACCESS_KEY_ID   # OSS访问密钥ID
VITE_OSS_ACCESS_KEY_SECRET # OSS访问密钥Secret
CDN_ASSETS_PATH          # 生产环境CDN资源路径
VITE_TG_BOT_ID          # 生产环境Telegram Bot ID
VITE_GA_TRACKING_ID     # 生产环境Google Analytics跟踪ID
```

### 测试环境 (staging)

```
VITE_APP_ENV              # 部署环境（staging）
VITE_APP_VERSION          # 版本号（时间格式：YYYY-MM-DD-HH-MM-SS）
VITE_APP_BUILD_TIME      # 构建时间
VITE_APP_COMMIT_SHA      # Git提交SHA
VITE_APP_BRANCH          # Git分支名
VITE_API_BASE_URL        # 测试环境API基础URL
VITE_OSS_BUCKET          # 测试环境OSS存储桶
VITE_OSS_REGION          # 测试环境OSS区域
VITE_OSS_ACCESS_KEY_ID   # OSS访问密钥ID
VITE_OSS_ACCESS_KEY_SECRET # OSS访问密钥Secret
CDN_ASSETS_PATH          # 测试环境CDN资源路径
VITE_TG_BOT_ID          # 测试环境Telegram Bot ID
VITE_GA_TRACKING_ID     # 测试环境Google Analytics跟踪ID
```

## 使用示例

### 手动触发发布

1. 进入GitHub Actions页面
2. 选择"Release Pipeline"
3. 点击"Run workflow"
4. 输入要构建的分支名称（默认：main）
5. 选择部署环境（production/staging）
6. 点击"Run workflow"

## 注意事项

1. 确保所有必需的Secrets都已正确配置
2. OSS路径格式：`{OSS_BASE_PATH}/{environment}/{build_time}`
3. Docker镜像会推送到阿里云镜像仓库：`registry-intl.ap-southeast-1.aliyuncs.com/codatta/codatta-frontier-website`
4. 构建产物会保留30天
5. Node.js版本为22
6. 版本号使用时间格式：YYYY-MM-DD-HH-MM-SS
