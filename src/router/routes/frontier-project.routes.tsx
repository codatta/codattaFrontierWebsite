import { Route } from 'react-router-dom'
import { lazy } from 'react'

import FrontierLayout from '@/layouts/frontier-layout'
import AppContainerDetector from '@/components/app/app-container-detector'

// --- Layout-wrapped templates (under FrontierLayout) ---
const FoodScienceTemplate = lazy(() => import('@/views/frontiers/form-type-6'))
const NFTGenerateTemplate = lazy(() => import('@/views/frontiers/form-type-7'))
const OOTDTemplate = lazy(() => import('@/views/frontiers/form-type-8'))
const SpeechTemplate = lazy(() => import('@/views/frontiers/form-type-9'))
const RoboticsFormType1 = lazy(() => import('@/views/robotics/form-type-1'))
const RoboticsFormType2 = lazy(() => import('@/views/robotics/form-type-2'))
const RoboticsFormType3 = lazy(() => import('@/views/robotics/form-type-3'))
const CMULayout = lazy(() => import('@/views/cmu-video-labeling/cmu-layout'))
const CMUVideoLabelingTaskList = lazy(() => import('@/views/cmu-video-labeling/task-list'))
const CMUVideoLabelingForm = lazy(() => import('@/views/cmu-video-labeling/labeling-form'))

// --- Simple template routes (no layout wrapper) ---
const Verification = lazy(() => import('@/views/frontiers/verification'))
const PhysicalQuestion = lazy(() => import('@/views/frontiers/physical_question'))
const CryptoTpl000001 = lazy(() => import('@/views/frontiers/crypto_tpl_000001'))
const AnnotatorInfoSurveyBasic = lazy(() => import('@/views/frontiers/annotator_info_survey_basic'))
const AnnotatorInfoSurveyQuiz = lazy(() => import('@/views/frontiers/annotator_info_survey_quiz'))
const KitchenAppDataW12 = lazy(() => import('@/views/frontiers/kitchen_app_data_w12'))
const HighQualityUser = lazy(() => import('@/views/frontiers/high_quality_user'))
const HighQualityUserV2Task1 = lazy(() => import('@/views/frontiers/high_quality_user_v2_task1'))
const HighQualityUserV2Task2 = lazy(() => import('@/views/frontiers/high_quality_user_v2_task2'))
const HighQualityUserV2Task3 = lazy(() => import('@/views/frontiers/high_quality_user_v2_task3'))
const AirdropModelComparison = lazy(() => import('@/views/frontiers/airdrop_model_comparison'))
const AirdropExpertAnswerProvision = lazy(() => import('@/views/frontiers/airdrop_expert_answer_provision'))
const AirdropBadCaseAnalysis = lazy(() => import('@/views/frontiers/airdrop_bad_case_analysis'))
const AirdropCexHotWalletDeposit = lazy(() => import('@/views/frontiers/airdrop_cex_hot_wallet_deposit'))
const AirdropCexHotWalletWithdraw = lazy(() => import('@/views/frontiers/airdrop_cex_hot_wallet_withdraw'))
const CryptoAndStockInfoCollection = lazy(() => import('@/views/frontiers/crypto_and_stock_info_collection'))
const FateTpl000001 = lazy(() => import('@/views/frontiers/fate_tpl_000001'))
const FateApp = lazy(() => import('@/views/frontiers/fate-app'))
const VivolightValidation = lazy(() => import('@/views/frontiers/vivolight/vivolight_validation'))

// --- Social task templates ---
const FrontierSocialDiscordBind = lazy(() => import('@/views/frontiers/social-tasks/discord-bind'))
const FrontierSocialTelegramBind = lazy(() => import('@/views/frontiers/social-tasks/telegram-bind'))
const FrontierSocialTwitterBind = lazy(() => import('@/views/frontiers/social-tasks/twitter-bind'))
const FrontierSocialDiscordJoinServer = lazy(() => import('@/views/frontiers/social-tasks/discord-join-server'))
const FrontierSocialTelegramJoinGroup = lazy(() => import('@/views/frontiers/social-tasks/telegram-join-group'))
const FrontierSocialTwitterFollow = lazy(() => import('@/views/frontiers/social-tasks/twitter-follow'))
const FrontierSocialTwitterRetweet = lazy(() => import('@/views/frontiers/social-tasks/twitter-retweet'))

