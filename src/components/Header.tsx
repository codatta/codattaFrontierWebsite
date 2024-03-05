import './Header.scss'

export default function HeaderComp() {
    return (
      <header className="header flex justify-between  font-medium">
        <div className="flex items-center">
          <div className="logo-icon"></div>
          <div>Ominitags</div>
        </div>
        <button className="color-#fff border-none bg-inherit">Sign in</button>
      </header>
    )
}