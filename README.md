# vld-rpi-gpio-interface
A python script to control GPIO of a Raspberry Pi 3b+

## prerequisite

### Equipment
A Raspberry Pi 3b+

### Intall GPIO library
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

## usage
ex : activate GPIO 0 for 4 seconds
```
$ python scriptgpio.py 17 4
```
The script use the BCM mode GPIO 0 = BCM 17
