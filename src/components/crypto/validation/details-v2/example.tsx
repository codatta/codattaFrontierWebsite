import { Image } from 'antd'

import image1 from '@/assets/crypto/validation/example/image-1.png'
import image2 from '@/assets/crypto/validation/example/image-2.jpeg'
import image3 from '@/assets/crypto/validation/example/image-3.png'
import image4 from '@/assets/crypto/validation/example/image-4.png'
import image5 from '@/assets/crypto/validation/example/image-5.png'
import image6 from '@/assets/crypto/validation/example/image-6.png'
import image7 from '@/assets/crypto/validation/example/image-7.png'
import image8 from '@/assets/crypto/validation/example/image-8.png'

const Example = ({ type }: { type: string }) => {
  return (
    <div className="px-4 pb-6">
      {type === 'SUBMISSION_PRIVATE' && (
        <div className="flex gap-12">
          <div className="w-[400px]">
            <div className="mb-3 text-base font-bold">Approve Example:</div>
            <div>
              <Image src={image1} />
            </div>
          </div>
          <div>
            <div className="mb-3 text-base font-bold">Reject Example:</div>
            <div className="w-[143px]">
              <Image src={image2} />
            </div>
          </div>
        </div>
      )}
      {type === 'SUBMISSION_HASH_ADDRESS' && (
        <div className="flex gap-12">
          <div className="w-80">
            <div className="mb-3 text-base font-bold">Approve Example:</div>
            <div>
              <Image src={image3} />
            </div>
            <div>
              <div className="mb-2 mt-3 text-[#84828E]">Address</div>
              <div>0xfFEE087852cb4898e6c3532E776e68BC68b1143B</div>
            </div>
          </div>
          <div className="w-80">
            <div className="mb-3 text-base font-bold">Reject Example:</div>
            <div className="w-80">
              <Image src={image4} />
            </div>
            <div>
              <div className="mb-2 mt-3 text-[#84828E]">Address</div>
              <div>0x4d2E128f8F45751257beFcAa4E92Da8D0e6b5869</div>
            </div>
          </div>
        </div>
      )}
      {type === 'SUBMISSION_IMAGE_ADDRESS' && (
        <div className="flex gap-12">
          <div className="w-80">
            <div className="mb-3 text-base font-bold">Approve Example:</div>
            <div>
              <Image src={image5} />
            </div>
            <div>
              <div className="mb-2 mt-3 text-[#84828E]">Address</div>
              <div>TAshjGqBFCeHumHaBCPqfn2DmgRDq97tTf</div>
            </div>
          </div>
          <div className="w-80">
            <div className="mb-3 text-base font-bold">Reject Example:</div>
            <div className="w-80">
              <Image src={image6} />
            </div>
            <div>
              <div className="mb-2 mt-3 text-[#84828E]">Address</div>
              <div>TWaertrZdpRJSbLv2G638UL5HCK6sKcZYy</div>
            </div>
          </div>
        </div>
      )}
      {type === 'SUBMISSION_IMAGE_ENTITY' && (
        <div className="flex gap-12">
          <div className="w-80">
            <div className="mb-3 text-base font-bold">Approve Example:</div>
            <div>
              <Image src={image7} />
            </div>
            <div>
              <div className="mb-2 mt-3 text-[#84828E]">Description</div>
              <div>This address has been entityed as Uniswap on Etherscan.</div>
            </div>
            <div>
              <div className="mb-2 mt-3 text-[#84828E]">Entity</div>
              <div>Uniswap</div>
            </div>
          </div>
          <div className="w-80">
            <div className="mb-3 text-base font-bold">Reject Example:</div>
            <div className="w-80">
              <Image src={image8} />
            </div>
            <div>
              <div className="mb-2 mt-3 text-[#84828E]">Entity</div>
              <div>Uniswap</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Example
