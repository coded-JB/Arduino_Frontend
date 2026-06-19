const hardwareStatus=require("./hardwareStatus");
const path=require("path");

const express=require("express");
const http=require("http");
const WebSocket=require("ws");
const cors=require("cors");

const ArduinoDevice=
require("./arduinoDevice");

const app=
express();

app.use(
cors()
);

const server=
http.createServer(
app
);

const wss=
new WebSocket.Server({
server
});

const device=
new ArduinoDevice();

//=========================
let deviceConnected=
false;

let staleTelemetry=
false;

let lastTelemetry=
Date.now();

let lastDeviceMessage=
"Arduino disconnected";

const history=[];

const MAX_HISTORY=
300;

//=========================
function broadcast(
payload
)
{
const msg=
JSON.stringify(
payload
);

wss.clients.forEach(
client=>
{
if(
client.readyState
===
WebSocket.OPEN
)
{
client.send(
msg
);
}
}
);
}

//=========================
function enrichTelemetry(
data
)
{
const alerts=[];

const bpm=
data.heart?.bpm;

const spo2=
data.spo2?.value;

const temp=
data.temperature?.value;

// HR
if(
typeof bpm==="number"
)
{
if(
bpm<55
)
{
alerts.push({
type:"warning",
message:
"Bradycardia detected"
});
}

if(
bpm>110
)
{
alerts.push({
type:"critical",
message:
"Tachycardia detected"
});
}
}

// SpO₂
if(
typeof spo2==="number"
&&
spo2>0
)
{
if(
spo2<95
)
{
alerts.push({
type:"warning",
message:
"Low oxygen saturation"
});
}

if(
spo2<90
)
{
alerts.push({
type:"critical",
message:
"Critical oxygen level"
});
}
}

// Temp
if(
typeof temp==="number"
)
{
if(
temp>37.5
)
{
alerts.push({
type:"warning",
message:
"Elevated temperature"
});
}

if(
temp>39
)
{
alerts.push({
type:"critical",
message:
"High fever"
});
}
}

return{
...data,
alerts
};
}

//=========================
wss.on(
"connection",
ws=>
{
console.log(
"Client connected"
);

ws.send(
JSON.stringify({
type:
"device_status",

connected:
deviceConnected,

message:
lastDeviceMessage,

timestamp:
Date.now()
})
);
}
);

//=========================
app.use(
express.static(
path.join(
__dirname,
"../frontend/dist"
)
)
);

app.get(
"/{*splat}",
(req,res)=>
{
res.sendFile(
path.join(
__dirname,
"../frontend/dist/index.html"
)
);
}
);

//=========================
device.start(

(data)=>
{
deviceConnected=
true;

staleTelemetry=
false;

lastTelemetry=
Date.now();

lastDeviceMessage=
"Receiving telemetry";

const enriched=
enrichTelemetry(
data
);

hardwareStatus.update(
enriched
);

// append history
history.push({

time:
new Date()
.toLocaleTimeString(),

hr:
enriched.heart?.bpm
??
null,

spo2:
enriched.spo2?.value
??
null,

temp:
enriched.temperature?.value
??
null,

qrs:
enriched.ecg?.qrsDuration
??
null
});

if(
history.length
>
MAX_HISTORY
)
{
history.shift();
}

enriched.history=
history;

enriched.hardware=
hardwareStatus;

enriched.timestamp=
Date.now();

broadcast(
enriched
);

},

(status)=>
{
deviceConnected=
status.connected;

lastDeviceMessage=
status.message;

broadcast({
type:
"device_status",

connected:
status.connected,

message:
status.message,

timestamp:
Date.now()
});
}

);

//=========================
setInterval(
()=>
{
if(
Date.now()
-
lastTelemetry
>
5000
)
{
staleTelemetry=
true;

broadcast({

type:
"device_status",

connected:
deviceConnected,

message:
deviceConnected
?
"Telemetry timeout"
:
"Arduino disconnected",

timestamp:
Date.now()
});
}

},
1000
);

//=========================
server.listen(
3000,
()=>
{
console.log(
"Backend running on :3000"
);
});
