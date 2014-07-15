#
# (OS X, Unix and Linux)
#
# What is this?
#
# It's a shell script that is using ImageMagick to create all the icon files from one source icon.
#
# Stick the script in your 'www/res/icons' folder with your source icon 'my-hires-icon.png' then trigger it from Terminal.
#

APP_NAME=TankRemote
ICON=${1:-"icon.png"}

# test android folder
if [ -d "platforms/android" ]; then
    echo "Having Android project"
    convert $ICON -resize 36x36 platforms/android/res/drawable-ldpi/icon.png
    convert $ICON -resize 48x48 platforms/android/res/drawable-mdpi/icon.png
    convert $ICON -resize 72x72 platforms/android/res/drawable-hdpi/icon.png
    convert $ICON -resize 96x96 platforms/android/res/drawable-xhdpi/icon.png
    convert $ICON -resize 96x96 platforms/android/res/drawable/icon.png
fi

## test ios folder
if [ -d "platforms/ios" ]; then
    echo "Having iOS project"
    #convert $ICON -resize 29 ios/icon-29.png
    #convert $ICON -resize 40 ios/icon-40.png 
    #convert $ICON -resize 50 ios/icon-50.png 

    convert $ICON -resize 57x57 platforms/ios/{$APP_NAME}/Resources/icons/icon.png
    convert $ICON -resize 114x114 platforms/ios/{$APP_NAME}/Resources/icons/icon@2x.png

    convert $ICON -resize 60x60 platforms/ios/{$APP_NAME}/Resources/icons/icon-60.png
    convert $ICON -resize 120x120 platforms/ios/{$APP_NAME}/Resources/icons/icon-60@2x.png

    convert $ICON -resize 72x72 platforms/ios/{$APP_NAME}/Resources/icons/icon-72.png
    convert $ICON -resize 144x144 platforms/ios/{$APP_NAME}/Resources/icons/icon-72@2x.png

    convert $ICON -resize 76x76 platforms/ios/{$APP_NAME}/Resources/icons/icon-76.png
    convert $ICON -resize 152x152 platforms/ios/{$APP_NAME}/Resources/icons/icon-76@2x.png

    #convert $ICON -resize 60 ios/icon-60.png
    #convert $ICON -resize 72 ios/icon-72.png
    #convert $ICON -resize 76 ios/icon-76.png  
    #convert $ICON -resize 80 ios/icon-40-2x.png
    #convert $ICON -resize 100 ios/icon-50-2x.png
    #convert $ICON -resize 114 ios/icon-57-2x.png     
    #convert $ICON -resize 120 ios/icon-60-2x.png
    #convert $ICON -resize 144 ios/icon-72-2x.png
    #convert $ICON -resize 152 ios/icon-76-2x.png
fi

