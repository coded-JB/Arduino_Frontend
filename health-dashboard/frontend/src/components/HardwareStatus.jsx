export default function HardwareStatus({
hardware={}
})
{
const items=
Object.values(
hardware
).filter(
v=>
typeof v==="object"
);

return(

<div className="panel">

<div className="title">

HARDWARE STATUS

</div>

<div
style={{
display:"grid",
gap:12
}}
>

{
items.map(
(
item,
i
)=>
(

<div
key={i}

style={{
display:"flex",

justifyContent:
"space-between",

padding:12,

borderRadius:8,

background:
item.connected
?
"rgba(34,197,94,.08)"
:
"rgba(239,68,68,.08)"
}}
>

<div>

<div>

{
item.name
}

</div>

<div
style={{
opacity:.7
}}
>

{
item.message
}

</div>

</div>

<div
style={{
fontWeight:700,

color:
item.connected
?
"#22c55e"
:
"#ef4444"
}}
>

{
item.connected
?
"ONLINE"
:
"OFFLINE"
}

</div>

</div>
)
)
}

</div>

</div>

);
}
