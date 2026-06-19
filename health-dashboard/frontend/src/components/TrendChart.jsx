import {
ResponsiveContainer,
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
Legend
}
from
"recharts";

export default function TrendChart({
history=[]
})
{
const formatted=
history
.slice(-120)
.map(
(item,index)=>
({
time:
item.time
||
index,

hr:
item.hr
??
null,

spo2:
item.spo2
??
null,

temp:
item.temp
??
null
})
);

return(

<div className="panel">

<div className="title">

TELEMETRY TRENDS

</div>

<div
style={{
width:"100%",
height:320
}}
>

<ResponsiveContainer>

<LineChart
data={
formatted
}
>

<CartesianGrid
stroke="#1e293b"
strokeDasharray="4 4"
/>

<XAxis
dataKey="time"
tick={{
fill:"#64748b"
}}
tickLine={false}
/>

<YAxis
yAxisId="left"
domain={[40,160]}
tick={{
fill:"#22c55e"
}}
tickLine={false}
/>

<YAxis
yAxisId="right"
orientation="right"
domain={[20,45]}
tick={{
fill:"#f97316"
}}
tickLine={false}
/>

<Tooltip
contentStyle={{
background:"#020617",
border:
"1px solid #1e293b",
borderRadius:8,
color:"#fff"
}}
/>

<Legend/>

<Line
yAxisId="left"
type="natural"
dataKey="hr"
name="Heart Rate"
stroke="#00ff88"
strokeWidth={3}
dot={false}
isAnimationActive={false}
/>

<Line
yAxisId="left"
type="natural"
dataKey="spo2"
name="SpO₂"
stroke="#38bdf8"
strokeWidth={3}
dot={false}
isAnimationActive={false}
/>

<Line
yAxisId="right"
type="natural"
dataKey="temp"
name="Temperature"
stroke="#f97316"
strokeWidth={3}
dot={false}
isAnimationActive={false}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

);
}