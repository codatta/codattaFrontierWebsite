import { Route, BrowserRouter, Routes, Navigate, useLocation } from 'react-router-dom'
import { lazy, useEffect } from 'react'

// layouts
import FrontierLayout from '@/layouts/frontier-layout'
import UserInfoLayout from '@/layouts/userinfo-layout'
import AppLayout from '@/layouts/app-layout'
import ArenaLayout from '@/layouts/arena-layout'
import { trackPageView } from './utils/track'
import GlobalModalHost from './components/app/global-modal-host'

// index home
const Home = lazy(() => import('@/views/home'))
const AppLeaderboard = lazy(() => import('@/views/leaderboard'))
const AppNotification = lazy(() => import('@/views/notification'))
const AppQuestChanllenge = lazy(() => import('@/views/quest/quest-challenge'))
const AppReferral = lazy(() => import('@/views/referral'))
const NewJourney = lazy(() => import('@/views/new-journey'))
const SubmissionDetail = lazy(() => import('@/views/frontiers/submission-detail'))

// quest
const ActivityGroup = lazy(() => import('@/views/quest/activity-group'))
const Activity = lazy(() => import('@/views/quest/activity'))
const AirdropActivity = lazy(() => import('@/views/airdrop-activity/home'))
const AirdropLeaderboard = lazy(() => import('@/views/airdrop-activity/leaderboard'))
const AirdropRankingHistory = lazy(() => import('@/views/airdrop-activity/ranking-history'))
const AirdropActivityHistory = lazy(() => import('@/views/airdrop-activity/activity-history'))

// user info
const UserInfo = lazy(() => import('@/views/userinfo/index'))
const UserInfoReward = lazy(() => import('@/views/userinfo/reward'))
const UserInfoReputation = lazy(() => import('@/views/userinfo/reputation'))
const UserInfoNFT = lazy(() => import('@/views/userinfo/nft'))
const UserInfoPersonal = lazy(() => import('@/views/userinfo/personal'))
const UserInfoOnchain = lazy(() => import('@/views/userinfo/onchain'))
const UserInfoDataProfile = lazy(() => import('@/views/userinfo/data-profile'))
const UserInfoDataAssets = lazy(() => import('@/views/userinfo/data-assets'))

// account
const AccountSignin = lazy(() => import('@/views/account/signin'))
const ReferralLanding = lazy(() => import('@/views/referral-landing'))
const SocialLinkLanding = lazy(() => import('@/views/account/social-link-landing'))

// frontiers
const FrontierHome = lazy(() => import('@/views/frontiers/home'))
const FashionHome = lazy(() => import('@/views/fashion/home'))
const FrontierHistory = lazy(() => import('@/views/frontiers/history'))
const RoboticsFormType1 = lazy(() => import('@/views/robotics/form-type-1'))
const RoboticsFormType2 = lazy(() => import('@/views/robotics/form-type-2'))
const RoboticsFormType3 = lazy(() => import('@/views/robotics/form-type-3'))

// frontiers templates

const FoodScienceTemplate = lazy(() => import('@/views/frontiers/form-type-6'))
const NFTGenerateTemplate = lazy(() => import('@/views/frontiers/form-type-7'))
const OOTDTemplate = lazy(() => import('@/views/frontiers/form-type-8'))
const SpeechTemplate = lazy(() => import('@/views/frontiers/form-type-9'))
const FateTpl000001 = lazy(() => import('@/views/frontiers/fate_tpl_000001'))

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
const AirdropFood = lazy(() => import('@/views/frontiers/airdrop_food'))
const PhysicalVerification = lazy(() => import('@/views/frontiers/physical_verification'))
const PhysicalQuestion = lazy(() => import('@/views/frontiers/physical_question'))

// cmu video labeling
const CMUVideoLabelingForm = lazy(() => import('@/views/cmu-video-labeling/labeling-form'))
const CMUVideoLabelingTaskList = lazy(() => import('@/views/cmu-video-labeling/task-list'))
const CMULayout = lazy(() => import('@/views/cmu-video-labeling/cmu-layout'))

// data profile
const DataProfile = lazy(() => import('@/views/data-profile'))

