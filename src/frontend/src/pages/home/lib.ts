import type { COBEOptions } from "cobe";

export const getLocation = async ():Promise<[number, number]> => {
    if("geolocation" in navigator){
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition((data) => {
                resolve([data.coords.latitude, data.coords.longitude]);
            },
            () => {
                resolve([200,200]);
            });
        })
    }
    return new Promise(resolve=> resolve([200,200]));
}

export const getGlobeConfig = async ():Promise<COBEOptions> => {
    const location = await getLocation();
    let config:COBEOptions = {
        width: 200,
        height: 200,
        onRender: () => {},
            devicePixelRatio: 2,
        phi: 0,
        theta: 0.3,
        dark: 0,
        diffuse: 0,
        mapSamples: 16000,
        mapBrightness: 1.2,
        baseColor: [1, 1, 1],
        markerColor: [251 / 255, 100 / 255, 21 / 255],
        glowColor: [1, 1, 1],
        markers: [],
    }

    if(location[0] != 200){
        config.markers.push(
            { location: [location[0], location[1]], size: 0.3 },
        )
    }

    return config;
}
