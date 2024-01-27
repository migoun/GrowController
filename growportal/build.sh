sudo systemctl stop growportal
rm -rf build
npm run build
sudo systemctl start growportal