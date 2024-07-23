const BaseUrl = window.location.href;
const config = {
    apiEndpoint: "api.futami.siraphop.me"
}

window.onload = CheckPath()

function CheckPath() {
    let CurrentUrl = window.location.pathname;
    //console.log(CurrentUrl)

    if (CurrentUrl.includes("/statics") || CurrentUrl.includes("/statics.html")) {
        GetLastData();
        if (BaseUrl.indexOf('?playlist') !== -1) {
            ShowPlaylist.showModal();
            GetPlaylist();
        }
    } else if (CurrentUrl.includes("/") || CurrentUrl.includes("/index.html") || CurrentUrl.includes("/index")) {
        GetStat();
        CheckStatus();
        FutamiTyping();
    }
}

function GetStat() {
    axios.get(`https://${config.apiEndpoint}/system`)
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

function CheckStatus() {
  axios.get(`https://${config.apiEndpoint}/status`)
      .then(function (response) {
          const StatusData = response.data
          const StatusCode = StatusData.code
          const StatusBadge = document.getElementById('badgeStatus')
          const Frame = document.getElementById('StatusFrame')

          if (StatusCode == 1) {
            StatusBadge.classList.remove('badge-error')
            StatusBadge.classList.add('badge-success')
            StatusBadge.classList.add('heartbeat')
          } else if (StatusCode == 0) {
            StatusBadge.classList.add('vibrate-1')
          } else if (StatusCode == 2) {
            StatusBadge.classList.remove('badge-error')
            StatusBadge.classList.add('badge-warning')
            StatusBadge.classList.add('vibrate-1')
          }

          Frame.style.display = 'grid';
          StatusBadge.innerHTML = `API : ${StatusData.status}`
      })
      .catch(function (error) {
          console.error('[ERROR] : ', error);
          const StatusBadge = document.getElementById('badgeStatus')
          const Frame = document.getElementById('StatusFrame')
          Frame.style.display = 'grid';
          StatusBadge.classList.add('vibrate-1')
      });
}

function GetLastData() {
    const Loader = document.getElementById('FetchLoader')
    const FTable = document.getElementById('FetchTable')
    const ContainF = document.getElementById('FetchContainer')
    const AlertFail = document.getElementById('AlertFailed')

    let FailedCount = false;

    axios.get(`https://${config.apiEndpoint}/player`)
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
            FailedCount = true;
            console.error('[ERROR] : ', error);
        });

    axios.get(`https://${config.apiEndpoint}/system`)
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
            FailedCount = true;
            console.error('[ERROR] : ', error);

            const ErrorLoader1 = document.getElementById('LoaderError1')
            const ErrorLoader2 = document.getElementById('LoaderError2')
            const ErrorLoader3 = document.getElementById('LoaderError3')
            const Loader1 = document.getElementById('Loader1');
            const Loader2 = document.getElementById('Loader2');
            const Loader3 = document.getElementById('Loader3');

            Loader1.style.display = 'none';
            Loader2.style.display = 'none';
            Loader3.style.display = 'none';
            ErrorLoader1.style.display = 'block';
            ErrorLoader2.style.display = 'block';
            ErrorLoader3.style.display = 'block';
        });

    //console.log(FailedCount)
    if (FailedCount) {
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

function GetPlaylist() {
    axios.get(`https://${config.apiEndpoint}/player/playlist`)
        .then(function (response) {

            const Data = response.data.Playlist;
            //console.log(Data)
            const TableBody = document.getElementById('PlayDataTable');

            TableBody.innerHTML = '';

            Data.forEach(List => {
                const Row = document.createElement('tr');
                Row.classList.add('bg-base-200');
                Row.innerHTML = `
                    <td>${List.name}</td>
                    <td>${List.title}</td>
                    <td>${List.request}</td>
                `;
                TableBody.appendChild(Row);
            });

        })
        .catch(function (error) {
            console.error('[ERROR] : ', error);
        });
}
