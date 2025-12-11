// Header Module
const btnMobile = document.getElementById('mobile-menu-btn');
const menuMobile = document.getElementById('mobile-menu');
if (btnMobile && menuMobile) {
    btnMobile.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = menuMobile.classList.contains('hidden');
        menuMobile.classList.toggle('hidden');
        if (isHidden) document.body.classList.add('overflow-hidden');
        else document.body.classList.remove('overflow-hidden');
    });
    document.addEventListener('click', (e) => {
        if (!menuMobile.classList.contains('hidden')) {
            if (!menuMobile.contains(e.target) && !btnMobile.contains(e.target)) {
                menuMobile.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        }
    });
}