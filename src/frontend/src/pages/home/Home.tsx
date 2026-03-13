import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe"
import { useNavigate } from "react-router";
import { getGlobeConfig } from "./lib";
import { useEffect, useState } from "react";
import type { COBEOptions } from "cobe";

const Home = () => {
    const navigate = useNavigate();
    const [globeConfig, setGlobeConfig] = useState<COBEOptions | undefined>(undefined);
    
    useEffect(() => {
        const getConfig = async () => {
            const config = await getGlobeConfig();
            setGlobeConfig(config);
        }
        getConfig();
    },[])

    return <div className="w-dvw h-dvh flex items-center justify-center align-middle flex-col">
    <div className="font-bold text-4xl">
        Schach
    </div>
    <Globe config={globeConfig}/>
    <Button className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    onClick={() => {
        navigate("/start");
    }}
    >
    Play!
    </Button>
    </div>

}

export default Home;
