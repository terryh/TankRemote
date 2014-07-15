
TankRemote: a android app build with cordova
=====================================

This is a android application work with arduino device via bluetooth, please install the necessary  plugins to 
setup the android project.

mainly control my arduino tank, could refer to the blog post

http://blog.lifetaiwan.net/2014/07/arduino.html (wirtten in Chinese)

To use this this remote control

1. list all your bluetooth devices.

2. pick up the right one to connect.

3. you are done.

Serial write
==============

The remote only send one char each time, keyword sent to arduino is mapping from keyboard. 

Q W E A S D Z X V


* q , North West
* w , West
* e , North East
* a , West
* s , South
* d , East
* z , South West
* v , South East
* 0 to 9 mean the distance of the red dot to the center point, which use to control the speed.

ICON
=======

The icon is taken from http://www.flaticon.com

