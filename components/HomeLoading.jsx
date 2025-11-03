export default function HomeLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-clrGray font-google font-medium gap-4">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <h1 className="text-xl flex flex-col items-center">
        Loading your directory
        <span>Please wait !!!</span>
      </h1>
    </div>
  );
}
