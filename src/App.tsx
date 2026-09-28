import {useEffect,useState} from 'react';
import {Home,Gamepad2,BarChart3,Trophy,BookOpen,LogOut,Sun,Moon,GraduationCap,School,Users,FileText,Clock,Flame,Zap,Lock,Menu,X,Medal,Calendar,Sparkles,Camera} from 'lucide-react';
import Login from './Login';
import PhotoEditor,{Avatar} from './Photo';
import {clearPreview,restorePreview,loginConfigured,parseStudent,request,type Student} from './auth';

type Page='Overview'|'Play Games'|'My Stats'|'Leaderboard'|'Learning';
const nav=[['Overview',Home],['Play Games',Gamepad2],['My Stats',BarChart3],['Leaderboard',Trophy],['Learning',BookOpen]] as const;

function Soon(){return <span className="soon"><Lock size={11}/> Coming soon</span>}

function Brand({dark=false}:{dark?:boolean}){
 return <div className="brand"><img src={'/assets/mga-logo-mark'+(dark?'-dark':'')+'.png'} alt=""/><img className="wordmark" src={'/assets/mga-wordmark-slogan'+(dark?'-dark':'')+'.png'} alt="Maths Genius Academy — Think Smart, Solve Fast, Be a Genius"/></div>;
}

function DailyQuest(){
 return <section className="panel daily-quest-panel">
  <div className="daily-quest-card">
   <div className="daily-quest-info">
    <div className="daily-quest-tag"><Sparkles size={14}/><span>Daily Quest / Hero Challenge</span></div>
    <h3>Mental Math Master</h3>
    <p>Sharpen your focus & speed · Solve 10 quick problems in 5 minutes!</p>
    <div className="daily-quest-rewards">
     <span>Reward:</span>
     <span className="reward-chip xp"><Zap size={13}/> 50 XP</span>
     <span className="reward-chip coin">🪙 15 Coins</span>
    </div>
    <button type="button" className="quest-start-btn">Start Challenge →</button>
   </div>
   <div className="daily-quest-art">
    <img src="/assets/daily-math-quest.jpg" alt="Daily Math Quest 3D Art" />
   </div>
  </div>
 </section>;
}

function Academic({student:s}:{student:Student}){
 return <section className="panel"><div className="section-title"><h2><BookOpen/> Academic Journey</h2><span>Every small step counts.</span></div><div className="stats">{[[GraduationCap,'Credits',s.credits],[Users,'Attendance',s.attendance+'%'],[BarChart3,'Participation',s.participation+'/5'],[FileText,'Assignments',s.assignments+'%']].map(([Icon,label,value])=>{const Symbol=Icon as typeof Trophy;return <article className="stat" key={String(label)}><Symbol/><div><span>{String(label)}</span><strong>{String(value)}</strong></div></article>})}</div></section>;
}

function Stats(){
 return <section className="panel"><div className="section-title"><h2><Gamepad2/> My Game Stats</h2><Soon/></div><div className="stats">{[[Trophy,'Rank'],[Clock,'Played Time'],[BarChart3,'Level'],[Flame,'Daily Streak']].map(([Icon,label])=>{const Symbol=Icon as typeof Trophy;return <article className="stat" key={String(label)}><Symbol/><div><span>{String(label)}</span><strong>—</strong></div></article>})}</div><p className="muted footnote">Your game progress will appear here when games launch.</p></section>;
}

function Games(){
 return <section className="panel"><div className="section-title"><h2><Gamepad2/> Play on Web</h2><span>Fun games. Sharper minds.</span></div><div className="game-grid"><article className="game flash"><div><div className="game-badge">⚡ Mental Speed</div><h3>Flash Game</h3><p>Sharpen your mental maths with fast-paced numbers.<br/>Play in your browser.</p><Soon/></div><img className="game-3d-img" src="/assets/flash-math-icon.jpg" alt="Flash Math" /></article><article className="game abacus"><div><div className="game-badge">🧮 Focus Master</div><h3>Abacus Game</h3><p>Build focus and number sense with interactive beads.<br/>Play in your browser.</p><Soon/></div><img className="game-3d-img" src="/assets/abacus-3d-icon.jpg" alt="Abacus Challenge" /></article></div></section>;
}

function Learning(){
 return <section className="panel"><div className="section-title"><h2><BookOpen/> Learning</h2><span>A little more, every day.</span></div><div className="learning-grid">{[[BookOpen,'Resources','Helpful learning materials'],[Calendar,'Classes','Your schedule and lessons'],[FileText,'Assignments','Your next learning steps']].map(([Icon,title,sub])=>{const Symbol=Icon as typeof Trophy;return <article key={String(title)}><Symbol/><h3>{String(title)}</h3><p>{String(sub)}</p><Soon/></article>})}</div></section>;
}

