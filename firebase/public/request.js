window.onload = GetLastData()

function GetLastData() {
    const Loader = document.getElementById('FetchLoader')
    const FTable = document.getElementById('FetchTable')
    const ContainF = document.getElementById('FetchContainer')

    axios.get('https://futami.onrender.com/player')
        .then(function (response) {

            const Data = response.data.LastSong;
            //console.log(Data)
            const TableBody = document.getElementById('DataTable');

            TableBody.innerHTML = '';

            Data.forEach(Song => {
                const Row = document.createElement('tr');
                Row.classList.add('bg-base-100');
                if (Song.thumbnail != "-") {
                    Row.innerHTML = `
                    <td><img style="max-width: 7rem;" src="${Song.thumbnail}" class="max-w-sm rounded-lg shadow-2xl" /></td>
                    <td>${Song.name}</td>
                    <td>${Song.uploader}</td>
                `;
                } else {
                    Row.innerHTML = `
                    <td>${Song.thumbnail}</td>
                    <td>${Song.name}</td>
                    <td>${Song.uploader}</td>
                `;
                }
                TableBody.appendChild(Row);
            });

        })
        .catch(function (error) {
            console.error('[ERROR] : ', error);
        });

    axios.get('https://futami.onrender.com/system')
        .then(function (response) {
            const SystemData = response.data.System;
            const CpuUsage = SystemData.cpuusage.split(',')[0];
            const RamUsage = SystemData.ramusage;
            const Ping = SystemData.ping;

            document.getElementById('DataCpu').textContent = CpuUsage;
            document.getElementById('DataRam').textContent = RamUsage;
            document.getElementById('DataPing').textContent = Ping + " ms";
        })
        .catch(function (error) {
            console.error('[ERROR] : ', error);
        });

    setTimeout(function () {
        Loader.style.display = 'none';
        FTable.style.display = 'block';
        ContainF.classList.remove('prepare-load');
        ContainF.classList.add('sas-content');
    }, 2000);
}