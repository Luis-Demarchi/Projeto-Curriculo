class MobileNavbar {
    constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }

    animateLinks(opening) {
        this.navLinks.forEach((link, index) => {
            if (opening) {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index * 0.1 + 0.3}s`;
            } else {
                link.style.animation = "";
            }
        });
    }

    handleClick() {
        const isOpening = !this.navList.classList.contains(this.activeClass);

        this.navList.classList.toggle(this.activeClass);
        this.mobileMenu.classList.toggle(this.activeClass);
        this.animateLinks(isOpening);
    }

    handleLinkClick() {
        this.navList.classList.remove(this.activeClass);
        this.mobileMenu.classList.remove(this.activeClass);
        this.animateLinks(false);
    }

    handleOutsideClick(event) {
        if (!this.mobileMenu.contains(event.target) && !this.navList.contains(event.target)) {
            this.navList.classList.remove(this.activeClass);
            this.mobileMenu.classList.remove(this.activeClass);
            this.animateLinks(false);
        }
    }

    addClickEvent() {
        this.mobileMenu.addEventListener("click", this.handleClick);
        this.navLinks.forEach(link => {
            link.addEventListener("click", this.handleLinkClick);
        });
        document.addEventListener("click", this.handleOutsideClick);
    }

    init() {
        if (this.mobileMenu) {
            this.addClickEvent();
        }
        return this;
    }
}

const MobileNavbarInstance = new MobileNavbar(
    ".mobile-menu",
    ".nav-list",
    ".nav-list li"
);
MobileNavbarInstance.init();

function openImage(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");

    if (!modal || !modalImg) {
        console.error("Erro: Modal ou Imagem não encontrados!");
        return;
    }

    modal.style.display = "flex";
    modalImg.src = imageSrc;
}

function closeImage() {
    document.getElementById("imageModal").style.display = "none";
}


document.getElementById("imageModal").addEventListener("click", function (e) {
    if (e.target === this) closeImage();
});

window.onload = function () {
    document.getElementById("imageModal").style.display = "none";
};

window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('contactForm').addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        }

        try {
            const response = await fetch("https://luisdemarchi.dev.br/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.status === 200) {
                showAlert("success", result.message);
            } else {
                showAlert("error", result.message);
            }
        } catch (error) {
            showAlert("error", "An error occurred.");
        }
    
        function showAlert(type, message) {
            const alert = document.querySelector(`.alert.${type}`);
            const alertMessage = alert.querySelector('.alertMessage');
            alertMessage.innerHTML = message;
            alert.classList.add('show');
            alert.classList.remove('hide')

            setTimeout(() => {
                alert.classList.add('hide');
            }, 3000);
        }
    });
});
