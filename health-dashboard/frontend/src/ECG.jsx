import {
useEffect,
useRef
}
from "react";

export default function ECG({
value=0,
status="normal",
qrsDuration=null
})
{
const canvasRef=useRef(null);

const points=useRef([]);

const animation=useRef();

useEffect(()=>{

points.current.push(
typeof value==="number"
?value
:512
);

if(
points.current.length
>
400
)
{
points.current.shift();
}

},[value]);

useEffect(()=>{

const canvas=
canvasRef.current;

if(!canvas)
return;

const ctx=
canvas.getContext("2d");

canvas.width=
canvas.offsetWidth;

canvas.height=
220;

function render()
{
draw(
ctx,
canvas,
points.current,
status,
qrsDuration
);

animation.current=
requestAnimationFrame(
render
);
}

render();

return()=>{

cancelAnimationFrame(
animation.current
);

};

},[
status,
qrsDuration
]);

return(

<div
style={styles.wrapper}
>

<div
style={styles.title}
>

ECG MONITOR

</div>

<canvas
ref={canvasRef}
style={styles.canvas}
/>

</div>

);
}

function draw(
ctx,
canvas,
data,
status,
qrs
)
{
ctx.fillStyle=
"#020617";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);

drawGrid(
ctx,
canvas
);

if(
data.length<2
)
return;

ctx.beginPath();

if(
status==="warning"
)
{
ctx.strokeStyle=
"#ef4444";
}
else if(
qrs
)
{
ctx.strokeStyle=
"#00ffff";
}
else
{
ctx.strokeStyle=
"#00ff88";
}

ctx.lineWidth=3;

ctx.shadowBlur=12;

ctx.shadowColor=
ctx.strokeStyle;

const min=
350;

const max=
800;

const scale=
canvas.height*0.35;

for(
let i=0;
i<data.length;
i++
)
{
const x=
i*
(
canvas.width/
400
);

let y=
canvas.height/2-
(
(
data[i]-min
)
/
(
max-min
)
)
*
scale;

y=
Math.max(
20,
Math.min(
canvas.height-20,
y
)
);

if(
i===0
)
ctx.moveTo(
x,
y
);

else
ctx.lineTo(
x,
y
);
}

ctx.stroke();

// sweep line
ctx.strokeStyle=
"rgba(0,255,150,.8)";

ctx.shadowBlur=
20;

ctx.beginPath();

ctx.moveTo(
canvas.width-10,
0
);

ctx.lineTo(
canvas.width-10,
canvas.height
);

ctx.stroke();

if(qrs)
{
ctx.fillStyle=
"#00ffff";

ctx.beginPath();

ctx.arc(
canvas.width-40,
30,
8,
0,
Math.PI*2
);

ctx.fill();

ctx.fillStyle=
"#fff";

ctx.font=
"14px Arial";

ctx.fillText(
`${qrs} ms`,
canvas.width-130,
35
);
}
}

function drawGrid(
ctx,
canvas
)
{
ctx.strokeStyle=
"rgba(34,197,94,.08)";

for(
let x=0;
x<canvas.width;
x+=20
)
{
ctx.beginPath();

ctx.moveTo(
x,
0
);

ctx.lineTo(
x,
canvas.height
);

ctx.stroke();
}

for(
let y=0;
y<canvas.height;
y+=20
)
{
ctx.beginPath();

ctx.moveTo(
0,
y
);

ctx.lineTo(
canvas.width,
y
);

ctx.stroke();
}
}

const styles={

wrapper:{
background:"#050816",
borderRadius:12,
padding:12,
overflow:"hidden",
border:"1px solid #1e293b"
},

title:{
color:"#22c55e",
marginBottom:10,
fontWeight:"bold"
},

canvas:{
width:"100%",
height:220
}

};