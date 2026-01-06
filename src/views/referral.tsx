import { message, Button, Input, Modal, ConfigProvider, Pagination } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga4'
import { Loader2, X } from 'lucide-react'
import TransitionEffect from '@/components/common/transition-effect'
import { useUserStore } from '@/stores/user.store'
import { referralStoreActions, useReferralStore } from '@/stores/referral.store'
import userApi from '@/apis/user.api'
import SocialShare from '@/components/referral/social-share'
import Empty from '@/components/common/empty'
import CoinSvgImage from '@/assets/userinfo/reward-icon.svg'
import AntdTheme from '@/styles/antd.theme'
import ReferralGiftBoxImage from '@/assets/referral/referral-gift-box.png'
import dayjs from 'dayjs'

// Chest Success Modal Component
function ChestSuccessModal({
  open,
  rewardValue,
  onClose
}: {
  open: boolean
  rewardValue: number
  onClose: () => void
}) {
  const modalTheme = {
    ...AntdTheme,
    components: {
      Modal: {
        contentBg: '#1C1C26',
        borderRadius: 16,
        borderRadiusLG: 16
      }
    }
  }

  return (
    <ConfigProvider theme={modalTheme}>
      <Modal closeIcon={null} open={open} centered onCancel={onClose} footer={null} width={400}>
        <div className="relative flex flex-col items-center p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-0 top-0 flex size-6 items-center justify-center text-white hover:text-white/70"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <h2 className="mb-6 text-2xl font-bold text-white">Congratulations!</h2>

          {/* Coin Icon with Background */}
          <div className="relative mb-10 flex items-center justify-center rounded-2xl border-2 border-white/60 bg-primary">
            {/* Purple background with stripes */}

            <div
              className="relative flex size-32 items-center justify-center rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #5734BB 0%, #8B5CF6 100%)',
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)'
              }}
            >
              <div className="absolute bottom-0 right-0 rounded-br-2xl rounded-tl-2xl bg-[#5734BB] px-3 py-1">
                <span className="text-lg font-bold text-white">+{rewardValue}</span>
              </div>
              <img src={CoinSvgImage} alt="Coin" className="relative size-20" />
            </div>

            {/* Reward Value Badge */}
          </div>

          {/* Claim Button */}
          <Button
            type="primary"
            size="large"
            onClick={onClose}
            className="h-12 w-[120px] bg-primary text-base font-semibold"
            shape="round"
          >
            Claim
          </Button>
        </div>
      </Modal>
    </ConfigProvider>
  )
}

