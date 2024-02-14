#!/usr/bin/python

#####################################
#  Control GPIO on Raspberry Pi 3b+ #
#####################################

import ntpath, sys, time
import RPi.GPIO as GPIO

class colors:
    SUCCESS = '\033[92m'
    WARNING = '\033[93m'
    ERROR = '\033[91m'
    RESET = '\033[0m'

class GpioException(Exception): pass

try:
   scriptName = ntpath.basename(sys.argv[0])

   if len(sys.argv) != 3:
      raise GpioException(colors.ERROR + 'Error : missing args\n' + colors.WARNING + 'Usage: python ' + scriptName + ' gpio_bcm_id execution_time_in_second '+ colors.SUCCESS +'\nex: "python ' + scriptName + ' 0 4"')

   gpioId = int(sys.argv[1])
   during = int(sys.argv[2])

   # disable warnings
   GPIO.setwarnings(False)

   # set gpio mode to BCM
   GPIO.setmode(GPIO.BCM)

   # set the gpio to an output
   GPIO.setup(gpioId, GPIO.OUT)

   # set the gpio status to 0 (for safety, It is not mandatory)
   GPIO.output(gpioId, GPIO.LOW)

   # set the gpio status to 1
   GPIO.output(gpioId, GPIO.HIGH)

   # delay
   time.sleep(during)

   # set the gpio status to 0
   GPIO.output(gpioId, GPIO.LOW)

   # reset the gpio parameters to prevent electrical damage that could happened
   GPIO.cleanup()

except GpioException as e:
   print(e)
