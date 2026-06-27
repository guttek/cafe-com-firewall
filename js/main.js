/* ============================================================
   Café com Firewall — main.js
   Interatividade: menu, scroll reveal, quiz, validação, barras, glossário
   ============================================================ */

/* ---------- 1. MENU HAMBURGER ---------- */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('aberto');
    navLinks.classList.toggle('aberto');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('aberto'));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('aberto');
      navLinks.classList.remove('aberto');
    });
  });
}

/* ---------- 2. ACTIVE LINK ---------- */
(function() {
  const pag = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === pag) a.classList.add('ativo');
  });
})();

/* ---------- 3. SCROLL REVEAL nos cards ---------- */
(function() {
  const els = document.querySelectorAll('.card-post, .stat, .card-equipe, .item-glossario, .destaque');
  if (!els.length) return;

  if (!document.getElementById('reveal-css')) {
    const s = document.createElement('style');
    s.id = 'reveal-css';
    s.textContent = `
      .card-post,.stat,.card-equipe,.item-glossario,.destaque{opacity:0;transform:translateY(18px);}
      @keyframes surgir{to{opacity:1;transform:none;}}
    `;
    document.head.appendChild(s);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'surgir .45s ease forwards';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
})();

/* ---------- 4. CONTAGEM ANIMADA (stats) ---------- */
(function() {
  const nums = document.querySelectorAll('[data-conta]');
  if (!nums.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const fim = +el.dataset.conta;
      const suf = el.dataset.suf || '';
      let cur = 0;
      const passo = fim / (1400 / 16);
      const t = setInterval(() => {
        cur = Math.min(cur + passo, fim);
        el.textContent = Math.floor(cur) + suf;
        if (cur >= fim) clearInterval(t);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => obs.observe(n));
})();

/* ---------- 5. BARRAS DE HABILIDADE ---------- */
(function() {
  const fills = document.querySelectorAll('.barra-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w;
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();

/* ---------- 6. VALIDAÇÃO DO FORMULÁRIO ---------- */
(function() {
  const form = document.getElementById('formContato');
  if (!form) return;

  const regras = {
    nome:      { min: 2,  msg: 'Informe seu nome (mínimo 2 letras).' },
    email:     { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'E-mail inválido.' },
    assunto:   { min: 1,  msg: 'Selecione um assunto.' },
    mensagem:  { min: 20, msg: 'Escreva pelo menos 20 caracteres.' },
  };

  function checar(id, valor) {
    const r = regras[id];
    if (!r) return true;
    if (r.regex) return r.regex.test(valor.trim());
    return valor.trim().length >= r.min;
  }

  function estado(grupo, ok, msg) {
    grupo.classList.toggle('com-erro', !ok);
    grupo.classList.toggle('valido', ok);
    const el = grupo.querySelector('.erro');
    if (el) el.textContent = msg || '';
  }

  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('blur', () => {
      const g = el.closest('.grupo');
      estado(g, checar(el.id, el.value), regras[el.id]?.msg);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let tudo = true;
    Object.keys(regras).forEach(id => {
      const el = form.querySelector('#' + id);
      const g  = el?.closest('.grupo');
      if (!el || !g) return;
      const ok = checar(id, el.value);
      estado(g, ok, regras[id].msg);
      if (!ok) tudo = false;
    });
    if (tudo) {
      const toast = document.getElementById('toast');
      if (toast) toast.style.display = 'block';
      form.reset();
      form.querySelectorAll('.grupo').forEach(g => g.classList.remove('com-erro', 'valido'));
    }
  });
})();

/* ---------- 7. QUIZ ---------- */
(function() {
  const el = document.getElementById('quiz');
  if (!el) return;

  const perguntas = [
    {
      p: 'O que é Phishing?',
      ops: [
        'Um tipo de vírus que apaga arquivos',
        'Uma técnica de engenharia social que usa e-mails falsos para roubar dados',
        'Um ataque que sobrecarrega servidores',
        'Um método de criptografia de senhas',
      ],
      certa: 1,
      exp: 'Phishing usa mensagens falsas (e-mail, SMS, WhatsApp) fingindo ser uma empresa real para enganar você e roubar sua senha ou dados.',
    },
    {
      p: 'O que significa "Engenharia Social" em cybersegurança?',
      ops: [
        'Construir redes elétricas seguras',
        'Programar sistemas de segurança',
        'Manipular pessoas psicologicamente para obter informações confidenciais',
        'Instalar firewalls em servidores',
      ],
      certa: 2,
      exp: 'Engenharia Social não explora tecnologia, mas pessoas! O atacante se passa por alguém de confiança para te convencer a revelar senhas ou acessos.',
    },
    {
      p: 'O que faz um Firewall?',
      ops: [
        'Acelera a conexão com a internet',
        'Filtra e controla o tráfego de rede, bloqueando acessos não autorizados',
        'Criptografa arquivos do computador',
        'Remove vírus do sistema operacional',
      ],
      certa: 1,
      exp: 'O Firewall funciona como um porteiro digital: ele analisa cada pacote de dados que entra e sai da rede e bloqueia o que não é permitido.',
    },
    {
      p: 'O que é um ataque de força bruta (brute force)?',
      ops: [
        'Invadir fisicamente um servidor',
        'Tentar adivinhar uma senha testando todas as combinações possíveis',
        'Desligar servidores remotamente',
        'Instalar um vírus via e-mail',
      ],
      certa: 1,
      exp: 'Brute force testa automaticamente milhares de combinações de senha até acertar. Por isso senhas longas e complexas são tão importantes!',
    },
    {
      p: 'Qual prática aumenta sua segurança online de forma mais eficaz?',
      ops: [
        'Usar a mesma senha em todos os sites para não esquecer',
        'Desligar o antivírus para o computador ficar mais rápido',
        'Usar senhas únicas e longas + autenticação em dois fatores (2FA)',
        'Não criar conta em redes sociais',
      ],
      certa: 2,
      exp: 'Senhas únicas e 2FA são as melhores defesas! Se um site vazar sua senha, os outros continuam protegidos. Com 2FA, mesmo que sua senha seja roubada, o atacante não consegue entrar.',
    },
  ];

  let atual = 0, pontos = 0, respondeu = false;

  function renderizar() {
    if (atual >= perguntas.length) {
      el.innerHTML = `
        <div class="quiz-placar">☕ ${pontos}/${perguntas.length} acertos</div>
        <p style="text-align:center;color:var(--muted);font-size:.9rem;font-family:var(--mono)">
          ${pontos >= 4 ? '🔥 Incrível! Você manda bem em segurança!' :
            pontos >= 2 ? '📚 Bom começo! Continue aprendendo.' :
            '☕ Calma, tome um café e estude mais um pouco!'}
        </p>
        <div style="text-align:center;margin-top:1.25rem">
          <button class="btn btn-outline" onclick="location.reload()">Tentar novamente</button>
        </div>`;
      return;
    }

    const q = perguntas[atual];
    respondeu = false;
    el.innerHTML = `
      <div class="quiz-prog">Pergunta ${atual + 1} de ${perguntas.length}</div>
      <div class="quiz-pergunta">${q.p}</div>
      <div class="quiz-opcoes">
        ${q.ops.map((o, i) => `<button class="quiz-opcao" data-i="${i}">${o}</button>`).join('')}
      </div>
      <div class="quiz-feedback" id="fb"></div>`;

    el.querySelectorAll('.quiz-opcao').forEach(btn => {
      btn.addEventListener('click', function() {
        if (respondeu) return;
        respondeu = true;
        const i  = +this.dataset.i;
        const fb = document.getElementById('fb');
        el.querySelectorAll('.quiz-opcao').forEach(b => b.disabled = true);
        if (i === q.certa) {
          this.classList.add('certa');
          pontos++;
          fb.style.color = 'var(--ok)';
          fb.textContent = '✓ Correto! ' + q.exp;
        } else {
          this.classList.add('errada');
          el.querySelectorAll('.quiz-opcao')[q.certa].classList.add('certa');
          fb.style.color = 'var(--erro)';
          fb.textContent = '✗ Quase! ' + q.exp;
        }
        fb.style.display = 'block';
        setTimeout(() => { atual++; renderizar(); }, 2500);
      });
    });
  }
  renderizar();
})();

/* ---------- 8. BUSCA NO GLOSSÁRIO ---------- */
(function() {
  const campo = document.getElementById('buscaGlossario');
  if (!campo) return;
  campo.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.item-glossario').forEach(item => {
      item.classList.toggle('escondido', !item.textContent.toLowerCase().includes(q));
    });
  });
})();
