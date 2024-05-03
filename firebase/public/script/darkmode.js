let CursorX;
let CursorY;

function GetCursor(event) {
    CursorX = event.clientX;
    CursorY = event.clientY;
}

// Original code : petya0927/real-dark-mode
// Modifiled : FujaTyping

function RealDarkMode(options = {
    color: "#000000",
    size: 180,
    falloff: 0.5,
    opacity: 0.90,
    zIndex: 9999,
}, Immediate = true) {
    const MouseMove = (event) => {
        const X = event.clientX;
        const Y = event.clientY;

        const Spotlight = document.querySelector(".real-dark-mode-spotlight");

        if (!Spotlight) return;

        Spotlight.style.background = `radial-gradient(circle at ${X}px ${Y}px, transparent ${options.size * options.falloff || 50}px, ${options.color || "#000000"} ${options.size || 100}px)`;
    };

    const RemoveRealDarkMode = () => {
        document.body.classList.remove("real-dark-mode-enabled");
        document.querySelector(".real-dark-mode-spotlight").classList.add("dark-focus-out");
        setTimeout(function () {
            document.body.removeChild(document.querySelector(".real-dark-mode-spotlight"));
        }, 500);
        document.removeEventListener("mousemove", MouseMove);
    };

    const CreateSpotlightElement = () => {
        const Spotlight = document.createElement("div");

        if (!Spotlight) return;

        Spotlight.classList.add("real-dark-mode-spotlight");
        Spotlight.classList.add("dark-focus-in");
        Spotlight.style.position = "fixed";
        Spotlight.style.top = "0";
        Spotlight.style.left = "0";
        Spotlight.style.width = "100vw";
        Spotlight.style.height = "100vh";
        Spotlight.style.zIndex = `${options.zIndex || 9999}`;
        Spotlight.style.pointerEvents = "none";
        Spotlight.style.opacity = `${options.opacity || 0.85}`;
        return Spotlight;
    };

    if (!document.body) return;

    if (document.body.classList.contains("real-dark-mode-enabled")) {
        RemoveRealDarkMode();
        return;
    }

    const SpotlightElement = CreateSpotlightElement();

    if (!SpotlightElement) return;

    document.body.appendChild(SpotlightElement);
    document.body.classList.add("real-dark-mode-enabled");

    if (Immediate) {
        MouseMove({ clientX: CursorX, clientY: CursorY });
    }

    document.addEventListener("mousemove", MouseMove);
}