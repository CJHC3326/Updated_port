(function(){
  // ---- Intro sequence ----
  var intro = document.getElementById('introOverlay');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    intro.style.display='none';
  } else {
    var lines = intro.querySelectorAll('.intro-line');
    lines.forEach(function(l,i){ setTimeout(function(){ l.classList.add('on'); }, i*380); });
    setTimeout(function(){
      intro.classList.add('fade-out');
      setTimeout(function(){ intro.style.display='none'; }, 550);
    }, lines.length*380 + 500);
  }

  // ---- Mobile nav ----
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  toggle.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
  });

  // ---- Active nav link on scroll ----
  var sections = ['home','about','skills','projects','experience','contact'].map(function(id){ return document.getElementById(id); });
  var navLinks = Array.from(nav.querySelectorAll('a'));
  function onScroll(){
    var pos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function(s){ if(s && s.offsetTop <= pos) current = s; });
    navLinks.forEach(function(l){
      l.classList.toggle('active', l.getAttribute('href') === '#'+current.id);
    });
    document.getElementById('toTop').classList.toggle('show', window.scrollY > 600);
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  document.getElementById('toTop').addEventListener('click', function(){
    window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'});
  });

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  // ---- Contact form -> mailto ----
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value;
    var email = document.getElementById('cf-email').value;
    var msg = document.getElementById('cf-message').value;
    var subject = encodeURIComponent('Portfolio contact from ' + name);
    var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:your.email@example.com?subject=' + subject + '&body=' + body;
  });

  // ---- Project modal ----
  var projects = {
    p1: {
      tag:'Networking',
      title:'Home Lab Network Segmentation',
      role:'Sole designer & builder',
      art: document.querySelector('[data-project="p1"] .project-art').innerHTML,
      desc:'Rebuilt a flat, single-subnet home network into a segmented lab environment. Split traffic into VLANs for trusted devices, IoT, and guest access, then wrote firewall rules to control what each zone could reach.',
      tech:['pfSense','VLANs','Managed switch','Zabbix'],
      highlights:['Isolated IoT devices from personal devices to reduce attack surface','Set up Zabbix to monitor uptime and alert on link failures','Documented the full topology and IP scheme for future changes']
    },
    p2: {
      tag:'Networking',
      title:'Small Office Wi-Fi & Topology Redesign',
      role:'Site surveyor & implementer',
      art: document.querySelector('[data-project="p2"] .project-art').innerHTML,
      desc:'Surveyed a small two-room office with persistent Wi-Fi dead zones and mixed guest/staff traffic on one flat network. Proposed and implemented a redesign: repositioned access points, tuned channel width, and separated traffic by VLAN.',
      tech:['Wireless site survey','VLAN tagging','DHCP scoping'],
      highlights:['Eliminated two confirmed dead zones through AP repositioning','Separated guest Wi-Fi from the internal staff network','Reduced support tickets related to dropped connections']
    },
    p3: {
      tag:'Networking + Frontend',
      title:'Network Uptime Dashboard',
      role:'End-to-end builder',
      art: document.querySelector('[data-project="p3"] .project-art').innerHTML,
      desc:'A personal project bridging both sides of my skill set: a lightweight web dashboard that polls devices on my home lab and visualizes latency and uptime over time, instead of reading raw ping output in a terminal.',
      tech:['JavaScript','Chart.js','Fetch API','GitHub Pages'],
      highlights:['Built a polling script to collect ping/latency data on an interval','Rendered live-updating charts with Chart.js','Deployed as a static site on GitHub Pages']
    },
    p4: {
      tag:'Frontend',
      title:'Responsive Portfolio Build',
      role:'Designer & developer',
      art: document.querySelector('[data-project="p4"] .project-art').innerHTML,
      desc:'An earlier portfolio site built to practice core frontend fundamentals before this one: semantic HTML structure, a CSS Grid-based layout system, and responsive breakpoints down to mobile.',
      tech:['HTML5','CSS Grid & Flexbox','Vanilla JavaScript'],
      highlights:['Built entirely without a framework to learn the fundamentals first','Practiced mobile-first responsive breakpoints','Used semantic HTML for better accessibility and SEO']
    }
  };

  var overlay = document.getElementById('modalOverlay');
  var modalArt = document.getElementById('modalArt');
  var modalBody = document.getElementById('modalBody');
  var lastFocused = null;

  function openModal(key){
    var p = projects[key];
    if(!p) return;
    modalArt.innerHTML = p.art;
    modalBody.innerHTML =
      '<div class="modal-tag">'+p.tag+'</div>'+
      '<h3 style="margin-top:8px;">'+p.title+'</h3>'+
      '<p>'+p.desc+'</p>'+
      '<div class="modal-section-label">My role</div>'+
      '<p style="margin-top:0;">'+p.role+'</p>'+
      '<div class="modal-section-label">Tools &amp; tech</div>'+
      '<div class="chip-row">'+p.tech.map(function(t){return '<span class="chip">'+t+'</span>';}).join('')+'</div>'+
      '<div class="modal-section-label">Highlights</div>'+
      '<ul>'+p.highlights.map(function(h){return '<li>'+h+'</li>';}).join('')+'</ul>';
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    document.getElementById('modalClose').focus();
  }
  function closeModal(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    if(lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.project-card').forEach(function(card){
    card.addEventListener('click', function(){ openModal(card.getAttribute('data-project')); });
  });
  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });
})();