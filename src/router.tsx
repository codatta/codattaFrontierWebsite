import { Route, BrowserRouter, Routes, Navigate, useLocation } from 'react-router-dom'
import { lazy, useEffect } from 'react'

// layouts
import FrontierLayout from '@/layouts/frontier-layout'
import UserInfoLayout from '@/layouts/userinfo-layout'
import AppLayout from '@/layouts/app-layout'
import ArenaLayout from '@/layouts/arena-layout'
import BoosterLayout from '@/layouts/booster-layout'
import { trackPageView } from './utils/track'

// index home
const Home = lazy(() => import('@/views/home'))
const AppLeaderboard = lazy(() => import('@/views/leaderboard'))
const AppNotification = lazy(() => import('@/views/notification'))
const AppQuestChanllenge = lazy(() => import('@/views/quest/quest-challenge'))
const AppReferral = lazy(() => import('@/views/referral'))
const NewJourney = lazy(() => import('@/views/new-journey'))

// quest
const ActivityGroup = lazy(() => import('@/views/quest/activity-group'))
const Activity = lazy(() => import('@/views/quest/activity'))

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

// crypto
const CryptoHome = lazy(() => import('@/views/crypto/home'))
const CryptoValidationList = lazy(() => import('@/views/crypto/validation-list'))
const CryptoSubmissionSubmit = lazy(() => import('@/views/crypto/submission-submit'))
const CryptoSubmissionHistory = lazy(() => import('@/views/crypto/submission-history'))
const CryptoBountyHome = lazy(() => import('@/views/crypto/bounty-home'))
const CryptoBountyList = lazy(() => import('@/views/crypto/bounty-list'))
const CryptoBountyDetail = lazy(() => import('@/views/crypto/bounty-detail'))
const CryptoBountySubmit = lazy(() => import('@/views/crypto/bounty-submit'))

// frontiers
const FrontierHome = lazy(() => import('@/views/frontiers/home'))
const FashionHome = lazy(() => import('@/views/fashion/home'))
const FrontierHistory = lazy(() => import('@/views/frontiers/history'))
const RoboticsFormType1 = lazy(() => import('@/views/robotics/form-type-1'))
const RoboticsFormType2 = lazy(() => import('@/views/robotics/form-type-2'))
const RoboticsFormType3 = lazy(() => import('@/views/robotics/form-type-3'))

// frontiers templates
const FoodScienceTemplate = lazy(() => import('@/views/frontiers/form-type-6'))
const FoodTpl000002 = lazy(() => import('@/views/frontiers/food_tpl_000002'))
const FoodTpl000003 = lazy(() => import('@/views/frontiers/food_tpl_000003'))
const FoodTpl000004 = lazy(() => import('@/views/frontiers/food_tpl_000004'))
const FoodTpl000005 = lazy(() => import('@/views/frontiers/food_tpl_000005'))
const FoodTplM2W1 = lazy(() => import('@/views/frontiers/food_tpl_m2_w1'))
const FoodTplM2W234 = lazy(() => import('@/views/frontiers/food_tpl_m2_w234'))
const RoboticsTplW5 = lazy(() => import('@/views/frontiers/robitcs_tpl_w5'))

const NFTGenerateTemplate = lazy(() => import('@/views/frontiers/form-type-7'))
const OOTDTemplate = lazy(() => import('@/views/frontiers/form-type-8'))
const SpeechTemplate = lazy(() => import('@/views/frontiers/form-type-9'))
const FateTpl000001 = lazy(() => import('@/views/frontiers/fate_tpl_000001'))

const CryptoTpl000001 = lazy(() => import('@/views/frontiers/crypto_tpl_000001'))
const CryptoTpl000002 = lazy(() => import('@/views/frontiers/crypto_tpl_000002'))
const CryptoTpl000003 = lazy(() => import('@/views/frontiers/crypto_tpl_000003'))

const CollectionTpl0001 = lazy(() => import('@/views/frontiers/collection_tpl_0001'))
const CollectionTpl0002 = lazy(() => import('@/views/frontiers/collection_tpl_0002'))

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

