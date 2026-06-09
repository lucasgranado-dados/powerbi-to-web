import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Label simples (sem dependência de @radix-ui/react-label) usado pela barra de
 * filtros. Caso precise do componente shadcn completo, rode:
 *   npx shadcn@latest add label
 */
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-xs font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
