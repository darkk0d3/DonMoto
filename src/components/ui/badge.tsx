import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-oswald uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-primary/20 text-primary",
        pending: "bg-yellow-500/20 text-yellow-400",
        confirmed: "bg-blue-500/20 text-blue-400",
        "in-progress": "bg-purple-500/20 text-purple-400",
        completed: "bg-green-500/20 text-green-400",
        cancelled: "bg-red-500/20 text-red-400",
        approved: "bg-green-500/20 text-green-400",
        outline: "border border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
