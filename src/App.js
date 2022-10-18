import './App.css';
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Navbar from "./components/Navbar";
import { Typography } from '@mui/material';

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

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    subscribe()
  }, [])


  const subscribe = (function () {
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        getSensorReadings()
        setInterval(() => {
          getSensorReadings()
        }, 10000);
      }
    };
  })();

  const fetchSensorReadings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_EVENTPROCESSOR_URL}`, {
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
    const result = await fetchSensorReadings()
    const formattedData = formatToChartData(result)
    setData(formattedData)
  }

  const formatToChartData = (result) => {
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
      {data.length === 0 ? <NoDataMessage /> : <SensorChart data={data} />}
    </div>
  );
}

export default App;
