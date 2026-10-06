/**
 * Daiana Pessoa Advocacia & Assessoria Jurídica
 * Main JavaScript Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });

    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    };

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMenu);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 2. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (questionBtn && content) {
      questionBtn.addEventListener('click', () => {
        const isOpen = content.classList.contains('open');

        // Close all other FAQs
        faqItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherContent && otherContent !== content) {
            otherContent.classList.remove('open');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        // Toggle current FAQ
        if (isOpen) {
          content.classList.remove('open');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          content.classList.add('open');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });

  // 3. Toast Notification Helper
  window.showToast = function (message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  // 4. Copy to Clipboard Utility
  window.copyText = function (text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || 'Copiado para a área de transferência!');
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  };

  function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Copiado com sucesso!');
    } catch (err) {
      showToast('Não foi possível copiar automaticamente.');
    }
    document.body.removeChild(textArea);
  }

  // 5. Native Share API
  window.shareWebsite = function () {
    const shareData = {
      title: 'Daiana Pessoa Advocacia & Assessoria Jurídica',
      text: 'Conheça o escritório Daiana Pessoa Advocacia em São José do Rio Preto - SP. Atendimento acolhedor, inclusivo e 24 horas.',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        if (err.name !== 'AbortError') {
          copyText(window.location.href, 'Link do site copiado para compartilhar!');
        }
      });
    } else {
      copyText(window.location.href, 'Link do site copiado para a área de transferência!');
    }
  };

  // 6. WhatsApp Floating Bubble Popover
  const waBubble = document.getElementById('waBubble');
  const waBubbleClose = document.getElementById('waBubbleClose');
  if (waBubble) {
    // Show after 4 seconds
    setTimeout(() => {
      waBubble.classList.remove('hidden');
      waBubble.classList.add('flex');
    }, 4000);

    if (waBubbleClose) {
      waBubbleClose.addEventListener('click', (e) => {
        e.stopPropagation();
        waBubble.classList.add('hidden');
        waBubble.classList.remove('flex');
      });
    }
  }

  // 7. Contact Form WhatsApp Dispatcher
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const area = document.getElementById('formArea').value;
      const message = document.getElementById('formMessage').value.trim();

      if (!name || !phone) {
        showToast('Por favor, preencha pelo menos seu nome e telefone.');
        return;
      }

      let waText = `Olá, Dra. Daiana Pessoa!\nMeu nome é *${name}*.\nMeu telefone/WhatsApp é: ${phone}.`;
      if (area) {
        waText += `\nÁrea de interesse: *${area}*.`;
      }
      if (message) {
        waText += `\n\n*Mensagem:* ${message}`;
      } else {
        waText += `\nGostaria de agendar uma consulta para entender melhor meu caso.`;
      }

      const encodedUrl = `https://wa.me/5517991072320?text=${encodeURIComponent(waText)}`;
      window.open(encodedUrl, '_blank');
      showToast('Redirecionando para o WhatsApp da Dra. Daiana...');
    });
  }

  // 8. Dynamic Navbar, Scroll Progress & Back-to-Top Handlers
  const navbar = document.getElementById('mainNavbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // 8.1 Barra de progresso de rolagem
    if (scrollProgress && docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      scrollProgress.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    // 8.2 Navbar scrolled state
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // 8.3 Botão voltar ao topo
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // 8.4 ScrollSpy: destacar link ativo conforme rolagem
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Clique no botão Voltar ao Topo
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 9. Contadores Numéricos Animados no Scroll (Stats Counter)
  const counterElements = document.querySelectorAll('.counter-number');
  let countersAnimated = false;

  const animateCounters = () => {
    counterElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = el.getAttribute('data-decimal') === 'true';
      const duration = 1800;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * easeOut;

        if (isDecimal) {
          el.textContent = currentValue.toFixed(1);
        } else {
          el.textContent = Math.floor(currentValue);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = isDecimal ? target.toFixed(1) : target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  if ('IntersectionObserver' in window && counterElements.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('estatisticas') || counterElements[0].closest('section');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  }

  // 10. Inicialização do AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      delay: 50
    });
  }

  // 11. Current Year in Footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
