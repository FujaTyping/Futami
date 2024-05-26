let top_button = document.getElementById("top-button");

window.onscroll = function () {
    Check_scroll();
};

function Check_scroll() {
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

    /*
    if (Box.checked && Box2.checked) {
        Text.style.color = 'white';
        Text2.style.color = 'white';
        pleaseread_modal.close()
        window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=1155156868554043484&permissions=11537416&scope=bot%20applications.commands';
    } else {
        Text.style.color = 'red';
        Text2.style.color = 'red';
    } 
    */

    if (Box.checked) {
        Text.style.color = 'white';
        pleaseread_modal.close()
        window.open('https://discord.com/api/oauth2/authorize?client_id=1155156868554043484&permissions=11537416&scope=bot%20applications.commands', 'popup', 'width=500,height=700');
        setTimeout(function () {
            thankyou.showModal()
        }, 5000);
    } else {
        Text.style.color = 'red';
    }
}

const CheckParallaxContainer = document.querySelector('.parallax-container');

if (CheckParallaxContainer !== null) {
    document.addEventListener("DOMContentLoaded", function () {
        let ParallaxContainer = document.querySelector('.parallax-container');
        let ParallaxImg = document.querySelector('.parallax-img');

        ParallaxContainer.addEventListener('mousemove', function (e) {
            let x = e.clientX / window.innerWidth;
            let y = e.clientY / window.innerHeight;

            ParallaxImg.style.transform = 'translate(-' + x * 30 + 'px, -' + y * 30 + 'px)';
        });
    });
}

function ShowMoreFeature() {
    const Button = document.getElementById('MoreText')
    const Contaner = document.getElementById('OtherFeature')

    Button.style.display = 'none';
    Contaner.style.display = 'block';
}

function FutamiSay(Action) {
    if (Action == 'Hello') {
        document.getElementById('Hello').play();
    } else if (Action == 'About') {
        document.getElementById('About').play();
    }
}

function FutamiTyping() {
    let Typing = new Typed('#FutamiMsg', {
        strings: ["You're so cute 💙", '👋🏻 はじめまして'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 5000,
        cursorChar: ' |',
        loop: true
    });
}