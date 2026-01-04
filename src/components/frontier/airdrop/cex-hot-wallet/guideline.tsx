export const DepositGuideline = () => (
  <div className="py-4 text-left">
    <div className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-white">
      <div className="h-3.5 w-[3px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#22c1c3]" />
      Guidelines
    </div>

    <div className="mb-3">
      <div className="mb-2.5 text-xs font-bold text-white">Task Description</div>
      <div className="text-[13px] leading-[1.6] text-[#d0d0d0]">
        This task aims to collect deposit transaction records from centralized exchanges (CEX) and identify the hot
        wallet addresses used by these exchanges. By tracking deposit transactions and analyzing fund flows, we can map
        the hot wallet infrastructure of major exchanges. Please follow the steps below to submit your deposit record:
        first, confirm and select the exchange where you made the deposit; then navigate to the deposit history page;
        select a valid deposit record that meets the requirements; verify the transaction details on the blockchain
        explorer; check if funds were transferred out from the deposit address; and finally, submit all relevant
        transaction information.
      </div>
    </div>

    <div>
      <div className="mb-2.5 text-xs font-bold text-white">Requirements (Must Read)</div>
      <ul className="mt-2 list-none space-y-1 pl-0">
        <li className="relative pl-6 text-[13px] text-[#d1d5db]">
          <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
          Use PC desktop browser only
        </li>
        <li className="relative pl-6 text-[13px] text-[#d1d5db]">
          <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
          Mobile apps/browsers not supported
        </li>
      </ul>
    </div>
  </div>
)

export const WithdrawGuideline = () => (
  <div className="py-4 text-left">
    <div className="mb-2.5 flex items-center gap-2 text-[15px] font-bold text-white">
      <div className="h-3.5 w-[3px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#22c1c3]" />
      Guidelines
    </div>

    <div className="mb-3">
      <div className="mb-2.5 text-xs font-bold text-white">Task Description</div>
      <div className="text-[13px] leading-[1.6] text-[#d0d0d0]">
        This task aims to collect withdrawal transaction records from centralized exchanges (CEX) and identify the hot
        wallet addresses used by these exchanges. By tracking withdrawal transactions and analyzing fund flows from
        exchange hot wallets to user addresses, we can map the withdrawal routing patterns of major exchanges. Please
        follow the steps below to submit your withdrawal record: first, confirm and select the exchange where you made
        the withdrawal; then navigate to the withdrawal history page; select a valid withdrawal record that meets the
        requirements; verify the transaction details on the blockchain explorer; and finally, submit all relevant
        transaction information.
      </div>
    </div>

    <div>
      <div className="mb-2.5 text-xs font-bold text-white">Requirements (Must Read)</div>
      <ul className="mt-2 list-none space-y-1 pl-0">
        <li className="relative pl-6 text-[13px] text-[#d1d5db]">
          <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
          Use PC desktop browser only
        </li>
        <li className="relative pl-6 text-[13px] text-[#d1d5db]">
          <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
          Mobile apps/browsers not supported
        </li>
      </ul>
    </div>
  </div>
)
