# vld-rpi-gpio-interface
A python script to control GPIO of a Raspberry Pi 3b+ or 5

## prerequisite

### Equipment
A Raspberry Pi 3b+ or 5

### Intall GPIO library (on Raspberry Pi 3b+ only!)
```
$ sudo apt-get update
$ sudo apt-get install rpi.gpio
```

### Install Python
```
$ python --version
$ sudo apt-get install python
```

### Test Python
```
$ python
```
```
>>> print("hello\r\nworld!")
hello
world!
```

exit : ctrl + d

## usage with Raspberry pi 3b+
ex : activate GPIO 0 for 4 seconds
```
$ python gpio-rpi3.py 17 4
```

## usage with Raspberry pi 5
ex : activate GPIO 0 for 4 seconds
```
$ python gpio-rpi5.py 17 4

The script use the BCM mode GPIO 0 = BCM 17
