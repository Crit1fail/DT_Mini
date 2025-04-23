import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// ========== 3D SCENE SETUP ==========
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

scene.add(new THREE.AmbientLight(0xffffff, 1));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

camera.position.set(2, 2, 5);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ========== ROOM MODEL & PARTICLES ==========
let pm25ParticleSystem, co2ParticleSystem;
let pm25ParticleVelocities = [], co2ParticleVelocities = [];
let particleBox = null;
let pm25Sphere, co2Sphere, humiditySphere, temperatureSphere;

function createTextSprite(message) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 32;
  context.font = `${fontSize}px Arial`;
  const textWidth = context.measureText(message).width;
  canvas.width = textWidth + 20;
  canvas.height = fontSize + 20;
  context.font = `${fontSize}px Arial`;
  context.fillStyle = 'rgba(255, 255, 250, 0.8)';
  context.fillText(message, 10, fontSize);
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(canvas.width / 50, canvas.height / 50, 1);
  return sprite;
}

function createParticles(min, max) {
  console.log('Bounding Box Min:', min, 'Max:', max);

  const pm25ParticleCount = 40000;
  const co2ParticleCount = 40000;
  particleBox = { min, max };

  const width = max.x - min.x;
  const height = max.y - min.y;
  const depth = max.z - min.z;

  // PM2.5 Particles
  const pm25Geometry = new THREE.BufferGeometry();
  const pm25Positions = new Float32Array(pm25ParticleCount * 3);
  pm25ParticleVelocities = [];

  for (let i = 0; i < pm25ParticleCount; i++) {
    const x = min.x + Math.random() * width;
    const y = min.y + Math.random() * height;
    const z = min.z + Math.random() * depth;

    pm25Positions[i * 3] = x;
    pm25Positions[i * 3 + 1] = y;
    pm25Positions[i * 3 + 2] = z;

    pm25ParticleVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.005,
      (Math.random() - 0.5) * 0.005,
      (Math.random() - 0.5) * 0.005
    ));
  }

  pm25Geometry.setAttribute('position', new THREE.BufferAttribute(pm25Positions, 3));
  const pm25Material = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  pm25ParticleSystem = new THREE.Points(pm25Geometry, pm25Material);
  scene.add(pm25ParticleSystem);

  // CO2 Particles
  const co2Geometry = new THREE.BufferGeometry();
  const co2Positions = new Float32Array(co2ParticleCount * 3);
  co2ParticleVelocities = [];

  for (let i = 0; i < co2ParticleCount; i++) {
    const x = min.x + Math.random() * width;
    const y = min.y + Math.random() * height;
    const z = min.z + Math.random() * depth;

    co2Positions[i * 3] = x;
    co2Positions[i * 3 + 1] = y;
    co2Positions[i * 3 + 2] = z;

    co2ParticleVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.005,
      (Math.random() - 0.5) * 0.005,
      (Math.random() - 0.5) * 0.005
    ));
  }

  co2Geometry.setAttribute('position', new THREE.BufferAttribute(co2Positions, 3));
  const co2Material = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 0.04,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  co2ParticleSystem = new THREE.Points(co2Geometry, co2Material);
  scene.add(co2ParticleSystem);

  // Spheres
  const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
  const sphereMaterialPM25 = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.8 });
  const sphereMaterialCO2 = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.8 });
  const sphereMaterialHumidity = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.8 });
  const sphereMaterialTemperature = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.8 });

  pm25Sphere = new THREE.Mesh(sphereGeometry, sphereMaterialPM25);
  co2Sphere = new THREE.Mesh(sphereGeometry, sphereMaterialCO2);
  humiditySphere = new THREE.Mesh(sphereGeometry, sphereMaterialHumidity);
  temperatureSphere = new THREE.Mesh(sphereGeometry, sphereMaterialTemperature);

  const centerX = (min.x + max.x) / 2;
  const centerY = min.y + 6.0;
  const centerZ = (min.z + max.z) / 2;

  pm25Sphere.position.set(centerX - 1.5, centerY, centerZ - 1.5);
  co2Sphere.position.set(centerX + 1.5, centerY, centerZ - 1.5);
  humiditySphere.position.set(centerX - 1.5, centerY, centerZ + 1.5);
  temperatureSphere.position.set(centerX + 1.5, centerY, centerZ + 1.5);

  console.log('PM2.5 Sphere Position:', pm25Sphere.position);
  console.log('CO2 Sphere Position:', co2Sphere.position);
  console.log('Humidity Sphere Position:', humiditySphere.position);
  console.log('Temperature Sphere Position:', temperatureSphere.position);

  scene.add(pm25Sphere);
  scene.add(co2Sphere);
  scene.add(humiditySphere);
  scene.add(temperatureSphere);

  // Labels
  const pm25Label = createTextSprite('PM2.5');
  const co2Label = createTextSprite('CO2');
  const humidityLabel = createTextSprite('HUMIDITY');
  const temperatureLabel = createTextSprite('TEMPERATURE');

  pm25Label.position.set(pm25Sphere.position.x, pm25Sphere.position.y + 0.7, pm25Sphere.position.z);
  co2Label.position.set(co2Sphere.position.x, co2Sphere.position.y + 0.7, co2Sphere.position.z);
  humidityLabel.position.set(humiditySphere.position.x, humiditySphere.position.y + 0.7, humiditySphere.position.z);
  temperatureLabel.position.set(temperatureSphere.position.x, temperatureSphere.position.y + 0.7, temperatureSphere.position.z);

  scene.add(pm25Label);
  scene.add(co2Label);
  scene.add(humidityLabel);
  scene.add(temperatureLabel);
}

