// import tracingImg from '../assets/images/tracing-5.svg'
import img1 from '../assets/images/privacy-1.svg'
import img2 from '../assets/images/privacy-2.svg'
import img3 from '../assets/images/privacy-3.svg'

import tracingIcon from '../assets/images/tracing-icon-3.svg'

const Head = () => {
  return (
    <>
      <div className="title-1 mt-12px relative">
        <img
          src={tracingIcon}
          className="w-48px absolute top--10px left--68px"
        />
        Privacy-preservation
      </div>
      <div className="title-2 color-#3857F8">PII-Free Privacy</div>
      <div>
        Our conviction is firm that personal privacy is a fundamental human
        right, with no exception in blockchain space. We strive to strike a
        balance between transparency and privacy, optimizing the immense value
        that can be unlocked by marrying on-chain and off-chain data, while
        ensuring personal privacy is un-compromised.
      </div>
    </>
  )
}

const Section1 = () => {
  return (
    <div className="mt-30px flex justify-between">
      <img src={img1} className="w-635px mr-47px" />
      <div>
        <div className="font-semibold color-white">No PII Allowed</div>
        <div className="mt-16px">
          Our system is meticulously designed to omit any collection of personal
          information.
        </div>
      </div>
    </div>
  )
}

const Section2 = () => {
  return (
    <div className="mt-64px flex">
      <div>
        <div className="font-semibold color-white">Anonymous Participation</div>
        <div className="mt-16px">
          Contributors can utilize a web3-native method to create an account,
          thereby allowing them to remain anonymous and avoid disclosing
          personal information.
        </div>
      </div>
      <img src={img2} className="w-635px ml-82px" />
    </div>
  )
}

const Section3 = () => {
  return (
    <div className="mt-64px flex">
      <img src={img3} className="w-635px mr-52px" />
      <div>
        <div className="font-semibold color-white">Credential extracts</div>
        <div className="mt-16px">
          Verifiable credentials (such as KYC or diplomas) constitute a treasure
          trove of high-value data. Extracted information from these credentials
          (such as gender or age group) provides anonymous but valuable
          demographic data that helps to empower the Web3 economy in numerous
          ways, including on-chain advertising.
        </div>
      </div>
    </div>
  )
}

const Part = () => {
  return (
    <div className="h-1345px relative">
      <Head />
      <Section1 />
      <Section2 />
      <Section3 />
      {/* <div className="absolute left--68px top--12px w-48px flex flex-col">
        <img src={tracingIcon} className="w-48px" />
        <img src={tracingLine} className="w-48px h-1200px" />
      </div> */}
      {/* <img
        src={tracingImg}
        className="absolute left--68px top--12px h-full w-48px object-contain"
      /> */}
    </div>
  )
}

export default Part
