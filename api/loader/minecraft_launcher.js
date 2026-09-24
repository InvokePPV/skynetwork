// Minecraft Launcher Integration
(function() {
    let isDownloading = false;
    let isLaunching = false;

    // Слушаем сообщения от C++ приложения
    window.addEventListener('message', function(event) {
        const data = event.data;
        
        if (typeof data === 'string') {
            if (data === 'minecraft_launching') {
                isLaunching = true;
                updateLaunchButton('Запуск...', true);
            }
            else if (data === 'minecraft_launched') {
                isLaunching = false;
                updateLaunchButton('Запустить Minecraft', false);
                showNotification('Minecraft запущен!', 'success');
            }
            else if (data === 'minecraft_launch_failed') {
                isLaunching = false;
                updateLaunchButton('Запустить Minecraft', false);
                showNotification('Ошибка запуска Minecraft', 'error');
            }
            else if (data === 'download_complete') {
                isDownloading = false;
                updateLaunchButton('Запустить Minecraft', false);
                showNotification('Minecraft загружен!', 'success');
            }
            else if (data === 'download_failed') {
                isDownloading = false;
                updateLaunchButton('Запустить Minecraft', false);
                showNotification('Ошибка загрузки', 'error');
            }
            else if (data.startsWith('download_progress:')) {
                const progressData = JSON.parse(data.substring(18));
                updateDownloadProgress(progressData.status, progressData.progress);
            }
        }
    });

    function updateLaunchButton(text, disabled) {
        const btn = document.querySelector('.launch-btn');
        if (btn) {
            btn.textContent = text;
            btn.disabled = disabled;
        }
    }

    function updateDownloadProgress(status, progress) {
        const btn = document.querySelector('.launch-btn');
        if (btn) {
            btn.textContent = `${status} ${progress}%`;
            btn.disabled = true;
        }
    }

    function showNotification(message, type) {
        // Можно добавить красивое уведомление
        console.log(`[${type}] ${message}`);
    }

    // Функция для проверки наличия Minecraft
    function checkMinecraftInstalled() {
        // Здесь можно добавить проверку через C++
        return false; // По умолчанию считаем, что не установлен
    }

    // Обработчик кнопки запуска
    window.launchMinecraft = function() {
        if (isDownloading || isLaunching) return;

        const isInstalled = checkMinecraftInstalled();
        
        if (!isInstalled) {
            // Скачиваем Minecraft
            isDownloading = true;
            updateLaunchButton('Загрузка...', true);
            window.postMessage('download_minecraft', '*');
        } else {
            // Запускаем Minecraft
            isLaunching = true;
            updateLaunchButton('Запуск...', true);
            window.postMessage('launch_minecraft', '*');
        }
    };

    // Добавляем кнопку при загрузке страницы
    window.addEventListener('DOMContentLoaded', function() {
        // Кнопка уже должна быть в HTML, просто добавляем обработчик
        const launchBtn = document.querySelector('.launch-btn');
        if (launchBtn) {
            launchBtn.addEventListener('click', window.launchMinecraft);
        }
    });
})();
