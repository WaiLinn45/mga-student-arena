import {useEffect,useState} from 'react';
import {Home,Gamepad2,BarChart3,Trophy,BookOpen,UserRound,LogOut,Sun,Moon,GraduationCap,School,Users,FileText,Clock,Flame,Zap,Lock,Menu,X,Medal,Calendar} from 'lucide-react';
import Login from './Login';
import PhotoEditor,{Avatar} from './Photo';
import {clearPreview,restorePreview,loginConfigured,parseStudent,request,type Student} from './auth';

type Page='Overview'|'Play Games'|'My Stats'|'Leaderboard'|'Learning'|'My Profile';
const nav=[['Overview',Home],['Play Games',Gamepad2],['My Stats',BarChart3],['Leaderboard',Trophy],['Learning',BookOpen],['My Profile',UserRound]] as const;

const mockPlayers=[
 {name:'Kaung Khant',level:'18',time:'12m',streak:'15',color:'#2563eb'},
 {name:'Hsu Myat Noe',level:'17',time:'14m',streak:'12',color:'#7c3aed'},
 {name:'Aung Thura',level:'16',time:'15m',streak:'10',color:'#059669'},
 {name:'May Phoo Han',level:'15',time:'18m',streak:'9',color:'#d97706'},
 {name:'Min Khant Kyaw',level:'14',time:'20m',streak:'8',color:'#dc2626'},
 {name:'Thet Htar San',level:'13',time:'22m',streak:'7',color:'#0891b2'},
 {name:'Kyaw Swar Win',level:'12',time:'25m',streak:'5',color:'#4b5563'},
];

function Soon(){return <span className="soon"><Lock size={11}/> Coming soon</span>}

function Brand({dark=false}:{dark?:boolean}){
 return <div className="brand"><img src={'/assets/mga-logo-mark'+(dark?'-dark':'')+'.png'} alt=""/><img className="wordmark" src={'/assets/mga-wordmark-slogan'+(dark?'-dark':'')+'.png'} alt="Maths Genius Academy — Think Smart, Solve Fast, Be a Genius"/></div>;
}

function Academic({student:s}:{student:Student}){
 return <section className="panel"><div className="section-title"><h2><BookOpen/> Academic Journey</h2><span>Every small step counts.</span></div><div className="stats">{[[GraduationCap,'Credits',s.credits],[Users,'Attendance',s.attendance+'%'],[BarChart3,'Participation',s.participation+'/5'],[FileText,'Assignments',s.assignments+'%']].map(([Icon,label,value])=>{const Symbol=Icon as typeof Trophy;return <article className="stat" key={String(label)}><Symbol/><div><span>{String(label)}</span><strong>{String(value)}</strong></div></article>})}</div></section>;
}

function Stats(){
 return <section className="panel"><div className="section-title"><h2><Gamepad2/> My Game Stats</h2><Soon/></div><div className="stats">{[[Trophy,'Rank'],[Clock,'Played Time'],[BarChart3,'Level'],[Flame,'Daily Streak']].map(([Icon,label])=>{const Symbol=Icon as typeof Trophy;return <article className="stat" key={String(label)}><Symbol/><div><span>{String(label)}</span><strong>—</strong></div></article>})}</div><p className="muted footnote">Your game progress will appear here when games launch.</p></section>;
}

function Games(){
 return <section className="panel"><div className="section-title"><h2><Gamepad2/> Play on Web</h2><span>Fun games. Sharper minds.</span></div><div className="game-grid"><article className="game flash"><div><h3>Flash Game</h3><p>Sharpen your mental maths.<br/>Play in your browser.</p><Soon/></div><Zap className="game-art" aria-hidden="true"/></article><article className="game abacus"><div><h3>Abacus Game</h3><p>Build focus and number sense.<br/>Play in your browser.</p><Soon/></div><div className="abacus-art" aria-hidden="true">{[0,1,2,3].map(i=><div key={i}>{[0,1,2].map(j=><i key={j}/>)}</div>)}</div></article></div></section>;
}

function Learning(){
 return <section className="panel"><div className="section-title"><h2><BookOpen/> Learning</h2><span>A little more, every day.</span></div><div className="learning-grid">{[[BookOpen,'Resources','Helpful learning materials'],[Calendar,'Classes','Your schedule and lessons'],[FileText,'Assignments','Your next learning steps']].map(([Icon,title,sub])=>{const Symbol=Icon as typeof Trophy;return <article key={String(title)}><Symbol/><h3>{String(title)}</h3><p>{String(sub)}</p><Soon/></article>})}</div></section>;
}

