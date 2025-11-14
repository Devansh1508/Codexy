import { WebContainer } from "@webcontainer/api";
import { useEffect,useState } from "react";

export const useWebContainer = () => {
    const [webContainer, setWebContainer] = useState<WebContainer>();

    async function initWebContainer() {
        const wc = await WebContainer.boot();
        setWebContainer(wc);
    }

    useEffect(()=>{
        initWebContainer();
    }, [])

    return webContainer;
}
