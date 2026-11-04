import { useState, FormEvent } from 'react';
import { Button } from './ui';

export interface PortfolioFormValues {
  name: string;
}

interface PortfolioFormProps {
  onSubmit: (values: PortfolioFormValues) => void | Promise<void>;
  initialValues?: Partial<PortfolioFormValues>;
}

function PortfolioForm({ onSubmit, initialValues }: PortfolioFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Give your portfolio a name.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ name: trimmed });
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save portfolio.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="ds-form" onSubmit={handleSubmit}>
      <div className="ds-field">
        <label className="ds-label" htmlFor="portfolio-name">
          Portfolio name
        </label>
        <input
          id="portfolio-name"
          className="input"
          type="text"
          placeholder="e.g. Growth Picks, Retirement Fund"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
        <span className="ds-help">Give this portfolio a name to start tracking buy and sell transactions.</span>
      </div>
      {error && (
        <p className="ds-small" style={{ color: 'var(--color-danger)' }}>
          {error}
        </p>
      )}
      <div className="ds-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Create portfolio'}
        </Button>
      </div>
    </form>
  );
}

export { PortfolioForm };
export default PortfolioForm;