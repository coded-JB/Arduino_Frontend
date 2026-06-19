const hardwareStatus =
{
arduino:
{
name:
"Arduino",

connected:
true,

message:
"Serial active"
},

ecg:
{
name:
"AD8232 ECG",

connected:
true,

message:
"A1 input active"
},

temperature:
{
name:
"DS18B20",

connected:
true,

message:
"Temperature stream active"
},

spo2:
{
name:
"Pulse Sensor",

connected:
true,

message:
"Analog pulse detected"
},

network:
{
name:
"WebSocket",

connected:
true,

message:
"Streaming telemetry"
},

patient:
{
name:
"Patient Contact",

connected:
false,

message:
"No contact"
}
};

//=====================
hardwareStatus.update=
function(
telemetry
)
{
const spo2=
telemetry?.spo2?.value;

const ecg=
telemetry?.ecg?.signal;

const temp=
telemetry?.temperature?.value;

// patient detection
this.patient.connected=
(
spo2>0
||
ecg!==null
);

this.patient.message=
this.patient.connected
?
"Detected"
:
"No contact";

// ecg
this.ecg.connected=
ecg!==null;

this.ecg.message=
ecg!==null
?
"Receiving ECG"
:
"No signal";

// temp
this.temperature.connected=
temp!==null;

this.temperature.message=
temp!==null
?
`${temp} °C`
:
"Sensor idle";

// spo2
this.spo2.connected=
spo2>0;

this.spo2.message=
spo2>0
?
`${spo2}%`
:
"No finger";
};

module.exports=
hardwareStatus;