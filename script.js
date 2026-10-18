
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const year = document.getElementById("currentYear");

    // Automatically update footer year
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Mobile navigation
    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        // Close menu after clicking a navigation link
        navItems.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Close menu when clicking outside it
        document.addEventListener("click", event => {
            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Reset mobile menu on desktop resize
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    // Reveal cards and sections as they enter the viewport
    const revealElements = document.querySelectorAll(".reveal");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Keep content visible if animation is unsupported or disabled
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }

    // Highlight the active navbar section
    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    navItems.forEach(link => {
                        const active =
                            link.getAttribute("href") ===
                            `#${entry.target.id}`;

                        link.classList.toggle("active", active);
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px"
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
});
