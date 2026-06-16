import { useOrder } from '../../../context/OrderContext';
import FullServiceStep1 from './FullServiceStep1';
import FullServiceStep2 from './FullServiceStep2';
import FullServiceStep3 from './FullServiceStep3';

export default function FullServiceFlow() {
  const { state } = useOrder();
  const { fsStep } = state;

  return (
    <div>
      {fsStep === 1 && <FullServiceStep1 />}
      {fsStep === 2 && <FullServiceStep2 />}
      {fsStep === 3 && <FullServiceStep3 />}
    </div>
  );
}
