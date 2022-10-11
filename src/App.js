import './App.css';
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import Navbar from "./components/Navbar";

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    subscribe()
  }, [])

  const options = {
    title: "Sensor Values Over Time",
    curveType: "function",
    legend: { position: "bottom" },
  };

  const subscribe = (function () {
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        setInterval(() => {
          getSensorReadings()
        }, 10000);
      }
    };
  })();

  const getSensorReadings = async () => {
    try {
      const response = await fetch("http://localhost:8080", {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      const formattedData = formatToChartData(result)
      setData(formattedData)
    } catch (err) {
      console.log(err)
    }
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
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
}

export default App;
