document.addEventListener("DOMContentLoaded", () => {

    const mobileButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");


    if (mobileButton && mobileMenu) {

        mobileButton.addEventListener("click", () => {

            mobileMenu.classList.toggle("active");

            mobileButton.textContent =
                mobileMenu.classList.contains("active")
                    ? "×"
                    : "☰";

        });


        const mobileLinks =
            mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("active");

                mobileButton.textContent = "☰";

            });

        });

    }


    /*
        Smooth reveal for cards when they enter viewport
    */

    const cards = document.querySelectorAll(
        ".step-card, .factor-card, .about-card"
    );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";
                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    cards.forEach(card => {

        card.style.opacity = "0";
        card.style.transform = "translateY(25px)";
        card.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        observer.observe(card);

    });

});