function Leaderboard({student:s}:{student:Student}){
 return <section className="panel leaderboard"><header><div><h2><Trophy/> Leaderboard</h2><p>Integration coming soon</p></div><span className="top100">TOP 100</span></header><div className="leader-content"><div className="segmented" aria-label="Game filter preview"><button disabled><Zap size={15}/> Flash</button><button disabled><Gamepad2 size={15}/> Abacus</button></div><div className="segmented"><button disabled>Weekly</button><button disabled>All time</button></div><div className="ranking-scroll" tabIndex={0} role="region" aria-label="Leaderboard preview"><table><thead><tr>{['#','Player','Level','Time','Streak'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{Array.from({length:7},(_,i)=><tr key={i} className={'place-'+(i+1)}><td>{i<3?<span className="medal"><Medal size={22}/><b>{i+1}</b></span>:i+1}</td><td><span className="player"><Avatar student={s}/> Player {String(i+1).padStart(2,'0')}</span></td><td>—</td><td>—</td><td>—</td></tr>)}</tbody></table></div><div className="your-position"><small>YOUR POSITION</small><div><Avatar student={s}/><span><b>{s.nickname||s.name}</b><strong>Unranked</strong><small>Earn your place when games launch.</small></span></div></div><button className="top-button" disabled><Lock size={16}/> View Top 100 · Coming soon</button><p className="footnote muted">Preview only · No live rankings yet</p></div></section>;
}

export default function App(){
 const [theme,setTheme]=useState<'light'|'dark'>(()=>{try{return localStorage.getItem('mga_arena_theme')==='dark'?'dark':'light'}catch{return 'light'}}),[student,setStudent]=useState<Student|null>(restorePreview),[page,setPage]=useState<Page>('Overview'),[menu,setMenu]=useState(false),[loading,setLoading]=useState(loginConfigured),[error,setError]=useState(''),[photoModal,setPhotoModal]=useState(false);
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
    <span className="sidebar-arena-title">STUDENT ARENA</span>
    <button className="mobile-close" aria-label="Close navigation" onClick={()=>setMenu(false)}><X/></button>
   </div>
   
   <nav aria-label="Student Arena">
    {nav.map(([label,Icon])=><button key={label} aria-current={page===label?'page':undefined} className={page===label?'selected':''} onClick={()=>{setPage(label);setMenu(false);window.scrollTo(0,0)}}><Icon size={20}/><span>{label}</span>{label!=='Overview'&&<small>Soon</small>}</button>)}
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
     <button className="header-avatar-btn" title="Click to update photo" onClick={()=>setPhotoModal(true)} aria-label="Change profile photo">
      <Avatar student={student}/>
      <span className="avatar-edit-badge"><Camera size={11}/></span>
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

    <div className="header-right-block">
     <div className="header-streak-badge" title="Daily Activity Streak">
      <Flame size={17} className="flame-icon"/>
      <span><b>7</b> Days Streak</span>
     </div>
     <div className="header-welcome-text">
      <b>Welcome back, {student.nickname||student.name.split(' ')[0]}!</b>
      <p>Keep learning, keep growing.</p>
     </div>
    </div>
   </header>

   {/* Ambient Light Bar Divider */}
   <div className="ambient-light-bar" aria-hidden="true"/>

   {/* Student Arena Sub-Bar below Divider */}
   <div className="arena-subbar">
    <div className="arena-subbar-main">
     <span className="arena-subbar-kicker">STUDENT ARENA</span>
     <h1 className="arena-subbar-heading">{page==='Overview'?'My Arena':page}</h1>
    </div>
    <p className="arena-subbar-slogan">Think Smart, Solve Fast, Be a Genius</p>
   </div>

   {/* Main Content Area */}
   <main id="arena-main" className="main-content">
    {error&&<p role="alert">{error}</p>}

    {page==='Overview'?(
     <div className="overview-grid">
      <div className="content-stack">
       <DailyQuest/>
       <Academic student={student}/>
       <Stats/>
       <Games/>
       <Learning/>
      </div>
      <Leaderboard student={student}/>
     </div>
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

  {/* Profile Photo Update Modal */}
  {photoModal&&(
   <div className="photo-modal-backdrop" onClick={()=>setPhotoModal(false)}>
    <div className="photo-modal-dialog" onClick={e=>e.stopPropagation()}>
     <div className="photo-modal-header">
      <h3>Update Profile Photo</h3>
      <button className="photo-modal-close" onClick={()=>setPhotoModal(false)} aria-label="Close dialog"><X size={18}/></button>
     </div>
     <div className="photo-modal-body">
      <PhotoEditor student={student} onChange={s=>{setStudent(s);setPhotoModal(false);}}/>
     </div>
    </div>
   </div>
  )}
 </div>;
}
