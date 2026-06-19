import { useEffect, useState } from "react";

const MAX_HISTORY = 300;

export default function useTelemetry()
{
const [data,setData]=
useState({
ecg:{
signal:null,
qrsDuration:null,
status:"no-contact"
},

heart:{
bpm:null
},

temperature:{
value:null
},

spo2:{
value:null
},

alerts:[],

history:[],

device:{
connected:false,
message:"Waiting for Arduino"
}
});

useEffect(
()=>
{
const protocol=
window.location.protocol==="https:"
?
"wss:"
:
"ws:";

const backendHost=
import.meta.env.VITE_WS_HOST
||
"localhost:3000";

const ws=
new WebSocket(
`${protocol}//${backendHost}`
);

//=====================
ws.onopen=
()=>
{
setData(
prev=>({
...prev,

device:{
connected:true,
message:"Connected"
}
})
);
};

//=====================
ws.onmessage=
(event)=>
{
try
{
const incoming=
JSON.parse(
event.data
);

// DEVICE STATUS
if(
incoming.type
===
"device_status"
)
{
const noContact=
incoming.connected
&&
incoming.message
?.toLowerCase()
.includes(
"no patient contact"
);

setData(
prev=>({

...prev,

device:{
connected:
incoming.connected,

message:
incoming.message
},

...(noContact
?
{
ecg:{
signal:null,
qrsDuration:null,
status:
"no-contact"
},

heart:{
bpm:null
},

temperature:{
value:null
},

spo2:{
value:null
},

alerts:[]
}
:
{})
})
);

return;
}

//=====================
// TELEMETRY
//=====================

setData(
prev=>
{
const next=
{
...prev,

ecg:{
...prev.ecg,
...incoming.ecg
},

heart:{
...prev.heart,
...incoming.heart
},

temperature:{
...prev.temperature,
...incoming.temperature
},

spo2:{
...prev.spo2,
...incoming.spo2
},

alerts:
incoming.alerts
||
prev.alerts,

device:{
connected:true,
message:
"Receiving telemetry"
}
};

// append history
next.history=
[
...prev.history,

{
time:
new Date()
.toLocaleTimeString(),

hr:
next.heart.bpm,

spo2:
next.spo2.value,

temp:
next.temperature.value
}
]
.slice(
-MAX_HISTORY
);

return next;
}
);

}
catch(err)
{
console.error(
"Telemetry parse error",
err
);
}
};

//=====================
ws.onerror=
(err)=>
{
console.error(
"WebSocket error",
err
);

setData(
prev=>({

...prev,

device:{
connected:false,
message:
"WebSocket error"
}
})
);
};

//=====================
ws.onclose=
()=>
{
setData(
prev=>({

...prev,

device:{
connected:false,
message:
"Backend disconnected"
}
})
);
};

//=====================
return ()=>
{
ws.close();
};

},
[]
);

return data;
}
