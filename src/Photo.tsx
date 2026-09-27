import {useEffect,useRef,useState} from 'react';
import {Camera,UserRound} from 'lucide-react';
import {saveStudentPhoto,type Student} from './auth';

export function Avatar({student}:{student:Student}){
 const [failed,setFailed]=useState('');
 const src=student.photo===null?'':student.photo||'/assets/student-sample-classroom.png';
 return <span className="avatar"><span className={'avatar-image '+(student.photo===undefined?'sample-boy':'')}>{src&&failed!==src?<img src={src} alt={student.name+' profile photo'} onError={()=>setFailed(src)}/>:<UserRound aria-hidden="true"/>}</span><i title="Active"/></span>;
}
export default function PhotoEditor({student,onChange}:{student:Student;onChange:(s:Student)=>void}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const [draft,setDraft]=useState<HTMLImageElement|null>(null);
 const [zoom,setZoom]=useState(1),[position,setPosition]=useState({x:0,y:0});
 const canvas=useRef<HTMLCanvasElement>(null);
 const drag=useRef<{x:number;y:number;ox:number;oy:number}|null>(null);
 const uploadVersion=useRef(0);
 useEffect(()=>()=>{uploadVersion.current++;},[]);
 useEffect(()=>{
  if(!draft||!canvas.current)return;
  const context=canvas.current.getContext('2d');if(!context)return;
  const scale=Math.max(384/draft.width,384/draft.height)*zoom;
  context.clearRect(0,0,384,384);
  context.drawImage(draft,(384-draft.width*scale)/2+position.x,(384-draft.height*scale)/2+position.y,draft.width*scale,draft.height*scale);
 },[draft,zoom,position]);
 function move(x:number,y:number){
  if(!draft)return;
  const scale=Math.max(384/draft.width,384/draft.height)*zoom;
  const mx=(draft.width*scale-384)/2,my=(draft.height*scale-384)/2;
  setPosition({x:Math.max(-mx,Math.min(mx,x)),y:Math.max(-my,Math.min(my,y))});
 }
 function cancel(){uploadVersion.current++;setDraft(null);setMessage('');drag.current=null;}
 async function confirm(){
  if(!canvas.current||!draft||busy)return;
  const photo=canvas.current.toDataURL('image/jpeg',.88);
  setBusy(true);setMessage('');
  try{onChange(await saveStudentPhoto(student,photo));setDraft(null);setMessage('Profile photo updated.');}
  catch{setMessage('Could not save your photo. Please try again.');}
  finally{setBusy(false);}
 }
 async function upload(file?:File){
  if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){setMessage('Choose a JPEG, PNG or WebP under 8 MB.');return;}
  setBusy(true);setMessage('');
  const version=++uploadVersion.current;
  const url=URL.createObjectURL(file);
  try{
   const img=new Image();img.src=url;await img.decode();
   if(version!==uploadVersion.current)return;
   setDraft(img);setZoom(1);setPosition({x:0,y:0});
  }catch{setMessage('This photo could not be opened. Try another image.');}
  finally{URL.revokeObjectURL(url);setBusy(false);}
 }
 return <div className="profile-photo-editor"><Avatar student={student}/><div className="photo-editor-controls">
  <label className="photo-upload"><Camera size={17}/>{busy?'Please wait…':draft?'Choose another photo':'Change profile photo'}<input disabled={busy} aria-label="Change profile photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{void upload(e.target.files?.[0]);e.target.value='';}}/></label>
  <p className="muted">JPEG, PNG or WebP · up to 8 MB</p>
  {draft&&<div className="photo-adjustment">
   <div className="arena-photo-crop" role="group" tabIndex={busy?-1:0} aria-label="Drag photo to reposition. You can also use the arrow keys."
    onKeyDown={e=>{const directions:Record<string,number[]>={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]};const d=directions[e.key];if(d&&!busy){e.preventDefault();move(position.x+d[0],position.y+d[1]);}}}
    onPointerDown={e=>{if(busy)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,ox:position.x,oy:position.y};}}
    onPointerMove={e=>{if(!drag.current||busy)return;const ratio=384/e.currentTarget.clientWidth;move(drag.current.ox+(e.clientX-drag.current.x)*ratio,drag.current.oy+(e.clientY-drag.current.y)*ratio);}}
    onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null} onLostPointerCapture={()=>drag.current=null}>
    <canvas ref={canvas} width={384} height={384}/><span className="arena-crop-guide" aria-hidden="true"/>
   </div>
   <p className="muted">Drag to adjust your photo. Zoom in for a closer crop.</p>
   <label className="photo-zoom">Zoom<input disabled={busy} aria-label="Photo zoom" type="range" min="1" max="3" step="0.01" value={zoom} onChange={e=>{setZoom(Number(e.target.value));setPosition({x:0,y:0});}}/></label>
   <div className="photo-confirm-actions"><button type="button" disabled={busy} onClick={cancel}>Cancel</button><button type="button" className="confirm-photo" disabled={busy} onClick={()=>void confirm()}>{busy?'Saving…':'Confirm'}</button></div>
  </div>}
  {message&&<p role="status">{message}</p>}
 </div></div>;
}
