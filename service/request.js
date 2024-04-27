window.onload = CheckPath()

function CheckPath() {
    let CurrentUrl = window.location.pathname;
    //console.log(CurrentUrl)

    if (CurrentUrl.includes("/statics") || CurrentUrl.includes("/statics.html")) {
        GetLastData();
    } else if (CurrentUrl.includes("/") || CurrentUrl.includes("/index.html") || CurrentUrl.includes("/index")) {
        GetStat();
    }
}

function GetStat() {
    axios.get('https://api.futami.siraphop.me:6947/system')
        .then(function (response) {
            const BotData = response.data.Bot
            const Guild = BotData.guild
            const Users = BotData.users

            const DataGuild = document.getElementById('DataGuild');
            const DataUsers = document.getElementById('DataUsers');
            const Loader1 = document.getElementById('Loader1');
            const Loader2 = document.getElementById('Loader2');

            DataGuild.textContent = Guild
            DataUsers.textContent = Users
            Loader1.style.display = 'none';
            Loader2.style.display = 'none';
            DataGuild.style.display = 'block';
            DataUsers.style.display = 'block';
        })
        .catch(function (error) {
            console.error('[ERROR] : ', error);

            const ErrorLoader1 = document.getElementById('LoaderError1')
            const ErrorLoader2 = document.getElementById('LoaderError2')
            const Loader1 = document.getElementById('Loader1');
            const Loader2 = document.getElementById('Loader2');

            Loader1.style.display = 'none';
            Loader2.style.display = 'none';
            ErrorLoader1.style.display = 'block';
            ErrorLoader2.style.display = 'block';
        });

}

function GetLastData() {
    const Loader = document.getElementById('FetchLoader')
    const FTable = document.getElementById('FetchTable')
    const ContainF = document.getElementById('FetchContainer')
    const AlertFail = document.getElementById('AlertFailed')

    let FailedCount = 0;

    axios.get('https://api.futami.siraphop.me:6947/player')
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
            FailedCount = FailedCount + 1;
            console.error('[ERROR] : ', error);
        });

    axios.get('https://api.futami.siraphop.me:6947/system')
        .then(function (response) {
            const BotData = response.data.Bot
            const SystemData = response.data.System;
            const CpuUsage = SystemData.cpuusage;
            const RamUsage = SystemData.ramusage;
            const Ping = BotData.ping;

            const CpuUsageArray = CpuUsage.split(',').map(parseFloat);
            const TotalCpuUsage = CpuUsageArray.reduce((acc, curr) => acc + curr, 0);
            const AverageCpuUsage = TotalCpuUsage / CpuUsageArray.length;

            document.getElementById('DataCpu').textContent = AverageCpuUsage.toFixed(2) + " %";
            document.getElementById('DataRam').textContent = RamUsage;
            document.getElementById('DataPing').textContent = Ping + " ms";
            document.getElementById('DataUptime').textContent = "Uptime since : " + SystemData.uptimesince;
        })
        .catch(function (error) {
            FailedCount = FailedCount + 1;
            console.error('[ERROR] : ', error);
        });

    if (FailedCount >= 1) {
        AlertFail.style.display = 'flex';
    } else {
        Loader.style.display = 'none';
        FTable.style.display = 'block';
        ContainF.classList.remove('min-h-screen');
        //ContainF.classList.add('sas-content');
    }
    /*
    setTimeout(function () {
        if (FailedCount >= 1) {
            AlertFail.style.display = 'flex';
        } else {
            Loader.style.display = 'none';
            FTable.style.display = 'block';
            ContainF.classList.remove('min-h-screen');
            //ContainF.classList.add('sas-content');
        }
    }, Math.floor(Math.random() * 3001) + 2000);
    */
}
