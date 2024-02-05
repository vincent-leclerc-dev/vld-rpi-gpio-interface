#!/usr/bin/python

#####################################
#   Control GPIO on Raspberry Pi 5  #
#####################################

import ntpath, sys, time
import gpiod

class colors:
    SUCCESS = '\033[92m'
    WARNING = '\033[93m'
    ERROR = '\033[91m'
    RESET = '\033[0m'

class GpioException(Exception): pass

try:
    scriptName = ntpath.basename(sys.argv[0])

    if len(sys.argv) != 3:
        raise GpioException(colors.ERROR + 'Error : missing args\n' + colors.WARNING + 'Usage: python ' + scriptName + ' gpio_bcm_id execution_time_in_second '+ colors.SUCCESS +'\nex: "python ' + scriptName + ' 17 4"')
   
    gpioId = int(sys.argv[1])
    during = int(sys.argv[2])

    # select gpio chipset gpiomem4
    chip = gpiod.Chip('gpiochip4')

    # get the handle to the GPIO line at given offset
    pin_line = chip.get_line(gpioId)

    # request the GPIO with a label and type OUTPUT
    pin_line.request(consumer="PIN", type=gpiod.LINE_REQ_DIR_OUT)
    
    # set the GPIO status to 1
    pin_line.set_value(1)

    # wait
    time.sleep(during)

    # set the GPIO status to 0
    pin_line.set_value(0)

    # reset the gpio parameters to prevent electrical damage that could happened
    pin_line.release()

except GpioException as e:
    print(e)


