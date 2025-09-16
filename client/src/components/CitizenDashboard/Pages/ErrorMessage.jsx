export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
        <h3 className="font-bold mb-2">Error</h3>
        <p>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
