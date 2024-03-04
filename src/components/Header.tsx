import './Header.scss'

export default function HeaderComp() {
    return  (<header className='header flex justify-between  font-medium'>
        <div className="flex items-center">
            <div className='logo-icon'></div>
            <div>Ominitags</div>
        </div>
        <button>Sign in</button>
    </header>)
}