function animateParticles() {
  if (!pm25ParticleSystem || !co2ParticleSystem || !particleBox) return;

  const { min, max } = particleBox;

  // Animate PM2.5 Particles
  const pm25Positions = pm25ParticleSystem.geometry.attributes.position.array;
  for (let i = 0; i < pm25ParticleVelocities.length; i++) {
    const v = pm25ParticleVelocities[i];

    v.x += (Math.random() - 0.5) * 0.0005;
    v.y += (Math.random() - 0.5) * 0.0005;
    v.z += (Math.random() - 0.5) * 0.0005;

    const idx = i * 3;
    pm25Positions[idx] += v.x;
    pm25Positions[idx + 1] += v.y;
    pm25Positions[idx + 2] += v.z;

    if (
      pm25Positions[idx] < min.x || pm25Positions[idx] > max.x ||
      pm25Positions[idx + 1] < min.y || pm25Positions[idx + 1] > max.y ||
      pm25Positions[idx + 2] < min.z || pm25Positions[idx + 2] > max.z
    ) {
      pm25Positions[idx] = min.x + Math.random() * (max.x - min.x);
      pm25Positions[idx + 1] = min.y + Math.random() * (max.y - min.y);
      pm25Positions[idx + 2] = min.z + Math.random() * (max.z - min.z);

      pm25ParticleVelocities[i].set(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      );
    }
  }
  pm25ParticleSystem.geometry.attributes.position.needsUpdate = true;

  // Animate CO2 Particles
  const co2Positions = co2ParticleSystem.geometry.attributes.position.array;
  for (let i = 0; i < co2ParticleVelocities.length; i++) {
    const v = co2ParticleVelocities[i];

    v.x += (Math.random() - 0.5) * 0.0005;
    v.y += (Math.random() - 0.5) * 0.0005;
    v.z += (Math.random() - 0.5) * 0.0005;

    const idx = i * 3;
    co2Positions[idx] += v.x;
    co2Positions[idx + 1] += v.y;
    co2Positions[idx + 2] += v.z;

    if (
      co2Positions[idx] < min.x || co2Positions[idx] > max.x ||
      co2Positions[idx + 1] < min.y || co2Positions[idx + 1] > max.y ||
      co2Positions[idx + 2] < min.z || co2Positions[idx + 2] > max.z
    ) {
      co2Positions[idx] = min.x + Math.random() * (max.x - min.x);
      co2Positions[idx + 1] = min.y + Math.random() * (max.y - min.y);
      co2Positions[idx + 2] = min.z + Math.random() * (max.z - min.z);

      co2ParticleVelocities[i].set(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      );
    }
  }
  co2ParticleSystem.geometry.attributes.position.needsUpdate = true;
}

const loader = new GLTFLoader();
loader.load('/model/scene.gltf', function(gltf) {
  console.log('GLTF Model Loaded Successfully');
  scene.add(gltf.scene);
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const min = box.min;
  const max = box.max;
  createParticles(min, max);
}, undefined, err => console.error('GLTF Load Error:', err));

