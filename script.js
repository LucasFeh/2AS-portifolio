        // Modal de imagem do carrossel
        document.addEventListener('DOMContentLoaded', function () {
            // Adiciona evento de clique nas imagens do carrossel
            document.querySelectorAll('.modal-image').forEach(function (img) {
                img.style.cursor = 'zoom-in';
                img.addEventListener('click', function () {
                    var modal = document.getElementById('carouselImageModal');
                    var modalImg = document.getElementById('carouselModalImg');
                    modalImg.src = img.src;
                    modal.style.display = 'flex';
                });
            });
            // Fecha o modal ao clicar no X ou fora da imagem
            document.getElementById('closeCarouselModal').onclick = function () {
                document.getElementById('carouselImageModal').style.display = 'none';
            };
            document.getElementById('carouselImageModal').addEventListener('click', function (e) {
                if (e.target === this) {
                    this.style.display = 'none';
                }
            });
        });
        // Variáveis para controle de scroll
        let isScrolling = false;
        let currentSectionIndex = 0;
        const sections = ['home', 'sobre', 'projetos', 'Cliente-section', 'contato', 'footer-section'];

        // Função para mostrar projetos (mantida)
        function showProjects(category) {
            // Esconder todas as categorias
            const categories = document.querySelectorAll('.project-category');
            categories.forEach(cat => {
                cat.style.display = 'none';
            });

            // Mostrar a categoria selecionada
            document.getElementById(category).style.display = 'block';

            // Remover classe active de todas as abas
            const tabs = document.querySelectorAll('.sidebar-tab');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });

            // Adicionar classe active na aba clicada
            event.target.classList.add('active');
        }

        // Função para scroll suave para seção
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                isScrolling = true;
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Atualizar o índice atual
                currentSectionIndex = sections.indexOf(sectionId);

                // Liberar o scroll após a animação
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }

        // Função para ir para próxima seção
        function goToNextSection() {
            if (currentSectionIndex < sections.length - 1) {
                currentSectionIndex++;
                scrollToSection(sections[currentSectionIndex]);
            }
        }

        // Função para ir para seção anterior
        function goToPrevSection() {
            if (currentSectionIndex > 0) {
                currentSectionIndex--;
                scrollToSection(sections[currentSectionIndex]);
            }
        }

        // Detectar seção ativa e atualizar pontos
        function updateActiveSection() {
            const dots = document.querySelectorAll('.scroll-dot');
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            sections.forEach((sectionId, index) => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentSectionIndex = index;
                        // Remove active de todos os pontos
                        dots.forEach(dot => dot.classList.remove('active'));
                        // Adiciona active no ponto atual
                        if (dots[index]) {
                            dots[index].classList.add('active');
                        }
                    }
                }
            });
        }

        // Controle do scroll do mouse
        function handleWheel(e) {
            // Verificar se o mouse está sobre um model-viewer
            const target = e.target;
            const modelViewer = target.closest('model-viewer');

            // Se estiver sobre um model-viewer
            if (modelViewer) {
                // Verificar se é o model-viewer demonstrativo (seção sobre)
                if (modelViewer.classList.contains('demo-viewer')) {
                    // Para o model-viewer demonstrativo, sempre fazer scroll de página
                    e.preventDefault();
                    if (isScrolling) return;

                    if (e.deltaY > 0) {
                        goToNextSection();
                    } else {
                        goToPrevSection();
                    }
                    return;
                }

                // Para outros model-viewers, permitir o zoom nativo
                return;
            }

            // Prevenir o scroll padrão apenas se não estiver sobre model-viewer
            e.preventDefault();

            // Se já estiver fazendo scroll, ignorar
            if (isScrolling) return;

            // Determinar direção do scroll
            if (e.deltaY > 0) {
                // Scroll para baixo - próxima seção
                goToNextSection();
            } else {
                // Scroll para cima - seção anterior
                goToPrevSection();
            }
        }

        // Atualizar links da navbar para usar scroll suave
        document.addEventListener('DOMContentLoaded', function () {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = this.getAttribute('href').substring(1);
                    scrollToSection(target);
                });
            });

            // Adicionar controle de scroll do mouse
            window.addEventListener('wheel', handleWheel, { passive: false });

            // Detectar mudanças no scroll (apenas para atualizar indicadores)
            window.addEventListener('scroll', updateActiveSection);

            // Atualizar seção ativa na inicialização
            updateActiveSection();

            // Controle por teclado (opcional)
            document.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                    e.preventDefault();
                    goToNextSection();
                } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                    e.preventDefault();
                    goToPrevSection();
                }
            });

            // Configurar model-viewers para permitir zoom
            setTimeout(() => {
                const modelViewers = document.querySelectorAll('model-viewer');
                modelViewers.forEach(viewer => {
                    // Pular o model-viewer demonstrativo
                    if (viewer.classList.contains('demo-viewer')) {
                        return;
                    }

                    // Garantir que o model-viewer pode capturar eventos de wheel
                    viewer.style.pointerEvents = 'auto';

                    // Adicionar atributos necessários para zoom se não existirem
                    if (!viewer.hasAttribute('camera-controls')) {
                        viewer.setAttribute('camera-controls', '');
                    }
                    if (!viewer.hasAttribute('disable-zoom')) {
                        // Remove disable-zoom se existir para permitir zoom
                        viewer.removeAttribute('disable-zoom');
                    }
                });
            }, 100);
        });

        // Animação dos ícones de clientes ao entrar/sair da seção
        document.addEventListener('DOMContentLoaded', function () {
            const clienteSection = document.getElementById('Cliente-section');
            const clientLogos = clienteSection ? clienteSection.querySelectorAll('.client-logo') : [];
            let clienteSectionVisible = false;

            function animateClientLogos(inView) {
                clientLogos.forEach((el, i) => {
                    setTimeout(() => {
                        if (inView) {
                            el.classList.add('animate-in');
                            el.classList.remove('animate-out');
                        } else {
                            el.classList.remove('animate-in');
                            el.classList.add('animate-out');
                        }
                    }, i * 80); // efeito cascata
                });
            }

            function isSectionInViewport(section) {
                const rect = section.getBoundingClientRect();
                return (
                    rect.top < window.innerHeight * 0.6 &&
                    rect.bottom > window.innerHeight * 0.2
                );
            }

            function onScrollClientes() {
                if (!clienteSection) return;
                const inView = isSectionInViewport(clienteSection);
                if (inView && !clienteSectionVisible) {
                    clienteSectionVisible = true;
                    animateClientLogos(true);
                } else if (!inView && clienteSectionVisible) {
                    clienteSectionVisible = false;
                    animateClientLogos(false);
                }
            }

            window.addEventListener('scroll', onScrollClientes);
            // Inicializa estado
            onScrollClientes();
        });