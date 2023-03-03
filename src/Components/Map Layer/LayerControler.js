import React, { Fragment, useState, useEffect } from "react";
import { LayersControl, MapContainer, Marker, TileLayer } from "react-leaflet";
import Markers from "../UI/Marker";
import { GeoJSON } from "react-leaflet";
import { useSelector } from "react-redux";
import { useMap } from "react-leaflet";
import { GetColor } from "../UI/GetColor";
function LayerControler({ disasterData, currenttab }) {
  
  const leafletMap = useMap();
  const latlng = useSelector((state) => {
    return state.latlng;
  });

  const [json, setjson] = useState(null);
  const analysisResultAmenities = useSelector((state) => {
    return state.feature.amenities;
  });
  const analysisResultBuilding = useSelector((state) => {
    return state.feature.building;
  });
  const analysisResultForest = useSelector((state) => {
    return state.feature.forest;
  });
  const analysisResultWaterBody = useSelector((state) => {
    return state.feature.waterbody;
  });
  useEffect(() => {
    setjson(
      analysisResultBuilding ? (
        <GeoJSON data={analysisResultBuilding[0]} />
      ) : null
    );
  }, [analysisResultAmenities, setjson]);
  
  useEffect(() => {
    if (latlng) leafletMap.setView([latlng[1], latlng[0]], 16);
  });
  
  const styleGEOJSON = (feature) => {
    let type = feature.properties.classes;
    let colorRGB = GetColor(type);
    return {
      fillColor: `rgb(${colorRGB[0]}, ${colorRGB[1]}, ${colorRGB[2]})`,
      opacity: 1,
      weight: 0,
      color: "none",
      fillOpacity: 0.7,
    };
  };


  const getGeoJSON = (featureAnalysisResult) => {
    return featureAnalysisResult ? (
      <GeoJSON data={featureAnalysisResult} style={styleGEOJSON}></GeoJSON>
    ) : null;
  };
  
  return (
    <Fragment>
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="OSM Streets">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="World Imagery">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Grey Imagery">
          <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
        </LayersControl.BaseLayer>
      </LayersControl>
      {currenttab == "disasterAnalysis" ? (
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Buidling">
            {analysisResultBuilding
              ? getGeoJSON(analysisResultBuilding[0])
              : null}
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Forest">
            {analysisResultForest ? getGeoJSON(analysisResultForest[0]) : null}
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Waterbody">
            {analysisResultWaterBody
              ? getGeoJSON(analysisResultWaterBody[0])
              : null}
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Amenities">
            {analysisResultAmenities
              ? getGeoJSON(analysisResultAmenities[0])
              : null}
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="test">
            {json}
          </LayersControl.Overlay>
        </LayersControl>
      ) : null}

      {disasterData.map((event) => {
        return <Markers disaster={event} key={event.id} />;
      })}
    </Fragment>
  );
}

export default LayerControler;
