import './Title2.scss'

const Title = () => {
  return (
    <div className="text-left h-224px flex flex-col justify-between">
      <div className=""></div>
      <h1 className="h-176px waviy">
        {"Let's annotate crypto".split('').map((val, i) => (
          <span key={val + i}>{val}</span>
        ))}
        <br />
        <br />
        <br />

        {'addresses from here'.split('').map((val, i) => (
          <span key={val + i}>{val}</span>
        ))}
      </h1>
      <p>
        The first decentralized data protocol building foundational
        infrastructure for developers, protocols, and AI, with mechanisms
        generating scientific confidence levels.
      </p>
    </div>
  )
}

export default Title
