import privacySvg1 from '../assets/images/privacy-1.svg'
import privacySvg2 from '../assets/images/privacy-2.svg'
import privacySvg3 from '../assets/images/privacy-3.svg'

import './Privacy.scss'

export default function Privacy() {
  return (
    <div className="privacy text-2xl mt-160px">
      <div className="font-semibold color-white">Privacy-preservation</div>
      <div className="text-3xl color-#3857F8 text-3xl mt-24px">
        PII-Free Privacy
      </div>
      <div className="mt-16px">
        Our conviction is firm that personal privacy is a fundamental human
        right, with no exception in blockchain space. We strive to strike a
        balance between transparency and privacy, optimizing the immense value
        that can be unlocked by marrying on-chain and off-chain data, while
        ensuring personal privacy is un-compromised.
      </div>
      <div className="mt-30px flex justify-between">
        <img src={privacySvg1} className="w-635px mr-47px" />
        <div>
          <div className="font-semibold color-white">No PII Allowed</div>
          <div className="mt-16px">
            Our system is meticulously designed to omit any collection of
            personal information.
          </div>
        </div>
      </div>
      <div className="mt-64px flex">
        <div>
          <div className="font-semibold color-white">
            Anonymous Participation
          </div>
          <div className="mt-16px">
            Contributors can utilize a web3-native method to create an account,
            thereby allowing them to remain anonymous and avoid disclosing
            personal information.
          </div>
        </div>
        <img src={privacySvg2} className="w-635px ml-82px" />
      </div>
      <div className="mt-64px flex">
        <img src={privacySvg3} className="w-635px mr-52px" />
        <div>
          <div className="font-semibold color-white">Credential extracts</div>
          <div className="mt-16px">
            Verifiable credentials (such as KYC or diplomas) constitute a
            treasure trove of high-value data. Extracted information from these
            credentials (such as gender or age group) provides anonymous but
            valuable demographic data that helps to empower the Web3 economy in
            numerous ways, including on-chain advertising.
          </div>
        </div>
      </div>
    </div>
  )
}
