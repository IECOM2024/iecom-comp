import { useRef, useState } from "react";

export const useHoverMenu = () => {
    const timeRef = useRef<number | null>(null);
    const [isHover, setIsHover] = useState(false);

    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        timeRef.current = window.setTimeout(() => {
            setIsHover(false);
        }, 250);
    }

    const handleMouseEnterMenuList = () => {
        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }
    }

    const handleMouseLeaveMenuList = () => {
        setIsHover(false);
    }

    return {
        isOpen: isHover,
        mouseProps: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
        },
        menuListProps: {
            onMouseEnter: handleMouseEnterMenuList,
            onMouseLeave: handleMouseLeaveMenuList,
        }
    }
}