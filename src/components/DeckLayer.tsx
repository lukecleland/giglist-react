import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import ParcelsData from './data';

type DeckProps = {
    coords: number[]
};

export const DeckLayer = ({coords}:DeckProps) => {
    /**
     * Data format:
     * Valid GeoJSON object
     */

     const data = {
        type: "FeatureCollection",
        features: ParcelsData.parcels
    }

    const viewState = {
        longitude: coords[0],
        latitude: coords[1],
        zoom: 13,
        pitch: 0,
        bearing: 0
        };


    const layer = new GeoJsonLayer({
        id: 'geojson-layer',
        data,
        pickable: true,
        stroked: false,
        filled: true,
        extruded: true,
        pointType: 'circle',
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getFillColor: [160, 160, 180, 200],
        getLineColor: [160, 160, 180, 200],
        getPointRadius: 100,
        getLineWidth: 1,
        getElevation: 30
    });

    return <DeckGL viewState={viewState} layers={[layer]} />;
}
   
// <DeckLayer coords={[33.8915,-151.2767]} />