// ========== AIR QUALITY IMPACT CONFIG ==========
const airQualityImpacts = {
  'none': { pm25: 0, co2: 0, temperature: 0, humidity: 0 },
  'air-purifier': { pm25: -50, co2: -5, temperature: 0, humidity: -10 },
  'plants': { pm25: -10, co2: -20, temperature: 0, humidity: 10 },
  'open-window': { pm25: -30, co2: -40, temperature: -10, humidity: 20 },
  'humidifier': { pm25: 0, co2: 0, temperature: 0, humidity: 30 }
};

let selectedOption = 'none';

// Apply impact to a value
function applyImpact(value, impactPercentage) {
  if (value === null || isNaN(value)) return value;
  const adjusted = value * (1 + impactPercentage / 100);
  return Math.max(0, adjusted); // Prevent negative values
}

// Update status bar
function updateStatusBar(pm25, co2, temp, humidity) {
  const statusPM25 = document.getElementById('status-pm25');
  const statusCO2 = document.getElementById('status-co2');
  const statusTemp = document.getElementById('status-temp');
  const statusHumidity = document.getElementById('status-humidity');

  statusPM25.textContent = pm25 !== null ? pm25.toFixed(1) : '--';
  statusCO2.textContent = co2 !== null ? co2.toFixed(1) : '--';
  statusTemp.textContent = temp !== null ? temp.toFixed(1) : '--';
  statusHumidity.textContent = humidity !== null ? humidity.toFixed(1) : '--';
}

// ========== UI UPDATE FUNCTIONS ==========
function updateAirQualityDisplay(pm25, timestamp) {
  const pmValue = document.getElementById('pm-value');
  const pmStatus = document.getElementById('pm-status');
  const pmTime = document.getElementById('pm-time');
  const pmDot = document.getElementById('pm-dot');

  if (!pmValue || !pmStatus || !pmTime || !pmDot) {
    console.warn('PM2.5 DOM elements not found');
    return;
  }

  let status = 'Good';
  let color = 'green';
  let sphereColor = 0x00ff00;

  if (pm25 >= 500) {
    status = 'Very Poor'; color = '#7e0023'; sphereColor = 0x7e0023;
  } else if (pm25 >= 250) {
    status = 'Unhealthy'; color = 'purple'; sphereColor = 0x800080;
  } else if (pm25 >= 100) {
    status = 'Poor'; color = 'red'; sphereColor = 0xff0000;
  } else if (pm25 >= 50) {
    status = 'Moderate'; color = 'orange'; sphereColor = 0xffa500;
  }

  pmValue.textContent = pm25.toFixed(1);
  pmStatus.textContent = status;
  pmTime.textContent = new Date(timestamp).toLocaleString();
  pmDot.style.backgroundColor = color;

  if (pm25ParticleSystem) {
    pm25ParticleSystem.material.color.set(sphereColor);
  }

  if (pm25Sphere) {
    pm25Sphere.material.color.set(sphereColor);
  }
}

function updateCO2Display(co2, timestamp) {
  const co2Value = document.getElementById('co2-value');
  const co2Status = document.getElementById('co2-status');
  const co2Time = document.getElementById('co2-time');
  const co2Dot = document.getElementById('co2-dot');

  if (!co2Value || !co2Status || !co2Time || !co2Dot) {
    console.warn('CO2 DOM elements not found');
    return;
  }

  let status = 'Good';
  let color = 'green';
  let sphereColor = 0x00ff00;

  if (co2 >= 1000) {
    status = 'Very Poor'; color = '#7e0023'; sphereColor = 0x7e0023;
  } else if (co2 >= 800) {
    status = 'Poor'; color = 'red'; sphereColor = 0xff0000;
  } else if (co2 >= 700) {
    status = 'Moderate'; color = 'orange'; sphereColor = 0xffa500;
  }

  co2Value.textContent = co2.toFixed(1);
  co2Status.textContent = status;
  co2Time.textContent = new Date(timestamp).toLocaleString();
  co2Dot.style.backgroundColor = color;

  if (co2ParticleSystem) {
    co2ParticleSystem.material.color.set(sphereColor);
  }

  if (co2Sphere) {
    co2Sphere.material.color.set(sphereColor);
  }
}

