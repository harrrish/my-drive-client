import { RiUserSettingsFill } from "react-icons/ri";

export default function CompLoadingShimmer() {
  return (
    <div className="min-h-[100vh] bg-gray-200 border-3 relative overflow-hidden">
      <nav className="flex flex-col justify-between w-full sm:max-w-4xl mx-auto transition-all duration-300">
        <div className="flex justify-between items-center p-2">
          {/* //* ==========>TITLE */}
          <button className="font-bookerly-display font-bold text-3xl px-4 py-1 cursor-pointer outline-0">
            My Drive
          </button>

          {/* //* ==========>SETTINGS */}
          <button className="cursor-pointer text-3xl">
            <RiUserSettingsFill />
          </button>
        </div>
      </nav>
    </div>
  );
}
