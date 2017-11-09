# Install IcyWallet

If you don't want to buy a pre-configured IcyWallet device, there are still three ways that you can get up and running:

1. Install IcyWallet on any existing device running Node.js
2. Download a pre-built IcyWallet disk image.
3. Build your own clone of the IcyWallet device

## Installing on existing hardware

TBD

## Ready-to-go disk image

TBD

## Building your own IcyWallet clone

Following these steps, you’ll be able to create your very own IcyWallet device.

### Requirements

One of these Raspberry Pi models:

** Raspberry Pi 1 Model A+
** Raspberry Pi 1 Model B+
** Raspberry Pi 2 Model B
** Raspberry Pi 3 Model B

IcyWallet will run on the Raspberry Pi Zero, but lacking an audio jack, the Zero is not ideal for the audio-only interface.

### Initial Configuration

Begin by downloading the [latest Raspbian Stretch Lite image](https://downloads.raspberrypi.org/raspbian_lite_latest) and [placing the image on a Micro SD card](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) (minimum 8 GB recommended).

When finished, insert the Micro SD card into your Raspberry Pi and power on the device. Connect a keyboard and headphones. After it boots to the login prompt, log in with the standard Raspberry Pi user account:

** Username: pi
** Password: raspberry

Then, type `sudo raspi-config` and press enter.

1. Select **Hostname** and change the hostname to **icywallet**.
2. Select **Boot Options**, then **Desktop/CLI**, and choose **Console/Autologin**.
3. Select **Localisation Options**, then **Change Keyboard Layout**, and make selections for your particular keyboard (the default is a UK layout).
4. Select **Interfacing Options**, then **SSH**, and enable the SSH server.
5. Select **Finish** and when prompted, reboot.

### Networking

Type `sudo nano /etc/network/interfaces` and press enter.

Scroll to the bottom of the file, and add this text:

```
auto lo

iface lo inet loopback
iface eth0 inet dhcp
```

If you intend to connect to your Pi with an ethernet cable, you can stop there. If you’re using a Raspberry Pi 3 and intend to connect via wifi, continue and add this text, replacing the quoted **ssid** and **password** values with your own wifi SSID and password:

```
allow-hotplug wlan0
auto wlan0

iface wlan0 inet dhcp
  wpa-ssid "ssid"
  wpa-psk "password"
```

When finished, press Ctrl-X, hit **Y**, and then press enter. Then type `sudo reboot` and press enter.

From this point forward, you can SSH into your device or continue the configuration from the attached keyboard.

### Updates & Additional Software

Type `sudo sh -c "apt-get update; apt-get -y update; apt-get -y dist-upgrade; apt-get -y autoremove; apt-get -y autoclean" && sudo reboot` and hit enter. After rebooting, log in and run the same command a second time (more updates!).

Log in and run:

`sudo apt-get install git vim nodejs npm libasound2-dev mpg321 -y`

### Final Configuration

Type `sudo nano /boot/cmdline.txt` and press enter. Where you see `console=tty1`, change that to `console=tty3` (tty**1** to tty**3**). Then, at the very end of the line, add `quiet splash loglevel=0 logo.nologo vt.global_cursor_default=0`. Press Ctrl-X, hit **Y**, and press enter.

Type `sudo nano /etc/rc.local` and press enter. Before the line that reads `exit 0`, add `dmesg --console-off` on a line by itself. Press Ctrl-X, hit **Y**, and press enter.

Type `sudo nano /etc/systemd/system/autologin\@.service` and press enter. Find the line that reads `ExecStart=-/sbin/agetty --autologin pi --noclear %I $TERM` and change it to `ExecStart=-/sbin/agetty --skip-login --noclear --noissue --login-options "-f pi" %I $TERM`. Press Ctrl-X, hit **Y**, and press enter.

Type `touch ~/.hushlogin` and press enter.

Type `sudo rm /etc/profile.d/sshpwd.sh` and press enter.

Type `nano ~/.bashrc` and press enter. Scroll to the bottom of the file and add a line reading `nodejs icywallet.js`, then press Ctrl-X, hit **Y**, and press enter.

Type `sudo nano /etc/default/console-setup` and press enter. In the empty quotes beside **FONFACE**, type **TerminusBold** and in the empty quotes beside **FONTSIZE**, type **16x32**. Then press Ctrl-X, hit **Y**, and press enter. Then type `sudo reboot` and press enter.

This time, when the device reboots, you should note that the screen remains blank until the IcyWallet software runs.

If you enabled wifi previously, it’s time to disable it. Type `sudo nano /etc/network/interfaces` and press enter, and then remove everything from `allow-hotplug wlan0` through the end of the file. Press Ctrl-X, hit **Y**, and press enter. Then type `sudo reboot` and press enter.

# Important

Once IcyWallet has been installed on your device, it’s important to **never connect it to the internet ever again**. Any future updates should be managed through IcyWallet’s in-app update process.