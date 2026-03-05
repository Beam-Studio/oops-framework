### Framework usage instructions
Oops Framework has been available as a Cocos Creator plug-in since version 3.5.2. This design is designed to facilitate authors to update the framework when upgrading framework functions and fixing problems.

### Automatically update the latest branch framework version
Open the Cocos Creator project directory and execute the following command

###### windows
```
md extensions
cd extensions
git clone -b master https://github.com/Beam-Studio/oops-plugin-framework.git
git pull
```
###### mac
```
mkdir -p extensions
cd extensions
git clone -b master https://github.com/Beam-Studio/oops-plugin-framework.git
git pull
```