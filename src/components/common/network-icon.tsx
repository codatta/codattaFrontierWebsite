import { cn } from '@udecode/cn'

const NETWORK_ICON_PATH = 'https://static.codatta.io/icons/network/'

const NETWORK_ICON_KEY_MAP = {
  abelian: 'abelian.png',
  aia: 'aia.png',
  aioz: 'aioz.png',
  airdao: 'airdao.png',
  aleph: 'aleph.png',
  alephium: 'alephium.png',
  algorand: 'algorand.svg',
  aptos: 'aptos.png',
  arbitrum: 'arbitrum.png',
  astar: 'astar.svg',
  avalanche: 'avalanche.svg',
  base: 'base.png',
  bitcoin: 'bitcoin.svg',
  bitrock: 'bitrock.png',
  bnb: 'bnb.svg',
  boba: 'boba.png',
  busy: 'busy.png',
  canto: 'canto.png',
  cardano: 'cardano.svg',
  casper: 'casper.jpeg',
  chihuahua: 'chihuahua.png',
  chiliz: 'chiliz.png',
  chromia: 'chromia.svg',
  coinweb: 'coinweb.png',
  concordium: 'concordium.png',
  coreum: 'coreum.png',
  cosmos: 'cosmos.png',
  cronos: 'cronos.png',
  cudos: 'cudos.png',
  degate: 'degate.png',
  dogcoin: 'dogcoin.png',
  dogecoin: 'dogecoin.png',
  dusk: 'dusk.svg',
  dynex: 'dynex.png',
  ecash: 'ecash.png',
  electra: 'electra.png',
  enjin: 'enjin.svg',
  epic: 'epic.png',
  ergo: 'ergo.png',
  ethereum: 'ethereum.svg',
  evmos: 'evmos.png',
  fantom: 'fantom.svg',
  fio: 'fio.svg',
  flow: 'flow.svg',
  fuse: 'fuse.png',
  gnosis: 'gnosis.png',
  hedera: 'hedera.svg',
  hive: 'hive.svg',
  humanode: 'humanode.png',
  hypr: 'hypr.webp',
  immutable: 'immutable.png',
  injective: 'injective.png',
  integritee: 'integritee.png',
  interlay: 'interlay.png',
  internet: 'internet.svg',
  jackal: 'jackal.png',
  kadena: 'kadena.png',
  kaspa: 'kaspa.png',
  kava: 'kava.png',
  kintsugi: 'kintsugi.webp',
  klaytn: 'klaytn.svg',
  kylacoin: 'kylacoin.png',
  layerai: 'layerai.png',
  liquidlayer: 'liquidlayer.png',
  loopring: 'loopring.svg',
  lto: 'lto.png',
  lukso: 'lukso.png',
  mainnetz: 'mainnetz.svg',
  manta: 'manta.png',
  mantle: 'mantle.png',
  metis: 'metis.png',
  mintlayer: 'mintlayer.png',
  moonbeam: 'moonbeam.png',
  moonriver: 'moonriver.svg',
  multivac: 'multivac.png',
  multiversx: 'multiversx.png',
  muu: 'muu.png',
  myria: 'myria.png',
  near: 'near.svg',
  neurai: 'neurai.png',
  nexa: 'nexa.png',
  nordek: 'nordek.png',
  nym: 'nym.png',
  oasys: 'oasys.png',
  octaspace: 'octaspace.png',
  openfabric: 'openfabric.png',
  optimism: 'optimism.png',
  oraichain: 'oraichain.png',
  origintrail: 'origintrail.svg',
  phantasma: 'phantasma.svg',
  picasso: 'picasso.png',
  polkadot: 'polkadot.png',
  polygon: 'polygon.png',
  qanplatform: 'qanplatform.png',
  qubic: 'qubic.png',
  radiant: 'radiant.png',
  radix: 'radix.svg',
  ronin: 'ronin.png',
  saito: 'saito.png',
  satoshivm: 'satoshivm.png',
  script: 'script.png',
  sei: 'sei.png',
  skale: 'skale.svg',
  solana: 'solana.svg',
  starknet: 'starknet.png',
  stride: 'stride.png',
  sui: 'sui.png',
  syscoin: 'syscoin.svg',
  taraxa: 'taraxa.png',
  tectum: 'tectum.svg',
  tezos: 'tezos.svg',
  the: 'the.svg',
  theta: 'theta.svg',
  thought: 'thought.png',
  toncoin: 'toncoin.svg',
  tron: 'tron.svg',
  ultron: 'ultron.png',
  unique: 'unique.svg',
  wax: 'wax.svg',
  witnet: 'witnet.png',
  xdai: 'xdai.png',
  xdc: 'xdc.png',
  zano: 'zano.png',
  zenon: 'zenon.svg',
  zetachain: 'zetachain.png',
  zkbase: 'zkbase.png'
}

const NETWORK_ICON_MAP = Object.fromEntries(
  Object.entries(NETWORK_ICON_KEY_MAP).map(([k, v]) => [
    k,
    NETWORK_ICON_PATH + v + '?v=2.1'
  ])
)

const Icon = ({
  type,
  size = 14,
  className
}: {
  type: string
  size: number
  className?: string
}) => {
  const icon = NETWORK_ICON_MAP[type?.toLocaleLowerCase()]

  return (
    <span
      className={cn(
        'block rounded-full bg-contain bg-center bg-no-repeat',
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${icon}?ver=1.1)`
      }}
    ></span>
  )
}

export default Icon