function Leaderboard({student:s}:{student:Student}){
 return <section className="panel leaderboard">
  <header>
   <div><h2><Trophy/> Leaderboard</h2><p>Integration coming soon</p></div>
   <span className="top100">TOP 100</span>
  </header>
  <div className="leader-content">
   <div className="segmented" aria-label="Game filter preview"><button disabled><Zap size={15}/> Flash</button><button disabled><Gamepad2 size={15}/> Abacus</button></div>
   <div className="segmented"><button disabled>Weekly</button><button disabled>All time</button></div>
   <div className="ranking-scroll" tabIndex={0} role="region" aria-label="Leaderboard preview">
    <table>
     <thead>
      <tr>{['#','Player','Level','Time','Streak'].map(x=><th key={x}>{x}</th>)}</tr>
     </thead>
     <tbody>
      {mockPlayers.map((p,i)=><tr key={p.name} className={'place-'+(i+1)}>
       <td>{i<3?<span className="medal"><Medal size={22}/><b>{i+1}</b></span>:i+1}</td>
       <td>
        <span className="player">
         <span className="leader-avatar" style={{backgroundColor:p.color}}>{p.name.charAt(0)}</span>
         <span>{p.name}</span>
        </span>
       </td>
       <td>{p.level}</td>
       <td>{p.time}</td>
       <td>{p.streak}</td>
      </tr>)}
     </tbody>
    </table>
   </div>
   <div className="your-position">
    <small>YOUR POSITION</small>
    <div>
     <Avatar student={s}/>
     <span><b>{s.nickname||s.name}</b><strong>Unranked</strong><small>Earn your place when games launch.</small></span>
    </div>
   </div>
   <button className="top-button" disabled><Lock size={16}/> View Top 100 · Coming soon</button>
   <p className="footnote muted">Preview only · No live rankings yet</p>
  </div>
 </section>;
}

