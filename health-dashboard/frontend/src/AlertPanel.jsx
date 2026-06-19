import { useMemo } from "react";

export default function AlertPanel({
alerts=[]
})
{
const normalized=
useMemo(
()=>
{
const seen=
new Set();

return alerts
.filter(
a=>
{
const key=
`${a.type}-${a.message}`;

if(
seen.has(key)
)
return false;

seen.add(key);

return true;
}
)
.slice(
0,
6
);
},
[
alerts
]
);

return(

<div className="panel">

<div className="title">

ALERTS

</div>

<div
style={{
marginTop:20,
display:"flex",
flexDirection:"column",
gap:12
}}
>

{
normalized.length===0
&&
(
<div
style={{
padding:16,
borderRadius:10,
background:
"rgba(34,197,94,.08)",
border:
"1px solid rgba(34,197,94,.25)",

color:"#22c55e",

fontWeight:700
}}
>

SYSTEM NORMAL

<div
style={{
marginTop:8,
fontSize:12,
opacity:.7
}}
>

No active telemetry alerts

</div>

</div>
)
}

{
normalized.map(
(
alert,
index
)=>
{
const critical=
alert.type==="critical";

const warning=
alert.type==="warning";

return(

<div
key={
index
}

style={{
padding:14,

borderRadius:10,

border:
critical
?
"1px solid #ef4444"
:
warning
?
"1px solid #f59e0b"
:
"1px solid #38bdf8",

background:
critical
?
"rgba(239,68,68,.10)"
:
warning
?
"rgba(245,158,11,.10)"
:
"rgba(56,189,248,.10)",

boxShadow:
critical
?
"0 0 18px rgba(239,68,68,.18)"
:
"none",

transition:
".2s"
}}
>

<div
style={{
display:"flex",
justifyContent:
"space-between"
}}
>

<div
style={{
fontWeight:700
}}
>

{
critical
?
"CRITICAL"
:
warning
?
"WARNING"
:
"INFO"
}

</div>

<div
style={{
fontSize:12,
opacity:.6
}}
>

{
new Date()
.toLocaleTimeString()
}

</div>

</div>

<div
style={{
marginTop:8
}}
>

{
alert.message
}

</div>

</div>

);
}
)
}

</div>

</div>

);
}