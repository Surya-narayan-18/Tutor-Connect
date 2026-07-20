const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-danger-500/10 flex items-center justify-center">
        <svg className="w-8 h-8 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-surface-300 text-center max-w-md">{message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