// --- App-adaptive templates (AppContainerDetector) ---
const FashionValidation = lazy(() => import('@/views/frontiers/fashion_validation'))
const FashionValidationApp = lazy(() => import('@/views/frontiers/fashion_validation_app'))
const FashionGuideToDownload = lazy(() => import('@/views/frontiers/fashion_guide_to_download'))
const FashionGuideToDownloadApp = lazy(() => import('@/views/frontiers/fashion_guide_to_download_app'))
const AirdropFood = lazy(() => import('@/views/frontiers/airdrop_food'))
const AirdropFoodApp = lazy(() => import('@/views/frontiers/food-annotation-app'))
const AirdropKnob = lazy(() => import('@/views/frontiers/airdrop_knob'))
const AirdropKnobApp = lazy(() => import('@/views/frontiers/airdrop_knob_app'))
const RealWorldPhotoCollection = lazy(() => import('@/views/frontiers/real_world_photo_collection'))
const RealWorldPhotoCollectionApp = lazy(() => import('@/views/frontiers/real_world_photo_collection_app'))

// ============================================================
// Helper: generates routes for templates that use AppContainerDetector
// with an optional /feed/:uid sub-route
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>

const PREFIX = '/frontier/project'

function appDetectorRoute(templateId: string, WebComponent: LazyComponent, AppComponent: LazyComponent) {
  return (
    <Route path={`${PREFIX}/${templateId}/:taskId`}>
      <Route
        index
        element={
          <AppContainerDetector
            inApp={<AppComponent templateId={templateId} />}
            notInApp={<WebComponent templateId={templateId} />}
          />
        }
      />
      <Route path="feed/:uid" element={<AppComponent templateId={templateId} isFeed={true} />} />
    </Route>
  )
}

// ============================================================
// Helper: generates a simple template route
// path: /frontier/project/{TEMPLATE_ID}/:taskId
// ============================================================
function simpleTemplateRoute(templateId: string, Component: LazyComponent, paramName = 'taskId') {
  return <Route path={`${PREFIX}/${templateId}/:${paramName}`} element={<Component templateId={templateId} />} />
}

// ============================================================
// Exported routes
// ============================================================

/** Routes wrapped in FrontierLayout */
export const frontierLayoutRoutes = (
  <Route path="/frontier/project" element={<FrontierLayout />}>
    <Route path="FOOD_TPL_000001/:taskId" element={<FoodScienceTemplate templateId="FOOD_TPL_000001" />} />
    <Route path="NFT_TPL_000001/:taskId" element={<NFTGenerateTemplate templateId="NFT_TPL_000001" />} />
    <Route path="OOTD_TPL_000001/:taskId" element={<OOTDTemplate templateId="OOTD_TPL_000001" />} />
    <Route path="SPEECH_TPL_000001/:taskId" element={<SpeechTemplate templateId="SPEECH_TPL_000001" />} />
    <Route path="ROBOTICS_TPL_000001/:taskId" element={<RoboticsFormType1 templateId="ROBOTICS_TPL_000001" />} />
    <Route path="ROBOTICS_TPL_000002/:taskId" element={<RoboticsFormType2 templateId="ROBOTICS_TPL_000002" />} />
    <Route path="ROBOTICS_TPL_000003/:taskId" element={<RoboticsFormType3 templateId="ROBOTICS_TPL_000003" />} />
    <Route path="CMU_TPL_000001/:taskId" element={<CMULayout />}>
      <Route index element={<CMUVideoLabelingTaskList />} />
      <Route path="quest/:questId" element={<CMUVideoLabelingForm templateId="CMU_TPL_000001" />} />
    </Route>
  </Route>
)

