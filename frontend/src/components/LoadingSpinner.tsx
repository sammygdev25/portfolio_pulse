import { Spinner } from './ui';

function LoadingSpinner() {
  return (
    <div className="ds-loading" role="status" aria-live="polite">
      <Spinner />
      <span className="ds-muted">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
export { LoadingSpinner };