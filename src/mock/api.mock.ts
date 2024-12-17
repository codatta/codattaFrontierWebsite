import { defineMock } from 'vite-plugin-mock-dev-server'
export default defineMock([
  {
    url: '/api/v2/task/categories',
    method: 'POST',
    body: {
      data: [
        {
          cate_name: 'Permanent Quests',
          cate_id: 'CATE001',
          cate_icon: null,
          rewards: null,
          sub: [
            {
              sub_cate_id: 'SUBCATE012',
              sub_cate_name: 'Submit Fashion data from Codatta Clip',
              sub_cate_description:
                'Submit your fashion data from Codatta Clip now and earn exciting rewards while helping us enhance our product offerings!',
              award_icon:
                'https://static.codatta.io/static/images/26d1ccfd45ab98bd5ec948f6b038f7d469d66c37.png',
              completed_count: 36,
              avatars: [
                'https://file.b18a.io/158071644262400_461109_.png',
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png'
              ],
              locked: false,
              how_to_unlock: null,
              finished_count: 0,
              all_finished: false
            },
            {
              sub_cate_id: 'SUBCATE009',
              sub_cate_name:
                'Access the Codatta tool for simplified data submission',
              sub_cate_description:
                'A powerful tool designed to simplify and enhance your data submission process. Streamline your workflows effortlessly with Codatta!',
              award_icon:
                'https://static.codatta.io/static/images/30d957a15fdb1fa6fbc34b0c82d470443dc39c9f.png',
              completed_count: 4595,
              avatars: [
                'https://file.b18a.io/158157313658880_747083_.png',
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
                'https://file.b18a.io/158281722609664_405444_.png'
              ],
              locked: false,
              how_to_unlock: null,
              finished_count: 0,
              all_finished: false
            },
            {
              sub_cate_id: 'SUBCATE008',
              sub_cate_name: 'Telegram  Mini-Program',
              sub_cate_description:
                'On the Telegram mobile app, participate in the codatta Telegram Mini-Program to earn unique daily points rewards and easily validate anytime, anywhere.\n',
              award_icon:
                'https://static.codatta.io/static/images/7ca783326e2057993c23058567e2e8b80b27e312.png',
              completed_count: 93650,
              avatars: [
                'https://file.b18a.io/3106827653341184_632107_.png',
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png',
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png'
              ],
              locked: false,
              how_to_unlock: null,
              finished_count: 2,
              all_finished: false
            },
            {
              sub_cate_id: 'SUBCATE005',
              sub_cate_name:
                'Complete cyclic quests to receive substantial daily rewards.',
              sub_cate_description:
                "The main goal of Cyclic quests is to help users become familiar with the codatta project. As data contributors, we don't want to impose any extra burden on you. Instead, we periodically encourage you to engage in core data activities, such as submission and validation.",
              award_icon:
                'https://static.codatta.io/static/images/63b196b5e3cc4b07e9a0db8f0e72f3a3f969793d.png',
              completed_count: 2802922,
              avatars: [
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png'
              ],
              locked: false,
              how_to_unlock: null,
              finished_count: 1,
              all_finished: false
            }
          ]
        },
        {
          cate_name: 'New User Quests',
          cate_id: 'CATE002',
          cate_icon: null,
          rewards: null,
          sub: [
            {
              sub_cate_id: 'SUBCATE011',
              sub_cate_name: 'Know more about XnY',
              sub_cate_description:
                'XnY is a blockchain network aimed at transforming the data economy by addressing inefficiencies in AI data markets and promoting a decentralized ecosystem that ensures fair compensation for data creators.',
              award_icon:
                'https://static.codatta.io/static/images/3e649cb7a817373eec20dac10727ed6a0b93b440.png',
              completed_count: 1094,
              avatars: [
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
                'https://file.b18a.io/158293891629056_894274_.png',
                'https://file.b18a.io/71549efc-57c6-41c1-896c-b5b32dba0d81_605293_avatar.png'
              ],
              locked: false,
              how_to_unlock: null,
              finished_count: 0,
              all_finished: true
            },
            {
              sub_cate_id: 'SUBCATE002',
              sub_cate_name:
                'Start your codatta journey: How to perform validation.',
              sub_cate_description:
                'Complete the quests in this module to enhance understanding of validation.',
              award_icon:
                'https://static.codatta.io/static/images/c29d6850c9d902bf908a6552f1f2bf1fce50831b.png',
              completed_count: 162899,
              avatars: [
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png',
                'https://file.b18a.io/158494416908288_289254_.png',
                'https://file.b18a.io/3109685398941696_135072_.png'
              ],
              locked: false,
              how_to_unlock: null,
              finished_count: 0,
              all_finished: true
            },
            {
              sub_cate_id: 'SUBCATE003',
              sub_cate_name: 'Advanced use of codatta: Mastering submission.',
              sub_cate_description:
                'Complete the quests in this module to enhance understanding of submission.',
              award_icon:
                'https://static.codatta.io/static/images/c3fefa7623b799097d9adbd6a22105313cf1420d.png',
              completed_count: 73138,
              avatars: [
                'https://file.codatta.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_855028_default-avatar-1.png',
                'https://file.b18a.io/158431568637952_813404_.png',
                'https://file.b18a.io/d5e3da70-b9d9-45fe-8e6f-e75c51cb7005_165485_default-avatar-2.png'
              ],
              locked: false,
              how_to_unlock: null,
              finished_count: 0,
              all_finished: true
            }
          ]
        }
      ],
      success: true,
      errorCode: 0,
      errorMessage: 'SUCCESS'
    }
  }
])
