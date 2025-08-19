import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileBottomSheetProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  trigger,
  title,
  description,
  children,
  className,
  side = 'bottom'
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent 
        side={isMobile ? side : 'right'}
        className={cn(
          isMobile && side === 'bottom' && 'h-[85vh] rounded-t-[20px]',
          isMobile && 'max-w-full',
          className
        )}
      >
        <SheetHeader className={isMobile ? 'pb-4' : ''}>
          <SheetTitle className={isMobile ? 'text-xl' : 'text-lg'}>
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className={isMobile ? 'text-base' : 'text-sm'}>
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className={cn(
          'overflow-y-auto',
          isMobile ? 'h-[calc(85vh-120px)] touch-pan-y' : 'h-[calc(100vh-120px)]'
        )}>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileBottomSheet;