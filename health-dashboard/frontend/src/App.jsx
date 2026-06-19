import useTelemetry from "./useTelemetry";
import ECG from "./ECG";
import AlertPanel from "./AlertPanel";
import DeviceStatus from "./components/DeviceStatus";
import HardwareStatus from "./components/HardwareStatus";
import TelemetryStatsPanel from "./components/TelemetryStatsPanel";
import TrendChart from "./components/TrendChart";
import Header from "./components/Header";
import FullscreenButton from "./components/FullscreenButton";

export default function App()
{
const data =
useTelemetry();

const ecgStatus =
data.ecg?.status
||
"no-contact";

const connected =
data.device?.connected;

const isWarning =
(
ecgStatus==="warning"
||
ecgStatus==="no-contact"
);

const heartRate =
data.heart?.bpm
??
"--";

const temperature =
data.temperature?.value
??
"--";

const spo2 =
data.spo2?.value
??
"--";

return(

<div className="dashboard">

<Header/>

<FullscreenButton/>

<div className="top-grid">

<div className="panel">

<div className="title">
ECG MONITOR
</div>

<ECG
value={data.ecg?.signal}
status={ecgStatus}
qrsDuration={data.ecg?.qrsDuration}
/>

<h2
className={
connected
?
(
isWarning
?
"status-warning"
:
"status-normal"
)
:
"status-offline"
}
>

{
connected
?
`HR: ${heartRate} BPM`
:
"DEVICE OFFLINE"
}

</h2>

</div>

<div className="panel">

<div className="title">
SYSTEM STATUS
</div>

<h1 className="big-number">

{
connected
?
heartRate
:
"--"
}

</h1>

<p>
BPM
</p>

<p
className={
connected
?
(
isWarning
?
"status-warning"
:
"status-normal"
)
:
"status-offline"
}
>

{
connected
?
ecgStatus
:
"offline"
}

</p>

</div>

</div>

<div style={{marginTop:20}}>

<DeviceStatus
device={
data.device
}
/>

</div>

<div style={{marginTop:20}}>

<HardwareStatus
hardware={
data.hardware
}
/>

</div>

<div className="bottom-grid">

<div className="panel">

<div className="title">
TEMPERATURE
</div>

<h1 className="big-number">

{
temperature
}

<span className="unit">

°C

</span>

</h1>

</div>

<div className="panel">

<div className="title">
SpO₂
</div>

<h1 className="big-number">

{
spo2
}

<span className="unit">

%

</span>

</h1>

</div>

<AlertPanel
alerts={
data.alerts
}
/>

</div>

<div style={{marginTop:20}}>

<TelemetryStatsPanel
history={
data.history
}
/>

</div>

<div style={{marginTop:20}}>

<TrendChart
history={
data.history
}
/>

</div>

<div
style={{
marginTop:20,
padding:12,
borderRadius:10,
display:"flex",
justifyContent:"space-between",
background:"#020617",
border:
connected
?
"1px solid #22c55e"
:
"1px solid #ef4444",
color:
connected
?
"#22c55e"
:
"#ef4444"
}}
>

<span>

STATUS:

{
connected
?
"SYSTEM ACTIVE"
:
"SYSTEM OFFLINE"
}

</span>

<span>

{
connected
?
"ARDUINO CONNECTED"
:
"ARDUINO DISCONNECTED"
}

</span>

</div>

</div>

);
}
