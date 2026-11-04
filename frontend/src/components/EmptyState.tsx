import { EmptyState as DSEmptyState } from './ui';

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return <DSEmptyState icon="package" title={message} />;
}

export default EmptyState;
export { EmptyState };