import { useToastCtx } from '../Ui';
// Same API as before: const [toast, show] = useToast();  (toast is now rendered globally)
export const useToast = () => [null, useToastCtx()];
