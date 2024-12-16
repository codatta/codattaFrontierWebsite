import { AnimatePresence, motion } from 'framer-motion'

export default function TransitionEffect(props: {
  children: React.ReactNode
  className: string
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 30, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={props.className}
      >
        {props.children}
      </motion.div>
    </AnimatePresence>
  )
}
