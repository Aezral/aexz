import { cn } from "@/lib/utils";
import { IconLoader2, TablerIconsProps } from "@tabler/icons-react";
import { MotionProps, motion } from "framer-motion";
import React from "react";
export default function Spinner(props: Omit<TablerIconsProps & MotionProps,'ref'>) {

    const Component = React.useMemo(()=> motion(IconLoader2), [])

    return (
        <Component
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
            {...props}
            className={cn("animate-spin", props.className)}
        ></Component>
    );
}
