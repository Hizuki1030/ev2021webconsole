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
  var [Speed, setSelectedTopicSpeed] =useState<any>(0);
  var [Lat, setSelectedTopicLat] =useState<any>('0');
  var [Long, setSelectedTopicLong] =useState<any>('0');
  var [BatteryVoltage, setSelectedTopicBatteryVoltage] =useState<any>(0);
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
    const currentTime = new Date()
    const msg = { "data": `[${currentTime.toUTCString()}] Topic from browser!` }
    const selectedTopicName = "/chatter"
    rowma.publish(selectedRobotUuid, selectedTopicName, msg)
  }

  const handleSubscribeButtonClick = async () => {
    let selectedTopicName = "/GPS_speed"
    await rowma.subscribe(selectedTopicName, handleTopicSpeed)
    await rowma.setTopicRoute(selectedRobotUuid, 'application', rowma.uuid, selectedTopicName);
    


    selectedTopicName = "/GPS_lat"
    rowma.subscribe(selectedTopicName, handleTopicLat)
    rowma.setTopicRoute(selectedRobotUuid, 'application', rowma.uuid, selectedTopicName);
    

    selectedTopicName = "/GPS_long"
    rowma.subscribe(selectedTopicName, handleTopicLong)
    rowma.setTopicRoute(selectedRobotUuid, 'application', rowma.uuid, selectedTopicName);
    

    selectedTopicName = "/BatteryVoltage"
    rowma.subscribe(selectedTopicName, handleTopicBatteryVoltage)
    rowma.setTopicRoute(selectedRobotUuid, 'application', rowma.uuid, selectedTopicName);

    
    console.log("called")
  }

  const handleTopicSpeed = (event: Topic) => {
    console.log(event.msg)    
    Speed = event.msg["data"]
    setSelectedTopicSpeed(Speed)
  }

  const handleTopicLat = (event: Topic) => {
    Lat = event.msg["data"]
    setSelectedTopicLat(Lat)
    console.log(Lat)
  }

  const handleTopicLong = (event: Topic) => {
    Long = event.msg["data"]
    setSelectedTopicLong(Long)
  }

  const handleTopicBatteryVoltage = (event: Topic) => {
    BatteryVoltage = event.msg["data"]
    console.log(BatteryVoltage)
    BatteryVoltage = Math.round(BatteryVoltage * 10) / 10;
    setSelectedTopicBatteryVoltage(BatteryVoltage)
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
        <div className = "left"><Chart name={"Power voltage"}  MaterColor={"#1a90ff"} value={BatteryVoltage} unit={"V"} min_value={"0"} max_value={"30"}/></div>
        <div className = "center"><Chart name={"System voltage"} MaterColor={"#0000ff"} value={"0"} unit={"V"} min_value={"0"} max_value={"10"}/></div>
        <div className = "right"><Chart name={"Speed"} MaterColor={"#0000ff"} value={Speed} unit={"km/h"} min_value={"0"} max_value={"60"}/></div>
      </div>
      <div className="SecondGrade">
        <div className="GoogleMap">
          <GoogleMap lat={Lat} long={Long}/>
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
