export const VITE_IS_LOCAL = import.meta.env.DEV
export const VITE_MODE = import.meta.env.MODE
export const VITE_DYNAMIC_ENVIRONMENT_ID = import.meta.env
  .VITE_DYNAMIC_ENVIRONMENT_ID

console.log(
  'ENV: ',
  VITE_IS_LOCAL,
  VITE_MODE,
  VITE_DYNAMIC_ENVIRONMENT_ID,
  import.meta.env
)
