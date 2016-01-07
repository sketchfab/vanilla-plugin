#!/bin/sh

rm -r dist
mkdir dist
mkdir dist/Sketchfab

cp class.sketchfab.plugin.php dist/Sketchfab/
cp icon.png dist/Sketchfab/
cp LICENSE.txt dist/Sketchfab/
cp -r js dist/Sketchfab/
cp -r design dist/Sketchfab/

cd dist
zip -r sketchfab-plugin.zip *
rm -r Sketchfab
