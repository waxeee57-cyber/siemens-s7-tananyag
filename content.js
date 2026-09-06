(async function(){
  try{
    var parts=[];
    for(var i=0;i<12;i++){
      parts.push(await fetch("gz"+i+".b64?v=3").then(function(r){ if(!r.ok) throw new Error("gz"+i); return r.text(); }));
    }
    var b64=parts.join("");
    var bin=Uint8Array.from(atob(b64), function(c){ return c.charCodeAt(0); });
    var ds=new DecompressionStream("gzip");
    var stream=new Blob([bin]).stream().pipeThrough(ds);
    var ab=await new Response(stream).arrayBuffer();
    (0,eval)(new TextDecoder().decode(ab));
    var s=document.createElement("scr"+"ipt");
    s.src="app.js";
    document.body.appendChild(s);
  }catch(e){ console.error("S7 content load failed", e); var el=document.getElementById("content-area"); if(el) el.innerHTML="<p style=color:#ef4444>Tartalom betoltesi hiba</p>"; }
})();
