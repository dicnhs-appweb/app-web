import {CalculatorIcon} from 'lucide-react';
import {Button} from '../ui/button';
import {Card} from '../ui/card';

export const NavigationBar = () => {
  return (
    <Card className="sticky flex items-center justify-between w-full h-16 px-6 bg-black/95">
      <div className="inline-flex gap-2 text-xl font-bold">
        <CalculatorIcon className="text-primary-foreground/85 size-8" />
      </div>
      <ul className="flex space-x-4 text-md text-primary-foreground/85">
        <li>
          <a href="/dashboard">Home</a>
        </li>
        <li>
          <button>Forecast</button>
        </li>
        <li>
          <a href="/profile">History</a>
        </li>
      </ul>
      <div>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full size-8"
        >
          <img
            src="/placeholder-user.jpg"
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </div>
    </Card>
  );
};
