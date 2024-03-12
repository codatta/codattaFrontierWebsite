// import { useEffect } from 'react'
// import useScrollWithProgress from './useScrollWithProgress' // 替换为实际使用的滚动库
// import { useMotionValueEvent, animate } from 'framer-motion' // 替换为实际使用的动画库

// interface UseRunNumProgressHookProps {
//   stiffness: number
//   damping: number
// }

// interface UseRunNumProgressHookResult {
//   ref: React.RefObject<HTMLDivElement>
//   progress: number
//   runNum: boolean
//   runNumProgress: number
// }

// const useRunNumProgressHook = ({
//   stiffness,
//   damping,
// }: UseRunNumProgressHookProps): UseRunNumProgressHookResult => {
//   const { ref, progress } = useScrollWithProgress([0, 1], {
//     stiffness,
//     damping,
//   })

//   const runNumProgressHandler = (
//     latest: number,
//     setRunNum: React.Dispatch<React.SetStateAction<boolean>>
//   ) => {
//     if (latest > 0.6 && !setRunNum) {
//       setRunNum(true)
//     } else if (latest <= 0.6 && setRunNum) {
//       setRunNum(false)
//     }
//   }

//   useMotionValueEvent(progress, 'change', (latest) =>
//     runNumProgressHandler(latest, setRunNum)
//   )

//   useEffect(() => {
//     console.log('progress: ', progress)
//   }, [progress])

//   useEffect(() => {
//     console.log('num: ', runNum)

//     animate(runNumProgress, runNum ? 1 : 0, {
//       duration: 2,
//       onUpdate: (latest) => setRunNumProgress(latest),
//     })
// //   }, [runNum])

//   return { ref, progress, runNum, runNumProgress }
// }

// export default useRunNumProgressHook
