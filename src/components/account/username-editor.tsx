import { useCallback, useEffect, useState } from 'react'
import { Button, message } from 'antd'
import { Check, Edit, X } from 'lucide-react'

import TaskTarget from '@/components/common/task-target'

import { userStoreActions, useUserStore } from '@/stores/user.store'

export default function UserNameEditor() {
  const { username } = useUserStore()

  const [edit, setEdit] = useState(false)
  const [nickname, setNickname] = useState(username ?? '')
  const [loading, setLoading] = useState(false)

  const handleUpdateUsername = useCallback(async () => {
    if (nickname === username) {
      return
    }
    if (nickname.trim().length === 0) {
      setNickname(username ?? '')
      return message.error('Username cannot be empty')
    }
    try {
      setLoading(true)
      await userStoreActions.updateUserInfo({ update_key: 'USER_NAME', update_value: nickname! })
      setLoading(false)
      setEdit(false)
    } catch (err) {
      message.error(err.message)
      setEdit(false)
      setLoading(false)
      setNickname(username ?? '')
    }
  }, [nickname, username])

  function handleCancel() {
    setEdit(false)
    setNickname(username ?? '')
  }

  useEffect(() => {
    setNickname(username ?? '')
  }, [username])

  return (
    <>
      {edit ? (
        <div className="rounded-lg border border-white/10 p-2">
          <div className="flex flex-1 items-center justify-between gap-2">
            <input
              autoFocus
              className="h-full flex-1 bg-transparent outline-none"
              placeholder="Enter your nickname"
              type="text"
              value={nickname}
              minLength={1}
              maxLength={12}
              onChange={(e) => setNickname(e.target.value.trim())}
            />
            <Button size="small" className="ml-auto" loading={loading} type="primary" onClick={handleUpdateUsername}>
              {!loading && <Check size={14} />}
            </Button>
            <Button size="small" className="ml-auto" type="primary" ghost onClick={handleCancel}>
              <X size={14} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex cursor-pointer items-center gap-2 text-lg font-semibold" onClick={() => setEdit(true)}>
          <div>{nickname || 'Unknown'}</div>
          <TaskTarget
            match={['target', 'username']}
            className="ml-auto w-0 scale-0 transition-all group-hover:w-5 group-hover:scale-100"
          >
            <Edit size={24} className="p-1"></Edit>
          </TaskTarget>
        </div>
      )}
    </>
  )
}
