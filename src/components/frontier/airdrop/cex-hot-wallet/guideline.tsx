export const DepositGuideline = () => (
  <div className="py-[30px] text-sm leading-[22px] text-[#8D8D93]">
    <h2 className="text-lg font-bold text-white">
      <span>📋 Guidelines</span>
    </h2>

    <div className="mt-4">
      <h3 className="mb-2 font-semibold text-white">Task Description</h3>
      <p className="leading-[22px]">
        This task aims to collect deposit transaction records from centralized exchanges (CEX) and identify the hot
        wallet addresses used by these exchanges. By tracking deposit transactions and analyzing fund flows, we can map
        the hot wallet infrastructure of major exchanges. Please follow the steps below to submit your deposit record:
        first, confirm and select the exchange where you made the deposit; then navigate to the deposit history page;
        select a valid deposit record that meets the requirements; verify the transaction details on the blockchain
        explorer; check if funds were transferred out from the deposit address; and finally, submit all relevant
        transaction information.
      </p>
    </div>

    <div className="mt-4">
      <h3 className="mb-2 font-semibold text-white">Requirements (Must Read)</h3>
      <ul className="list-none space-y-1">
        <li className="relative pl-6">
          <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
          Use PC desktop browser only
        </li>
        <li className="relative pl-6">
          <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
          Mobile apps/browsers not supported
        </li>
      </ul>
    </div>
  </div>
)

export const WithdrawGuideline = () => (
  <div className="py-[30px] text-sm leading-[22px] text-[#8D8D93]">
    <h2 className="text-lg font-bold text-white">
      <span>📋 Guidelines</span>
    </h2>

    <div className="mt-4">
      <h3 className="mb-2 font-semibold text-white">Task Description</h3>
      <p className="leading-[22px]">
        This task aims to collect withdrawal transaction records from centralized exchanges (CEX) and identify the hot
        wallet addresses used by these exchanges. By tracking withdrawal transactions and analyzing fund flows from
        exchange hot wallets to user addresses, we can map the withdrawal routing patterns of major exchanges. Please
        follow the steps below to submit your withdrawal record: first, confirm and select the exchange where you made
        the withdrawal; then navigate to the withdrawal history page; select a valid withdrawal record that meets the
        requirements; verify the transaction details on the blockchain explorer; and finally, submit all relevant
        transaction information. Accurate and complete submissions help build a high-quality database of exchange hot
        wallet addresses.
      </p>
    </div>

    <div className="mt-4">
      <h3 className="mb-2 font-semibold text-white">Requirements (Must Read)</h3>
      <ul className="list-none space-y-1">
        <li className="relative pl-6">
          <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
          Use PC desktop browser only
        </li>
        <li className="relative pl-6">
          <span className="absolute left-0 font-bold text-[#10b981]">✓</span>
          Mobile apps/browsers not supported
        </li>
      </ul>
    </div>
  </div>
)
