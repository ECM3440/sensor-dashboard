import './App.css';
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Navbar from "./components/Navbar";
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

const SensorChart = ({ data }) => {
  const options = {
    title: "Sensor Values Over Time",
    curveType: "function",
    legend: { position: "bottom" },
  };

  return (<Chart
    data-testid="sensor-chart"
    chartType="LineChart"
    width="100%"
    height="400px"
    data={data}
    options={options}
  />)
}

const NoDataMessage = () => {
  return (
    <Typography data-testid="no-data-msg" variant="h4" component="div" sx={{ flexGrow: 1 }}>
      No data received
    </Typography>
  )
}

const ActuatorCard = ({ title, value, testId }) => {
  return (
    <Card style={{ height: "180px" }} data-testId={testId}>
      <React.Fragment>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {title}:
          </Typography>
          <Typography sx={{ fontSize: 48 }} color="text.primary" gutterBottom data-testid={testId + "Value"}>
            {value}
          </Typography>
        </CardContent>
      </React.Fragment>
    </Card>
  )
}

function App() {
  const [sensorData, setSensorData] = useState([])
  const [soilActuatorData, setSoilActuatorData] = useState(0)
  const [tempActuatorData, setTempActuatorData] = useState(0)
  const [humidActuatorData, setHumidActuatorData] = useState(0)

  useEffect(() => {
    subscribe()
  }, [])

  const subscribe = (function () {
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        getSensorReadings()
        getActuatorReadings()
        setInterval(() => {
          getSensorReadings()
          getActuatorReadings()
        }, 10000);
      }
    };
  })();

  const fetchReadings = async (path) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_EVENTPROCESSOR_URL}/${path}`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.log(err)
    }
  }

  const getSensorReadings = async () => {
    const result = await fetchReadings("sensors")

    if (result !== undefined && result.length > 0) {
      const formattedData = formatSensorData(result)
      setSensorData(formattedData)
    }
  }

  const getActuatorReadings = async () => {
    const result = await fetchReadings("actuators")

    if (result !== undefined && result.length > 0) {
      setActuatorData(result)
    }
  }

  const setActuatorData = (result) => {
    result.forEach(reading => {
      switch (reading.sensor_type) {
        case "Soil Moisture":
          setSoilActuatorData(soilActuatorData + 1)
          break;
        case "Temperature":
          setTempActuatorData(tempActuatorData + 1)
          break;
        case "Humidity":
          setHumidActuatorData(humidActuatorData + 1)
        default:
          console.log("sensor type not recognised")
          break;
      }
    })
  }

  const formatSensorData = (result) => {
    let data = []
    let lines = ["Time"]
    let rows = []

    result.forEach(reading => {
      let rowItem = []
      const readingTime = Object.keys(reading).pop()
      const readingDateObj = new Date(readingTime)
      rowItem.push(readingDateObj)

      reading[readingTime].forEach(sensorReading => {
        if (!lines.includes(sensorReading.name)) {
          lines.push(sensorReading.name)
        }

        rowItem.push(sensorReading.value)
      })
      rows.push(rowItem)
    });

    data.push(lines)

    rows.forEach(row => {
      data.push(row)
    })

    return data
  }

  return (
    <div className="App">
      <Navbar />
      <Container fixed style={{ paddingTop: "20px" }}>
        <Box sx={{ flexGrow: 1, minWidth: 275 }} style={{ paddingBottom: "30px" }}>
          <Grid container spacing={2}>
            <Grid xs={4}>
              <ActuatorCard title="No. of Soil Mositure Actuator Triggers from a Mositure <= 200" value={soilActuatorData} testId="soilCard" />
            </Grid>
            <Grid xs={4}>
              <ActuatorCard title="No. of Temperature Actuator Triggers from a Temperature <= 5°C" value={tempActuatorData} testId="tempCard" />
            </Grid>
            <Grid xs={4}>
              <ActuatorCard title="No. of Humidity Actuator Triggers from a Humidity <= 20%" value={humidActuatorData} testId="humidCard" />
            </Grid>
          </Grid>
        </Box>
        {sensorData.length === 0 ? <NoDataMessage /> : <SensorChart data={sensorData} />}
      </Container>
    </div>
  );
}

export default App;