export default function Component() {
  const [messageApi, contextHolder] = message.useMessage()
  const { info } = useUserStore()
  const { referralList, referralInfo, chestProgress } = useReferralStore()
  const [loading, setLoading] = useState(false)
  const [showChestModal, setShowChestModal] = useState(false)
  const [chestReward, setChestReward] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)

  const shareLink = useMemo(() => {
    const shareCode = info?.user_data.referee_code || ''
    return `${location.origin}/referral/${shareCode}`
  }, [info])

  const onCopied = () => {
    messageApi.success({
      content: 'Link copied to clipboard!'
    })
  }

  async function getReferralInfo() {
    try {
      await referralStoreActions.getInviteInfo()
    } catch (err) {
      message.error(err.message)
    }
  }

  async function getReferralList(page: number) {
    setLoading(true)
    try {
      const res = await referralStoreActions.getReferralList(page)
      setTotalPage(res.data.total_count)
      setPageSize(res.data.page_size)
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  async function handleOpenChest() {
    try {
      setLoading(true)
      const res = await userApi.openReferralChest()
      if (res.data && res.data.status === 1) {
        setChestReward(res.data.reward_value)
        setShowChestModal(true)
        // Refresh referral info and list
        await Promise.all([getReferralInfo(), getReferralList(page)])
      } else {
        message.error('Failed to open chest')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to open chest'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function handleCloseChestModal() {
    setShowChestModal(false)
  }

  useEffect(() => {
    getReferralList(page)
  }, [page])

  useEffect(() => {
    getReferralInfo()
  }, [])

  return (
    <TransitionEffect className="text-white/85">
      <h2 className="mb-6 text-[32px] font-semibold leading-[48px]">Referral</h2>

      <div className="pb-[100px]">
        {/* Top Section: Invite Friends & Contribute & Win */}
        <div className="mb-8 block gap-6 lg:flex">
          {/* Left: Invite Friends, Earn Together */}
          <div className="flex-1 rounded-3xl bg-[#252532] p-6">
            <h3 className="mb-1 text-xl font-bold">Invite Friends, Earn Together</h3>
            <p className="text-sm text-white/60">
              Invite a friend, both get <span className="font-semibold text-primary">100</span> Points.
            </p>

            {/* Metrics Cards */}
            <div className="mt-5 items-stretch gap-4 xl:flex xl:gap-6">
              <div className="mb-3 flex flex-1 items-stretch rounded-xl bg-white/5 py-2 xl:mb-0 xl:w-1/2 xl:py-4">
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-white">{referralInfo.user_count || 0}</div>
                  <div className="mt-1 text-sm text-white/60">Invited Friends</div>
                </div>
                <div className="my-1 w-px self-stretch bg-white/10"></div>
                <div className="flex-1 text-center">
                  <div className="text-3xl font-bold text-white">{referralInfo.reward}</div>
                  <div className="mt-1 text-sm text-white/60">Rewards Points</div>
                </div>
              </div>
              <div className="rounded-xl bg-white/5 p-4 xl:w-1/2">
                <div className="mb-1 text-center text-sm leading-[36px] text-white/60">
                  Chest every 5 invites Daily limit: 10
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.min((chestProgress / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="mt-5">
              <div className="mb-2 text-sm text-white/60">Copy this link to share with friends</div>
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-white text-black hover:bg-white focus:bg-white"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <CopyToClipboard
                  text={shareLink}
                  onCopy={() => {
                    ReactGA.event('share', {
                      method: 'copy_link',
                      content_type: 'referral'
                    })
                    onCopied()
                  }}
                >
                  <Button className="h-[34px] border-none bg-white text-black hover:bg-white focus:bg-white">
                    Copy link
                  </Button>
                </CopyToClipboard>
                <SocialShare
                  content={() => ({ link: shareLink })}
                  onShare={(social) => {
                    ReactGA.event('share', {
                      method: social,
                      content_type: 'referral'
                    })
                  }}
                  className="flex items-center gap-2"
                  itemWrapper={(child) => child}
                />
              </div>
            </div>
          </div>

          {/* Right: Contribute & Win */}
          <div className="mt-6 rounded-3xl border border-white/5 bg-[#252532] p-6 lg:mt-0 lg:w-[342px] lg:p-6">
            <h3 className="text-2xl font-bold">Contribute & Win</h3>
            <p className="mt-1 text-sm text-white/60">Chest on friend's first accepted contribution.</p>

            {/* Gift Box Illustration Placeholder */}
            <div className="relative z-0 mt-4 flex items-center justify-center">
              <img className="w-[234px] xl:w-[152px]" src={ReferralGiftBoxImage} alt="" />
            </div>

            {/* Open Button */}
            <div className="relative z-10 -mt-6 flex w-full justify-center rounded-full bg-[#252532]">
              <Button
                block
                type="primary"
                size="large"
                className="h-12 bg-primary px-8 text-base font-semibold"
                disabled={referralInfo.chest_available_count === 0 || loading}
                loading={loading}
                onClick={() => handleOpenChest()}
                shape="round"
              >
                OPEN ({referralInfo.chest_available_count})
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Referral History */}
        <h3 className="mb-6 text-2xl font-bold">Referral History</h3>
        <div className="rounded-3xl border border-white/5 bg-[#252532] px-6 pb-6 pt-1">
          {loading && referralList.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-12">
              <Loader2 className="animate-spin text-white"></Loader2>
              loading...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="py-4 font-semibold">Name</th>
                      <th className="py-4 text-center font-semibold">Chest</th>
                      <th className="py-4 text-center font-semibold">Point</th>
                      <th className="w-[100px] py-4 text-right font-semibold">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralList.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          <Empty text="No referral records found" />
                        </td>
                      </tr>
                    ) : (
                      referralList.map((item) => {
                        return (
                          <tr className="border-b border-white/10">
                            <td className="py-4">{item.user_name}</td>
                            <td className="py-4 text-center">
                              {item.chest_count > 0 && (
                                <span className="inline-block rounded-full bg-[#FFA800]/15 px-3 py-1 font-bold text-[#FFA800]">
                                  + {item.chest_count}
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-center">
                              {item.reward > 0 && (
                                <span className="inline-block rounded-full bg-[#008573]/15 px-3 py-1 font-bold text-[#008573]">
                                  + {item.reward}
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-right">{dayjs(item.gmt_create * 1000).format('YYYY/MM/DD')}</td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                total={totalPage}
                pageSize={pageSize}
                current={page}
                onChange={(page) => setPage(page)}
                hideOnSinglePage
              />
            </>
          )}
        </div>
      </div>
      {contextHolder}
      <ChestSuccessModal open={showChestModal} rewardValue={chestReward} onClose={handleCloseChestModal} />
    </TransitionEffect>
  )
}
