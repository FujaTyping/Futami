let top_button = document.getElementById("top-button");

window.onscroll = function () {
    check_scroll();
};

function check_scroll() {
    if (
        document.body.scrollTop > 500 ||
        document.documentElement.scrollTop > 500
    ) {
        top_button.style.display = "block";
        top_button.classList.add('animate__bounceInUp');
    } else {
        top_button.style.display = "none";
    }
}

top_button.addEventListener("click", Top);

function Top() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}