function Profile({student:s,onChange}:{student:Student;onChange:(s:Student)=>void}){
 return <section className="panel profile">
  <h2>My Profile</h2>
  <PhotoEditor student={s} onChange={onChange}/>
  <div className="profile-grid">
   <section>
    <h3>Student information</h3>
    <dl>{[['Full name',s.name],['Nickname',s.nickname||'Not provided'],['Student ID',s.studentId],['Date of birth',s.dob],['School',s.school],['Class',s.level],['Enrolled',s.enrolled]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
   </section>
   <section>
    <h3>Academic Journey</h3>
    <dl>{[['Credits',s.credits],['Attendance',s.attendance+'%'],['Participation',s.participation+'/5'],['Assignments',s.assignments+'%']].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
   </section>
  </div>
 </section>;
}

export default function App(){
 const [theme,setTheme]=useState<'light'|'dark'>(()=>{try{return localStorage.getItem('mga_arena_theme')==='dark'?'dark':'light'}catch{return 'light'}}),[student,setStudent]=useState<Student|null>(restorePreview),[page,setPage]=useState<Page>('Overview'),[menu,setMenu]=useState(false),[loading,setLoading]=useState(loginConfigured),[error,setError]=useState('');
 const mainSiteUrl=import.meta.env.VITE_MGA_WEBSITE_URL||(import.meta.env.DEV?'http://127.0.0.1:3001/#top':'https://'+window.location.hostname.replace(/^arena\./,''));

 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('mga_arena_theme',theme)}catch{/* Theme still works without storage. */}},[theme]);
 useEffect(()=>{let active=true;if(loginConfigured)request('/session').then(r=>{if(active)setStudent(parseStudent(r.student))}).catch(()=>{}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[]);

 async function logout(){try{if(loginConfigured)await request('/logout',{});clearPreview();setStudent(null);setPage('Overview');setMenu(false);setError('')}catch{setError('Could not sign out. Please check your connection and try again.')}}

 if(loading)return <main className="loading" role="status">Opening your Arena…</main>;
 if(!student)return <><header className="login-header arena-login-header"><div className="arena-header-inner"><a className="arena-login-brand" href={mainSiteUrl} aria-label="Maths Genius Academy"><Brand dark={theme==='dark'}/></a><div className="arena-login-title" aria-label="Student Arena"><i aria-hidden="true"/><span>Student Arena</span><i aria-hidden="true"/></div><div className="arena-login-actions"><a href={mainSiteUrl}><span aria-hidden="true">←</span> Back to MGA</a><button className="arena-theme-toggle" onClick={()=>setTheme(t=>t==='light'?'dark':'light')} aria-label={'Switch to '+(theme==='light'?'dark':'light')+' mode' }><span aria-hidden="true">{theme==='dark'?'☾':'☀'}</span></button></div></div></header><Login onLogin={s=>{setStudent(s);setPage('Overview')}}/></>;

 return <div className="app-shell">
  <a href="#arena-main" className="skip-link">Skip to content</a>
  {menu&&<button className="nav-scrim" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
  
  {/* Sidebar */}
  <aside className={'sidebar '+(menu?'open':'')}>
   <div className="sidebar-brand">
    <Brand dark/>
    <button className="mobile-close" aria-label="Close navigation" onClick={()=>setMenu(false)}><X/></button>
   </div>
   
   <div className="ambient-light-bar sidebar-divider" aria-hidden="true"/>

   <div className="sidebar-arena-title">STUDENT ARENA</div>

   <nav aria-label="Student Arena">
    {nav.map(([label,Icon])=><button key={label} aria-current={page===label?'page':undefined} className={page===label?'selected':''} onClick={()=>{setPage(label);setMenu(false);window.scrollTo(0,0)}}><Icon size={20}/><span>{label}</span>{label!=='Overview'&&label!=='My Profile'&&<small>Soon</small>}</button>)}
   </nav>

   {/* Sidebar Bottom: Animated Dark Mode Switch & Sign Out */}
   <div className="sidebar-bottom">
    <button className={'theme-switch-btn '+theme} onClick={()=>setTheme(t=>t==='light'?'dark':'light')} aria-label={'Switch to '+(theme==='light'?'dark':'light')+' mode'}>
     <span className="switch-track">
      <span className="switch-thumb">
       {theme==='dark'?<Moon size={12}/>:<Sun size={12}/>}
      </span>
     </span>
     <span className="switch-label">{theme==='dark'?'Dark Mode':'Light Mode'}</span>
    </button>
    <button className="signout" onClick={logout}><LogOut size={18}/> Sign out</button>
   </div>
  </aside>

  {/* Main Workspace */}
  <div className="workspace">
   {/* Header containing Profile Info and Welcome Back */}
   <header className="topbar">
    <button className="mobile-menu" aria-label="Open navigation" aria-expanded={menu} onClick={()=>setMenu(v=>!v)}><Menu/></button>
    
    <div className="header-student-profile">
     <button className="header-avatar-btn" title="View Profile / Change Photo" onClick={()=>{setPage('My Profile');window.scrollTo(0,0);}} aria-label="View Profile">
      <Avatar student={student}/>
     </button>
     <div className="header-student-info">
      <div className="header-name-row">
       <span className="header-student-name">{student.name}</span>
       {student.nickname&&<span className="header-student-nickname">({student.nickname})</span>}
       <span className="header-student-id">{student.studentId}</span>
      </div>
      <div className="header-meta-tags">
       <span className="meta-tag"><School size={13}/>{student.school}</span>
       <span className="meta-tag"><GraduationCap size={13}/>{student.level}</span>
      </div>
     </div>
    </div>

    <div className="header-welcome-text">
     <b>Welcome back, {student.nickname||student.name.split(' ')[0]}!</b>
     <p>Keep learning, keep growing.</p>
    </div>
   </header>

   {/* Ambient Light Bar Divider */}
   <div className="ambient-light-bar" aria-hidden="true"/>

   {/* Main Content Area */}
   <main id="arena-main" className="main-content">
    {error&&<p role="alert">{error}</p>}

    {page==='Overview'?(
     <div className="overview-grid">
      <div className="content-stack">
       <Academic student={student}/>
       <Stats/>
       <Games/>
       <Learning/>
      </div>
      <Leaderboard student={student}/>
     </div>
    ):page==='My Profile'?(
     <Profile student={student} onChange={setStudent}/>
    ):page==='Leaderboard'?(
     <div className="leader-page"><Leaderboard student={student}/></div>
    ):page==='Play Games'?(
     <Games/>
    ):page==='My Stats'?(
     <Stats/>
    ):(
     <Learning/>
    )}

    <footer className="page-footer">
     Maths Genius Academy <span>Think Smart, Solve Fast, Be a Genius.</span>
    </footer>
   </main>
  </div>
 </div>;
}
