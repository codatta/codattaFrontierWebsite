import { clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork, WalletReadyState } from '@solana/wallet-adapter-base'
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react'
import {
  AlphaWalletAdapter,
  AvanaWalletAdapter,
  BitpieWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  CoinhubWalletAdapter,
  FractalWalletAdapter,
  HuobiWalletAdapter,
  HyperPayWalletAdapter,
  KeystoneWalletAdapter,
  KrystalWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  NekoWalletAdapter,
  NightlyWalletAdapter,
  NufiWalletAdapter,
  OntoWalletAdapter,
  ParticleAdapter,
  PhantomWalletAdapter,
  SafePalWalletAdapter,
  SaifuWalletAdapter,
  SalmonWalletAdapter,
  SkyWalletAdapter,
  SolflareWalletAdapter,
  SolongWalletAdapter,
  SpotWalletAdapter,
  TokenaryWalletAdapter,
  TokenPocketWalletAdapter,
  TorusWalletAdapter,
  TrezorWalletAdapter,
  TrustWalletAdapter,
  WalletConnectWalletAdapter,
  XDEFIWalletAdapter,
  BitgetWalletAdapter,
  WalletConnectWalletAdapterConfig
} from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { useEffect, useMemo } from 'react'
import '@solana/wallet-adapter-react-ui/styles.css'

function WalletConnector() {
  const { wallet } = useWallet()

  useEffect(() => {
    if (!wallet) return
    if (wallet.readyState === WalletReadyState.Installed) wallet.adapter.connect()
    if (wallet.readyState === WalletReadyState.Loadable) wallet.adapter.connect()
    if (wallet.readyState === WalletReadyState.NotDetected) window.open(wallet.adapter.url, '_blank')
    if (wallet.readyState === WalletReadyState.Unsupported) window.open(wallet.adapter.url, '_blank')
  }, [wallet])
  return <></>
}

export default function SolanaConnectProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])
  const wallets = useMemo(
    () => {
      const walletConnectConfig: WalletConnectWalletAdapterConfig = {
        network: WalletAdapterNetwork.Mainnet,
        options: { projectId: '7a4434fefbcc9af474fb5c995e47d286' }
      }

      const wallets = [
        new AlphaWalletAdapter(),
        new AvanaWalletAdapter(),
        new BitpieWalletAdapter(),
        new CloverWalletAdapter(),
        new Coin98WalletAdapter(),
        new CoinbaseWalletAdapter(),
        new CoinhubWalletAdapter(),
        new FractalWalletAdapter(),
        new HuobiWalletAdapter(),
        new HyperPayWalletAdapter(),
        new KeystoneWalletAdapter(),
        new KrystalWalletAdapter(),
        new LedgerWalletAdapter(),
        new MathWalletAdapter(),
        new NekoWalletAdapter(),
        new NightlyWalletAdapter(),
        new NufiWalletAdapter(),
        new OntoWalletAdapter(),
        new ParticleAdapter(),
        new PhantomWalletAdapter(),
        new SafePalWalletAdapter(),
        new SaifuWalletAdapter(),
        new SalmonWalletAdapter(),
        new SkyWalletAdapter(),
        new SolflareWalletAdapter(),
        new SolongWalletAdapter(),
        new SpotWalletAdapter(),
        new TokenaryWalletAdapter(),
        new TokenPocketWalletAdapter(),
        new TorusWalletAdapter(),
        new TrezorWalletAdapter(),
        new TrustWalletAdapter(),
        new WalletConnectWalletAdapter(walletConnectConfig),
        new XDEFIWalletAdapter(),
        new BitgetWalletAdapter()
      ]
      return wallets
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <WalletConnector />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
