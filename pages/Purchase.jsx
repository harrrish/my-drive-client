import { BiSolidPurchaseTag } from "react-icons/bi";

export default function PagePurchasePremium() {
  return (
    <div className="min-h-screen bg-clrGray flex items-center justify-center font-google">
      <div className="bg-white w-[90%] sm:max-w-2xl p-2 rounded-sm shadow-2xl">
        <h1 className="flex items-center justify-between">
          Purchase Premium
          <span>
            <BiSolidPurchaseTag />
          </span>
        </h1>
      </div>
    </div>
  );
}