function updateHumidityDisplay(humidity, timestamp) {
  const humidityValue = document.getElementById('humidity-value');
  const humidityStatus = document.getElementById('humidity-status');
  const humidityTime = document.getElementById('humidity-time');
  const humidityDot = document.getElementById('humidity-dot');

  if (!humidityValue || !humidityStatus || !humidityTime || !humidityDot) {
    console.warn('Humidity DOM elements not found');
    return;
  }

  let status = 'Optimal';
  let color = 'green';

  if (humidity >= 70) {
    status = 'Too High'; color = 'purple';
  } else if (humidity >= 60) {
    status = 'High'; color = 'blue';
  } else if (humidity <= 30) {
    status = 'Too Low'; color = 'red';
  } else if (humidity <= 40) {
    status = 'Low'; color = 'orange';
  }

  humidityValue.textContent = humidity.toFixed(1);
  humidityStatus.textContent = status;
  humidityTime.textContent = new Date(timestamp).toLocaleString();
  humidityDot.style.backgroundColor = color;

  if (humiditySphere) {
    let sphereColor;
    if (humidity >= 70) sphereColor = 0x800080;
    else if (humidity >= 60) sphereColor = 0x0000ff;
    else if (humidity <= 30) sphereColor = 0xff0000;
    else if (humidity <= 40) sphereColor = 0xffa500;
    else sphereColor = 0x00ff00;
    humiditySphere.material.color.set(sphereColor);
  }
}

function updateTemperatureDisplay(temp, timestamp) {
  const tempValue = document.getElementById('temp-value');
  const tempStatus = document.getElementById('temp-status');
  const tempTime = document.getElementById('temp-time');
  const tempDot = document.getElementById('temp-dot');

  if (!tempValue || !tempStatus || !tempTime || !tempDot) {
    console.warn('Temperature DOM elements not found');
    return;
  }

  if (temp === null || isNaN(temp)) {
    tempValue.textContent = '--';
    tempStatus.textContent = 'No Data';
    tempTime.textContent = '--';
    tempDot.style.backgroundColor = 'grey';
    if (temperatureSphere) {
      temperatureSphere.material.color.set(0x808080);
    }
    return;
  }

  let status = 'Comfortable';
  let color = 'green';

  if (temp >= 28) {
    status = 'Hot'; color = 'red';
  } else if (temp >= 26) {
    status = 'Warm'; color = 'orange';
  } else if (temp <= 18) {
    status = 'Cold'; color = 'blue';
  } else if (temp <= 21) {
    status = 'Cool'; color = 'lightblue';
  }

  tempValue.textContent = temp.toFixed(1);
  tempStatus.textContent = status;
  tempTime.textContent = new Date(timestamp).toLocaleString();
  tempDot.style.backgroundColor = color;

  if (temperatureSphere) {
    let sphereColor;
    if (temp >= 28) sphereColor = 0xff0000;
    else if (temp >= 26) sphereColor = 0xffa500;
    else if (temp <= 18) sphereColor = 0x0000ff;
    else if (temp <= 21) sphereColor = 0xadd8e6;
    else sphereColor = 0x00ff00;
    temperatureSphere.material.color.set(sphereColor);
  }
}

// ========== DATA HANDLING ==========
let airDataRows = [], currentRowIndex = 0;
let co2Rows = [], co2RowIndex = 0;
let tempRows = [], tempRowIndex = 0;
let humidityRows = [], humidityRowIndex = 0;

function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  const sepLine = lines[0].startsWith('sep=') ? 1 : 0;
  const headers = lines[sepLine].split(';').map(h => h.replace(/^"(.*)"$/, '$1'));
  const seriesIdx = headers.indexOf('Series'), timeIdx = headers.indexOf('Time'), valueIdx = headers.indexOf('Value');

  return lines.slice(sepLine + 1).map(line => {
    const fields = line.split(';').map(f => f.replace(/^"(.*)"$/, '$1'));
    return {
      Series: fields[seriesIdx],
      Time: fields[timeIdx],
      Value: parseFloat(fields[valueIdx])
    };
  }).filter(row => !isNaN(row.Value));
}

function parseEnvironmentalDataCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/).map(line => line.trim());
  const sepLine = lines[0].startsWith('sep=') ? 1 : 0;
  const headers = lines[sepLine].split(';').map(h => h.replace(/^"(.*)"$/, '$1'));
  const seriesIdx = headers.indexOf('Series'), timeIdx = headers.indexOf('Time'), valueIdx = headers.indexOf('Value');

  return lines.slice(sepLine + 1).map(line => {
    const fields = line.trim().split(';').map(f => f.replace(/^"(.*)"$/, '$1'));
    if (fields.length < 3) return null;
    return {
      Series: fields[seriesIdx],
      Time: fields[timeIdx],
      Value: parseFloat(fields[valueIdx])
    };
  }).filter(row => row !== null && !isNaN(row.Value));
}

