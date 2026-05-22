const revs = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
}), {threshold:0.06});
revs.forEach(el => obs.observe(el));

(function motionCanvas(){
  const canvas = document.getElementById('mc');
  if(!canvas) return;
  const dpr = Math.min(window.devicePixelRatio||1, 2);
  function size(){
    const r = canvas.parentElement.getBoundingClientRect();
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
  }
  size();
  window.addEventListener('resize', size);
  const ctx = canvas.getContext('2d');

  const pts = Array.from({length:7}, (_,i) => ({
    t: (i/7)*Math.PI*2,
    sp: 0.008 + i*0.002,
    sz: 2.5 + i*0.6,
    trail: []
  }));

  function draw(){
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    const cx = W/2, cy = H/2, rx = W*0.36, ry = H*0.32;

    ctx.beginPath();
    for(let i=0;i<=360;i++){
      const a = (i/360)*Math.PI*2;
      const x = cx + rx*Math.sin(a);
      const y = cy + ry*Math.sin(a*2);
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(17,17,16,0.07)';
    ctx.lineWidth=1*dpr;
    ctx.stroke();

    pts.forEach((p,pi)=>{
      p.t += p.sp * 0.05;
      const x = cx + rx*Math.sin(p.t);
      const y = cy + ry*Math.sin(p.t*2);
      p.trail.push({x,y});
      if(p.trail.length>32) p.trail.shift();

      if(p.trail.length>1){
        ctx.beginPath();
        p.trail.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));
        ctx.strokeStyle=`rgba(26,26,255,${0.04+pi*0.045})`;
        ctx.lineWidth=p.sz*0.5*dpr;
        ctx.lineCap='round';
        ctx.lineJoin='round';
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x,y,p.sz*dpr,0,Math.PI*2);
      ctx.fillStyle=pi===0?'rgba(26,26,255,0.9)':'rgba(17,17,16,0.45)';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