// codatta clip
const ExtensionSignin = lazy(() => import('@/views/account/extension-signin'))

// arena
const ChatbotArenaPage = lazy(() => import('@/views/arena'))
const ModelListPage = lazy(() => import('@/views/arena/model-list'))
const ChatBotArenaLeaderboardPage = lazy(() => import('@/views/arena/leaderboard'))
const ArenaOnChainList = lazy(() => import('@/views/arena/onchain-record'))

// not found
const NotFoundPage = lazy(() => import('@/views/not-found'))

export default function Router() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route index element={<Navigate to="/app" />} />
        <Route path="/arena" element={<ArenaLayout />}>
          <Route index element={<ChatbotArenaPage />} />
          <Route path="leaderboard" element={<ChatBotArenaLeaderboardPage />} />
          <Route path="model/list" element={<ModelListPage />} />
          <Route path="onchain/list" element={<ArenaOnChainList />} />
        </Route>
        <Route path="/data-profile/:network/:address" element={<DataProfile />} />
        <Route path="/app/data/profile/:network/:address" element={<DataProfile />} />
        <Route path="/app" element={<AppLayout className="max-w-[1560px]" />}>
          <Route index element={<Home />} />
          <Route path="referral" element={<AppReferral />}></Route>
          <Route path="journey" element={<NewJourney />} />
          <Route path="airdrop">
            <Route index element={<AirdropActivity />} />
            <Route path="leaderboard" element={<AirdropLeaderboard />} />
            <Route path="ranking-history" element={<AirdropRankingHistory />} />
            <Route path="activity-history" element={<AirdropActivityHistory />} />
          </Route>

          <Route path="settings" element={<UserInfoLayout />}>
            <Route index element={<UserInfo />} />
            <Route path="account" element={<UserInfo />} />
            <Route path="reward" element={<UserInfoReward />} />
            <Route path="reputation" element={<UserInfoReputation />} />
            <Route path="nft" element={<UserInfoNFT />} />
            <Route path="personal" element={<UserInfoPersonal />} />
            <Route path="onchain" element={<UserInfoOnchain />} />
            <Route path="data-profile" element={<UserInfoDataProfile />} />
            <Route path="data-assets" element={<UserInfoDataAssets />} />
          </Route>

          <Route path="quest">
            <Route index element={<ActivityGroup />} />
            <Route path=":categoryId" element={<Activity />} />
          </Route>

          <Route path="notification" element={<AppNotification />}></Route>
          <Route path="frontier/:frontier_id" element={<FrontierHome />}></Route>
          <Route path="frontier/:frontier_id/history" element={<FrontierHistory />}></Route>
          <Route path="frontier/fashion" element={<FashionHome />}></Route>
          <Route path="leaderboard" element={<AppLeaderboard />}></Route>
        </Route>
        <Route path="/app/quest/:id/challenge" element={<AppQuestChanllenge />}></Route>
        <Route path="/account">
          <Route path="signin" element={<AccountSignin />} />
          <Route path="extension/signin" element={<ExtensionSignin />} />
          <Route path="social/link/:social_media" element={<SocialLinkLanding />}></Route>
        </Route>
        <Route path="/referral/:code" element={<ReferralLanding />} />
        <Route path="/frontier/project/CMU_TPL_000001/:taskId" element={<CMULayout />}>
          <Route index element={<CMUVideoLabelingTaskList />} />
          <Route path="quest/:questId" element={<CMUVideoLabelingForm templateId="CMU_TPL_000001" />} />
        </Route>
        <Route path="/frontier/project" element={<FrontierLayout />}>
          <Route path="FOOD_TPL_000001/:taskId" element={<FoodScienceTemplate templateId="FOOD_TPL_000001" />} />
          <Route path="NFT_TPL_000001/:taskId" element={<NFTGenerateTemplate templateId="NFT_TPL_000001" />} />
          <Route path="OOTD_TPL_000001/:taskId" element={<OOTDTemplate templateId="OOTD_TPL_000001" />} />
          <Route path="SPEECH_TPL_000001/:taskId" element={<SpeechTemplate templateId="SPEECH_TPL_000001" />} />
          <Route path="ROBOTICS_TPL_000001/:taskId" element={<RoboticsFormType1 templateId="ROBOTICS_TPL_000001" />} />
          <Route path="ROBOTICS_TPL_000002/:taskId" element={<RoboticsFormType2 templateId="ROBOTICS_TPL_000002" />} />
          <Route path="ROBOTICS_TPL_000003/:taskId" element={<RoboticsFormType3 templateId="ROBOTICS_TPL_000003" />} />
          <Route path="FATE_TPL_000001/:taskId" element={<FateTpl000001 templateId="FATE_TPL_000001" />} />
        </Route>
        <Route
          path="/frontier/project/PHYSICAL_TPL_VERIFICATION/:questId"
          element={<PhysicalVerification templateId="PHYSICAL_TPL_VERIFICATION" />}
        />
        <Route
          path="/frontier/project/PHYSICAL_TPL_QUESTION/:taskId"
          element={<PhysicalQuestion templateId="PHYSICAL_TPL_QUESTION" />}
        />
        <Route path="/frontier/project/AIRDROP_FOOD/:taskId" element={<AirdropFood templateId="AIRDROP_FOOD" />} />
        <Route
          path="/frontier/project/CRYPTO_TPL_WITHDRAW/:taskId"
          element={<CryptoTpl000001 templateId="CRYPTO_TPL_WITHDRAW" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_DEPOSIT/:taskId"
          element={<CryptoTpl000001 templateId="CRYPTO_TPL_DEPOSIT" />}
        />
        <Route
          path="/frontier/project/ANNOTATOR_INFO_SURVEY_BASIC/:taskId"
          element={<AnnotatorInfoSurveyBasic templateId="ANNOTATOR_INFO_SURVEY_BASIC" />}
        />
        <Route
          path="/frontier/project/ANNOTATOR_INFO_SURVEY_QUIZ/:taskId"
          element={<AnnotatorInfoSurveyQuiz templateId="ANNOTATOR_INFO_SURVEY_QUIZ" />}
        />
        <Route
          path="/frontier/project/KITCHEN_TPL_W12/:taskId/:questId"
          element={<KitchenAppDataW12 templateId="KITCHEN_TPL_W12" />}
        />
        <Route
          path="/frontier/project/HIGH_QUALITY_USER/:taskId"
          element={<HighQualityUser templateId="HIGH_QUALITY_USER" />}
        />
        <Route
          path="/frontier/project/HIGH_QUALITY_USER_TASK1/:questId"
          element={<HighQualityUserV2Task1 templateId="HIGH_QUALITY_USER_TASK1" />}
        />
        <Route
          path="/frontier/project/HIGH_QUALITY_USER_TASK2/:taskId"
          element={<HighQualityUserV2Task2 templateId="HIGH_QUALITY_USER_TASK2" />}
        />
        <Route
          path="/frontier/project/HIGH_QUALITY_USER_TASK3/:questId"
          element={<HighQualityUserV2Task3 templateId="HIGH_QUALITY_USER_TASK3" />}
        />

        <Route
          path="/frontier/project/AIRDROP_MODEL_COMPARISON/:taskId"
          element={<AirdropModelComparison templateId="AIRDROP_MODEL_COMPARISON" />}
        />
        <Route
          path="/frontier/project/AIRDROP_EXPERT_ANSWER_PROVISION/:taskId"
          element={<AirdropExpertAnswerProvision templateId="AIRDROP_EXPERT_ANSWER_PROVISION" />}
        />
        <Route
          path="/frontier/project/AIRDROP_BAD_CASE_ANALYSIS/:taskId"
          element={<AirdropBadCaseAnalysis templateId="AIRDROP_BAD_CASE_ANALYSIS" />}
        />

        <Route path="/app/submission/:submission_id/detail" element={<SubmissionDetail />}></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GlobalModalHost />
    </BrowserRouter>
  )
}

function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    console.log('trackPageView', location.pathname)
    trackPageView(location.pathname)
  }, [location])

  return null
}

// http://localhost:5175/app/frontier/project/PHYSICAL_TPL_QUESTION/8995881856000103187
