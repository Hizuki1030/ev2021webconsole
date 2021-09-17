import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Rowma, { Topic } from 'rowma_js';
import Chart from './cart';
import GoogleMap from "./map"
import {Card, Button,Select ,MenuItem} from '@material-ui/core';

function App() {
  const [rowma, setRowma] = useState<any>(null);
  const [robotUuids, setRobotUuids] = useState<Array<string>>([]);
  const [selectedRobotUuid, setSelectedRobotUuid] = useState<string>('');
  const [robot, setRobot] = useState<any>(null);
  const [selectedTopicName, setSelectedTopicName] = useState<string>('');
  const [receivedTopics, setReceivedTopics] = useState<Array<string>>([]);
  var [Speed, setSelectedTopicSpeed] =useState<string>('0');
  var [Lat, setSelectedTopicLat] =useState<string>('0');
  useEffect(() => {
    const a = {baseURL:"https://ros-rowma.herokuapp.com"};
    const _rowma = new Rowma(a);
    setRowma(_rowma);

    _rowma.currentConnectionList().then((connList: any) => {
      setRobotUuids(connList.data.map((robot: any) => robot.uuid));
    })
  }, [])

  const handleConnectionListChange = (event: any) => {
    setSelectedRobotUuid(event.target.value)
  }

  const handleConnectClicked = () => {
    rowma.connect()

    rowma.getRobotStatus(selectedRobotUuid).then((res: any) => {
      setRobot(res.data)
    })
  }

  const handleRostopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopicName(event.target.value)
  }

  const handlePublishTopic = () => {
    console.log("hellod")
    const currentTime = new Date()
    const msg = { "data": `[${currentTime.toUTCString()}] Topic from browser!` }
    const selectedTopicName = "/chatter"
    rowma.publish(selectedRobotUuid, selectedTopicName, msg)
  }

  const handleSubscribeButtonClick = () => {
    let selectedTopicName = "/Rowma_GPS_lat"
    rowma.setTopicRoute(selectedRobotUuid, 'application', rowma.uuid, selectedTopicName);
    rowma.subscribe(selectedTopicName, handleTopicLat)

    selectedTopicName = "/Rowma_GPS_speed"
    rowma.setTopicRoute(selectedRobotUuid, 'application', rowma.uuid, selectedTopicName);
    rowma.subscribe(selectedTopicName, handleTopicSpeed)


    
    console.log("called")
  }

  const handleTopicSpeed = (event: Topic) => {
    console.log(event.msg)    
    Speed = event.msg["data"]
    setSelectedTopicSpeed(Speed)
  }

  const handleTopicLat = (event: Topic) => {
    console.log(event.msg)  
    Lat = event.msg["data"]
    setSelectedTopicLat(Lat)
    console.log(Lat)
  }


  return (
    <div className="App">
      <div className="connectBox">
        <div className="connectButtonINPUT">
        <Select className="uuidSelect"  id="standard-basic" label="Standard"  onChange={handleConnectionListChange} >
          <MenuItem value={''}>{''}</MenuItem>
          {robotUuids.length > 0 && (
            robotUuids.map((uuid: string) => {
              return(
                <option key={uuid} value={uuid}>{uuid}</option>
              )
            })
          )}
        </Select>
        <Button variant="contained" color="primary" onClick={handleConnectClicked}>
              connect
        </Button>
          
        <Button variant="contained" color="primary" onClick={handleSubscribeButtonClick}>
              start Subscribe
        </Button>
        </div>
      </div>
      <div className="DataBox">
        <div className = "left"><Chart name={"Power voltage"}  MaterColor={"#1a90ff"} value={"0"} unit={"V"} min_value={"0"} max_value={"30"}/></div>
        <div className = "center"><Chart name={"System voltage"} MaterColor={"#0000ff"} value={Lat} unit={"V"} min_value={"0"} max_value={"10"}/></div>
        <div className = "right"><Chart name={"Speed"} MaterColor={"#0000ff"} value={Speed} unit={"km/h"} min_value={"0"} max_value={"60"}/></div>
      </div>
      <div className="SecondGrade">
        <div className="GoogleMap">
          <GoogleMap/>
        </div>
        <div className="meter">
        <Card className="topicViewer">
          &nbsp;&nbsp;status
          </Card>
          <Card className="statusBox">
          &nbsp;&nbsp;status
            <Card className="statusViewer">
            &nbsp;Video capture
            </Card >
            <Card className="statusViewer">
            &nbsp;Slave connection
            </Card>
            <Card className="statusViewer">
            &nbsp;&nbsp;Drive Mode
            </Card>
          </Card >
        </div>
      </div>
      
    </div>
  );
}

export default App;