// booster
const ReadTaskPage = lazy(() => import('@/views/booster/read'))
const QuizTaskPage = lazy(() => import('@/views/booster/quiz'))

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

          <Route path="crypto">
            <Route index element={<CryptoHome />} />
            <Route path="validation/list" element={<CryptoValidationList />} />
            <Route path="submission/submit" element={<CryptoSubmissionSubmit />} />
            <Route path="submission/history" element={<CryptoSubmissionHistory />} />
            <Route path="bounty" element={<CryptoBountyHome />} />
            <Route path="bounty/:id/detail" element={<CryptoBountyDetail />}></Route>
            <Route path="bounty/:id/submit" element={<CryptoBountySubmit />}></Route>
            <Route path="bounty/list" element={<CryptoBountyList />} />
          </Route>
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
          path="/frontier/project/FOOD_TPL_000002/:taskId/:questId"
          element={<FoodTpl000002 templateId="FOOD_TPL_000002" />}
        />
        <Route
          path="/frontier/project/FOOD_TPL_000003/:taskId"
          element={<FoodTpl000003 templateId="FOOD_TPL_000003" />}
        />
        <Route
          path="/frontier/project/FOOD_TPL_000003/:taskId/:questId"
          element={<FoodTpl000003 templateId="FOOD_TPL_000003" />}
        />
        <Route
          path="/frontier/project/FOOD_TPL_000004/:taskId/:questId"
          element={<FoodTpl000004 templateId="FOOD_TPL_000004" />}
        />
        <Route
          path="/frontier/project/FOOD_TPL_000005/:taskId/:questId"
          element={<FoodTpl000005 templateId="FOOD_TPL_000005" />}
        />
        <Route path="/frontier/project/FOOD_TPL_M2_W1/:taskId" element={<FoodTplM2W1 templateId="FOOD_TPL_M2_W1" />} />
        <Route
          path="/frontier/project/FOOD_TPL_M2_W1/:taskId/:questId"
          element={<FoodTplM2W1 templateId="FOOD_TPL_M2_W1" />}
        />
        <Route path="/frontier/project/FOOD_TPL_W6/:taskId" element={<FoodTplM2W234 templateId="FOOD_TPL_W6" />} />
        <Route
          path="/frontier/project/FOOD_TPL_W6/:taskId/:questId"
          element={<FoodTplM2W234 templateId="FOOD_TPL_W6" />}
        />
        <Route path="/frontier/project/FOOD_TPL_W7/:taskId" element={<FoodTplM2W234 templateId="FOOD_TPL_W7" />} />
        <Route
          path="/frontier/project/FOOD_TPL_W7/:taskId/:questId"
          element={<FoodTplM2W234 templateId="FOOD_TPL_W7" />}
        />
        <Route path="/frontier/project/FOOD_TPL_W8/:taskId" element={<FoodTplM2W234 templateId="FOOD_TPL_W8" />} />
        <Route
          path="/frontier/project/FOOD_TPL_W8/:taskId/:questId"
          element={<FoodTplM2W234 templateId="FOOD_TPL_W8" />}
        />
        <Route
          path="/frontier/project/ROBOTICS_TPL_W5/:taskId/:questId"
          element={<RoboticsTplW5 templateId="ROBOTICS_TPL_W5" />}
        />
        <Route
          path="/frontier/project/ROBOTICS_TPL_W6/:taskId/:questId"
          element={<RoboticsTplW5 templateId="ROBOTICS_TPL_W6" />}
        />
        <Route
          path="/frontier/project/ROBOTICS_TPL_W7/:taskId/:questId"
          element={<RoboticsTplW5 templateId="ROBOTICS_TPL_W7" />}
        />
        <Route
          path="/frontier/project/ROBOTICS_TPL_W8/:taskId/:questId"
          element={<RoboticsTplW5 templateId="ROBOTICS_TPL_W8" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_WITHDRAW/:taskId"
          element={<CryptoTpl000001 templateId="CRYPTO_TPL_WITHDRAW" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_DEPOSIT/:taskId"
          element={<CryptoTpl000001 templateId="CRYPTO_TPL_DEPOSIT" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_WITHDRAW/:taskId/:questId"
          element={<CryptoTpl000001 templateId="CRYPTO_TPL_WITHDRAW" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_DEPOSIT/:taskId/:questId"
          element={<CryptoTpl000001 templateId="CRYPTO_TPL_DEPOSIT" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_WITHDRAW_W7/:taskId"
          element={<CryptoTpl000002 templateId="CRYPTO_TPL_WITHDRAW_W7" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_DEPOSIT_W7/:taskId"
          element={<CryptoTpl000002 templateId="CRYPTO_TPL_DEPOSIT_W7" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_WITHDRAW_W7/:taskId/:questId"
          element={<CryptoTpl000002 templateId="CRYPTO_TPL_WITHDRAW_W7" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_DEPOSIT_W7/:taskId/:questId"
          element={<CryptoTpl000002 templateId="CRYPTO_TPL_DEPOSIT_W7" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_WITHDRAW_W8/:taskId"
          element={<CryptoTpl000003 templateId="CRYPTO_TPL_WITHDRAW_W8" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_DEPOSIT_W8/:taskId"
          element={<CryptoTpl000003 templateId="CRYPTO_TPL_DEPOSIT_W8" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_WITHDRAW_W8/:taskId/:questId"
          element={<CryptoTpl000003 templateId="CRYPTO_TPL_WITHDRAW_W8" />}
        />
        <Route
          path="/frontier/project/CRYPTO_TPL_DEPOSIT_W8/:taskId/:questId"
          element={<CryptoTpl000003 templateId="CRYPTO_TPL_DEPOSIT_W8" />}
        />
        <Route
          path="/frontier/project/PERSONAL_INFO_COLLECTION_0001/:taskId"
          element={<CollectionTpl0001 templateId="PERSONAL_INFO_COLLECTION_0001" />}
        />
        <Route
          path="/frontier/project/PERSONAL_INFO_COLLECTION_0001/:taskId/:questId"
          element={<CollectionTpl0001 templateId="PERSONAL_INFO_COLLECTION_0001" />}
        />
        <Route
          path="/frontier/project/PERSONAL_INFO_COLLECTION_0002/:taskId"
          element={<CollectionTpl0002 templateId="PERSONAL_INFO_COLLECTION_0002" />}
        />
        <Route
          path="/frontier/project/PERSONAL_INFO_COLLECTION_0002/:taskId/:questId"
          element={<CollectionTpl0002 templateId="PERSONAL_INFO_COLLECTION_0002" />}
        />

        <Route path="/app/booster" element={<BoosterLayout />}>
          <Route path=":week/read" element={<ReadTaskPage />} />
          <Route path=":week/quiz" element={<QuizTaskPage />} />
          <Route path="not-found" element={<NotFoundPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
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
