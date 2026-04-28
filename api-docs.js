(function () {
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
})();
