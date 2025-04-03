export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div className="relative w-24 h-24 mb-8">
        {/* Camera shutter animation */}
        <div className="absolute inset-0 border-8 border-neutral-300 dark:border-neutral-700 rounded-full animate-pulse"></div>
        <div className="absolute inset-4 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
        <div className="absolute inset-7 bg-neutral-50 dark:bg-neutral-900 rounded-full"></div>
        <div className="absolute inset-8 border-4 border-neutral-300 dark:border-neutral-700 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-secondary rounded-full animate-ping"></div>
        </div>
      </div>

      <h2 className="text-2xl font-light text-neutral-700 dark:text-neutral-200 mb-2">
        Loading
      </h2>

      <div className="flex space-x-2">
        <div
          className="w-2 h-2 bg-secondary rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-2 h-2 bg-secondary rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-secondary rounded-full animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>

      <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
        Preparing your photography experience
      </p>
    </div>
  );
}
