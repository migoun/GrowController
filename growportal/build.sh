# must be run on raspi
sudo systemctl stop growportal
rm -rf build
npm run build
sudo systemctl start growportal