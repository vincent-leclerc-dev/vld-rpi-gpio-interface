# vld-rpi-gpio-interface
A python script to control GPIO of a Raspberry Pi 3b+ or 5

## prerequisite

### Equipment
A Raspberry Pi 3b+ or 5

Enable "Remote GPIO" in Interfaces configuration

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

### Display GPIO list
in terminal:
```
$ pinout
```
and read [the doc here](https://pinout.xyz/)

#### usage with Raspberry pi 3b+
ex : activate GPIO 0 for 4 seconds
```
$ python gpio-rpi3.py 0 4
```

#### usage with Raspberry pi 5
ex : activate GPIO 1 for 2 seconds
```
$ python gpio-rpi5.py 1 2
```

### usage with http
curl -X GET "http://REPLACE_WITH_SERVER_IP:3000/gpio/activate?id=0&during=4"

### GPIO pins available as switch on/off

| left | right |
| ---- | ----- |
| 4	   |       |
| 17   |       |
| 27   |       |
| 22   | 23    |
|	     | 24    |
|	     | 25    |
| 5	   |       |
| 6	   | 12    |
| 13   |	     |
|	     | 16    |
| 26   |	     |