/** Standalone frontier project routes (no layout wrapper) */
export const frontierProjectRoutes = (
  <>
    {/* Verification & physical */}
    <Route path="/frontier/project/VERIFICATION/:questId" element={<Verification templateId="VERIFICATION" />} />
    {simpleTemplateRoute('PHYSICAL_TPL_QUESTION', PhysicalQuestion)}

    {/* Crypto */}
    {simpleTemplateRoute('CRYPTO_TPL_WITHDRAW', CryptoTpl000001)}
    {simpleTemplateRoute('CRYPTO_TPL_DEPOSIT', CryptoTpl000001)}
    {simpleTemplateRoute('AIRDROP_CEX_HOT_WALLET_DEPOSIT', AirdropCexHotWalletDeposit)}
    {simpleTemplateRoute('AIRDROP_CEX_HOT_WALLET_WITHDRAW', AirdropCexHotWalletWithdraw)}
    {simpleTemplateRoute('CRYPTO_AND_STOCK_INFO_COLLECTION', CryptoAndStockInfoCollection)}

    {/* Annotator surveys */}
    {simpleTemplateRoute('ANNOTATOR_INFO_SURVEY_BASIC', AnnotatorInfoSurveyBasic)}
    {simpleTemplateRoute('ANNOTATOR_INFO_SURVEY_QUIZ', AnnotatorInfoSurveyQuiz)}

    {/* High quality user */}
    {simpleTemplateRoute('HIGH_QUALITY_USER', HighQualityUser)}
    {simpleTemplateRoute('HIGH_QUALITY_USER_TASK1', HighQualityUserV2Task1, 'questId')}
    {simpleTemplateRoute('HIGH_QUALITY_USER_TASK2', HighQualityUserV2Task2)}
    {simpleTemplateRoute('HIGH_QUALITY_USER_TASK3', HighQualityUserV2Task3, 'questId')}

    {/* Airdrop tasks */}
    {simpleTemplateRoute('AIRDROP_MODEL_COMPARISON', AirdropModelComparison)}
    {simpleTemplateRoute('AIRDROP_EXPERT_ANSWER_PROVISION', AirdropExpertAnswerProvision)}
    {simpleTemplateRoute('AIRDROP_BAD_CASE_ANALYSIS', AirdropBadCaseAnalysis)}

    {/* Social tasks */}
    {simpleTemplateRoute('X_BIND', FrontierSocialTwitterBind)}
    {simpleTemplateRoute('X_FOLLOW', FrontierSocialTwitterFollow)}
    {simpleTemplateRoute('X_RETWEET', FrontierSocialTwitterRetweet)}
    {simpleTemplateRoute('DISCORD_BIND', FrontierSocialDiscordBind)}
    {simpleTemplateRoute('DISCORD_JOIN_SERVER', FrontierSocialDiscordJoinServer)}
    {simpleTemplateRoute('TELEGRAM_BIND', FrontierSocialTelegramBind)}
    {simpleTemplateRoute('TELEGRAM_JOIN_GROUP', FrontierSocialTelegramJoinGroup)}

    {/* Fate */}
    {simpleTemplateRoute('FATE_TPL_000001', FateTpl000001)}
    {simpleTemplateRoute('FATE_APP', FateApp)}

    {/* Vivolight */}
    {simpleTemplateRoute('VIVOLIGHT_VALIDATION', VivolightValidation)}

    {/* App-adaptive templates (web + app with feed sub-route) */}
    {appDetectorRoute('FASHION_VALIDATION', FashionValidation, FashionValidationApp)}
    {appDetectorRoute('FASHION_GUIDE_TO_DOWNLOAD', FashionGuideToDownload, FashionGuideToDownloadApp)}
    {appDetectorRoute('AIRDROP_FOOD', AirdropFood, AirdropFoodApp)}
    {appDetectorRoute('AIRDROP_KNOB', AirdropKnob, AirdropKnobApp)}
    {appDetectorRoute('REAL_WORLD_PHOTO_COLLECTION', RealWorldPhotoCollection, RealWorldPhotoCollectionApp)}

    {/* Kitchen */}
    <Route
      path="/frontier/project/KITCHEN_TPL_W12/:taskId/:questId"
      element={<KitchenAppDataW12 templateId="KITCHEN_TPL_W12" />}
    />
    {/* App-only food template */}
    <Route path="/frontier/project/AIRDROP_FOOD_APP/:taskId">
      <Route index element={<AirdropFoodApp templateId="AIRDROP_FOOD_APP" />} />
      <Route path="feed/:uid" element={<AirdropFoodApp templateId="AIRDROP_FOOD_APP" isFeed={true} />} />
    </Route>
  </>
)
