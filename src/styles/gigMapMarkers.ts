import markerIcon from './assets/gigmap-marker.svg';
import clusterIcon from './assets/gigmap-cluster.svg';

export const gigMapClusterOptions = {
    gridSize:40, maxZoom:18, averageCenter:true, zoomOnClick:true,
    title:'Click to zoom in to gig locations',
    styles:[{url:clusterIcon,width:56,height:56,textColor:'#111',textSize:18,fontWeight:'bold'}],
};

export const gigMapMarkerIcon = () => ({
    url:markerIcon,
    scaledSize:new window.google.maps.Size(32,32),
    anchor:new window.google.maps.Point(16,16),
});
