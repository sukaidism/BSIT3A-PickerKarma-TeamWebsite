(function () {
    function initDocs() {
        const links = Array.from(document.querySelectorAll(".side-link"));
        const sections = Array.from(document.querySelectorAll(".doc-section"));

        if (links.length && sections.length) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        const id = entry.target.getAttribute("id");
                        links.forEach((link) => {
                            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
                        });
                    });
                },
                { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
            );

            sections.forEach((section) => observer.observe(section));
        }

        document.querySelectorAll(".copy-btn").forEach((button) => {
            button.addEventListener("click", async function () {
                const content = this.getAttribute("data-copy");
                if (!content) {
                    return;
                }

                try {
                    await navigator.clipboard.writeText(content);
                    const original = this.textContent;
                    this.textContent = "Copied";
                    setTimeout(() => {
                        this.textContent = original;
                    }, 1300);
                } catch (error) {
                    this.textContent = "Copy failed";
                    setTimeout(() => {
                        this.textContent = "Copy";
                    }, 1300);
                }
            });
        });
    }

    function initHome() {
        const header = document.getElementById("siteHeader");
        const menuToggle = document.getElementById("menuToggle");
        const nav = document.getElementById("siteNav");
        const navLinks = Array.from(document.querySelectorAll(".nav-link"));
        const sections = Array.from(document.querySelectorAll("main section[id]"));
        const revealItems = Array.from(document.querySelectorAll(".reveal"));

        function onScrollHeader() {
            if (!header) {
                return;
            }
            header.classList.toggle("scrolled", window.scrollY > 10);
        }

        function closeMenu() {
            if (!nav || !menuToggle) {
                return;
            }
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        }

        if (menuToggle && nav) {
            menuToggle.addEventListener("click", function () {
                const opened = nav.classList.toggle("open");
                menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
            });
        }

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {
            if (!nav || !menuToggle || !(event.target instanceof Node)) {
                return;
            }
            if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });

        if (sections.length && navLinks.length) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }
                        const id = entry.target.getAttribute("id");
                        navLinks.forEach((link) => {
                            const active = link.getAttribute("href") === "#" + id;
                            link.classList.toggle("active", active);
                        });
                    });
                },
                { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
            );

            sections.forEach((section) => observer.observe(section));
        }

        if (revealItems.length) {
            const revealObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            revealObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.16 }
            );

            revealItems.forEach((el) => revealObserver.observe(el));
        }

        window.addEventListener("scroll", onScrollHeader, { passive: true });
        onScrollHeader();
    }

    const body = document.body;
    if (!body) {
        return;
    }

    if (body.classList.contains("page-home")) {
        initHome();
    }

    if (body.classList.contains("page-docs")) {
        initDocs();
    }
})();