function loadCSV() {
  fetch('/src/data/dataset1.csv')
    .then(res => res.text())
    .then(text => {
      airDataRows = parseCSV(text);
      currentRowIndex = 0;
      console.log('PM2.5 Data Loaded:', airDataRows.length, 'rows');
      cycleData();
    })
    .catch(err => console.error('PM2.5 CSV Error:', err));
}

function cycleData() {
  if (!airDataRows.length) return;
  const rawPM25 = airDataRows[currentRowIndex].Value;
  const timestamp = airDataRows[currentRowIndex].Time;
  const adjustedPM25 = applyImpact(rawPM25, airQualityImpacts[selectedOption].pm25);
  updateAirQualityDisplay(adjustedPM25, timestamp);
  currentRowIndex = (currentRowIndex + 1) % airDataRows.length;
}

function loadEnvironmentalData() {
  fetch('/src/data/dataset2.csv')
    .then(res => res.text())
    .then(text => {
      const allData = parseEnvironmentalDataCSV(text);
      
      co2Rows = allData.filter(row => row.Series.includes('co2'));
      tempRows = allData.filter(row => row.Series.includes('temperature'));
      humidityRows = allData.filter(row => row.Series.includes('humidity'));

      co2RowIndex = 0;
      tempRowIndex = 0;
      humidityRowIndex = 0;
      
      console.log(`Loaded environmental data: ${co2Rows.length} CO2 readings, ${tempRows.length} temperature readings, ${humidityRows.length} humidity readings`);
      console.log('Sample CO2 Data:', co2Rows.slice(0, 2));
      console.log('Sample Temperature Data:', tempRows.slice(0, 2));
      console.log('Sample Humidity Data:', humidityRows.slice(0, 2));
      
      cycleEnvironmentalData();
    })
    .catch(err => console.error('Environmental Data CSV Error:', err));
}

function cycleEnvironmentalData() {
  let adjustedPM25 = airDataRows.length ? applyImpact(airDataRows[currentRowIndex].Value, airQualityImpacts[selectedOption].pm25) : null;
  let adjustedCO2 = null, adjustedTemp = null, adjustedHumidity = null;

  if (co2Rows.length) {
    adjustedCO2 = applyImpact(co2Rows[co2RowIndex].Value, airQualityImpacts[selectedOption].co2);
    updateCO2Display(adjustedCO2, co2Rows[co2RowIndex].Time);
    co2RowIndex = (co2RowIndex + 1) % co2Rows.length;
  }
  
  if (tempRows.length) {
    adjustedTemp = applyImpact(tempRows[tempRowIndex].Value, airQualityImpacts[selectedOption].temperature);
    updateTemperatureDisplay(adjustedTemp, tempRows[tempRowIndex].Time);
    tempRowIndex = (tempRowIndex + 1) % tempRows.length;
  } else {
    console.warn('No temperature data to cycle');
    updateTemperatureDisplay(null, null);
  }
  
  if (humidityRows.length) {
    adjustedHumidity = applyImpact(humidityRows[humidityRowIndex].Value, airQualityImpacts[selectedOption].humidity);
    updateHumidityDisplay(adjustedHumidity, humidityRows[humidityRowIndex].Time);
    humidityRowIndex = (humidityRowIndex + 1) % humidityRows.length;
  } else {
    console.warn('No humidity data to cycle');
    updateHumidityDisplay(null, null);
  }

  // Update status bar with adjusted values
  updateStatusBar(adjustedPM25, adjustedCO2, adjustedTemp, adjustedHumidity);
}

// ========== START EVERYTHING ==========
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle dropdown selection
const dropdown = document.getElementById('air-quality-option');
if (dropdown) {
  dropdown.addEventListener('change', (event) => {
    selectedOption = event.target.value;
    console.log('Selected air quality option:', selectedOption);
    // Immediately update displays with new impacts
    if (airDataRows.length) {
      const adjustedPM25 = applyImpact(airDataRows[currentRowIndex].Value, airQualityImpacts[selectedOption].pm25);
      updateAirQualityDisplay(adjustedPM25, airDataRows[currentRowIndex].Time);
    }
    cycleEnvironmentalData();
  });
} else {
  console.warn('Dropdown element not found');
}

console.log("Indoor Air Quality Digital Twin started...");
loadCSV();
loadEnvironmentalData();
setInterval(cycleData, 1000);
setInterval(cycleEnvironmentalData, 1000);

// ========== ANIMATION LOOP ==========
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  animateParticles();
  renderer.render(scene, camera);
}
animate();