import React,{ useState ,FC} from "react";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
  Circle ,
} from "@react-google-maps/api";
import Card from '@material-ui/core/Card';
import "./map.css"

const containerStyle = {
  height: "50vh",
  width: "100%",
};
const center = {
  lat: 35.69575,
  lng: 139.77521,
};




const positionIwamotocho = {
  lat: 35.69397,
  lng: 139.7762,
};

const divStyle = {
  background: "white",
  fontSize: 7.5,
};


const App:  React.FC<{ lat: String, long: String }> = (props) => {
  let car_long=Number(props.long) 
  let car_alt=Number(props.lat)
  let positionAkiba = {
    lat: car_alt,
    lng: car_long,
  };
  const [size, setSize] = useState<undefined | google.maps.Size>(undefined);
  const infoWindowOptions = {
    pixelOffset: size,
  };
  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -45));
  };
  return (
    <Card className="mapcard">
        <LoadScript googleMapsApiKey="AIzaSyByv2dfHaQ5ZIxR-cnDgP9I8-GBP3Zolsw" >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
            <Marker position={positionAkiba} />
        </GoogleMap>
        </LoadScript>
    </Card>
  );
};

export default App;