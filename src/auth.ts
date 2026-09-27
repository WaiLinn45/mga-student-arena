export type Student = {name:string;nickname?:string;studentId:string;school:string;level:string;dob:string;enrolled:string;photo?:string|null;credits:number;attendance:number;participation:number;assignments:number};
export const demoStudent:Student={name:'Htet Wai Yan',nickname:'Harry',studentId:'STU-170112',school:'Bright Future Academy',level:'Foundation 1',dob:'12 Jan 2017',enrolled:'1 Sep 2026',credits:70,attendance:80,participation:3,assignments:75};
const api=import.meta.env.VITE_ARENA_API_URL?.replace(/\/$/,'');
export const loginConfigured=Boolean(api);
const previewSessionKey='mga_arena_preview_session';
export function previewLogin(_username:string,remember:boolean):Student{
 const student=sampleProfile();
 try{localStorage.removeItem(previewSessionKey);sessionStorage.removeItem(previewSessionKey);(remember?localStorage:sessionStorage).setItem(previewSessionKey,JSON.stringify(student));}catch{/* Login still works if storage is unavailable. */}
 return student;
}
export function restorePreview():Student|null{
 if(loginConfigured)return null;
 try{const saved=localStorage.getItem(previewSessionKey)||sessionStorage.getItem(previewSessionKey);return saved?sampleProfile():null;}catch{return null;}
}
export function clearPreview(){try{localStorage.removeItem(previewSessionKey);sessionStorage.removeItem(previewSessionKey);}catch{/* Storage may be unavailable. */}}
export async function request(path:string,body?:unknown){
 if(!api) throw new Error('Student sign-in is not available yet. Please contact your school administrator.');
 const response=await fetch(api+path,{method:body===undefined?'GET':'POST',credentials:'include',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
 if(!response.ok) throw new Error(response.status===401?'Please check your student ID and password.':'Unable to connect. Please try again or contact your school administrator.');
 return response.status===204?null:response.json();
}
export function parseStudent(value:unknown):Student{
 const s=value as Student;
 if(!s||!['name','studentId','school','level','dob','enrolled'].every(k=>typeof (s as unknown as Record<string,unknown>)[k]==='string')||!['credits','attendance','participation','assignments'].every(k=>Number.isFinite((s as unknown as Record<string,unknown>)[k]))) throw new Error('Your profile could not be loaded. Please contact your school administrator.');
 return {name:s.name,nickname:s.nickname,studentId:s.studentId,school:s.school,level:s.level,dob:s.dob,enrolled:s.enrolled,credits:s.credits,attendance:s.attendance,participation:s.participation,assignments:s.assignments,photo:s.photo};
}
export function sampleProfile():Student{
 let photo: string|null|undefined;
 try{const saved=localStorage.getItem('mga_arena_photo_'+demoStudent.studentId);if(saved)photo=JSON.parse(saved);}catch{}
 return {...demoStudent,photo};
}
export async function saveStudentPhoto(student:Student,photo:string|null):Promise<Student>{
 if(loginConfigured){const result=await request('/profile/photo',{photo});return parseStudent(result.student);}
 localStorage.setItem('mga_arena_photo_'+student.studentId,JSON.stringify(photo));
 return {...student,photo};
}
