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

function ContinueInvite() {
    const Box = document.getElementById("agreeBox");
    const Text = document.getElementById("agreeText");
    const Box2 = document.getElementById("agreeBox2");
    const Text2 = document.getElementById("agreeText2");

    if (Box.checked && Box2.checked) {
        Text.style.color = 'white';
        Text2.style.color = 'white';
        pleaseread_modal.close()
        window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=1155156868554043484&permissions=8&scope=bot%20applications.commands';
    } else {
        Text.style.color = 'red';
        Text2.style.color = 'red';
    }
}