import { useEffect, useState } from "react"

export const useWindowDimensions = () => {
    const [width, setWidth] = useState(640);
    const [height, setHeight] = useState(960);

    useEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth)
    },[])

    return {
        width,
        height
    }
}