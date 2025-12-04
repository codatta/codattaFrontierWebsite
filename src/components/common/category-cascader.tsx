import { cn } from '@udecode/cn'
import { Cascader } from 'antd'
import { useEffect } from 'react'
import { useState } from 'react'
import { getCategoryDesByName } from '@/stores/config.store'

const CustomCascader = ({ ...props }) => {
  const [des, setDes] = useState('')
  const [isTipShow, setIsTipShow] = useState(false)

  return (
    <div>
      <Cascader
        {...props}
        // dropdownClassName="bg-transparent shadow-none rounded-0"
        dropdownRender={(menus) => {
          const node = document.querySelector('#category-cascader')

          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            let currentItem: Element

            const handleMouseOver = (e: Event) => {
              const target = e.target as HTMLElement
              const menuItem = target?.closest('.ant-cascader-menu-item')

              if (menuItem) {
                if (currentItem === menuItem) return

                const title = menuItem.getAttribute('title') || ''

                setIsTipShow(true)
                setDes(getCategoryDesByName(title) || '')

                currentItem = menuItem
              }
            }
            const handleMouseout = (_e: Event) => {
              setIsTipShow(false)
            }

            node?.addEventListener('mouseover', handleMouseOver, true)
            node?.addEventListener('mouseout', handleMouseout, true)

            return () => {
              node?.removeEventListener('mouseover', handleMouseOver, true)
              node?.removeEventListener('mouseout', handleMouseout, true)
            }
          }, [menus, node])

          return (
            <div className="flex">
              <div id="category-cascader" className="shadow-md rounded-xl">
                {menus}
              </div>
              <div>
                <div
                  className={cn(
                    'ml-[6px] h-full w-[156px] rounded-sm bg-[#000000]/10 p-[10px] text-xs leading-4 text-[#FAF9FB] transition duration-300 ease-out',
                    isTipShow && des ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  {des}
                </div>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}

export default CustomCascader
