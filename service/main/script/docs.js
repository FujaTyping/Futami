function Navigation(Tag) {
    const Music = document.getElementById('Music');
    const Mod = document.getElementById('Mod');
    const Fun = document.getElementById('Fun');
    const Other = document.getElementById('Others');

    if (Tag == 'Mod') {
        Music.style.display = 'none';
        Mod.style.display = 'block';
        Fun.style.display = 'none';
        Other.style.display = 'none';
        Mod.scrollIntoView()
    } else if (Tag == 'Music') {
        Music.style.display = 'block';
        Mod.style.display = 'none';
        Fun.style.display = 'none';
        Other.style.display = 'none';
        Music.scrollIntoView()
    } else if (Tag == 'Fun') {
        Music.style.display = 'none';
        Mod.style.display = 'none';
        Fun.style.display = 'block';
        Other.style.display = 'none';
        Fun.scrollIntoView()
    } else if (Tag == 'Others') {
        Music.style.display = 'none';
        Mod.style.display = 'none';
        Fun.style.display = 'none';
        Other.style.display = 'block';
        Other.scrollIntoView()
    }
}