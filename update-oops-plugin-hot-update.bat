md extensions
cd extensions

IF EXIST oops-plugin-hot-update (
goto update
) ELSE (
goto clone
)

:clone
git clone -b master https://github.com/Beam-Studio/oops-plugin-hot-update.git

:update
cd oops-plugin-hot-update
git pull