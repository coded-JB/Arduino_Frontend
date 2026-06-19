export default function DeviceStatus({
device={}
})
{
const msg=
(
device.message
||
"Waiting..."
)
.toLowerCase();

const connected=
device.connected;

let label=
"OFFLINE";

let color=
"#ef4444";

let border=
"rgba(239,68,68,.25)";

let background=
"rgba(239,68,68,.08)";

//=====================
if(
connected
)
{
label=
"ONLINE";

color=
"#22c55e";

border=
"rgba(34,197,94,.25)";

background=
"rgba(34,197,94,.08)";
}

if(
msg.includes(
"waiting"
)
)
{
label=
"WAITING";

color=
"#f59e0b";

border=
"rgba(245,158,11,.25)";

background=
"rgba(245,158,11,.08)";
}

if(
msg.includes(
"no patient"
)
)
{
label=
"NO CONTACT";

color=
"#38bdf8";

border=
"rgba(56,189,248,.25)";

background=
"rgba(56,189,248,.08)";
}

if(
msg.includes(
"receiving"
)
)
{
label=
"LIVE";

color=
"#22c55e";

border=
"rgba(34,197,94,.25)";

background=
"rgba(34,197,94,.08)";
}

return(

<div
style={{
padding:14,

borderRadius:10,

border:
`1px solid ${border}`,

background,

color,

display:"flex",

justifyContent:
"space-between",

alignItems:
"center",

transition:
".25s"
}}
>

<div>

<div
style={{
fontWeight:800,
fontSize:16
}}
>

DEVICE

</div>

<div
style={{
marginTop:5,
opacity:.75,
fontSize:14
}}
>

{
device.message
||
"No message"
}

</div>

</div>

<div
style={{
textAlign:"right"
}}
>

<div
style={{
fontSize:24,
fontWeight:800
}}
>

{
label
}

</div>

<div
style={{
fontSize:12,
opacity:.65
}}
>

{
connected
?
"Telemetry Active"
:
"No Stream"
}

</div>

</div>

</div>

);
}