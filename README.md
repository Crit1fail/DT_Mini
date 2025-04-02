# DT_Mini
# Indoor Air Quality Digital Twin (Mini-Project)

## Overview
This project is a **web-based digital twin** that visualizes **indoor air quality (IAQ)** in real time using **Three.js** and **MQTT**. It creates a **3D representation of an indoor space** where air quality data is displayed dynamically.

## Features
- **Live sensor data streaming** via **MQTT.js**.
- **3D visualization** of the indoor environment using **Three.js**.
- **Dynamic color changes** representing air quality levels.
- **Dockerized MQTT broker** for handling real-time sensor data.

## How It Works

### **1. Data Collection & Communication**
- Sensors continuously measure **CO₂ levels, temperature, and humidity**.
- The data is sent to an **MQTT broker** (Mosquitto) in real time.
- The **web application (built with Three.js)** subscribes to the MQTT topics and receives updates.

### **2. 3D Visualization**
- A **3D environment** is created using **Three.js** to represent an indoor space.
- Sensors are placed in the **3D scene** as objects (e.g., spheres).
- The sensor objects change **color** dynamically based on air quality data.

### **3. Real-Time Air Quality Representation**
- **Green** → Good Air Quality (CO₂ < 600 ppm)
- **Yellow** → Moderate Air Quality (600 - 1000 ppm)
- **Red** → Poor Air Quality (CO₂ > 1000 ppm)

### **4. Interaction**
- Users can navigate the **3D scene** using mouse and keyboard controls.
- Clicking on a sensor displays its **real-time data**.

## Future Improvements
- **Historical data visualization** using charts.
- **WebSockets** for faster real-time updates.
- **More realistic 3D environment** with better textures.

## Credits
- **Three.js** for 3D rendering.
- **MQTT.js** for real-time data handling.
- **Docker & Mosquitto** for communication.
