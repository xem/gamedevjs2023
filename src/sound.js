musicon = 0;
musicstarted = 0;

// Sound by Anders Kaare
function mkaudio(fn) {
	var data = [];
	for (var i = 0;;i++) {
		var smp = fn(i);
		if (smp===null) break;
		data.push(smp/5);
	}
	var l = data.length;
	var l2=l*2;

	var b32 = function (v) {
		var s = 0;
		var b = "";
		for (var i=0; i<4; i++,s+=8) b+=String.fromCharCode((v>>s)&255);
		return b;
	};
	var b16 = function (v) {
		var b = b32(v);
		return b[0]+b[1];
	};;

	var SR=48e3;
	var b = "RIFF"+b32(l2+36)+"WAVEfmt "+b32(16)+b16(1)+b16(1)+b32(SR)+b32(SR*2)+b16(2)+b16(16)+"data"+b32(l2);
	for (var i in data) b+=b16(data[i]*10e3);
	return new Audio("data:audio/wav;base64,"+btoa(b));
}

P=Math.pow;S=Math.sin;

function t(i,n) {
	return (n-i)/n;
}

/*function SNDjump0(i) {
	var n = 1e4;
	if (i>n) return null;
	return ((P(i,1.055)&128)?1:-1)*P(t(i,n),2);
}

function SNDjump1(i) {
	var n=1.3e4;
	var c=n/3;
	if (i > n) return null;
	var q=P(t(i,n),3.1);
	return (P(i,1.08)&(i<c?98:99))?q:-q;
}*/

function SNDjump2(i) {
	i=i*1.5;
	var n = 2e4;
	if (i>n) return null;
	return ((P(i,1.075)&128)?1:-1)*P(t(i,n),2);
}

/*
function SNDjump3(i) {
	i=i*1.5;
	var n = 2e4;
	if (i>n) return null;
	return ((P(i,1.055)&128)?1:-1)*P(t(i,n),2);
}

function SNDjump4(i) {
	i=i*1.4;
	var n = 2e4;
	if (i>n) return null;
	return ((P(i,1.055)&130)?1:-1)*P(t(i,n),2);
}

function SNDjump5(i) {
	i=i*0.75;
	var n=1.3e4;
	var c=n/3;
	if (i > n) return null;
	var q=P(t(i,n),3.1);
	return (P(i,1.08)&(i<c?98:99))?q:-q;
}
*/

function SNDdie0(i) {
	var n=5e4;
	if (i > n) return null;
	return ((P(i,0.9)&200)?1:-1)*P(t(i,n),3);
}

/*function SNDdie1(i) {
	i=P(i,0.96)*1.3;
	var n=9e4;
	if (i > n) return null;
	return (((i+S(i/1900)*80)&64)?1:-1)*P(t(i,n),3);
}

function SNDdie2(i) {
	var n=5e4;
	var n1=1e5;
	if (i > n) return null;
	i=P(i,1-S(i/n1))*5.3;
	var x=S(i/30+S(i/1500));
	return P(x,9)*t(i,n);
}

function SNDdie3(i) {
	var n=5e4;
	var n1=1e5;
	if (i > n) return null;
	i=P(i,1.2-S(i/n1))*7;
	var x=S(i/30+S(i/1500));
	return P(x,9)*t(i,n);
}

function SNDdie3(i) {
	var n=6e4;
	var n1=1e5;
	if (i > n) return null;
	i=P(i,1.2-S(i/n1))*7;
	var x=S(i/30+S(i/1500));
	return P(x,9)*t(i,n);
}

function SNDdie4(i) {
	var n=5e4;
	var n1=1e5;
	if (i > n) return null;
	i=P(i,1.2-S(i*2/n1))*6;
	var x=S(i/30+S(i/1500));
	return P(x,9)*t(i,n);
}

function SNDglitch0(i) {
	var n=5e4;
	if (i > n) return null;
	return ((P(i+S(i*0.01)*1000,0.9)&200)?1:-1)*P(t(i,n),1);
}
*/

function SNDbrick1(i) {
	var n=5e3;
	if (i > n) return null;
	return ((P(i+S(i*0.01)*1000,0.8)&200)?0.5:-0.5)*P(t(i,n),1);
}

function SNDglitch1(i) {
	var n=9e4;
	if (i > n) return null;
	return ((P(i+S(i*0.01)*1000,0.8)&200)?0.5:-0.5)*P(t(i,n),1);
}

/*
function SNDglitch2(i) {
	var n=1e5;
	if (i > n) return null;
	return ((P(P(i,0.9)+S(i*1.06)*1000,0.8)&200)?0.5:-0.5)*P(t(i,n),1);
}

function SNDcoin0(i) {
	var n=1e4;
	var c=n/3;
	if (i > n) return null;
	var q=P(t(i,n),2.1);
	return (P(i,3)&(i<c?16:99))?q:-q;
}
*/
function SNDcoin1(i) {
	var n=1.6e4;
	var c=n/7;
	if (i > n) return null;
	var q=P(t(i,n),2.1);
	return (i<c ? ((i+S(-i/900)*10)&16) : i&13) ?q:-q;
}

