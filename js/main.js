"use strict";

/* =========================================================
   PRESÉPIO 2026
   MAIN.JS COMPLETO
   ========================================================= */

(() => {
    if (window.presepioMainInitialized) {
        return;
    }

    window.presepioMainInitialized = true;


    /* =====================================================
       CONFIGURAÇÃO
       ===================================================== */

    const CONFIG = {
        navbarScrollPoint: 80,

        revealThreshold: 0.08,

        revealMargin:
            "0px 0px -5% 0px",

        countdownDate:
            "2026-12-01T14:00:00+00:00",

        loaderDelay: 500,

        loaderRemovalDelay: 900
    };


    /* =====================================================
       ESTADO
       ===================================================== */

    const state = {
        lastScrollPosition:
            window.scrollY,

        scrollFrame:
            null,

        activeGalleryIndex:
            0,

        previousFocus:
            null,

        countdownTimer:
            null,

        loaderRemoved:
            false
    };


    /* =====================================================
       UTILITÁRIOS
       ===================================================== */

    function clamp(
        value,
        minimum = 0,
        maximum = 1
    ) {
        return Math.min(
            Math.max(value, minimum),
            maximum
        );
    }


    function formatTwoDigits(value) {
        return String(value).padStart(
            2,
            "0"
        );
    }


    function reducedMotionIsActive() {
        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    }


    /* =====================================================
       LOADER E PREPARAÇÃO DA PÁGINA
       ===================================================== */

    function preparePage() {
        document.body.classList.add(
            "page-loaded"
        );

        if (!reducedMotionIsActive()) {
            document.documentElement.classList.add(
                "motion-ready"
            );
        }
    }


    function removeLoader() {
        if (state.loaderRemoved) {
            return;
        }

        state.loaderRemoved = true;

        const loader =
            document.getElementById(
                "page-loader"
            );

        document.body.classList.add(
            "page-loaded"
        );

        if (!loader) {
            return;
        }

        loader.classList.add(
            "is-hidden"
        );

        loader.setAttribute(
            "aria-hidden",
            "true"
        );

        window.setTimeout(
            () => {
                loader.remove();
            },
            CONFIG.loaderRemovalDelay
        );
    }


    function initializeLoader() {
        window.setTimeout(
            removeLoader,
            CONFIG.loaderDelay
        );

        /*
         * Proteção final caso algum recurso
         * bloqueie o carregamento normal.
         */

        window.setTimeout(
            removeLoader,
            2000
        );
    }


    /* =====================================================
       BARRA DE PROGRESSO
       ===================================================== */

    const progressBar =
        document.getElementById(
            "scroll-progress-bar"
        );


    function updateScrollProgress() {
        if (!progressBar) {
            return;
        }

        const scrollableHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            scrollableHeight > 0
                ? clamp(
                    window.scrollY /
                    scrollableHeight
                )
                : 0;

        progressBar.style.transform =
            `scaleX(${progress})`;
    }


    /* =====================================================
       NAVBAR
       ===================================================== */

    const navbar =
        document.getElementById(
            "navbar"
        );


    function updateNavbar() {
        if (!navbar) {
            return;
        }

        const currentScroll =
            Math.max(
                window.scrollY,
                0
            );

        navbar.classList.toggle(
            "navbar-scrolled",
            currentScroll >
                CONFIG.navbarScrollPoint
        );

        const scrollingDown =
            currentScroll >
            state.lastScrollPosition;

        const scrollDifference =
            Math.abs(
                currentScroll -
                state.lastScrollPosition
            );

        const mobileMenuOpen =
            document.body.classList.contains(
                "mobile-menu-open"
            );

        if (
            scrollingDown &&
            currentScroll > 550 &&
            scrollDifference > 5 &&
            !mobileMenuOpen
        ) {
            navbar.classList.add(
                "navbar-hidden"
            );
        } else if (
            !scrollingDown ||
            currentScroll < 550
        ) {
            navbar.classList.remove(
                "navbar-hidden"
            );
        }

        state.lastScrollPosition =
            currentScroll;
    }


    /* =====================================================
       MENU MÓVEL
       ===================================================== */

    const mobileMenuButton =
        document.getElementById(
            "mobile-menu-button"
        );

    const mobileMenu =
        document.getElementById(
            "mobile-menu"
        );


    function setMobileMenu(open) {
        if (
            !mobileMenuButton ||
            !mobileMenu
        ) {
            return;
        }

        mobileMenuButton.classList.toggle(
            "is-active",
            open
        );

        mobileMenu.classList.toggle(
            "is-open",
            open
        );

        document.body.classList.toggle(
            "mobile-menu-open",
            open
        );

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            open
                ? "Fechar menu"
                : "Abrir menu"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            String(!open)
        );

        navbar?.classList.remove(
            "navbar-hidden"
        );
    }


    function initializeMobileMenu() {
        mobileMenuButton?.addEventListener(
            "click",
            () => {
                const open =
                    mobileMenu?.classList.contains(
                        "is-open"
                    ) || false;

                setMobileMenu(!open);
            }
        );

        document
            .querySelectorAll(
                ".mobile-menu a[href^='#']"
            )
            .forEach((link) => {
                link.addEventListener(
                    "click",
                    () => {
                        setMobileMenu(false);
                    }
                );
            });
    }


    /* =====================================================
       NAVEGAÇÃO SUAVE
       ===================================================== */

    function initializeSmoothNavigation() {
        document
            .querySelectorAll(
                "a[href^='#']"
            )
            .forEach((link) => {
                link.addEventListener(
                    "click",
                    (event) => {
                        const selector =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !selector ||
                            selector === "#"
                        ) {
                            return;
                        }

                        let target = null;

                        try {
                            target =
                                document.querySelector(
                                    selector
                                );
                        } catch {
                            return;
                        }

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        setMobileMenu(false);

                        target.scrollIntoView({
                            behavior:
                                reducedMotionIsActive()
                                    ? "auto"
                                    : "smooth",

                            block:
                                "start"
                        });

                        history.replaceState(
                            null,
                            "",
                            selector
                        );
                    }
                );
            });
    }


    /* =====================================================
       LINK ATIVO DA NAVBAR
       ===================================================== */

    function initializeActiveNavigation() {
        const links =
            Array.from(
                document.querySelectorAll(
                    ".nav-links a[href^='#']"
                )
            );

        if (
            !links.length ||
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        const sections =
            links
                .map((link) => {
                    const selector =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !selector ||
                        selector === "#"
                    ) {
                        return null;
                    }

                    try {
                        return document.querySelector(
                            selector
                        );
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean);

        const observer =
            new IntersectionObserver(
                (entries) => {
                    const visible =
                        entries
                            .filter(
                                (entry) =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (
                                    first,
                                    second
                                ) =>
                                    second
                                        .intersectionRatio -
                                    first
                                        .intersectionRatio
                            );

                    if (!visible.length) {
                        return;
                    }

                    const activeId =
                        visible[0]
                            .target
                            .id;

                    links.forEach((link) => {
                        link.classList.toggle(
                            "is-active",
                            link.getAttribute(
                                "href"
                            ) ===
                                `#${activeId}`
                        );
                    });
                },
                {
                    rootMargin:
                        "-34% 0px -54% 0px",

                    threshold: [
                        0,
                        0.1,
                        0.3,
                        0.6
                    ]
                }
            );

        sections.forEach((section) => {
            observer.observe(section);
        });
    }


    /* =====================================================
       REVELAÇÕES GERAIS
       ===================================================== */

    function initializeGeneralReveals() {
        const elements =
            Array.from(
                document.querySelectorAll(
                    "[data-reveal]"
                )
            );

        if (!elements.length) {
            return;
        }

        if (
            reducedMotionIsActive() ||
            !("IntersectionObserver" in window)
        ) {
            elements.forEach((element) => {
                element.classList.add(
                    "is-visible"
                );
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }
                    );
                },
                {
                    threshold:
                        CONFIG.revealThreshold,

                    rootMargin:
                        CONFIG.revealMargin
                }
            );

        elements.forEach((element) => {
            observer.observe(element);
        });
    }


   /* =========================================================
   EXPERIÊNCIA CINEMATOGRÁFICA LIGADA AO SCROLL
   ========================================================= */

function initializeExperienceEntrance() {
    const section =
        document.querySelector(
            ".experience-section"
        );

    if (!section) {
        return;
    }

    const image =
        section.querySelector(
            ".experience-image"
        );

    if (!image) {
        return;
    }

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    /*
     * Em tablet ou telemóvel, mantém a imagem estável
     * para evitar saltos durante o scroll.
     */

    function effectIsDisabled() {
        return (
            reducedMotion ||
            window.innerWidth <= 900
        );
    }

    let animationFrame =
        null;

    function updateExperienceEffect() {
        animationFrame = null;

        if (effectIsDisabled()) {
            section.style.setProperty(
                "--experience-progress",
                "1"
            );

            section.classList.add(
                "is-visible"
            );

            return;
        }

        const rectangle =
            section.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight;

        /*
         * O progresso começa quando o início da secção
         * entra no fundo do ecrã.
         *
         * Termina quando a secção percorreu
         * aproximadamente 85% do viewport.
         */

        const start =
            viewportHeight * 0.92;

        const distance =
            viewportHeight * 1.05;

        const rawProgress =
            (
                start -
                rectangle.top
            ) /
            distance;

        const progress =
            Math.min(
                Math.max(
                    rawProgress,
                    0
                ),
                1
            );

        section.style.setProperty(
            "--experience-progress",
            progress.toFixed(4)
        );

        section.classList.toggle(
            "is-visible",
            progress > 0.015
        );
    }

    function requestExperienceEffect() {
        if (animationFrame !== null) {
            return;
        }

        animationFrame =
            window.requestAnimationFrame(
                updateExperienceEffect
            );
    }

    section.classList.add(
        "experience-motion-ready"
    );

    section.style.setProperty(
        "--experience-progress",
        "0"
    );

    window.addEventListener(
        "scroll",
        requestExperienceEffect,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        requestExperienceEffect
    );

    requestExperienceEffect();
}
    /* =====================================================
       ENTRADA DOS DETALHES
       ===================================================== */

    function initializeDetailsEntrance() {
        const section =
            document.querySelector(
                ".details-section"
            );

        if (!section) {
            return;
        }

        if (reducedMotionIsActive()) {
            section.classList.add(
                "details-motion-ready",
                "is-visible"
            );

            return;
        }

        /*
         * Ativa o estado inicial da animação
         * dos Detalhes.
         */

        section.classList.add(
            "details-motion-ready"
        );

        section.classList.remove(
            "is-visible"
        );

        if (
            !("IntersectionObserver" in window)
        ) {
            section.classList.add(
                "is-visible"
            );

            return;
        }

        const observer =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach(
                        (entry) => {
                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            section.classList.add(
                                "is-visible"
                            );

                            observer.disconnect();
                        }
                    );
                },
                {
                    threshold:
                        0.06,

                    rootMargin:
                        "0px 0px -4% 0px"
                }
            );

        observer.observe(section);
    }


    /* =====================================================
       BRILHO INTERATIVO DOS CARTÕES
       ===================================================== */

    function initializeCardLighting() {
        const cards =
            document.querySelectorAll(
                ".stat-card, " +
                ".details-card, " +
                ".value-card, " +
                ".visit-card"
            );

        cards.forEach((card) => {
            card.addEventListener(
                "pointermove",
                (event) => {
                    const rectangle =
                        card.getBoundingClientRect();

                    const x =
                        (
                            (
                                event.clientX -
                                rectangle.left
                            ) /
                            rectangle.width
                        ) *
                        100;

                    const y =
                        (
                            (
                                event.clientY -
                                rectangle.top
                            ) /
                            rectangle.height
                        ) *
                        100;

                    card.style.setProperty(
                        "--pointer-x",
                        `${x}%`
                    );

                    card.style.setProperty(
                        "--pointer-y",
                        `${y}%`
                    );
                }
            );

            card.addEventListener(
                "pointerleave",
                () => {
                    card.style.removeProperty(
                        "--pointer-x"
                    );

                    card.style.removeProperty(
                        "--pointer-y"
                    );
                }
            );
        });
    }


    /* =====================================================
       VÍDEO PRINCIPAL
       ===================================================== */

    function initializeHeroVideo() {
        const heroVideo =
            document.getElementById(
                "hero-video"
            );

        if (!heroVideo) {
            return;
        }

        heroVideo.muted = true;
        heroVideo.defaultMuted = true;
        heroVideo.playsInline = true;

        heroVideo.setAttribute(
            "muted",
            ""
        );

        heroVideo.setAttribute(
            "playsinline",
            ""
        );

        const playPromise =
            heroVideo.play();

        if (
            playPromise &&
            typeof playPromise.catch ===
                "function"
        ) {
            playPromise.catch(() => {
                /*
                 * Se o navegador bloquear o autoplay,
                 * o poster continua visível.
                 */
            });
        }
    }


    /* =====================================================
       VÍDEO VERTICAL
       ===================================================== */

    const verticalVideo =
        document.getElementById(
            "vertical-video"
        );

    const verticalVideoToggle =
        document.getElementById(
            "vertical-video-toggle"
        );

    const verticalVideoDevice =
        document.querySelector(
            ".vertical-video-device"
        );

    const verticalVideoIcon =
        verticalVideoToggle?.querySelector(
            ".vertical-video-play"
        );

    const verticalVideoText =
        verticalVideoToggle?.querySelector(
            ".vertical-video-button-text"
        );


    function updateVerticalVideoButton() {
        if (
            !verticalVideo ||
            !verticalVideoToggle
        ) {
            return;
        }

        const playing =
            !verticalVideo.paused &&
            !verticalVideo.ended;

        verticalVideoDevice
            ?.classList
            .toggle(
                "is-playing",
                playing
            );

        verticalVideoToggle.setAttribute(
            "aria-label",
            playing
                ? "Pausar vídeo"
                : "Reproduzir vídeo"
        );

        if (verticalVideoIcon) {
            verticalVideoIcon.textContent =
                playing
                    ? "Ⅱ"
                    : "▶";
        }

        if (verticalVideoText) {
            verticalVideoText.textContent =
                playing
                    ? "Pausar"
                    : "Reproduzir";
        }
    }


    async function toggleVerticalVideo() {
        if (!verticalVideo) {
            return;
        }

        if (verticalVideo.paused) {
            try {
                await verticalVideo.play();
            } catch {
                if (verticalVideoText) {
                    verticalVideoText.textContent =
                        "Vídeo indisponível";
                }
            }
        } else {
            verticalVideo.pause();
        }

        updateVerticalVideoButton();
    }


    function initializeVerticalVideo() {
        verticalVideoToggle?.addEventListener(
            "click",
            toggleVerticalVideo
        );

        verticalVideo?.addEventListener(
            "click",
            toggleVerticalVideo
        );

        verticalVideo?.addEventListener(
            "play",
            updateVerticalVideoButton
        );

        verticalVideo?.addEventListener(
            "pause",
            updateVerticalVideoButton
        );

        verticalVideo?.addEventListener(
            "ended",
            updateVerticalVideoButton
        );

        verticalVideo?.addEventListener(
            "error",
            () => {
                if (verticalVideoText) {
                    verticalVideoText.textContent =
                        "Vídeo em preparação";
                }
            }
        );

        updateVerticalVideoButton();
    }


    /* =====================================================
       GALERIA E LIGHTBOX
       ===================================================== */

    const galleryItems =
        Array.from(
            document.querySelectorAll(
                ".gallery-item"
            )
        );

    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightbox-image"
        );

    const lightboxTitle =
        document.getElementById(
            "lightbox-title"
        );

    const lightboxDescription =
        document.getElementById(
            "lightbox-description"
        );

    const lightboxClose =
        document.getElementById(
            "lightbox-close"
        );

    const lightboxPrevious =
        document.getElementById(
            "lightbox-previous"
        );

    const lightboxNext =
        document.getElementById(
            "lightbox-next"
        );


    function renderLightbox(index) {
        if (!galleryItems.length) {
            return;
        }

        state.activeGalleryIndex =
            (
                index +
                galleryItems.length
            ) %
            galleryItems.length;

        const item =
            galleryItems[
                state.activeGalleryIndex
            ];

        const image =
            item.dataset.image || "";

        const title =
            item.dataset.title ||
            "Fotografia do Presépio";

        const description =
            item.dataset.description || "";

        if (lightboxImage) {
            lightboxImage.src =
                image;

            lightboxImage.alt =
                title;
        }

        if (lightboxTitle) {
            lightboxTitle.textContent =
                title;
        }

        if (lightboxDescription) {
            lightboxDescription.textContent =
                description;
        }
    }


    function openLightbox(index) {
        if (!lightbox) {
            return;
        }

        state.previousFocus =
            document.activeElement;

        renderLightbox(index);

        lightbox.classList.add(
            "is-open"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "lightbox-open"
        );

        lightboxClose?.focus();
    }


    function closeLightbox() {
        if (!lightbox) {
            return;
        }

        lightbox.classList.remove(
            "is-open"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "lightbox-open"
        );

        if (
            typeof state.previousFocus
                ?.focus ===
                "function"
        ) {
            state.previousFocus.focus();
        }
    }


    function initializeGallery() {
        galleryItems.forEach(
            (item, index) => {
                item.addEventListener(
                    "click",
                    () => {
                        openLightbox(index);
                    }
                );
            }
        );

        lightboxClose?.addEventListener(
            "click",
            closeLightbox
        );

        lightboxPrevious?.addEventListener(
            "click",
            () => {
                renderLightbox(
                    state.activeGalleryIndex -
                        1
                );
            }
        );

        lightboxNext?.addEventListener(
            "click",
            () => {
                renderLightbox(
                    state.activeGalleryIndex +
                        1
                );
            }
        );

        lightbox?.addEventListener(
            "click",
            (event) => {
                if (
                    event.target ===
                    lightbox
                ) {
                    closeLightbox();
                }
            }
        );
    }


    /* =====================================================
       CONTAGEM DECRESCENTE
       ===================================================== */

    const daysElement =
        document.getElementById(
            "days"
        );

    const hoursElement =
        document.getElementById(
            "hours"
        );

    const minutesElement =
        document.getElementById(
            "minutes"
        );

    const secondsElement =
        document.getElementById(
            "seconds"
        );

    const countdownMessage =
        document.getElementById(
            "countdown-message"
        );


    function updateCountdown() {
        if (
            !daysElement ||
            !hoursElement ||
            !minutesElement ||
            !secondsElement
        ) {
            return;
        }

        const targetDate =
            new Date(
                CONFIG.countdownDate
            ).getTime();

        if (!Number.isFinite(targetDate)) {
            if (countdownMessage) {
                countdownMessage.textContent =
                    "Data por definir.";
            }

            return;
        }

        const difference =
            targetDate -
            Date.now();

        if (difference <= 0) {
            daysElement.textContent =
                "00";

            hoursElement.textContent =
                "00";

            minutesElement.textContent =
                "00";

            secondsElement.textContent =
                "00";

            if (countdownMessage) {
                countdownMessage.textContent =
                    "A experiência já começou.";
            }

            if (
                state.countdownTimer !==
                null
            ) {
                window.clearInterval(
                    state.countdownTimer
                );
            }

            return;
        }

        const totalSeconds =
            Math.floor(
                difference /
                1000
            );

        const days =
            Math.floor(
                totalSeconds /
                86400
            );

        const hours =
            Math.floor(
                (
                    totalSeconds %
                    86400
                ) /
                3600
            );

        const minutes =
            Math.floor(
                (
                    totalSeconds %
                    3600
                ) /
                60
            );

        const seconds =
            totalSeconds %
            60;

        daysElement.textContent =
            formatTwoDigits(days);

        hoursElement.textContent =
            formatTwoDigits(hours);

        minutesElement.textContent =
            formatTwoDigits(minutes);

        secondsElement.textContent =
            formatTwoDigits(seconds);

        if (countdownMessage) {
            countdownMessage.textContent =
                "";
        }
    }


    function initializeCountdown() {
        updateCountdown();

        state.countdownTimer =
            window.setInterval(
                updateCountdown,
                1000
            );
    }


    /* =====================================================
       CONTROLOS DE TECLADO
       ===================================================== */

    function initializeKeyboardControls() {
        document.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Escape") {
                    if (
                        lightbox
                            ?.classList
                            .contains(
                                "is-open"
                            )
                    ) {
                        closeLightbox();
                        return;
                    }

                    if (
                        mobileMenu
                            ?.classList
                            .contains(
                                "is-open"
                            )
                    ) {
                        setMobileMenu(false);
                    }
                }

                if (
                    lightbox
                        ?.classList
                        .contains(
                            "is-open"
                        )
                ) {
                    if (
                        event.key ===
                        "ArrowLeft"
                    ) {
                        renderLightbox(
                            state.activeGalleryIndex -
                                1
                        );
                    }

                    if (
                        event.key ===
                        "ArrowRight"
                    ) {
                        renderLightbox(
                            state.activeGalleryIndex +
                                1
                        );
                    }
                }
            }
        );
    }


    /* =====================================================
       CICLO DE SCROLL
       ===================================================== */

    function updateScrollEffects() {
        state.scrollFrame =
            null;

        updateScrollProgress();
        updateNavbar();
    }


    function requestScrollEffects() {
        if (
            state.scrollFrame !==
            null
        ) {
            return;
        }

        state.scrollFrame =
            window.requestAnimationFrame(
                updateScrollEffects
            );
    }


    function initializeScrollEffects() {
        window.addEventListener(
            "scroll",
            requestScrollEffects,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            () => {
                requestScrollEffects();

                if (
                    window.innerWidth >
                    1180
                ) {
                    setMobileMenu(false);
                }
            }
        );
    }


    /* =====================================================
       PROTEÇÃO DE VISIBILIDADE
       ===================================================== */



    /* =====================================================
       INICIALIZAÇÃO PRINCIPAL
       ===================================================== */

    function initializeApplication() {
        preparePage();

        initializeLoader();

        initializeMobileMenu();

        initializeSmoothNavigation();

        initializeActiveNavigation();

        initializeGeneralReveals();

        initializeExperienceEntrance();

        initializeDetailsEntrance();

        initializeCardLighting();

        initializeHeroVideo();

        initializeVerticalVideo();

        initializeGallery();

        initializeCountdown();

        initializeKeyboardControls();

        initializeScrollEffects();

        updateScrollProgress();

        updateNavbar();

        window.setTimeout(
            guaranteeVisibleContent,
            1800
        );
    }


    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeApplication,
            {
                once: true
            }
        );
    } else {
        initializeApplication();
    }
})();
function sendPageHeightToParent() {
    const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
    );

    window.parent.postMessage(
        {
            type: "PRESEPIO_PAGE_HEIGHT",
            height
        },
        "*"
    );
}

window.addEventListener(
    "load",
    sendPageHeightToParent
);

window.addEventListener(
    "resize",
    sendPageHeightToParent
);

const pageResizeObserver =
    new ResizeObserver(
        sendPageHeightToParent
    );

pageResizeObserver.observe(
    document.documentElement
);

window.setTimeout(
    sendPageHeightToParent,
    500
);

window.setTimeout(
    sendPageHeightToParent,
    1500
);

window.setTimeout(
    sendPageHeightToParent,
    3000
);
