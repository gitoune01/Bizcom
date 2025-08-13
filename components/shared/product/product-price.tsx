import { cn } from '@/lib/utils';
const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  //ensure two decimal places

  const stringValue = value.toFixed(2);

  //get int/float part and decimal part
  const [intPart, decimalPart] = stringValue.split('.');

  return (
    <p className={cn('text-2xl', className)}>
      <span className="text-xs align-super">$</span>
      {intPart}
      <span className="text-xs align-super">.{decimalPart}</span>
    </p>
  );
};

export default ProductPrice;