function SNDwin0(i) {
	var notes = [0,4,7,12,undefined,7,12];
	var n=4e4;
	if (i > n) return null;
	var idx = ((notes.length*i)/n)|0;
	var note = notes[idx];
	if (note === undefined) return 0;
	var r = P(2,note/12)*0.8;
	var q = t((i*notes.length)%n,n);
	return ((i*r)&64)?q:-q
}


function SNDswitch0(i) {
	var n=7e3;
	if (i > n) return null;
	return ((((i^(i>>3))^(i*i*7.3)^(i<<4))&65535)/65536)*t(i,n);
}

function SNDtimetravel0(i) {
	var n=5e4;
	var n1=1e5;
	if (i > n) return null;
	i=P(i,1.2-S(i/n1))*7;
	var x=S(i/30+S(i/1500));
	return P(x,9)*t(i,n);
}

/*
function SND0(i) {
	var n=25000;
	if (i > n) return null;
	return ((((i^(i>>3))^(i*i*7.3)^(i<<4))&65535)/65536)*t(i,n);
}

window.onload = function () {
	for (var k in window) {
		if (/^SND/.exec(k)) {
			(function (k) {
				var a = mkaudio(window[k]);
				var e = document.createElement("button");
				e.onclick = function () { a.play(); };
				e.innerHTML = k.substring(3);
				document.body.appendChild(e);
			})(k);
		}
	}
}
*/

// Music by Anders Kaare
// http://veralin.dk/2k.html
Music = () => {

  MM=new (function(){
    if (!window.AudioContext) return;

    var M=this;

    var ctx=new AudioContext;
    var node=ctx.createScriptProcessor(4096,0,1);

    // "constants"
    var RATE=ctx.sampleRate/48e3;
    var POW=Math.pow;
    var SIN=Math.sin;
    var RND=Math.random;
    var NSIN=function(x){return SIN(x)+RND()*0.6};
    var P2=Math.PI*2;
    //var PRB=function(x){return RND()<x;};
    var OSC=function(fn){
      var x=0;
      return function(note) {
        x+=POW(2,note/12)*RATE;
        if(x>P2)x-=P2;
        return musicon ? fn(x)/4 : 0;
      };
    };

    // oscillators
    var snare=OSC(NSIN);
    var pling=OSC(function(x) {
      return (x/P2-0.5);
    });
    var pling2=OSC(function(x) {
      return (x/P2-0.5);
    });
    var bass=OSC(function (x) {
      return (x/P2-0.5)+POW(SIN(x),5)*3;
    });

    var pos=1;
    var step=-1;
    var vibrato=0;

    node.onaudioprocess = function(e) {
      var data = e.outputBuffer.getChannelData(0);
      for (var i=0;i<data.length;i++) {
        pos+=M.t/RATE;
        vibrato+=0.001/RATE;
        if(pos>=1){
          pos-=1;
          step++;
        }
        var decay=1-pos;

        var o=0;

        var X=null;
        var bt=0;

        var lseq,lseq2;
        if ((step%128)<64) {
          //lseq = [3,4,4,4,3,4,0,-3,0,X,X,0,X,X,0,X,3,4,4,4,3,4,0,-3,0,12,X,12,12,X,X,X];
          //lseq2 = [X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,-1,0,0,0,-1,0,-5,-8,-5,X,X,-5,X,X,-5,X,X];
        } else {
          //lseq = [6,7,7,7,6,5,4,2,-5,X,X,7,X,X,X];
          //lseq2 = [X,X,X,X,-10,-5,X,X,X,-10];
          bt = -5;
        }

        //var L=lseq.length;
        //var ln = lseq[step%L];
        //if (ln!=X) o+=pling(-81+ln+24)*decay*M.p;

        //L=lseq2.length;
        //var ln = lseq2[step%L];
        //if (ln!=X) o+=pling2(-81+ln+24+SIN(vibrato)*0.05)*decay*M.p;

        var bseq=[0,X,X,0,7,9,X,7];
        L=bseq.length;
        var bseq2=[X,12,X,12,12,X];
        var bn = (((step/L)&3)<3?bseq:bseq2)[step%L];
        if (bn!=X) o+=bass(-81+bn+bt-SIN(vibrato)*0.05)*M.b*decay;

        var drumx=((1-pos)+(step&1))/2;
        if ((step&2)==2) o += snare(-70+POW(drumx,15)*60)*M.s*decay*RND();


        data[i]=o;
      }
    };
    node.connect(ctx.destination);

    // hi xem, this is the interface:
    M.stop = function() { node.disconnect(); } // XXX you can remove this to conserve space

    M.s = 0.1; // snare volume
    M.p = 0.2; // pling volume
    M.b = 0.2; // bass volume
    M.t=.8e-4; // tempo
  })

}

//Music();