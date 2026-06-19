const { SerialPort } =
require(
"serialport"
);

const {
ReadlineParser
}=
require(
"@serialport/parser-readline"
);

class ArduinoDevice
{
constructor(
options={}
)
{
this.port=null;

this.parser=null;

this.connected=false;

this.onData=null;

this.onStatus=null;

this.reconnectTimer=null;

this.lastECG=512;

this.path=
options.path
||
process.env.ARDUINO_PORT;

this.baudRate=
Number(
options.baudRate
||
process.env.ARDUINO_BAUD
||
9600
);
}

//=====================
emitStatus(
connected,
message
)
{
this.connected=
connected;

if(
this.onStatus
)
{
this.onStatus({
type:
"device_status",

connected,

message
});
}
}

//=====================
cleanup()
{
try
{
if(
this.parser
)
{
this.parser.removeAllListeners();
}

if(
this.port
)
{
this.port.removeAllListeners();

if(
this.port.isOpen
)
{
this.port.close();
}
}

}
catch{}
}

//=====================
scheduleReconnect()
{
if(
this.reconnectTimer
)
return;

this.reconnectTimer=
setTimeout(
()=>
{
this.reconnectTimer=
null;

this.connect();

},
3000
);
}

//=====================
async findArduinoPort()
{
const ports=
await SerialPort.list();

return ports.find(
p=>
{
const m=
p.manufacturer
?.toLowerCase()
||
"";

return(
p.vendorId==="2341"
||
m.includes("arduino")
||
m.includes("wch")
||
m.includes("ch340")
||
m.includes("silicon")
);
}
);
}

//=====================
async connect()
{
try
{
this.cleanup();

const portInfo=
this.path
?
{
path:
this.path
}
:
await this.findArduinoPort();

if(
!portInfo
)
{
this.emitStatus(
false,
"Waiting for Arduino"
);

this.scheduleReconnect();

return;
}

console.log(
"Connecting:",
portInfo.path
);

this.port=
new SerialPort({

path:
portInfo.path,

baudRate:
this.baudRate
});

this.parser=
this.port.pipe(
new ReadlineParser({
delimiter:
"\n"
})
);

this.emitStatus(
true,
`Connected ${portInfo.path}`
);

this.attach();

}
catch(
err
)
{
console.error(
err.message
);

this.emitStatus(
false,
err.message
);

this.scheduleReconnect();
}
}

//=====================
attach()
{
this.port.on(
"close",
()=>
{
this.emitStatus(
false,
"Arduino disconnected"
);

this.scheduleReconnect();
}
);

this.port.on(
"error",
(err)=>
{
this.emitStatus(
false,
err.message
);
}
);

this.parser.on(
"data",
(line)=>
{
try
{
line=
line.trim();

console.log(
"[RAW SERIAL]",
line
);

if(
!line
)
return;

// no contact
if(
line===
"STATUS:NO_CONTACT"
)
{
this.emitStatus(
true,
"No patient contact"
);

return;
}

const obj={};

line
.split(",")

.forEach(
p=>
{
const[
k,
v
]=
p.split(":");

if(
k
&&
v
)
{
obj[
k.trim()
]=
v.trim();
}
}
);

// parse
const bpm=
Number(
obj.HR
);

let ecg=
Number(
obj.ECG
);

const temp=
Number(
obj.TEMP
);

const spo2=
obj.SPO2==="NA"
?
0
:
Number(
obj.SPO2
);

const qrs=
obj.QRS==="NA"
?
null
:
Number(
obj.QRS
);

// validate
if(
!Number.isFinite(ecg)
||
!Number.isFinite(temp)
)
return;

// smooth ECG
ecg=
Math.round(
(
this.lastECG*2
+
ecg
)
/
3
);

this.lastECG=
ecg;

// build
const packet=
{
timestamp:
Date.now(),

ecg:
{
signal:
ecg,

qrsDuration:
Number.isFinite(qrs)
?
qrs
:
null,

status:
spo2===0
?
"no-contact"
:
(
bpm>110
||
bpm<55
)
?
"warning"
:
"normal"
},

heart:
{
bpm:
Number.isFinite(bpm)
?
bpm
:
null
},

temperature:
{
value:
temp
},

spo2:
{
value:
Math.max(
0,
Math.min(
98,
spo2
)
)
}
};

if(
this.onData
)
{
this.onData(
packet
);
}

}
catch(
err
)
{
console.error(
"Parse:",
err.message
);
}
}
);
}

//=====================
start(
onData,
onStatus
)
{
this.onData=
onData;

this.onStatus=
onStatus;

this.connect();
}
}

module.exports=
ArduinoDevice;
