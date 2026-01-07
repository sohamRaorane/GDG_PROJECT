"use client";
import React, { useState, type JSX } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "../../utils/cn";
import { Link, useLocation } from "react-router-dom";

export const FloatingNav = ({
    navItems,
    className,
    actions,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: JSX.Element;
    }[];
    className?: string;
    actions?: React.ReactNode;
}) => {
    const { scrollYProgress } = useScroll();
    const location = useLocation();

    const [visible, setVisible] = useState(true);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // Check if current is not undefined and is a number
        if (typeof current === "number") {
            let direction = current! - scrollYProgress.getPrevious()!;

            if (scrollYProgress.get() < 0.05) {
                // At the top, always show
                setVisible(true);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className={cn(
                    "flex max-w-2xl w-full fixed top-6 inset-x-0 mx-auto border border-white/20 dark:border-white/[0.2] rounded-full bg-white/80 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-6 py-2 items-center justify-between space-x-6",
                    className
                )}
            >
                {/* Logo/Brand (Optional integration, can be added or left out to keep it minimal) */}

                {navItems.map((navItem: any, idx: number) => {
                    const isActive = location.pathname === navItem.link;
                    return (
                        <Link
                            key={`link=${idx}`}
                            to={navItem.link}
                            className={cn(
                                "relative items-center flex space-x-1 transition-all duration-300 font-semibold text-sm",
                                isActive
                                    ? "bg-primary text-white px-4 py-2 rounded-full shadow-lg shadow-primary/25 scale-105"
                                    : "text-zinc-700 hover:text-primary px-2"
                            )}
                        >
                            <span className="block sm:hidden">{navItem.icon}</span>
                            <span className="hidden sm:block text-sm">{navItem.name}</span>
                        </Link>
                    );
                })}

                {actions && (
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        {actions}
                    </div>
                )}
            </motion.div>
        </AnimatePresence >
    );
};
