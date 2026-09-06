(async function(){
  try {
    var parts=[];
    for (var i=0;i<7;i++) {
      parts.push(await fetch('apart_'+i+'.js?v=4').then(function(r){ if(!r.ok) throw new Error('apart_'+i); return r.text(); }));
    }
    (0,eval)(parts.join(''));
  } catch(e) { console.error('S7 app load failed', e); }
})();
