import { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import PortfoliosHeader from '../components/PortfoliosHeader';
import PortfoliosContent from '../components/PortfoliosContent';
import PortfolioForm from '../components/PortfolioForm';
import { Alert } from '../components/ui';

export default function PortfoliosPage() {
  const { portfolios, loading, addPortfolio } = usePortfolio();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (data: { name: string }) => {
    setSubmitting(true);
    setError(null);
    try {
      await addPortfolio(data);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError('Could not create the portfolio. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ds-stack-lg">
      <PortfoliosHeader portfolioCount={portfolios.length} onCreate={handleCreate} />

      {error && <Alert tone="danger">{error}</Alert>}

      {showForm && (
        <div className="ds-card ds-card-body ds-stack">
          <PortfolioForm onSubmit={handleSubmit} initialValues={{ name: '' }} />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      )}

      <PortfoliosContent portfolios={portfolios} loading={loading} onCreate={handleCreate} />
    </div>
  );
}