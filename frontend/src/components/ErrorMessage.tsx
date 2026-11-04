import { Alert } from './ui';
import { Icon } from './icons';

interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Alert tone="danger">
      <Icon name="alert" size={18} title="Error" />
      <span>{message}</span>
    </Alert>
  );
}

export default ErrorMessage;
export { ErrorMessage };