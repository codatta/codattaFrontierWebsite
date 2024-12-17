import calorieAi from '@/assets/home/calorie-ai.png'
import vault from '@/assets/home/vault.png'

const Frontiers = () => {
  const explorelist = [
    // {
    //   title: 'Robotics',
    //   img: robotics,
    //   desc: 'Visual data annotation is essential for training large AI models in robotics, especially for object recognition and spatial awareness. High-quality labeled data helps improve the accuracy of robotic vision, enabling robots to perform complex tasks with greater precision and adaptability.',
    // },
    {
      title: 'Food Science',
      img: calorieAi,
      desc: 'From a fitness perspective, Food Science AI personalizes nutritional intake recommendations in recipes. It helps users manage their nutritional balance and dietary composition to promote a healthier lifetstyle.'
    },
    {
      title: 'Vault',
      img: vault,
      desc: 'Vault focuses on securely managing users, valuable personal data, ensuring privacy while unlocking its potential value. Users can control and monetize their data safely, maintaining complete ownership and control over their personal information.'
    }
    // {
    //   title: 'Fashion',
    //   img: fashion,
    //   desc: 'We are committed to collecting fashion data through multiple channels, including social media trends, consumer feedback, and e-commerce sales analysis, to help brands gain deeper insights into market dynamics and consumer preferences. By analyzing this data, we can identify emerging trends and popular styles, providing strong decision-making support for brands. Whether optimizing product lines, adjusting marketing strategies, or enhancing customer experiences, precise data insights empower brands to stand out in a competitive landscape.',
    // },
  ]
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-bold">Explore More</h2>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          {explorelist.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-2xl bg-[#252532] hover:border-primary hover:shadow-primary sm:flex"
            >
              <div className="flex-none overflow-hidden rounded-2xl sm:w-[260px]">
                <img
                  src={item.img}
                  alt=""
                  className="aspect-[260/148] object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden p-6">
                <h2 className="text-base font-bold">{item.title}</h2>
                <div className="mt-3 text-sm text-white/50 sm:line-clamp-3">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Frontiers
