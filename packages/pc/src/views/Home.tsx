import Article1 from '../components/article-1/Index'
import Article2 from '../components/article-2/Index'
import Article3 from '../components/article-3/Index'
import Article4 from '../components/article-4/Index'
import Article5 from '../components/article-5/Index'
import Footer from '@/components/Footer'
import CopyRights from '@/components/CopyRights'

export const Component = () => {
  return (
    <>
      <div className="ml-64px">
        <Article1 />
        <Article2 />
        <Article3 />
        <Article4 />
        <Article5 />
      </div>
      <div className="px-64px">
        <Footer />
        <CopyRights />
      </div>
    </>
  )
}
