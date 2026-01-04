import React from 'react'

export const SupportedNetworksTip: React.FC = () => {
  const items = [
    'BTC (BTC)',
    'ETH (ETH/USDC/USDT/BNB/stETH)',
    'TRON (TRX/USDT)',
    'SOL (SOL)',
    'BNB (BNB/ETH/USDC/USDT/XRP)',
    'ARB (ETH)',
    'OP (ETH)',
    'BASE (ETH)',
    'Polygon (POL)',
    'ETC (ETC)',
    'BCH (BCH)'
  ]

  return (
    <div className="mt-2 rounded-md border-l-4 border-yellow-500 bg-yellow-500/10 px-3 py-2.5 text-xs text-gray-200">
      <div className="mb-2 font-bold text-[#facc15]">Supported Combinations:</div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="text-[#a78bfa]">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
