
    // ===== Utilities
    const $ = (q, el=document) => el.querySelector(q);
    const $$ = (q, el=document) => [...el.querySelectorAll(q)];

    // ===== Theme toggle with localStorage
    const themeToggle = $('#themeToggle');
    const setTheme = (mode) => {
      if(mode === 'light'){ document.body.classList.add('light'); }
      else { document.body.classList.remove('light'); }
      localStorage.setItem('theme', mode);
    };
    (()=>{
      const saved = localStorage.getItem('theme');
      if(saved){ setTheme(saved); }
    })();
    themeToggle.addEventListener('click', ()=>{
      const isLight = document.body.classList.contains('light');
      setTheme(isLight ? 'dark' : 'light');
    });

    // ===== Mobile menu
    const menuBtn = $('#menuBtn');
    const mobileMenu = $('#mobileMenu');
    menuBtn.addEventListener('click', ()=>{
      const open = mobileMenu.style.display === 'block';
      mobileMenu.style.display = open ? 'none' : 'block';
      menuBtn.setAttribute('aria-expanded', String(!open));
    });
    $$('#mobileMenu a').forEach(a=>a.addEventListener('click', ()=> mobileMenu.style.display='none'));

    // ===== Scroll spy for nav
    const sections = ['about','skills','projects','achievements','contact'];
    const navLinks = sections.map(id => document.querySelector(`nav a[href="#${id}"]`));
    const onScroll = () => {
      const fromTop = window.scrollY + 84;
      sections.forEach((id, i)=>{
        const sec = document.getElementById(id);
        if(!sec) return;
        const active = sec.offsetTop <= fromTop && (sec.offsetTop + sec.offsetHeight) > fromTop;
        navLinks[i].classList.toggle('active', active);
      });
    };
    document.addEventListener('scroll', onScroll, { passive:true });

    // ===== Back to top
    $('#backToTop').addEventListener('click', (e)=>{ e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); });

    // ===== Dynamic year
    $('#year').textContent = new Date().getFullYear();

    // ===== Skills bars animation
    const skillEls = $$('.skill');
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const level = entry.target.dataset.level;
          let bar = entry.target.querySelector('.bar');
          if(!bar){
            bar = document.createElement('div');
            bar.className = 'bar';
            const span = document.createElement('span');
            bar.appendChild(span);
            entry.target.appendChild(bar);
          }
          requestAnimationFrame(()=>{
            bar.firstElementChild.style.width = level + '%';
          });
        }
      })
    }, { threshold: .5 });
    skillEls.forEach(el=> observer.observe(el));

    // ===== Projects filter
    const filters = $$('.filter');
    const cards = $$('.card');
    filters.forEach(btn=>btn.addEventListener('click', ()=>{
      filters.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c=>{
        const show = f === 'all' || c.dataset.type === f;
        c.style.display = show ? 'block' : 'none';
      })
    }));

    // ===== Contact form (mailto + validation)
    const form = $('#contactForm');
    const status = $('#formStatus');
    const to = 'qurratul.ann.irshad@example.com'; // TODO: replace with your real email
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if(!data.name || !data.email || !data.message){
        status.textContent = 'Please fill all fields.'; status.style.color = 'var(--warn)'; return;
      }
      const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name}\n${data.email}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      status.textContent = 'Opening your email app…'; status.style.color = 'var(--ok)';
      form.reset();
    });
    $('#copyEmail').addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText(to); status.textContent='Email copied to clipboard!'; status.style.color='var(--ok)'; }
      catch{ status.textContent='Could not copy email.'; status.style.color='var(--warn)'; }
    });

    // ===== Small stat tweak: count visible cards
    const countProjects = ()=>{
      const n = $$('.card').filter(c=>c.style.display !== 'none').length;
      $('#stat-projects').textContent = String(n).padStart(2,'0');
    };
    const mo = new MutationObserver(countProjects); mo.observe($('.projects'), { childList:true, subtree:true, attributes:true, attributeFilter:['style'] });
    countProjects();
  