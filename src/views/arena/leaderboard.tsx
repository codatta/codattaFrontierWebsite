import { useEffect, useMemo, useState } from 'react'
import { LeaderboardItem } from '@/apis/ai-model.api'
import { message, Spin } from 'antd'
import BronzeImage from '@/assets/chatbot/bronze-medal.png'
import SilverImage from '@/assets/chatbot/silver-medal.png'
import GoldImage from '@/assets/chatbot/gold-medal.png'
import { arenaStoreActions, useArenaStore } from '@/stores/arena.store'
import { Link } from 'react-router-dom'

interface SortIconProps {
  active: boolean
  direction: 'asc' | 'desc'
}

const SortIcon: React.FC<SortIconProps> = ({ active, direction }) => {
  return (
    <div className="ml-1 inline-flex flex-col">
      <div
        className={`size-0 border-x-[5px] border-b-[5px] border-x-transparent ${
          active && direction === 'asc' ? 'border-b-white' : 'border-b-white/30'
        }`}
      />
      <div
        className={`mt-1 size-0 border-x-[5px] border-t-[5px] border-x-transparent ${
          active && direction === 'desc' ? 'border-t-white' : 'border-t-white/30'
        }`}
      />
    </div>
  )
}

export default function Leaderboard() {
  const [loading, setLoading] = useState(false)
  const [sortField, setSortField] = useState<string>('arena_score')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const { leaderboard, leaderboardSummary } = useArenaStore()

  async function fetchLeaderboard() {
    setLoading(true)
    try {
      await arenaStoreActions.getLeaderboard()
    } catch (err) {
      message.error(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedData = useMemo(() => {
    const data = [...leaderboard].sort((a, b) => {
      console.log(a, b)
      const aValue = a[sortField as keyof LeaderboardItem]
      const bValue = b[sortField as keyof LeaderboardItem]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })
    return data
  }, [leaderboard, sortDirection, sortField])

  const renderRankIcon = (rank: number) => {
    if (rank === 1) return <img src={GoldImage} className="inline-block size-6" alt="" />
    if (rank === 2) return <img src={SilverImage} className="inline-block size-6" alt="" />
    if (rank === 3) return <img src={BronzeImage} className="inline-block size-6" alt="" />
    return <span className="leading-[24px]">{rank}</span>
  }

  return (
    <div className="min-h-screen pb-10">
      <h1 className="mb-4 text-center text-3xl font-bold text-white">Codatta Arena Leaderboard</h1>
      <div className="mb-6 flex justify-center gap-6 text-white">
        <div>
          📊 Total models: <strong>{leaderboardSummary.total}</strong>
        </div>
        <div>
          🗳️ Total verified votes: <strong>{leaderboardSummary.total_votes}</strong>
        </div>
        <Link to="/arena/onchain/list" className="underline transition-all hover:text-primary">
          🗳️ Total On-chain Votes: <strong>{leaderboardSummary.total_chain_votes}</strong>
        </Link>
        <div>
          📅 Last Updated: <strong>{leaderboardSummary.update_time}</strong>
        </div>
      </div>
      <div className="mb-8 text-center text-sm text-white/40">
        <p className="mb-2">
          Codatta Arena is an open benchmarking platform designed for conversational AI models, allowing users to assess
          real-world performance across various application scenarios.
        </p>
        <p>
          From basic interactions to data analysis and code generation, Codatta Arena provides a comprehensive
          comparison framework based on scores, accuracy rates, and user feedback to deliver objective model
          evaluations.
        </p>
      </div>

      <Spin spinning={loading}>
        <div className="overflow-hidden rounded-lg border border-white/5 bg-[#1e1e29] px-2 text-sm text-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-[#1e1e29] text-sm text-white">
                <th className="py-3 text-left">
                  <div className="flex items-center justify-center">Rank(UB)</div>
                </th>
                <th className="p-4 text-left">Model</th>
                <th className="cursor-pointer p-4 text-left" onClick={() => handleSort('arena_score')}>
                  <div className="flex items-center gap-1">
                    Arena Score
                    <SortIcon active={sortField === 'arena_score'} direction={sortDirection} />
                  </div>
                </th>
                <th className="cursor-pointer p-4 text-left" onClick={() => handleSort('ci')}>
                  <div className="flex items-center gap-1">
                    95% CI
                    <SortIcon active={sortField === 'ci'} direction={sortDirection} />
                  </div>
                </th>
                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => handleSort('votes')}>
                  <div className="flex items-center gap-1">
                    Votes
                    <SortIcon active={sortField === 'votes'} direction={sortDirection} />
                  </div>
                </th>
                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => handleSort('correct_rate')}>
                  <div className="flex items-center gap-1">
                    Correct Rate
                    <SortIcon active={sortField === 'correct_rate'} direction={sortDirection} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left">Organization</th>
                <th className="px-4 py-3 text-left">License</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.name} className="transition-all hover:bg-white/5">
                  <td className="py-4 text-center">{renderRankIcon(item.rank || 0)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img src={item.image_url} alt={item.show_name} className="size-6 rounded-full" />
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary"
                      >
                        {item.show_name}
                      </a>
                    </div>
                  </td>
                  <td className="p-4">{item.arena_score}</td>
                  <td className="p-4">{item.ci}</td>
                  <td className="p-4">{item.votes}</td>
                  <td className="p-4">{item.correct_rate}</td>
                  <td className="p-4">{item.org_name}</td>
                  <td className="p-4">{item.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Spin>
    </div>
  )
}
